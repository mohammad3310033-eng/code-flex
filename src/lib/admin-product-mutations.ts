import "server-only";

import { Prisma, ProductCondition, StockStatus, StorageType } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { buildSafeExtraSpecs, getLaptopCategoryIds } from "@/lib/admin-catalog";
import { postgresUuidSchema } from "@/lib/postgres-uuid";
import { prisma } from "@/lib/prisma";
import { normalizeProductSlug, productSlugWithSuffix } from "@/lib/product-slug";

type ProductMutationFailureCode = "VALIDATION_ERROR" | "NOT_FOUND" | "CONFLICT" | "INTERNAL_ERROR";

export type ProductMutationFailure = {
  ok: false;
  code: ProductMutationFailureCode;
  message: string;
  fieldErrors?: Record<string, string>;
};

export type ProductMutationSuccess = {
  ok: true;
  productId: string;
  slug: string;
};

export type ProductMutationResult = ProductMutationFailure | ProductMutationSuccess;

const optionalText = (max: number) => z.string().trim().max(max).transform((value) => value || null);
const priceSchema = z.string().trim().regex(/^\d{1,6}(?:\.\d{1,2})?$/u, "السعر يجب أن يكون رقماً موجباً بمنزلتين عشريتين كحد أقصى.");
const positiveInteger = (message: string, max: number) => z.string().trim()
  .regex(/^[1-9]\d*$/u, message)
  .transform(Number)
  .refine((value) => Number.isSafeInteger(value) && value <= max, message);
const screenSizeSchema = z.string().trim().refine((value) => {
  if (!value) return true;
  if (!/^\d+(?:\.\d+)?$/u.test(value)) return false;
  const number = Number(value);
  return Number.isFinite(number) && number >= 5 && number <= 30;
}, "حجم الشاشة يجب أن يكون رقماً بين 5 و30.");

const storageSchema = z.object({
  type: z.nativeEnum(StorageType, { error: "اختر نوع تخزين صالحاً." }),
  capacityGB: positiveInteger("سعة التخزين يجب أن تكون عدداً صحيحاً موجباً.", 200_000),
});

const productPayloadSchema = z.object({
  name: z.string().trim().min(2, "اسم المنتج مطلوب.").max(180, "اسم المنتج طويل جداً."),
  brandId: postgresUuidSchema,
  categoryId: postgresUuidSchema,
  descriptionAr: z.string().trim().min(2, "الوصف العربي مطلوب.").max(8_000, "الوصف العربي طويل جداً."),
  descriptionEn: optionalText(8_000),
  shortDescriptionAr: optionalText(500),
  shortDescriptionEn: optionalText(500),
  price: priceSchema,
  stockStatus: z.nativeEnum(StockStatus, { error: "حالة المخزون غير صالحة." }),
  condition: z.union([z.nativeEnum(ProductCondition), z.literal("")]).transform((value) => value || null),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  extraSpecs: z.unknown(),
  cpuBrand: z.string().trim().max(80),
  cpuModel: z.string().trim().max(120),
  cpuGeneration: optionalText(80),
  ramGB: z.string().trim(),
  storages: z.unknown(),
  gpuBrand: optionalText(80),
  gpuModel: optionalText(120),
  screenSize: z.string().trim(),
  resolution: optionalText(80),
});

type ParsedProduct = z.infer<typeof productPayloadSchema> & {
  priceUsdCents: number;
  isLaptop: boolean;
  extraSpecs: Prisma.JsonObject | null;
  laptopSpecs: {
    cpuBrand: string;
    cpuModel: string;
    cpuGeneration: string | null;
    ramGB: number;
    gpuBrand: string | null;
    gpuModel: string | null;
    screenSize: string | null;
    resolution: string | null;
    storages: Array<{ type: StorageType; capacityGB: number; sortOrder: number }>;
  } | null;
};

function validationFailure(fieldErrors: Record<string, string>): ProductMutationFailure {
  return {
    ok: false,
    code: "VALIDATION_ERROR",
    message: "تعذر حفظ المنتج بسبب حقول غير صالحة.",
    fieldErrors,
  };
}

function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path.map(String).join(".") || "form";
    result[field] ??= issue.message;
  }
  return result;
}

function toCents(value: string) {
  const [whole, fraction = ""] = value.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(cents) || cents <= 0 || cents > 99_999_999) return null;
  return cents;
}

