import Link from "next/link";

import { AnalyticsDailyChart } from "@/components/admin/analytics-daily-chart";
import { formatUsd, orderStatusLabels } from "@/lib/admin-presenters";
import { getAdminAnalyticsDashboard, resolveAnalyticsRange, type AnalyticsRange } from "@/lib/admin-analytics";
import { requireAdmin } from "@/lib/admin-auth";

const rangeOptions: Array<{ value: Exclude<AnalyticsRange, "custom">; label: string }> = [
  { value: "today", label: "اليوم" },
  { value: "7d", label: "آخر 7 أيام" },
  { value: "30d", label: "آخر 30 يوماً" },
];

const contactChannelLabels = {
  WHATSAPP: "واتساب",
  PHONE: "الهاتف",
  FACEBOOK: "فيسبوك",
  INSTAGRAM: "إنستغرام",
  OTHER: "أخرى",
} as const;

function analyticsHref(range: Exclude<AnalyticsRange, "custom">) {
  return `/admin/analytics?range=${range}`;
}

function formatCount(value: number) {
  return new Intl.NumberFormat("ar-SY-u-nu-latn").format(value);
}

function formatPercent(value: number) {
  return new Intl.NumberFormat("ar-SY-u-nu-latn", { maximumFractionDigits: 1 }).format(value) + "%";
}

function formatSypSnapshot(value: number) {
  return `${new Intl.NumberFormat("ar-SY-u-nu-latn", { maximumFractionDigits: 0 }).format(value)} ل.س`;
}

function MetricCard({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <article className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
      <p className="text-sm font-semibold text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-[-0.05em]">{formatCount(value)}</p>
      {hint ? <p className="mt-2 text-xs leading-5 text-muted-foreground">{hint}</p> : null}
    </article>
  );
}

