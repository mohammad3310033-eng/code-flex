import type { OrderStatus } from "@/generated/prisma/client";
import Link from "next/link";

import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { formatAdminDate, formatAdminSyp, formatUsd, orderStatusLabels } from "@/lib/admin-presenters";
import { prisma } from "@/lib/prisma";

const statuses: Array<OrderStatus | "ALL"> = ["ALL", "NEW", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED"];
const ranges = ["all", "today", "7d", "30d"] as const;
type Range = (typeof ranges)[number];

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getRangeStart(range: Range) {
  if (range === "all") return undefined;
  const now = new Date();
  if (range === "today") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  const days = range === "7d" ? 7 : 30;
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

function filterHref(status: OrderStatus | "ALL", range: Range) {
  const query = new URLSearchParams();
  if (status !== "ALL") query.set("status", status);
  if (range !== "all") query.set("range", range);
  const value = query.toString();
  return value ? `/admin/orders?${value}` : "/admin/orders";
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const requestedStatus = first(query.status);
  const requestedRange = first(query.range);
  const status: OrderStatus | "ALL" = statuses.includes(requestedStatus as OrderStatus | "ALL")
    ? (requestedStatus as OrderStatus | "ALL")
    : "ALL";
  const range: Range = ranges.includes(requestedRange as Range) ? (requestedRange as Range) : "all";
  const rangeStart = getRangeStart(range);

  const orders = await prisma.order.findMany({
    where: {
      ...(status !== "ALL" ? { status } : {}),
      ...(rangeStart ? { createdAt: { gte: rangeStart } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div>
        <p className="text-sm font-semibold text-muted-foreground">إدارة الطلبات</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-[-0.045em]">الطلبات</h2>
      </div>

      <section aria-label="تصفية الطلبات" className="mt-7 rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
        <div>
          <h3 className="text-sm font-bold">الحالة</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {statuses.map((item) => (
              <Link key={item} href={filterHref(item, range)} className={`inline-flex min-h-10 items-center rounded-full px-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${status === item ? "bg-brand-indigo text-white" : "bg-muted text-foreground hover:bg-brand-indigo/10"}`}>
                {item === "ALL" ? "الكل" : orderStatusLabels[item]}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-5 border-t border-black/8 pt-4">
          <h3 className="text-sm font-bold">الفترة</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {([ ["all", "كل الوقت"], ["today", "اليوم"], ["7d", "آخر 7 أيام"], ["30d", "آخر 30 يوماً"] ] as const).map(([value, label]) => (
              <Link key={value} href={filterHref(status, value)} className={`inline-flex min-h-10 items-center rounded-full px-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${range === value ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-black/10"}`}>{label}</Link>
            ))}
          </div>
        </div>
      </section>

      <p className="mt-5 text-sm font-semibold text-muted-foreground">{orders.length} طلب</p>
      {orders.length === 0 ? (
        <section className="mt-3 rounded-2xl border border-dashed border-black/15 bg-white p-8 text-center text-sm text-muted-foreground">لا توجد طلبات ضمن هذا التصفية.</section>
      ) : (
        <>
          <div className="mt-3 grid gap-3 md:hidden">
            {orders.map((order) => (
              <Link key={order.id} href={`/admin/orders/${order.id}`} className="rounded-2xl border border-black/10 bg-white p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                <div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{order.customerName}</p><p dir="ltr" className="font-latin mt-1 text-sm text-muted-foreground">{order.customerPhone}</p></div><OrderStatusBadge status={order.status} /></div>
                <p dir="ltr" className="font-latin mt-4 truncate text-sm font-semibold">{order.productNameSnapshot}</p>
                <div className="mt-3 flex items-end justify-between gap-3 text-xs text-muted-foreground"><span>{formatAdminDate(order.createdAt)}</span><span dir="ltr" className="font-latin font-semibold text-foreground">{formatUsd(order.usdPriceCentsSnapshot)}</span></div>
              </Link>
            ))}
          </div>
          <div className="mt-3 hidden overflow-hidden rounded-2xl border border-black/10 bg-white md:block">
            <table className="w-full text-right text-sm">
              <thead className="bg-muted/60 text-xs text-muted-foreground"><tr><th className="px-4 py-3 font-bold">العميل</th><th className="px-4 py-3 font-bold">المنتج</th><th className="px-4 py-3 font-bold">السعر</th><th className="px-4 py-3 font-bold">الحالة</th><th className="px-4 py-3 font-bold">التاريخ</th></tr></thead>
              <tbody className="divide-y divide-black/7">
                {orders.map((order) => <tr key={order.id} className="hover:bg-muted/35"><td className="px-4 py-4"><Link href={`/admin/orders/${order.id}`} className="block font-semibold hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{order.customerName}<span dir="ltr" className="font-latin mt-1 block text-xs font-normal text-muted-foreground">{order.customerPhone}</span></Link></td><td dir="ltr" className="font-latin max-w-56 truncate px-4 py-4 font-semibold">{order.productNameSnapshot}</td><td className="px-4 py-4"><bdi dir="ltr" className="font-latin block font-semibold">{formatUsd(order.usdPriceCentsSnapshot)}</bdi><span dir="ltr" className="font-latin mt-1 block text-xs text-muted-foreground">{formatAdminSyp(order.usdPriceCentsSnapshot, order.usdRateSnapshot)}</span></td><td className="px-4 py-4"><OrderStatusBadge status={order.status} /></td><td className="whitespace-nowrap px-4 py-4 text-xs text-muted-foreground">{formatAdminDate(order.createdAt)}</td></tr>)}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
