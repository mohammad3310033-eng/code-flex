import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductDeleteButton } from "@/components/admin/product-delete-button";
import { ProductForm } from "@/components/admin/product-form";
import { ProductImageManager } from "@/components/admin/product-image-manager";
import { getLaptopCategoryIds } from "@/lib/admin-catalog";
import { requireAdmin } from "@/lib/admin-auth";
import { postgresUuidSchema } from "@/lib/postgres-uuid";
import { prisma } from "@/lib/prisma";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin(); const { id } = await params; if (!postgresUuidSchema.safeParse(id).success) notFound();
  const [product, categories, brands] = await Promise.all([prisma.product.findUnique({ where: { id }, include: { laptopSpecs: { include: { storages: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] } } }, images: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: { id: true, publicId: true, url: true, sortOrder: true } } } }), prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { slug: "asc" }], select: { id: true, parentId: true, slug: true, nameAr: true, nameEn: true, sortOrder: true, isActive: true } }), prisma.brand.findMany({ orderBy: [{ normalizedName: "asc" }, { id: "asc" }], select: { id: true, name: true } })]);
  if (!product) notFound();
  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><Link href="/admin/products" className="text-sm font-bold text-primary hover:underline">المنتجات</Link><h2 dir="ltr" className="font-latin mt-2 text-3xl font-semibold tracking-[-0.045em]">{product.name}</h2></div><ProductDeleteButton productId={product.id} productName={product.name} /></div><div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_24rem]"><div><ProductForm product={product} categories={categories} brands={brands} laptopCategoryIds={getLaptopCategoryIds(categories)} /></div><div className="xl:sticky xl:top-6 xl:self-start"><ProductImageManager productId={product.id} productName={product.name} images={product.images} /></div></div></div>;
}
