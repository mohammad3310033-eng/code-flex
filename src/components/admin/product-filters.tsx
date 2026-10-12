"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { AdminSelect } from "@/components/ui/admin-select";

type CategoryOption = { id: string; nameAr: string; nameEn: string };

type ProductFiltersProps = {
  categories: CategoryOption[];
};

function createProductsHref(params: URLSearchParams) {
  const query = params.toString();
  return `/admin/products${query ? `?${query}` : ""}`;
}

export function ClearProductFiltersButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => router.push("/admin/products"))}
      className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl border border-black/12 px-4 text-sm font-bold hover:bg-muted disabled:opacity-60"
    >
      مسح عوامل التصفية
    </button>
  );
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const paramsKey = searchParams.toString();
  const hasFilters = ["q", "category", "active", "stock"].some((key) => Boolean(searchParams.get(key)));

  function applyFilters(formData: FormData) {
    const params = new URLSearchParams();
    const q = String(formData.get("q") ?? "").trim();
    const category = String(formData.get("category") ?? "");
    const active = String(formData.get("active") ?? "");
    const stock = String(formData.get("stock") ?? "");

    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (active) params.set("active", active);
    if (stock) params.set("stock", stock);

    startTransition(() => router.push(createProductsHref(params)));
  }

  return (
    <form
      key={paramsKey}
      onSubmit={(event) => {
        event.preventDefault();
        applyFilters(new FormData(event.currentTarget));
      }}
      className="mt-7 grid min-w-0 grid-cols-1 gap-3 rounded-2xl border border-black/10 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      <input
        name="q"
        defaultValue={searchParams.get("q") ?? ""}
        placeholder="بحث بالاسم أو العلامة"
        className="font-latin min-h-11 min-w-0 w-full rounded-xl border border-black/12 px-3 text-sm outline-none focus:border-primary lg:col-span-2"
        dir="ltr"
      />
      <AdminSelect name="category" defaultValue={searchParams.get("category") ?? ""} placeholder="كل التصنيفات" allowClear options={categories.map((category) => ({ value: category.id, label: `${category.nameAr} — ${category.nameEn}` }))} className="mt-0 min-h-11" />
      <AdminSelect name="active" defaultValue={searchParams.get("active") ?? ""} placeholder="كل حالات الظهور" allowClear options={[{ value: "true", label: "نشط" }, { value: "false", label: "غير نشط" }]} className="mt-0 min-h-11" />
      <AdminSelect name="stock" defaultValue={searchParams.get("stock") ?? ""} placeholder="كل المخزون" allowClear options={[{ value: "IN_STOCK", label: "متوفر" }, { value: "OUT_OF_STOCK", label: "غير متوفر" }, { value: "ON_REQUEST", label: "حسب الطلب" }]} className="mt-0 min-h-11" />
      <div className="flex flex-wrap gap-3 sm:col-span-2 lg:col-span-5">
        <button type="submit" disabled={isPending} className="min-h-11 rounded-xl bg-primary px-4 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-60">
          {isPending ? "جارٍ التصفية…" : "تطبيق التصفية"}
        </button>
        {hasFilters && <ClearProductFiltersButton />}
      </div>
    </form>
  );
}
