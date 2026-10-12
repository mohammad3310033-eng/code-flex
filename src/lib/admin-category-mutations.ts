import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminCategoryDescendantIds } from "@/lib/admin-catalog";
import { destroyManagedCategoryImage, isManagedCategoryPublicId, verifyManagedCategoryImage } from "@/lib/cloudinary";
import { normalizeProductSlug, productSlugWithSuffix } from "@/lib/product-slug";
import { prisma } from "@/lib/prisma";

type CategoryMutationFailure = {
  ok: false;
  code: "VALIDATION_ERROR" | "CONFLICT" | "NOT_FOUND" | "INTERNAL_ERROR";
  message: string;
  fieldErrors?: Record<string, string>;
};

export type CategoryMutationResult =
  | { ok: true; message: string; categoryId: string }
  | CategoryMutationFailure;

export type CategoryImageMutationResult =
  | { ok: true; message: string; imageUrl: string | null }
  | CategoryMutationFailure;

const optionalText = (max: number) =>
  z.string().trim().max(max).transform((value) => value || null);

const categorySchema = z.object({
  id: z.union([z.uuid(), z.literal("")]),
  nameAr: z.string().trim().min(2).max(120),
  nameEn: z.string().trim().min(2).max(120),
  descriptionAr: optionalText(1000),
  descriptionEn: optionalText(1000),
  parentId: z.union([z.uuid(), z.literal("")]).transform((value) => value || null),
  sortOrder: z.coerce.number().int().min(-10_000).max(10_000),
  isActive: z.boolean(),
});

function revalidateCategories() {
  ["/", "/en", "/products", "/en/products"].forEach((path) => revalidatePath(path));
  revalidatePath("/admin/categories");
}

function validationResult(error: z.ZodError): CategoryMutationFailure {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    fieldErrors[field] ??= "تحقّق من قيمة هذا الحقل.";
  }

  return {
    ok: false,
    code: "VALIDATION_ERROR",
    message: "تحقّق من حقول التصنيف والرابط.",
    fieldErrors,
  };
}

export async function saveAdminCategory(input: unknown): Promise<CategoryMutationResult> {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return validationResult(parsed.error);

  const isEdit = Boolean(parsed.data.id);
  const categories = await prisma.category.findMany({
    select: { id: true, parentId: true, slug: true, nameAr: true, nameEn: true, sortOrder: true, isActive: true },
  });

  if (parsed.data.parentId && !categories.some((category) => category.id === parsed.data.parentId)) {
    return { ok: false, code: "NOT_FOUND", message: "التصنيف الأب غير موجود." };
  }

  if (isEdit) {
    const descendants = getAdminCategoryDescendantIds(categories, parsed.data.id);
    if (parsed.data.parentId && descendants.includes(parsed.data.parentId)) {
      return { ok: false, code: "VALIDATION_ERROR", message: "لا يمكن جعل تصنيف فرعي أباً للتصنيف الحالي.", fieldErrors: { parentId: "لا يمكن اختيار تصنيف فرعي." } };
    }
  }

  const data = {
      nameAr: parsed.data.nameAr,
      nameEn: parsed.data.nameEn,
      descriptionAr: parsed.data.descriptionAr,
      descriptionEn: parsed.data.descriptionEn,
      parentId: parsed.data.parentId,
      sortOrder: parsed.data.sortOrder,
      isActive: parsed.data.isActive,
  };

  if (isEdit) {
    try {
      await prisma.category.update({ where: { id: parsed.data.id }, data });
    } catch {
      return { ok: false, code: "VALIDATION_ERROR", message: "تعذر حفظ التصنيف." };
    }
    revalidateCategories();
    return { ok: true, message: "تم تحديث التصنيف.", categoryId: parsed.data.id };
  }

  const slugBase = normalizeProductSlug(parsed.data.nameEn || parsed.data.nameAr);
  for (let suffix = 1; suffix <= 1_000; suffix += 1) {
    try {
      const category = await prisma.category.create({ data: { ...data, slug: productSlugWithSuffix(slugBase, suffix) }, select: { id: true } });
      revalidateCategories();
      return { ok: true, message: "تم إنشاء التصنيف.", categoryId: category.id };
    } catch (error) {
      if (typeof error === "object" && error && "code" in error && error.code === "P2002") continue;
      return { ok: false, code: "VALIDATION_ERROR", message: "تعذر حفظ التصنيف." };
    }
  }

  return { ok: false, code: "CONFLICT", message: "تعذر إنشاء رابط فريد للتصنيف. حاول مجدداً." };
}

export async function persistAdminCategoryImage(categoryId: string, publicId: string | null): Promise<CategoryImageMutationResult> {
  if (!z.uuid().safeParse(categoryId).success) return { ok: false, code: "VALIDATION_ERROR", message: "التصنيف غير صالح." };
  const category = await prisma.category.findUnique({ where: { id: categoryId }, select: { id: true } });
  if (!category) return { ok: false, code: "NOT_FOUND", message: "التصنيف غير موجود." };

  if (publicId === null) {
    await prisma.category.update({ where: { id: categoryId }, data: { imageUrl: null } });
    revalidateCategories();
    return { ok: true, message: "تمت إزالة صورة التصنيف.", imageUrl: null };
  }

  if (typeof publicId !== "string" || !isManagedCategoryPublicId(categoryId, publicId)) {
    return { ok: false, code: "VALIDATION_ERROR", message: "بيانات صورة التصنيف غير صالحة." };
  }

  let imageUrl: string | null;
  try {
    imageUrl = await verifyManagedCategoryImage(categoryId, publicId);
  } catch {
    try { await destroyManagedCategoryImage(categoryId, publicId); } catch { /* exact current upload cleanup is best effort */ }
    return { ok: false, code: "INTERNAL_ERROR", message: "تعذر التحقق من الصورة المرفوعة." };
  }
  if (!imageUrl) {
    try { await destroyManagedCategoryImage(categoryId, publicId); } catch { /* exact rejected upload cleanup is best effort */ }
    return { ok: false, code: "VALIDATION_ERROR", message: "رُفضت صورة التصنيف لأنها لا تطابق القيود." };
  }

  try {
    await prisma.category.update({ where: { id: categoryId }, data: { imageUrl } });
  } catch {
    try { await destroyManagedCategoryImage(categoryId, publicId); } catch { /* exact unpersisted upload cleanup is best effort */ }
    return { ok: false, code: "INTERNAL_ERROR", message: "تعذر حفظ صورة التصنيف." };
  }

  revalidateCategories();
  return { ok: true, message: "تم تحديث صورة التصنيف.", imageUrl };
}

export async function deleteAdminCategory(categoryId: string): Promise<CategoryMutationResult> {
  if (!z.uuid().safeParse(categoryId).success) {
    return { ok: false, code: "VALIDATION_ERROR", message: "التصنيف غير صالح." };
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { _count: { select: { products: true, children: true } } },
  });
  if (!category) return { ok: false, code: "NOT_FOUND", message: "التصنيف غير موجود." };
  if (category._count.products > 0 || category._count.children > 0) {
    return { ok: false, code: "CONFLICT", message: "لا يمكن حذف تصنيف يحتوي منتجات أو تصنيفات فرعية." };
  }

  await prisma.category.delete({ where: { id: categoryId } });
  revalidateCategories();
  return { ok: true, message: "تم حذف التصنيف الفارغ.", categoryId };
}
