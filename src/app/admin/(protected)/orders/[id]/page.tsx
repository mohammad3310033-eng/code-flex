import { ExternalLink, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { CopyPhoneButton } from "@/components/admin/copy-phone-button";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { formatAdminDate, formatAdminSyp, formatUsd } from "@/lib/admin-presenters";
import { prisma } from "@/lib/prisma";

const idSchema = z.uuid();

function Milestone({ label, value }: { label: string; value: Date | null }) {
  return <div className="flex items-center justify-between gap-4 py-3"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="text-sm font-semibold">{value ? formatAdminDate(value) : "—"}</dd></div>;
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!idSchema.safeParse(id).success) notFound();

  const order = await prisma.order.findUnique({
    where: { id },
    include: { product: { select: { slug: true, name: true, isActive: true } } },
  });
  if (!order) notFound();

  const whatsappNumber = order.customerPhone.replace(/\D/g, "");
  const whatsappHref = whatsappNumber.length >= 7 ? `https://wa.me/${whatsappNumber}` : null;

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><Link href="/admin/orders" className="text-sm font-bold text-primary hover:underline">الطلبات</Link><h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em]">تفاصيل الطلب</h2></div>
        <OrderStatusBadge status={order.status} />
      </div>
      <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><h3 className="text-lg font-semibold">العميل</h3><dl className="mt-5 divide-y divide-black/7"><div className="py-3"><dt className="text-sm text-muted-foreground">الاسم</dt><dd className="mt-1 font-semibold">{order.customerName}</dd></div><div className="py-3"><dt className="text-sm text-muted-foreground">الهاتف</dt><dd dir="ltr" className="font-latin mt-1 font-semibold">{order.customerPhone}</dd><div className="mt-3 flex flex-wrap gap-2"><CopyPhoneButton phone={order.customerPhone} /><a href={`tel:${order.customerPhone}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-black/12 bg-white px-3 text-sm font-bold hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><Phone className="size-4" aria-hidden="true" />اتصال</a>{whatsappHref && <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#1f9d59] px-3 text-sm font-bold text-white hover:bg-[#168346] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><MessageCircle className="size-4" aria-hidden="true" />واتساب</a>}</div></div><div className="py-3"><dt className="text-sm text-muted-foreground">المدينة</dt><dd className="mt-1 font-semibold">{order.city || "—"}</dd></div><div className="py-3"><dt className="text-sm text-muted-foreground">ملاحظة العميل</dt><dd className="mt-1 whitespace-pre-wrap leading-7">{order.note || "—"}</dd></div></dl></section>
          <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><h3 className="text-lg font-semibold">لقطة المنتج والسعر</h3><dl className="mt-5 divide-y divide-black/7"><div className="py-3"><dt className="text-sm text-muted-foreground">المنتج وقت الطلب</dt><dd dir="ltr" className="font-latin mt-1 font-semibold">{order.productNameSnapshot}</dd></div><div className="flex items-center justify-between gap-4 py-3"><dt className="text-sm text-muted-foreground">السعر بالدولار</dt><dd dir="ltr" className="font-latin font-semibold">{formatUsd(order.usdPriceCentsSnapshot)}</dd></div><div className="flex items-center justify-between gap-4 py-3"><dt className="text-sm text-muted-foreground">سعر الصرف وقت الطلب</dt><dd dir="ltr" className="font-latin font-semibold">{order.usdRateSnapshot.toLocaleString("en-US")}</dd></div><div className="flex items-center justify-between gap-4 py-3"><dt className="text-sm text-muted-foreground">السعر بالليرة</dt><dd dir="ltr" className="font-latin font-semibold">{formatAdminSyp(order.usdPriceCentsSnapshot, order.usdRateSnapshot)}</dd></div></dl>{order.product && <Link href={`/ar/products/${order.product.slug}`} target="_blank" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-black/12 px-3 text-sm font-bold hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">عرض المنتج الحالي <ExternalLink className="size-4" aria-hidden="true" /></Link>}</section>
        </div>
        <div className="space-y-5">
          <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><OrderStatusForm orderId={order.id} status={order.status} /></section>
          <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><h3 className="text-lg font-semibold">سجل الطلب</h3><dl className="mt-4 divide-y divide-black/7"><Milestone label="أُرسل" value={order.createdAt} /><Milestone label="تم التواصل" value={order.contactedAt} /><Milestone label="تم التأكيد" value={order.confirmedAt} /><Milestone label="اكتمل" value={order.completedAt} /><Milestone label="أُلغي" value={order.cancelledAt} /></dl></section>
        </div>
      </div>
    </div>
  );
}
