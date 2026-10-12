"use client";

import { LoaderCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { HeroImageManager } from "@/components/admin/hero-image-manager";
import type { ApiResponse } from "@/lib/admin-api-response";

type SiteSettings = {
  id: string;
  storeName: string;
  usdToSypRate: number;
  phone: string | null;
  whatsapp: string | null;
  facebook: string | null;
  instagram: string | null;
  heroEnabled: boolean;
  heroTitleAr: string | null;
  heroTitleEn: string | null;
  heroSubtitleAr: string | null;
  heroSubtitleEn: string | null;
  heroImageUrl: string | null;
  heroImagePublicId: string | null;
};

type FormState = { error?: string; success?: string; fieldErrors?: Record<string, string> };

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="block text-sm font-bold text-foreground"><span>{label}</span>{children}{hint && <span className="mt-1.5 block text-xs font-normal text-muted-foreground">{hint}</span>}</label>;
}

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, setState] = useState<FormState>({});
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = Object.fromEntries(data.entries());
    payload.heroEnabled = data.get("heroEnabled") === "on";
    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/settings", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
        const result = await response.json() as ApiResponse<{ message: string }>;
        if (result.ok) { setState({ success: result.data.message }); router.refresh(); }
        else setState({ error: result.error.message, fieldErrors: result.error.fieldErrors });
      } catch { setState({ error: "تعذر حفظ الإعدادات. حاول مجدداً." }); }
    });
  }

  return <form onSubmit={submit} className="space-y-6" noValidate>
    <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><h2 className="text-lg font-semibold">1. عام</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="اسم المتجر"><input name="storeName" required defaultValue={settings.storeName} className="mt-2 min-h-12 w-full rounded-xl border border-black/12 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></Field></div></section>

    <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><h2 className="text-lg font-semibold">2. العملة</h2><div className="mt-5 max-w-md"><Field label="سعر صرف الدولار" hint="عدد الليرات السورية مقابل 1 دولار أمريكي"><input name="usdToSypRate" required type="number" inputMode="numeric" min="1" step="1" defaultValue={settings.usdToSypRate} dir="ltr" className="font-latin mt-2 min-h-12 w-full rounded-xl border border-black/12 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></Field></div></section>

    <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><h2 className="text-lg font-semibold">3. التواصل</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="الهاتف" hint="يسمح برمز الدولة والفواصل الشائعة."><input name="phone" type="tel" defaultValue={settings.phone ?? ""} dir="ltr" className="font-latin mt-2 min-h-12 w-full rounded-xl border border-black/12 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></Field><Field label="واتساب" hint="استخدم رقماً صالحاً لتفعيل أزرار التواصل العامة."><input name="whatsapp" type="tel" defaultValue={settings.whatsapp ?? ""} dir="ltr" className="font-latin mt-2 min-h-12 w-full rounded-xl border border-black/12 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></Field></div></section>

    <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><h2 className="text-lg font-semibold">4. الروابط الاجتماعية</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Facebook"><input name="facebook" type="url" defaultValue={settings.facebook ?? ""} placeholder="https://" dir="ltr" className="font-latin mt-2 min-h-12 w-full rounded-xl border border-black/12 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></Field><Field label="Instagram"><input name="instagram" type="url" defaultValue={settings.instagram ?? ""} placeholder="https://" dir="ltr" className="font-latin mt-2 min-h-12 w-full rounded-xl border border-black/12 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></Field></div></section>

    <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">5. الصفحة الرئيسية / Hero</h2><p className="mt-1 text-sm text-muted-foreground">عند التفعيل، تحل النصوص المدخلة محل النسخة الافتراضية عند توفرها.</p></div><label className="inline-flex min-h-11 items-center gap-2 text-sm font-bold"><input name="heroEnabled" type="checkbox" defaultChecked={settings.heroEnabled} className="size-4 accent-primary" />تفعيل نص Hero المخصص</label></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="العنوان — العربية"><input name="heroTitleAr" defaultValue={settings.heroTitleAr ?? ""} className="mt-2 min-h-12 w-full rounded-xl border border-black/12 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></Field><Field label="العنوان — English"><input name="heroTitleEn" defaultValue={settings.heroTitleEn ?? ""} dir="ltr" className="font-latin mt-2 min-h-12 w-full rounded-xl border border-black/12 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></Field><Field label="النص التوضيحي — العربية"><textarea name="heroSubtitleAr" rows={4} defaultValue={settings.heroSubtitleAr ?? ""} className="mt-2 w-full rounded-xl border border-black/12 px-3 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></Field><Field label="النص التوضيحي — English"><textarea name="heroSubtitleEn" rows={4} defaultValue={settings.heroSubtitleEn ?? ""} dir="ltr" className="font-latin mt-2 w-full rounded-xl border border-black/12 px-3 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></Field></div><HeroImageManager settingsId={settings.id} initialUrl={settings.heroImageUrl} initialPublicId={settings.heroImagePublicId} /></section>

    {state.error && <p role="alert" className="rounded-xl bg-status-warm-surface px-4 py-3 text-sm font-bold text-status-warm">{state.error}</p>}
    {state.success && <p role="status" className="rounded-xl bg-status-positive-surface px-4 py-3 text-sm font-bold text-status-positive">{state.success}</p>}
    <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70">{pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}{pending ? "جارٍ الحفظ…" : "حفظ الإعدادات"}</button>
  </form>;
}
