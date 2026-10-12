import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin-auth";
import { destroyManagedProductImage, getCloudinaryProductImageCleanupDiagnostic, getCloudinaryResourceLookupDiagnostic, isManagedProductPublicId, verifyManagedProductImageDetails } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { postgresUuidSchema } from "@/lib/postgres-uuid";

export type AdminImageFormState = { error?: string; success?: string; diagnosticCode?: string; cleanupCode?: string; image?: { id: string; publicId: string; url: string; sortOrder: number } };
export type DuplicateProductMatch = { id: string; name: string; brand: string; categoryName: string };

const productIdSchema = postgresUuidSchema;

function revalidateCatalog(slug?: string) {
  ["/", "/en", "/products", "/en/products"].forEach((path) => revalidatePath(path));
  if (slug) ["/products/", "/en/products/"].forEach((prefix) => revalidatePath(`${prefix}${slug}`));
}

export async function findProductsByExactName(name: string, excludeId?: string): Promise<DuplicateProductMatch[]> {
  await requireAdmin();
  const normalizedName = name.trim().slice(0, 180);
  if (normalizedName.length < 2) return [];
  return prisma.product.findMany({
    where: {
      name: { equals: normalizedName, mode: "insensitive" },
      ...(excludeId && productIdSchema.safeParse(excludeId).success ? { id: { not: excludeId } } : {}),
    },
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    take: 5,
    select: { id: true, name: true, brand: { select: { name: true } }, category: { select: { nameAr: true } } },
  }).then((matches) => matches.map((match) => ({ id: match.id, name: match.name, brand: match.brand.name, categoryName: match.category.nameAr })));
}

export async function setProductActive(productId: string, isActive: boolean) {
  await requireAdmin();
  if (!productIdSchema.safeParse(productId).success) return;
  const product = await prisma.product.update({ where: { id: productId }, data: { isActive }, select: { slug: true } });
  revalidateCatalog(product.slug);
}

export async function setProductFeatured(productId: string, isFeatured: boolean) {
  await requireAdmin();
  if (!productIdSchema.safeParse(productId).success) return;
  const product = await prisma.product.update({ where: { id: productId }, data: { isFeatured }, select: { slug: true } });
  revalidateCatalog(product.slug);
}

export async function deleteProduct(productId: string): Promise<AdminImageFormState> {
  await requireAdmin();
  if (!productIdSchema.safeParse(productId).success) return { error: "المنتج غير صالح." };
  const product = await prisma.product.findUnique({ where: { id: productId }, include: { images: { select: { publicId: true } } } });
  if (!product) return { error: "المنتج غير موجود." };
  await prisma.product.delete({ where: { id: productId } });
  revalidateCatalog(product.slug);
  const results = await Promise.allSettled(product.images.map((image) => destroyManagedProductImage(productId, image.publicId)));
  return results.some((item) => item.status === "rejected") ? { success: "حُذف المنتج. تعذر تنظيف بعض الصور البعيدة." } : { success: "تم حذف المنتج وصوره." };
}

const imageFormSchema = z.object({ productId: postgresUuidSchema, publicId: z.string().min(1).max(300) });

async function cleanupUnpersistedProductImage(productId: string, publicId: string) {
  if (!isManagedProductPublicId(productId, publicId)) return "CLOUDINARY_CLEANUP_SKIPPED_UNOWNED";
  try {
    await destroyManagedProductImage(productId, publicId);
    return "CLOUDINARY_CLEANUP_COMPLETED";
  } catch (error) {
    const diagnostic = getCloudinaryProductImageCleanupDiagnostic(error);
    if (diagnostic) {
      console.warn("Cloudinary orphan cleanup failed", diagnostic);
      return `CLOUDINARY_CLEANUP_${diagnostic.category}`;
    }
    return "CLOUDINARY_CLEANUP_UNKNOWN";
  }
}

