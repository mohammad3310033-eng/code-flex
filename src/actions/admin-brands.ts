import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin-auth";
import { normalizeBrandName } from "@/lib/brand";
import { postgresUuidSchema } from "@/lib/postgres-uuid";
import { prisma } from "@/lib/prisma";

export type AdminBrandFormState = { error?: string; success?: string };

const brandSchema = z.object({
  id: z.union([postgresUuidSchema, z.literal("")]),
  name: z.string().trim().min(1).max(80),
});

function revalidateBrandSurfaces() {
  ["/", "/en", "/products", "/en/products", "/admin/brands", "/admin/products"].forEach((path) => revalidatePath(path));
}

export async function saveBrand(_state: AdminBrandFormState, formData: FormData): Promise<AdminBrandFormState> {
  await requireAdmin();
  const parsed = brandSchema.safeParse({ id: formData.get("id") ?? "", name: formData.get("name") });
  if (!parsed.success) return { error: "أدخل اسم علامة تجارية صالحاً." };

  const data = { name: parsed.data.name, normalizedName: normalizeBrandName(parsed.data.name) };
  try {
    if (parsed.data.id) await prisma.brand.update({ where: { id: parsed.data.id }, data });
    else await prisma.brand.create({ data });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
      return { error: "هذه العلامة التجارية موجودة مسبقاً." };
    }
    return { error: "تعذر حفظ العلامة التجارية." };
  }

  revalidateBrandSurfaces();
  return { success: parsed.data.id ? "تم تحديث العلامة التجارية." : "تمت إضافة العلامة التجارية." };
}

export async function deleteBrand(brandId: string): Promise<AdminBrandFormState> {
  await requireAdmin();
  if (!postgresUuidSchema.safeParse(brandId).success) return { error: "العلامة التجارية غير صالحة." };
  const brand = await prisma.brand.findUnique({ where: { id: brandId }, select: { name: true, _count: { select: { products: true } } } });
  if (!brand) return { error: "العلامة التجارية غير موجودة." };
  if (brand._count.products > 0) return { error: `لا يمكن حذف ${brand.name} لأنها مستخدمة في ${brand._count.products} منتج. انقل المنتجات إلى علامة أخرى أولاً.` };
  try {
    await prisma.brand.delete({ where: { id: brandId } });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2003") return { error: "لا يمكن حذف العلامة لأنها أصبحت مستخدمة في منتج." };
    return { error: "تعذر حذف العلامة التجارية." };
  }
  revalidateBrandSurfaces();
  return { success: "تم حذف العلامة التجارية غير المستخدمة." };
}
