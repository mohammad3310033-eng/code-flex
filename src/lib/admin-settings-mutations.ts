import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import { destroyManagedHeroImage, isManagedHeroPublicId, verifyManagedHeroImage } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

type SettingsFailureCode = "VALIDATION_ERROR" | "NOT_FOUND" | "INTERNAL_ERROR";

type SettingsMutationFailure = {
  ok: false;
  code: SettingsFailureCode;
  message: string;
  fieldErrors?: Record<string, string>;
};

export type SettingsMutationResult =
  | { ok: true; message: string }
  | SettingsMutationFailure;

export type HeroMutationResult =
  | { ok: true; message: string; image?: { url: string; publicId: string } }
  | SettingsMutationFailure;

const optionalText = (max: number) =>
  z.string().trim().max(max).transform((value) => value || null);

const optionalPhone = z
  .string()
  .trim()
  .max(40)
  .transform((value) => value || null)
  .refine(
    (value) => value === null || (/^\+?[0-9\s().-]+$/u.test(value) && (value.match(/\d/g)?.length ?? 0) >= 7),
    "INVALID_PHONE",
  );

const optionalHttpUrl = z
  .string()
  .trim()
  .max(1_000)
  .transform((value) => value || null)
  .refine((value) => {
    if (value === null) return true;
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "INVALID_URL");

const exchangeRate = z
  .string()
  .trim()
  .regex(/^[1-9]\d{0,7}$/u)
  .transform(Number)
  .refine((value) => value <= 10_000_000, "INVALID_RATE");

const settingsSchema = z.object({
  storeName: z.string().trim().min(2).max(100),
  usdToSypRate: exchangeRate,
  phone: optionalPhone,
  whatsapp: optionalPhone,
  facebook: optionalHttpUrl,
  instagram: optionalHttpUrl,
  heroEnabled: z.boolean(),
  heroTitleAr: optionalText(300),
  heroTitleEn: optionalText(300),
  heroSubtitleAr: optionalText(1_000),
  heroSubtitleEn: optionalText(1_000),
});

const heroAssetSchema = z.object({ settingsId: z.uuid(), publicId: z.string().min(1).max(300) });

function revalidateStorefront() {
  updateTag("storefront-home");
  ["/", "/en", "/products", "/en/products"].forEach((path) => revalidatePath(path));
  revalidatePath("/[locale]", "page");
  revalidatePath("/[locale]/products", "page");
  revalidatePath("/[locale]/products/[slug]", "page");
}

function settingsValidationResult(error: z.ZodError): SettingsMutationFailure {
  const fields = new Set(error.issues.map((issue) => String(issue.path[0] ?? "form")));
  const fieldErrors: Record<string, string> = {};
  for (const field of fields) fieldErrors[field] = "تحقّق من قيمة هذا الحقل.";

  if (fields.has("usdToSypRate")) {
    return { ok: false, code: "VALIDATION_ERROR", message: "سعر الصرف يجب أن يكون رقماً صحيحاً موجباً.", fieldErrors };
  }
  if (fields.has("phone") || fields.has("whatsapp")) {
    return { ok: false, code: "VALIDATION_ERROR", message: "أدخل رقم هاتف أو واتساب صالحاً.", fieldErrors };
  }
  if (fields.has("facebook") || fields.has("instagram")) {
    return { ok: false, code: "VALIDATION_ERROR", message: "أدخل رابط HTTP أو HTTPS صالحاً.", fieldErrors };
  }
  return { ok: false, code: "VALIDATION_ERROR", message: "تحقّق من الحقول المطلوبة وصيغة البيانات.", fieldErrors };
}

export async function updateAdminSiteSettings(input: unknown): Promise<SettingsMutationResult> {
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return settingsValidationResult(parsed.error);

  const settings = await prisma.siteSettings.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true } });
  if (!settings) return { ok: false, code: "NOT_FOUND", message: "إعدادات المتجر غير مهيأة بعد." };

  try {
    await prisma.siteSettings.update({
      where: { id: settings.id },
      data: {
        storeName: parsed.data.storeName,
        usdToSypRate: parsed.data.usdToSypRate,
        phone: parsed.data.phone,
        whatsapp: parsed.data.whatsapp,
        facebook: parsed.data.facebook,
        instagram: parsed.data.instagram,
        heroEnabled: parsed.data.heroEnabled,
        heroTitleAr: parsed.data.heroTitleAr,
        heroTitleEn: parsed.data.heroTitleEn,
        heroSubtitleAr: parsed.data.heroSubtitleAr,
        heroSubtitleEn: parsed.data.heroSubtitleEn,
      },
    });
  } catch {
    return { ok: false, code: "INTERNAL_ERROR", message: "تعذر حفظ الإعدادات. حاول مجدداً." };
  }

  revalidateStorefront();
  revalidatePath("/admin/settings");
  return { ok: true, message: "تم حفظ الإعدادات وتحديث واجهة المتجر." };
}

