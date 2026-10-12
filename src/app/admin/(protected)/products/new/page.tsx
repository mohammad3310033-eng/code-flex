import Link from "next/link";

import { ProductForm } from "@/components/admin/product-form";
import { getLaptopCategoryIds } from "@/lib/admin-catalog";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export default async function NewProductPage() {
  await requireAdmin();
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { slug: "asc" }], select: { id: true, parentId: true, slug: true, nameAr: true, nameEn: true, sortOrder: true, isActive: true } }),
    prisma.brand.findMany({ orderBy: [{ normalizedName: "asc" }, { id: "asc" }], select: { id: true, name: true } }),
  ]);
  return <div><Link href="/admin/products" className="text-sm font-bold text-primary hover:underline">المنتجات</Link><h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em]">إضافة منتج</h2><p className="mt-2 text-sm text-muted-foreground">أدخل بيانات المنتج واختر حتى 8 صور؛ سيُنشأ المنتج قبل رفع الصور والتحقق منها.</p><div className="mt-7 max-w-4xl"><ProductForm categories={categories} brands={brands} laptopCategoryIds={getLaptopCategoryIds(categories)} /></div></div>;
}
