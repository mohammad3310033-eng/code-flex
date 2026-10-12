import Link from "next/link";

import { BrandDeleteButton } from "@/components/admin/brand-delete-button";
import { BrandForm } from "@/components/admin/brand-form";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export default async function AdminBrandsPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireAdmin();
  const [brands, query] = await Promise.all([
    prisma.brand.findMany({ orderBy: [{ normalizedName: "asc" }, { id: "asc" }], include: { _count: { select: { products: true } } } }),
    searchParams,
  ]);
  const edit = query.edit ? brands.find((brand) => brand.id === query.edit) : undefined;

  return (
    <div>
      <p className="text-sm font-semibold text-muted-foreground">إدارة الكتالوج</p>
      <h2 className="mt-1 text-3xl font-semibold tracking-[-0.045em]">العلامات التجارية</h2>
      <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <section className="space-y-2" aria-label="قائمة العلامات التجارية">
          {brands.length === 0 ? <p className="rounded-2xl border border-dashed border-black/15 bg-white p-6 text-center text-sm font-bold">لا توجد علامات تجارية بعد.</p> : brands.map((brand) => (
            <article key={brand.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/10 bg-white p-4">
              <div><p dir="ltr" className="font-latin font-bold">{brand.name}</p><p className="mt-1 text-xs text-muted-foreground">{brand._count.products} منتج</p></div>
              <div className="flex items-start gap-3"><Link href={`/admin/brands?edit=${brand.id}`} className="inline-flex min-h-10 items-center text-sm font-bold text-primary hover:underline">تعديل</Link><BrandDeleteButton id={brand.id} /></div>
            </article>
          ))}
        </section>
        <aside className="xl:sticky xl:top-6 xl:self-start"><BrandForm brand={edit} /></aside>
      </div>
    </div>
  );
}
