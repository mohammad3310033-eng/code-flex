import { ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getAdminSession } from "@/lib/admin-auth";

export default async function AdminLoginPage() {
  if (await getAdminSession()) {
    redirect("/admin");
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-[#e9e9e4] px-4 py-8">
      <section className="w-full max-w-md rounded-[1.5rem] border border-black/10 bg-[#f7f7f5] p-6 shadow-xl shadow-black/8 sm:p-8">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#171717] text-white">
          <ShieldCheck className="size-6" aria-hidden="true" />
        </div>
        <p className="font-latin mt-6 text-xs font-bold tracking-[0.2em] text-primary">CODE FLEX</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em]">دخول الإدارة</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">هذه المساحة مخصّصة لفريق المتجر فقط.</p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