function FunnelStep({ label, count, conversion }: { label: string; count: number; conversion?: number }) {
  return (
    <li className="flex items-center justify-between gap-4 border-b border-black/7 py-3 last:border-b-0">
      <div>
        <p className="font-semibold">{label}</p>
        {conversion !== undefined ? <p className="mt-1 text-xs text-muted-foreground">التحويل من المرحلة السابقة: {formatPercent(conversion)}</p> : null}
      </div>
      <strong className="text-lg">{formatCount(count)}</strong>
    </li>
  );
}

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();

  const range = resolveAnalyticsRange(await searchParams);
  const dashboard = await getAdminAnalyticsDashboard(range);
  const metricCards = [
    { label: "مشاهدات الصفحات", value: dashboard.metrics.PAGE_VIEW },
    { label: "مشاهدات المنتجات", value: dashboard.metrics.PRODUCT_VIEW },
    { label: "نقرات التواصل", value: dashboard.metrics.CONTACT_CLICK },
    { label: "نوايا الطلب", value: dashboard.metrics.ORDER_INTENT },
    { label: "الطلبات المرسلة", value: dashboard.metrics.ORDER_SUBMITTED },
    { label: "الطلبات المكتملة", value: dashboard.completedOrderValue.count },
  ];

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">تقارير الأعمال</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-[-0.045em]">التحليلات</h2>
        </div>
        <p className="text-xs text-muted-foreground">تُحسب الأيام والفلاتر وفق توقيت UTC.</p>
      </div>

      <section aria-label="تصفية فترة التحليلات" className="mt-7 rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
        <h3 className="text-sm font-bold">الفترة</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {rangeOptions.map((option) => (
            <Link
              key={option.value}
              href={analyticsHref(option.value)}
              className={`inline-flex min-h-10 items-center rounded-full px-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${range.range === option.value ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-black/10"}`}
            >
              {option.label}
            </Link>
          ))}
        </div>
        <form action="/admin/analytics" method="get" className="mt-5 grid gap-3 border-t border-black/8 pt-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
          <input type="hidden" name="range" value="custom" />
          <label className="text-sm font-bold">من<input name="from" type="date" required defaultValue={range.from} className="font-latin mt-2 min-h-11 w-full rounded-xl border border-black/12 bg-white px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></label>
          <label className="text-sm font-bold">إلى<input name="to" type="date" required defaultValue={range.to} className="font-latin mt-2 min-h-11 w-full rounded-xl border border-black/12 bg-white px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></label>
          <button className="min-h-11 rounded-xl border border-black/12 px-4 text-sm font-bold hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">تطبيق</button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">المدى المخصص يقبل حتى 366 يوماً؛ تُستبدل القيم غير الصالحة بآخر 30 يوماً.</p>
      </section>

      <section aria-label="المؤشرات الأساسية" className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {metricCards.map((metric) => <MetricCard key={metric.label} {...metric} />)}
        <MetricCard label="زوار فريدون تقريباً" value={dashboard.uniqueVisitors} hint="تقدير على مستوى المتصفح باستخدام visitorId، وليس أشخاصاً مسجلين." />
      </section>

      <section className="mt-7 rounded-2xl border border-black/10 bg-white p-4 sm:p-6">
        <div><h3 className="text-lg font-semibold">الاتجاه اليومي</h3><p className="mt-1 text-sm text-muted-foreground">حركة الأحداث اليومية ضمن الفترة المحددة.</p></div>
        <div className="mt-5"><AnalyticsDailyChart data={dashboard.dailySeries} /></div>
      </section>

      <div className="mt-7 grid gap-7 xl:grid-cols-2">
        <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
          <h3 className="text-lg font-semibold">قمع الطلب</h3>
          <ol className="mt-4">
            <FunnelStep label="مشاهدة المنتج" count={dashboard.metrics.PRODUCT_VIEW} />
            <FunnelStep label="نية الطلب" count={dashboard.metrics.ORDER_INTENT} conversion={dashboard.funnel.productViewToIntent} />
            <FunnelStep label="طلب مرسل" count={dashboard.metrics.ORDER_SUBMITTED} conversion={dashboard.funnel.intentToSubmitted} />
            <FunnelStep label="طلب مكتمل" count={dashboard.completedOrderValue.count} conversion={dashboard.funnel.submittedToCompleted} />
          </ol>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
          <h3 className="text-lg font-semibold">قيمة الطلبات المكتملة</h3>
          <p className="mt-1 text-sm text-muted-foreground">تعتمد على لقطات السعر المحفوظة وقت الطلب فقط.</p>
          <dl className="mt-5 divide-y divide-black/7">
            <div className="flex items-center justify-between gap-4 py-3"><dt className="text-sm text-muted-foreground">طلبات مكتملة</dt><dd className="font-semibold">{formatCount(dashboard.completedOrderValue.count)}</dd></div>
            <div className="flex items-center justify-between gap-4 py-3"><dt className="text-sm text-muted-foreground">إجمالي USD</dt><dd dir="ltr" className="font-latin font-semibold">{formatUsd(dashboard.completedOrderValue.usdCents)}</dd></div>
            <div className="flex items-center justify-between gap-4 py-3"><dt className="text-sm text-muted-foreground">إجمالي SYP</dt><dd dir="ltr" className="font-latin font-semibold">{formatSypSnapshot(dashboard.completedOrderValue.syp)}</dd></div>
          </dl>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
          <h3 className="text-lg font-semibold">قنوات التواصل</h3>
          <ul className="mt-4 divide-y divide-black/7">
            {dashboard.contactChannels.map((item) => <li key={item.channel} className="flex items-center justify-between gap-4 py-3"><span className="font-semibold">{contactChannelLabels[item.channel]}</span><span className="text-sm text-muted-foreground">{formatCount(item.count)} · {formatPercent(item.percentage)}</span></li>)}
          </ul>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
          <h3 className="text-lg font-semibold">حالات الطلبات</h3>
          <ul className="mt-4 divide-y divide-black/7">
            {dashboard.orderStatuses.map((item) => <li key={item.status} className="flex items-center justify-between gap-4 py-3"><span className="font-semibold">{orderStatusLabels[item.status]}</span><strong>{formatCount(item.count)}</strong></li>)}
          </ul>
        </section>
      </div>

      <section className="mt-7 rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
        <div><h3 className="text-lg font-semibold">أفضل المنتجات</h3><p className="mt-1 text-sm text-muted-foreground">مرتبة بحسب مشاهدات المنتج، ثم نوايا الطلب والتفاعل.</p></div>
        {dashboard.topProducts.length === 0 ? <p className="mt-5 rounded-xl bg-muted/65 p-4 text-sm text-muted-foreground">لا توجد أحداث مرتبطة بمنتجات ضمن الفترة المحددة.</p> : (
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {dashboard.topProducts.map((product) => <li key={product.id} className="rounded-xl border border-black/10 p-4"><p dir="ltr" className="font-latin truncate font-semibold">{product.name}</p><dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm"><div><dt className="text-muted-foreground">مشاهدات</dt><dd className="mt-1 font-semibold">{formatCount(product.productViews)}</dd></div><div><dt className="text-muted-foreground">نوايا</dt><dd className="mt-1 font-semibold">{formatCount(product.orderIntents)}</dd></div><div><dt className="text-muted-foreground">مرسلة</dt><dd className="mt-1 font-semibold">{formatCount(product.submittedOrders)}</dd></div><div><dt className="text-muted-foreground">تواصل</dt><dd className="mt-1 font-semibold">{formatCount(product.contactClicks)}</dd></div></dl></li>)}
          </ul>
        )}
      </section>
    </div>
  );
}
