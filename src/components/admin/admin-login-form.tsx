"use client";

import { LoaderCircle, LogIn } from "lucide-react";
import { useActionState } from "react";

import { signInAdmin, type AdminFormState } from "@/actions/admin-auth";

const initialState: AdminFormState = {};

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(signInAdmin, initialState);

  return (
    <form action={formAction} className="mt-7 space-y-4" noValidate>
      <div>
        <label htmlFor="admin-email" className="text-sm font-bold text-foreground">البريد الإلكتروني</label>
        <input id="admin-email" name="email" type="email" autoComplete="username" required dir="ltr" className="font-latin mt-2 min-h-12 w-full rounded-xl border border-black/12 bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
      </div>
      <div>
        <label htmlFor="admin-password" className="text-sm font-bold text-foreground">كلمة المرور</label>
        <input id="admin-password" name="password" type="password" autoComplete="current-password" required minLength={10} maxLength={128} dir="ltr" className="font-latin mt-2 min-h-12 w-full rounded-xl border border-black/12 bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
      </div>
      {state.error && <p role="alert" className="rounded-xl bg-status-warm-surface px-3 py-3 text-sm font-semibold text-status-warm">{state.error}</p>}
      <button type="submit" disabled={pending} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70">
        {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <LogIn className="size-4" aria-hidden="true" />}
        {pending ? "جارٍ الدخول…" : "تسجيل الدخول"}
      </button>
    </form>
  );
}
