"use client";

import { LoaderCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { CategoryImageManager } from "@/components/admin/category-image-manager";
import { AdminSelect } from "@/components/ui/admin-select";
import type { ApiResponse } from "@/lib/admin-api-response";

type Category = { id: string; parentId: string | null; nameAr: string; nameEn: string; descriptionAr: string | null; descriptionEn: string | null; imageUrl: string | null; sortOrder: number; isActive: boolean };
type FormState = { error?: string; success?: string; fieldErrors?: Record<string, string> };

export function CategoryForm({ category, parentOptions }: { category?: Category; parentOptions: Category[] }) {
  const [savedCategoryId, setSavedCategoryId] = useState(category?.id);
  const [state, setState] = useState<FormState>({});
  const [imageBusy, setImageBusy] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const isEdit = Boolean(savedCategoryId);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = Object.fromEntries(data.entries());
    payload.isActive = data.get("isActive") === "on";
    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/categories", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
        const result = await response.json() as ApiResponse<{ message: string; categoryId: string }>;
        if (result.ok) {
          setSavedCategoryId(result.data.categoryId);
          setState({ success: result.data.message });
          router.refresh();
        } else setState({ error: result.error.message, fieldErrors: result.error.fieldErrors });
      } catch { setState({ error: "تعذر حفظ التصنيف. حاول مجدداً." }); }
    });
  }

  const controlClass = "mt-2 min-h-11 w-full rounded-xl border border-black/12 px-3 outline-none focus:border-primary";
  return <form onSubmit={submit} className="rounded-2xl border border-black/10 bg-white p-5"><input type="hidden" name="id" value={savedCategoryId ?? ""} /><h2 className="text-lg font-semibold">{isEdit ? "تعديل التصنيف" : "إضافة تصنيف"}</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold">الاسم العربي<input name="nameAr" required defaultValue={category?.nameAr} className={controlClass} /></label><label className="text-sm font-bold">English name<input name="nameEn" required defaultValue={category?.nameEn} dir="ltr" className={`font-latin ${controlClass}`} /></label><label className="text-sm font-bold">التصنيف الأب<AdminSelect name="parentId" defaultValue={category?.parentId ?? ""} placeholder="بدون أب" allowClear options={parentOptions.filter((item) => item.nameAr.trim() && item.nameEn.trim()).map((item) => ({ value: item.id, label: `${item.nameEn.trim()} — ${item.nameAr.trim()}` }))} /></label><label className="text-sm font-bold">الترتيب<input name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} className={controlClass} /></label><label className="inline-flex min-h-11 items-center gap-2 self-end text-sm font-bold"><input name="isActive" type="checkbox" defaultChecked={category?.isActive ?? true} className="size-4 accent-primary" />نشط في المتجر</label></div><label className="mt-4 block text-sm font-bold">الوصف العربي<textarea name="descriptionAr" rows={3} defaultValue={category?.descriptionAr ?? ""} className="mt-2 w-full rounded-xl border border-black/12 px-3 py-2 outline-none focus:border-primary" /></label><label className="mt-4 block text-sm font-bold">English description<textarea name="descriptionEn" rows={3} defaultValue={category?.descriptionEn ?? ""} dir="ltr" className="font-latin mt-2 w-full rounded-xl border border-black/12 px-3 outline-none focus:border-primary" /></label><CategoryImageManager categoryId={savedCategoryId} initialUrl={category?.imageUrl ?? null} disabled={pending} onBusyChange={setImageBusy} />{state.error && <p role="alert" className="mt-4 rounded-xl bg-status-warm-surface p-3 text-sm font-bold text-status-warm">{state.error}</p>}{state.success && <p role="status" className="mt-4 rounded-xl bg-status-positive-surface p-3 text-sm font-bold text-status-positive">{state.success}</p>}<button disabled={pending || imageBusy} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white disabled:opacity-60">{pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}{pending ? "جارٍ الحفظ…" : "حفظ التصنيف"}</button></form>;
}
