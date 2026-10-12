"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type DailyPoint = {
  date: string;
  pageViews: number;
  productViews: number;
  orderIntents: number;
  submittedOrders: number;
};

const labels = {
  pageViews: "مشاهدات الصفحات",
  productViews: "مشاهدات المنتجات",
  orderIntents: "نوايا الطلب",
  submittedOrders: "الطلبات المرسلة",
} as const;

function formatDay(value: string) {
  return new Intl.DateTimeFormat("ar-SY-u-nu-latn", { month: "numeric", day: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00.000Z`));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("ar-SY-u-nu-latn").format(value);
}

export function AnalyticsDailyChart({ data }: { data: DailyPoint[] }) {
  const hasData = data.some((point) => point.pageViews || point.productViews || point.orderIntents || point.submittedOrders);

  if (!hasData) {
    return <p className="rounded-xl bg-muted/65 p-5 text-sm text-muted-foreground">لا توجد أحداث ضمن الفترة المحددة لعرضها في الرسم البياني.</p>;
  }

  return (
    <div>
      <p className="sr-only">
        مخطط يومي يعرض مشاهدات الصفحات والمنتجات ونوايا الطلب والطلبات المرسلة للفترة المحددة.
      </p>
      <div dir="ltr" className="h-72 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="date" tickFormatter={formatDay} tick={{ fontSize: 11 }} minTickGap={28} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip
              labelFormatter={(value) => formatDay(String(value))}
              formatter={(value, name) => [formatNumber(Number(value)), labels[name as keyof typeof labels] ?? String(name)]}
              contentStyle={{ borderRadius: "0.75rem", borderColor: "rgba(0,0,0,0.15)", fontSize: "0.8rem" }}
            />
            <Legend formatter={(value) => labels[value as keyof typeof labels] ?? value} wrapperStyle={{ fontSize: "0.75rem", paddingTop: "0.75rem" }} />
            <Line type="monotone" dataKey="pageViews" stroke="#2563eb" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="productViews" stroke="#7c3aed" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="orderIntents" stroke="#d97706" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="submittedOrders" stroke="#15803d" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
