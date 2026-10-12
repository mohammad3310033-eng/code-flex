import { ShieldCheck } from "lucide-react";

import { PasswordChangeForm } from "@/components/admin/password-change-form";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminAccountPage() {
  const session = await requireAdmin();

  return (
    <div className="max-w-xl">
      <p className="text-sm font-semibold text-muted-foreground">الحساب</p>
      <h2 className="mt-1 text-3xl font-semibold tracking-[-0.045em]">الأمان</h2>
      <section className="mt-7 rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
        <div className="flex gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-status-positive-surface text-status-positive"><ShieldCheck className="size-5" aria-hidden="true" /></span>
          <div>
            <h3 className="font-semibold">{session.user.email}</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">تغيير كلمة المرور سيُلغي الجلسات الأخرى المرتبطة بهذا الحساب.</p>
          </div>
        </div>
        <PasswordChangeForm />
      </section>
    </div>
  );
}
