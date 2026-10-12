"use client";

import { LoaderCircle, Save } from "lucide-react";
import { useState, useTransition } from "react";

type ResponseBody = { ok: boolean; data?: { message?: string }; error?: { message?: string } };

export function BrandForm({ brand }: { brand?: { id: string; name: string } }) {
  const [message, setMessage] = useState<{ error?: string; success?: string }>({});
  const [pending, startTransition] = useTransition();
  return <form onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); startTransition(async () => { try { const response = await fetch("/api/admin/brands", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: form.get("id"), name: form.get("name") }) }); const result = await response.json() as ResponseBody; setMessage(result.ok ? { success: result.data?.message } : { error: result.error?.message ?? "تعذر حفظ العلامة التجارية." }); } catch { setMessage({ error: "تعذر الاتصال بخدمة العلامات التجارية." }); } }); }} className="rounded-2xl border border-black/10 bg-white p-5">
    <input type="hidden" name="id" value={brand?.id ?? ""} /><h2 className="text-lg font-semibold">{brand ? "تعديل العلامة" : "إضافة علامة تجارية"}</h2>
    <label className="mt-5 block text-sm font-bold">اسم العلامة<input name="name" required maxLength={80} defaultValue={brand?.name} dir="ltr" className="font-latin mt-2 min-h-11 w-full rounded-xl border border-black/12 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></label>
    <p className="mt-2 text-xs text-muted-foreground">تُمنع النسخ المكررة حتى عند اختلاف حالة الأحرف أو المسافات.</p>
    {message.error && <p role="alert" className="mt-4 rounded-xl bg-status-warm-surface p-3 text-sm font-bold text-status-warm">{message.error}</p>}{message.success && <p role="status" className="mt-4 rounded-xl bg-status-positive-surface p-3 text-sm font-bold text-status-positive">{message.success}</p>}
    <button disabled={pending} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-60">{pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}{pending ? "جارٍ الحفظ…" : "حفظ العلامة"}</button>
  </form>;
}