async function parseProduct(payload: unknown): Promise<{ data: ParsedProduct } | ProductMutationFailure> {
  const parsed = productPayloadSchema.safeParse(payload);
  if (!parsed.success) return validationFailure(zodFieldErrors(parsed.error));

  const cents = toCents(parsed.data.price);
  if (cents === null) return validationFailure({ price: "السعر يجب أن يكون رقماً موجباً ضمن الحد المسموح." });

  const [categories, brand] = await Promise.all([
    prisma.category.findMany({
      select: { id: true, parentId: true, slug: true, nameAr: true, nameEn: true, sortOrder: true, isActive: true },
    }),
    prisma.brand.findUnique({ where: { id: parsed.data.brandId }, select: { id: true } }),
  ]);
  const category = categories.find((item) => item.id === parsed.data.categoryId);
  const referenceErrors: Record<string, string> = {};
  if (!category) referenceErrors.categoryId = "التصنيف المحدد غير موجود.";
  else if (!category.isActive) referenceErrors.categoryId = "اختر تصنيفاً نشطاً للمنتج.";
  if (!brand) referenceErrors.brandId = "العلامة التجارية المحددة غير صالحة.";
  if (Object.keys(referenceErrors).length > 0) return validationFailure(referenceErrors);

  const isLaptop = getLaptopCategoryIds(categories).includes(category!.id);
  let extraSpecs: Prisma.JsonObject | null = null;
  try {
    extraSpecs = buildSafeExtraSpecs(parsed.data.extraSpecs);
  } catch {
    return validationFailure({ extraSpecs: "مواصفات الملحقات غير صالحة." });
  }

  let laptopSpecs: ParsedProduct["laptopSpecs"] = null;
  if (isLaptop) {
    const laptopBase = z.object({
      cpuBrand: z.string().trim().min(1, "اسم شركة المعالج مطلوب.").max(80),
      cpuModel: z.string().trim().min(1, "طراز المعالج مطلوب.").max(120),
      ramGB: positiveInteger("RAM يجب أن يكون عدداً صحيحاً موجباً.", 512),
      screenSize: screenSizeSchema,
      storages: z.array(storageSchema).min(1, "أضف وحدة تخزين واحدة على الأقل.").max(8, "الحد الأقصى هو 8 وحدات تخزين."),
    }).safeParse({
      cpuBrand: parsed.data.cpuBrand,
      cpuModel: parsed.data.cpuModel,
      ramGB: parsed.data.ramGB,
      screenSize: parsed.data.screenSize,
      storages: parsed.data.storages,
    });
    if (!laptopBase.success) return validationFailure(zodFieldErrors(laptopBase.error));

    laptopSpecs = {
      cpuBrand: laptopBase.data.cpuBrand,
      cpuModel: laptopBase.data.cpuModel,
      cpuGeneration: parsed.data.cpuGeneration,
      ramGB: laptopBase.data.ramGB,
      gpuBrand: parsed.data.gpuBrand,
      gpuModel: parsed.data.gpuModel,
      screenSize: laptopBase.data.screenSize || null,
      resolution: parsed.data.resolution,
      storages: laptopBase.data.storages.map((storage, sortOrder) => ({ ...storage, sortOrder })),
    };
  }

  return { data: { ...parsed.data, priceUsdCents: cents, isLaptop, extraSpecs, laptopSpecs } };
}

function productData(data: ParsedProduct) {
  return {
    name: data.name,
    brandId: data.brandId,
    categoryId: data.categoryId,
    descriptionAr: data.descriptionAr,
    descriptionEn: data.descriptionEn,
    shortDescriptionAr: data.shortDescriptionAr,
    shortDescriptionEn: data.shortDescriptionEn,
    priceUsdCents: data.priceUsdCents,
    stockStatus: data.stockStatus,
    condition: data.condition,
    isFeatured: data.isFeatured,
    isActive: data.isActive,
    ...(data.isLaptop ? {} : { extraSpecs: data.extraSpecs ?? Prisma.JsonNull }),
  };
}

function revalidateCatalog(slug?: string) {
  ["/", "/en", "/products", "/en/products"].forEach((path) => revalidatePath(path));
  if (slug) ["/products/", "/en/products/"].forEach((prefix) => revalidatePath(`${prefix}${slug}`));
}

function internalFailure(operation: "create" | "update", error: unknown): ProductMutationFailure {
  const diagnostic = error instanceof Error ? error.name : typeof error;
  console.error("Admin product mutation failed", { operation, diagnostic });
  return { ok: false, code: "INTERNAL_ERROR", message: "تعذر حفظ المنتج. حاول مجدداً." };
}

function isUniqueConstraintError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

export async function createAdminProduct(payload: unknown): Promise<ProductMutationResult> {
  const parsed = await parseProduct(payload);
  if ("ok" in parsed) return parsed;

  const slugBase = normalizeProductSlug(parsed.data.name);
  for (let suffix = 1; suffix <= 1_000; suffix += 1) {
    const slug = productSlugWithSuffix(slugBase, suffix);
    try {
      const product = await prisma.$transaction(async (tx) => {
        const created = await tx.product.create({ data: { ...productData(parsed.data), slug }, select: { id: true, slug: true } });
        if (parsed.data.laptopSpecs) {
          const { storages, ...specs } = parsed.data.laptopSpecs;
          await tx.laptopSpecs.create({ data: { ...specs, productId: created.id, storages: { create: storages } } });
        }
        return created;
      });
      revalidateCatalog(product.slug);
      revalidatePath("/admin/products");
      return { ok: true, productId: product.id, slug: product.slug };
    } catch (error) {
      if (!isUniqueConstraintError(error)) return internalFailure("create", error);
    }
  }

  return { ok: false, code: "CONFLICT", message: "تعذر إنشاء رابط فريد للمنتج. حاول مجدداً." };
}

export async function updateAdminProduct(productId: string, payload: unknown): Promise<ProductMutationResult> {
  if (!postgresUuidSchema.safeParse(productId).success) {
    return validationFailure({ productId: "المنتج غير صالح." });
  }

  const parsed = await parseProduct(payload);
  if ("ok" in parsed) return parsed;

  const existing = await prisma.product.findUnique({ where: { id: productId }, select: { slug: true } });
  if (!existing) return { ok: false, code: "NOT_FOUND", message: "المنتج غير موجود." };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.product.update({ where: { id: productId }, data: productData(parsed.data) });
      if (parsed.data.laptopSpecs) {
        const { storages, ...laptopUpdate } = parsed.data.laptopSpecs;
        await tx.laptopSpecs.upsert({ where: { productId }, create: { ...laptopUpdate, productId }, update: laptopUpdate });
        await tx.laptopStorage.deleteMany({ where: { productId } });
        await tx.laptopStorage.createMany({ data: storages.map((storage) => ({ ...storage, productId })) });
      } else {
        await tx.laptopSpecs.deleteMany({ where: { productId } });
      }
    });
  } catch (error) {
    return internalFailure("update", error);
  }

  revalidateCatalog(existing.slug);
  revalidatePath("/admin/products");
  return { ok: true, productId, slug: existing.slug };
}