export async function persistProductImage(_state: AdminImageFormState, formData: FormData): Promise<AdminImageFormState> {
  await requireAdmin();
  const parsed = imageFormSchema.safeParse({ productId: formData.get("productId"), publicId: formData.get("publicId") });
  if (!parsed.success) return { error: "بيانات الصورة غير صالحة." };
  let count: number;
  try {
    count = await prisma.productImage.count({ where: { productId: parsed.data.productId } });
  } catch {
    return { error: "تعذر حفظ الصورة، وتمت محاولة تنظيفها.", cleanupCode: await cleanupUnpersistedProductImage(parsed.data.productId, parsed.data.publicId) };
  }
  if (count >= 8) return { error: "الحد الأقصى هو 8 صور لكل منتج.", cleanupCode: await cleanupUnpersistedProductImage(parsed.data.productId, parsed.data.publicId) };
  let verifiedImage: Awaited<ReturnType<typeof verifyManagedProductImageDetails>>;
  try {
    verifiedImage = await verifyManagedProductImageDetails(parsed.data.productId, parsed.data.publicId);
    if (verifiedImage) console.info("Cloudinary resource lookup succeeded", verifiedImage.diagnostic);
  } catch (error) {
    const diagnostic = getCloudinaryResourceLookupDiagnostic(error);
    if (diagnostic) console.warn("Cloudinary resource lookup failed", diagnostic);
    return {
      error: "تعذر التحقق من الصورة المرفوعة.",
      ...(diagnostic ? { diagnosticCode: `CLOUDINARY_LOOKUP_${diagnostic.category}` } : {}),
      cleanupCode: await cleanupUnpersistedProductImage(parsed.data.productId, parsed.data.publicId),
    };
  }
  if (!verifiedImage) return { error: "الصورة لا تنتمي إلى هذا المنتج.", cleanupCode: await cleanupUnpersistedProductImage(parsed.data.productId, parsed.data.publicId) };
  let image: NonNullable<AdminImageFormState["image"]>;
  try {
    image = await prisma.productImage.create({ data: { productId: parsed.data.productId, publicId: parsed.data.publicId, url: verifiedImage.url, sortOrder: count }, select: { id: true, publicId: true, url: true, sortOrder: true } });
  } catch {
    return { error: "تعذر حفظ الصورة، وتمت محاولة تنظيفها.", cleanupCode: await cleanupUnpersistedProductImage(parsed.data.productId, parsed.data.publicId) };
  }
  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId }, select: { slug: true } });
  if (product) revalidateCatalog(product.slug);
  return { success: "تمت إضافة الصورة.", image };
}

export async function moveProductImage(productId: string, imageId: string, direction: "up" | "down"): Promise<AdminImageFormState> {
  await requireAdmin();
  if (!productIdSchema.safeParse(productId).success || !productIdSchema.safeParse(imageId).success) return { error: "الصورة غير صالحة." };
  const images = await prisma.productImage.findMany({ where: { productId }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  const currentIndex = images.findIndex((image) => image.id === imageId);
  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= images.length) return { error: "لا يمكن تغيير ترتيب الصورة." };
  const reordered = [...images];
  [reordered[currentIndex], reordered[targetIndex]] = [reordered[targetIndex]!, reordered[currentIndex]!];
  await prisma.$transaction(reordered.map((image, sortOrder) => prisma.productImage.update({ where: { id: image.id }, data: { sortOrder } })));
  const product = await prisma.product.findUnique({ where: { id: productId }, select: { slug: true } });
  if (product) revalidateCatalog(product.slug);
  return { success: "تم حفظ الترتيب." };
}

export async function reorderProductImages(productId: string, imageIds: string[]): Promise<AdminImageFormState> {
  await requireAdmin();
  if (!productIdSchema.safeParse(productId).success || imageIds.length > 8 || new Set(imageIds).size !== imageIds.length || imageIds.some((imageId) => !productIdSchema.safeParse(imageId).success)) return { error: "ترتيب الصور غير صالح." };
  const images = await prisma.productImage.findMany({ where: { productId }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  if (images.length !== imageIds.length || images.some((image) => !imageIds.includes(image.id))) return { error: "تعذر التحقق من ترتيب الصور." };
  await prisma.$transaction(imageIds.map((imageId, sortOrder) => prisma.productImage.update({ where: { id: imageId }, data: { sortOrder } })));
  const product = await prisma.product.findUnique({ where: { id: productId }, select: { slug: true } });
  if (product) revalidateCatalog(product.slug);
  return { success: "تم حفظ الترتيب." };
}

export async function deleteProductImage(productId: string, imageId: string): Promise<AdminImageFormState> {
  await requireAdmin();
  if (!productIdSchema.safeParse(productId).success || !productIdSchema.safeParse(imageId).success) return { error: "الصورة غير صالحة." };
  const image = await prisma.productImage.findFirst({ where: { id: imageId, productId }, include: { product: { select: { slug: true } } } });
  if (!image) return { error: "الصورة غير موجودة." };
  await prisma.productImage.delete({ where: { id: image.id } });
  const remaining = await prisma.productImage.findMany({ where: { productId }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  await prisma.$transaction(remaining.map((item, sortOrder) => prisma.productImage.update({ where: { id: item.id }, data: { sortOrder } })));
  revalidateCatalog(image.product.slug);
  try { await destroyManagedProductImage(productId, image.publicId); return { success: "تم حذف الصورة." }; } catch { return { success: "حُذفت الصورة من المتجر، وتعذر تنظيفها من التخزين البعيد." }; }
}
