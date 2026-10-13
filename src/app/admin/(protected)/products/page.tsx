import type { Prisma, StockStatus } from "@/generated/prisma/client";
import { Plus } from "lucide-react";
import Link from "next/link";

import { AdminImagePreview } from "@/components/admin/admin-image-preview";
import { ClearProductFiltersButton, ProductFilters } from "@/components/admin/product-filters";
import { ProductRowActions } from "@/components/admin/product-row-actions";
import { formatUsd } from "@/lib/admin-presenters";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const pageSize = 24;
const stockValues = ["IN_STOCK", "OUT_OF_STOCK", "ON_REQUEST"] as const;
const value = (input: string | string[] | undefined) => Array.isArray(input) ? input[0] : input;

function href(values: Record<string, string | undefined>) {
  const params = new URLSearchParams(Object.entries(values).flatMap(([key, item]) => item ? [[key, item]] : []));
  return `/admin/products${params.size ? `?${params}` : ""}`;
}

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const query = await searchParams;
  const q = value(query.q)?.trim().slice(0, 120) ?? "";
  const categoryId = value(query.category) ?? "";
  const active = value(query.active) ?? "";
  const stock = value(query.stock);
  const saved = value(query.saved);
  const page = Math.max(1, Number(value(query.page)) || 1);
  const where: Prisma.ProductWhereInput = { AND: [q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { brand: { is: { name: { contains: q, mode: "insensitive" } } } }] } : {}, categoryId ? { categoryId } : {}, active === "true" ? { isActive: true } : active === "false" ? { isActive: false } : {}, stockValues.includes(stock as StockStatus) ? { stockStatus: stock as StockStatus } : {}] };
  const [categories, total, productRows] = await Promise.all([
    prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { slug: "asc" }], select: { id: true, nameAr: true, nameEn: true } }),
    prisma.product.count({ where }),
    prisma.product.findMany({ where, orderBy: [{ updatedAt: "desc" }, { id: "asc" }], skip: (page - 1) * pageSize, take: pageSize, include: { brand: { select: { name: true } }, category: { select: { nameAr: true } }, images: { orderBy: { sortOrder: "asc" }, take: 1, select: { url: true } } } }),
  ]);
  const products = productRows.map((product) => ({ ...product, brand: product.brand.name }));
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const hasFilters = Boolean(q || categoryId || active || stock);

  return <div>
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-muted-foreground">إدارة الكتالوج</p><h2 className="mt-1 text-3xl font-semibold tracking-[-0.045em]">المنتجات</h2></div><Link href="/admin/products/new" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white hover:bg-primary-hover"><Plus className="size-4" aria-hidden="true" />إضافة منتج</Link></div>
    {(saved === "created" || saved === "updated") && <p role="status" data-testid="product-save-success" className="mt-5 rounded-xl border border-status-positive/15 bg-status-positive-surface px-4 py-3 text-sm font-bold text-status-positive">{saved === "created" ? "تمت إضافة المنتج بنجاح" : "تم حفظ التغييرات بنجاح"}</p>}
    <ProductFilters categories={categories} /><p className="mt-5 text-sm font-semibold text-muted-foreground">{total} منتج</p>
    {products.length === 0 ? <div className="mt-3 rounded-2xl border border-dashed border-black/15 bg-white p-6 text-center"><p className="text-sm font-bold">{hasFilters ? "لا توجد منتجات تطابق عوامل التصفية الحالية." : "لا توجد منتجات في الكتالوج بعد."}</p>{hasFilters && <ClearProductFiltersButton />}</div> : <>
      <div className="mt-3 grid grid-cols-1 gap-3 md:hidden">{products.map((product) => <div key={product.id} className="min-w-0 w-full rounded-2xl border border-black/10 bg-white p-3"><div className="flex min-w-0 gap-3">{product.images[0] ? <AdminImagePreview src={product.images[0].url} alt={product.name} sizes="64px" className="size-16 shrink-0 rounded-lg bg-muted" imageClassName="object-cover" /> : <div className="size-16 shrink-0 rounded-lg bg-muted" />}<div className="min-w-0 flex-1"><p dir="ltr" className="font-latin truncate font-bold">{product.name}</p><p className="mt-1 text-xs text-muted-foreground">{product.category.nameAr} · {formatUsd(product.priceUsdCents)}</p><p className="mt-2 text-xs font-bold">{product.isActive ? "نشط" : "غير نشط"} · {product.isFeatured ? "مميز" : "عادي"}</p></div></div><ProductRowActions productId={product.id} productName={product.name} compact /></div>)}</div>
      <div className="mt-3 hidden overflow-hidden rounded-2xl border border-black/10 bg-white md:block"><table className="w-full text-right text-sm"><thead className="bg-muted/60 text-xs text-muted-foreground"><tr><th className="p-3">المنتج</th><th className="p-3">العلامة/التصنيف</th><th className="p-3">السعر</th><th className="p-3">المخزون</th><th className="p-3">الظهور</th><th className="p-3"><span className="sr-only">الإجراءات</span></th></tr></thead><tbody className="divide-y divide-black/7">{products.map((product) => <tr key={product.id}><td className="p-3"><p dir="ltr" className="font-latin font-bold">{product.name}</p></td><td className="p-3"><p dir="ltr" className="font-latin">{product.brand}</p><p className="mt-1 text-xs text-muted-foreground">{product.category.nameAr}</p></td><td dir="ltr" className="font-latin p-3 font-bold">{formatUsd(product.priceUsdCents)}</td><td className="p-3">{product.stockStatus}</td><td className="p-3">{product.isActive ? "نشط" : "غير نشط"}{product.isFeatured && <span className="me-2 rounded-full bg-status-warm-surface px-2 py-1 text-xs text-status-warm">مميز</span>}</td><td className="p-3"><ProductRowActions productId={product.id} productName={product.name} /></td></tr>)}</tbody></table></div>
    </>}
    {pages > 1 && <nav className="mt-5 flex items-center gap-3" aria-label="ترقيم الصفحات">{page > 1 && <Link href={href({ q, category: categoryId, active, stock, page: String(page - 1) })} className="min-h-10 rounded-xl border border-black/12 px-4 py-2 text-sm font-bold">السابق</Link>}<span className="text-sm text-muted-foreground">{page} / {pages}</span>{page < pages && <Link href={href({ q, category: categoryId, active, stock, page: String(page + 1) })} className="min-h-10 rounded-xl border border-black/12 px-4 py-2 text-sm font-bold">التالي</Link>}</nav>}
  </div>;
}
