import { LogOut } from "lucide-react";
import Link from "next/link";

import { signOutAdmin } from "@/actions/admin-auth";
import { AdminMobileNavigation } from "@/components/admin/admin-mobile-navigation";
import { AdminNavigation } from "@/components/admin/admin-navigation";

type AdminShellProps = {
  children: React.ReactNode;
  email: string;
  newOrdersCount: number;
};

export function AdminShell({ children, email, newOrdersCount }: AdminShellProps) {
  return (
    <div className="min-h-dvh bg-[#f7f7f5] text-foreground">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-[#171717] px-4 py-3 text-white md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <span className="flex items-center gap-2 font-latin text-sm font-bold tracking-[0.15em]"><span className="bg-brand-gradient size-2 rounded-full" />CODE FLEX / ADMIN</span>
          <AdminMobileNavigation newOrdersCount={newOrdersCount} />
        </div>
      </header>

      <aside className="fixed inset-y-0 start-0 hidden w-72 flex-col bg-[#171717] px-4 py-6 text-white md:flex">
        <div className="px-3">
          <p className="text-brand-gradient font-latin text-xs font-bold tracking-[0.2em]">CODE FLEX</p>
          <h1 className="mt-2 text-xl font-semibold">لوحة الإدارة</h1>
        </div>
        <div className="mt-8">
          <AdminNavigation newOrdersCount={newOrdersCount} />
        </div>
        <div className="mt-auto border-t border-white/10 pt-5">
          <Link href="/admin/account" className="block truncate px-3 text-xs text-white/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            {email}
          </Link>
          <form action={signOutAdmin} className="mt-3">
            <button className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-white/78 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <LogOut className="size-4" aria-hidden="true" />
              تسجيل الخروج
            </button>
          </form>
        </div>
      </aside>

      <main className="w-full px-4 py-6 md:ms-72 md:w-auto md:px-8 md:py-9">
        <div className="mx-auto w-full max-w-[96rem]">{children}</div>
      </main>
    </div>
  );
}
