"use client";

import { KeyRound, LoaderCircle } from "lucide-react";
import { useActionState } from "react";

import { changeAdminPassword, type AdminFormState } from "@/actions/admin-auth";

const initialState: AdminFormState = {};

export function PasswordChangeForm() {
  const [state, formAction, pending] = useActionState(changeAdminPassword, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label htmlFor="current-password" className="text-sm font-bold">كلمة المرور الحالية</label>
        <input id="current-password" name="currentPassword" type="password" autoComplete="current-password" required maxLength={128} dir="ltr" className="font-latin mt-2 min-h-12 w-full rounded-xl border border-black/12 bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
      </div>
      <div>
        <label htmlFor="new-password" className="text-sm font-bold">كلمة المرور الجديدة</label>
        <input id="new-password" name="newPassword" type="password" autoComplete="new-password" required minLength={10} maxLength={128} dir="ltr" className="font-latin mt-2 min-h-12 w-full rounded-xl border border-black/12 bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
        <p className="mt-1.5 text-xs text-muted-foreground">10 أحرف على الأقل.</p>
      </div>
      <div>
        <label htmlFor="confirm-password" className="text-sm font-bold">تأكيد كلمة المرور الجديدة</label>
        <input id="confirm-password" name="confirmPassword" type="password" autoComplete="new-password" required minLength={10} maxLength={128} dir="ltr" className="font-latin mt-2 min-h-12 w-full rounded-xl border border-black/12 bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
      </div>
      {state.error && <p role="alert" className="rounded-xl bg-status-warm-surface px-3 py-3 text-sm font-semibold text-status-warm">{state.error}</p>}
      {state.success && <p role="status" className="rounded-xl bg-status-positive-surface px-3 py-3 text-sm font-semibold text-status-positive">{state.success}</p>}
      <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70">
        {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <KeyRound className="size-4" aria-hidden="true" />}
        {pending ? "جارٍ الحفظ…" : "تغيير كلمة المرور"}
      </button>
    </form>
  );
}
