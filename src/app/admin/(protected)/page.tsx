import { ArrowLeft, ClipboardList, TriangleAlert } from "lucide-react";
import Link from "next/link";

import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { formatAdminDate, formatUsd } from "@/lib/admin-presenters";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [newOrdersCount, recentOrders] = await Promise.all([
    prisma.order.count({ where: { status: "NEW" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">العمليات</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-[-0.045em]">ملخص الطلبات</h2>
        </div>
        <Link href="/admin/orders" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          كل الطلبات <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-black/10 bg-white p-5">
          <ClipboardList className="size-5 text-primary" aria-hidden="true" />
          <p className="mt-5 text-sm font-semibold text-muted-foreground">طلبات جديدة</p>
          <p className="mt-1 text-4xl font-semibold tracking-[-0.06em]">{newOrdersCount}</p>
        </article>
        <article className="rounded-2xl border border-orange-900/10 bg-status-warm-surface p-5">
          <TriangleAlert className="size-5 text-status-warm" aria-hidden="true" />
          <p className="mt-5 text-sm font-semibold text-status-warm">تحتاج متابعة</p>
          <p className="mt-1 text-4xl font-semibold tracking-[-0.06em] text-status-warm">{newOrdersCount}</p>
          <p className="mt-2 text-xs text-status-warm/80">تشمل الطلبات الجديدة فقط.</p>
        </article>
      </div>

      <section className="mt-8 rounded-2xl border border-black/10 bg-white">
        <div className="flex items-center justify-between border-b border-black/8 px-5 py-4">
          <h3 className="font-semibold">أحدث الطلبات</h3>
          <Link href="/admin/orders" className="text-sm font-bold text-primary hover:underline">عرض الكل</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">لا توجد طلبات بعد.</p>
        ) : (
          <ul className="divide-y divide-black/7">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <Link href={`/admin/orders/${order.id}`} className="block px-5 py-4 hover:bg-muted/45 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{order.customerName}</p>
                      <p dir="ltr" className="font-latin mt-1 text-sm text-muted-foreground">{order.productNameSnapshot} · {formatUsd(order.usdPriceCentsSnapshot)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <time className="text-xs text-muted-foreground">{formatAdminDate(order.createdAt)}</time>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