export async function persistAdminHeroImage(input: unknown): Promise<HeroMutationResult> {
  const parsed = heroAssetSchema.safeParse(input);
  if (!parsed.success) return { ok: false, code: "VALIDATION_ERROR", message: "بيانات صورة Hero غير صالحة." };

  const settings = await prisma.siteSettings.findUnique({
    where: { id: parsed.data.settingsId },
    select: { id: true, heroImagePublicId: true },
  });
  if (!settings) return { ok: false, code: "NOT_FOUND", message: "إعدادات المتجر غير موجودة." };

  let url: string | null;
  try {
    url = await verifyManagedHeroImage(settings.id, parsed.data.publicId);
  } catch {
    if (isManagedHeroPublicId(settings.id, parsed.data.publicId)) {
      try { await destroyManagedHeroImage(settings.id, parsed.data.publicId); } catch { /* exact orphan cleanup is best effort */ }
    }
    return { ok: false, code: "INTERNAL_ERROR", message: "تعذر التحقق من الصورة المرفوعة." };
  }
  if (!url) {
    if (isManagedHeroPublicId(settings.id, parsed.data.publicId)) {
      try { await destroyManagedHeroImage(settings.id, parsed.data.publicId); } catch { /* exact rejected asset cleanup is best effort */ }
    }
    return { ok: false, code: "VALIDATION_ERROR", message: "رُفضت الصورة لأنها ليست ضمن مساحة Hero المُدارة أو لا تطابق القيود." };
  }

  try {
    await prisma.siteSettings.update({
      where: { id: settings.id },
      data: { heroImageUrl: url, heroImagePublicId: parsed.data.publicId },
    });
  } catch {
    try { await destroyManagedHeroImage(settings.id, parsed.data.publicId); } catch { /* exact uploaded asset cleanup is best effort */ }
    return { ok: false, code: "INTERNAL_ERROR", message: "تعذر حفظ صورة Hero؛ تمت محاولة تنظيف الملف المرفوع." };
  }

  let cleanupWarning = "";
  if (settings.heroImagePublicId && settings.heroImagePublicId !== parsed.data.publicId && isManagedHeroPublicId(settings.id, settings.heroImagePublicId)) {
    try { await destroyManagedHeroImage(settings.id, settings.heroImagePublicId); } catch { cleanupWarning = " حُفظت الصورة الجديدة، لكن تعذر تنظيف الصورة السابقة."; }
  }
  revalidateStorefront();
  revalidatePath("/admin/settings");
  return { ok: true, message: `تم تحديث صورة Hero.${cleanupWarning}`, image: { url, publicId: parsed.data.publicId } };
}

export async function removeAdminHeroImage(settingsId: string): Promise<SettingsMutationResult> {
  if (!z.uuid().safeParse(settingsId).success) {
    return { ok: false, code: "VALIDATION_ERROR", message: "إعدادات المتجر غير صالحة." };
  }
  const settings = await prisma.siteSettings.findUnique({ where: { id: settingsId }, select: { heroImagePublicId: true } });
  if (!settings) return { ok: false, code: "NOT_FOUND", message: "إعدادات المتجر غير موجودة." };

  await prisma.siteSettings.update({ where: { id: settingsId }, data: { heroImageUrl: null, heroImagePublicId: null } });
  let warning = "";
  if (settings.heroImagePublicId && isManagedHeroPublicId(settingsId, settings.heroImagePublicId)) {
    try { await destroyManagedHeroImage(settingsId, settings.heroImagePublicId); } catch { warning = " أزيلت من المتجر، لكن تعذر تنظيف الملف البعيد."; }
  }
  revalidateStorefront();
  revalidatePath("/admin/settings");
  return { ok: true, message: `تمت إزالة صورة Hero.${warning}` };
}
