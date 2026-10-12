"use client";

import { Boxes, ChartNoAxesCombined, FolderTree, LayoutDashboard, PackageSearch, Settings, Tags } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/admin", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/admin/orders", label: "الطلبات", icon: PackageSearch },
  { href: "/admin/products", label: "المنتجات", icon: Boxes },
  { href: "/admin/brands", label: "العلامات التجارية", icon: Tags },
  { href: "/admin/categories", label: "التصنيفات", icon: FolderTree },
  { href: "/admin/analytics", label: "التحليلات", icon: ChartNoAxesCombined },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export function AdminNavigation({ newOrdersCount, onNavigate }: { newOrdersCount: number; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="التنقل الإداري" className="grid gap-1">
      {navigation.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple ${active ? "bg-brand-indigo/25 text-white ring-1 ring-brand-cyan/25" : "text-white/78 hover:bg-white/10 hover:text-white"}`}
          >
            <Icon className={`size-4 ${active ? "text-brand-cyan" : ""}`} aria-hidden="true" />
            <span>{label}</span>
            {href === "/admin/orders" && newOrdersCount > 0 && <span className="me-auto min-w-6 rounded-full bg-brand-purple px-1.5 py-0.5 text-center text-[0.7rem] font-bold text-white">{newOrdersCount}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
