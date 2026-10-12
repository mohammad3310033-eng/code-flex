"use client";

import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { signOutAdmin } from "@/actions/admin-auth";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function AdminMobileNavigation({ newOrdersCount }: { newOrdersCount: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- an Admin route transition must dismiss the controlled modal navigation.
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<button type="button" aria-label="فتح القائمة الإدارية" className="inline-flex min-h-10 cursor-pointer items-center rounded-lg border border-white/20 px-3 text-sm font-semibold transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />}>
        <Menu className="me-2 size-4" aria-hidden="true" />القائمة
      </SheetTrigger>
      <SheetContent side="right" dir="rtl" closeLabel="إغلاق القائمة الإدارية" onBackdropClick={closeMenu} className="w-[min(88vw,20rem)] gap-0 border-white/10 bg-[#202020] p-0 text-white shadow-2xl">
        <SheetHeader className="border-b border-white/10 px-5 py-5 pe-14"><SheetTitle className="text-lg text-white">لوحة الإدارة</SheetTitle><SheetDescription className="text-white/65">التنقل الإداري</SheetDescription></SheetHeader>
        <div className="p-3"><AdminNavigation newOrdersCount={newOrdersCount} onNavigate={closeMenu} /><Link href="/admin/account" onClick={closeMenu} className="mt-2 flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-white/78 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">الحساب والأمان</Link><form action={signOutAdmin} className="mt-2 border-t border-white/10 pt-2"><button className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-white/78 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><LogOut className="size-4" aria-hidden="true" />تسجيل الخروج</button></form></div>
      </SheetContent>
    </Sheet>
  );
}
