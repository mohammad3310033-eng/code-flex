import "server-only";

import type { AnalyticsEventType, ContactChannel, OrderStatus } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_CUSTOM_RANGE_DAYS = 366;

const eventTypes = ["PAGE_VIEW", "PRODUCT_VIEW", "CONTACT_CLICK", "ORDER_INTENT", "ORDER_SUBMITTED"] as const;
const contactChannels = ["WHATSAPP", "PHONE", "FACEBOOK", "INSTAGRAM", "OTHER"] as const;
const orderStatuses = ["NEW", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;

export type AnalyticsRange = "today" | "7d" | "30d" | "custom";

export type ResolvedAnalyticsRange = {
  range: AnalyticsRange;
  from: string;
  to: string;
  start: Date;
  end: Date;
};

type CountValue = bigint | number | string | null;

type DailyRow = {
  day: Date;
  pageViews: CountValue;
  productViews: CountValue;
  orderIntents: CountValue;
  submittedOrders: CountValue;
};

type ProductRow = {
  productId: string;
  productName: string | null;
  productViews: CountValue;
  orderIntents: CountValue;
  submittedOrders: CountValue;
  contactClicks: CountValue;
};

type VisitorRow = { count: CountValue };

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function startOfUtcDay(value: Date) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

function dateKey(value: Date) {
  return value.toISOString().slice(0, 10);
}

function parseDate(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.valueOf()) || dateKey(parsed) !== value ? null : parsed;
}

function defaultRange(now = new Date()): ResolvedAnalyticsRange {
  const end = new Date(startOfUtcDay(now).getTime() + DAY_MS);
  const start = new Date(end.getTime() - 30 * DAY_MS);

  return { range: "30d", from: dateKey(start), to: dateKey(new Date(end.getTime() - DAY_MS)), start, end };
}

export function resolveAnalyticsRange(
  query: Record<string, string | string[] | undefined>,
  now = new Date(),
): ResolvedAnalyticsRange {
  const requestedRange = first(query.range);
  const today = startOfUtcDay(now);

  if (requestedRange === "custom") {
    const from = parseDate(first(query.from));
    const to = parseDate(first(query.to));

    if (!from || !to || from > to || (to.getTime() - from.getTime()) / DAY_MS + 1 > MAX_CUSTOM_RANGE_DAYS) {
      return defaultRange(now);
    }

    return {
      range: "custom",
      from: dateKey(from),
      to: dateKey(to),
      start: from,
      end: new Date(to.getTime() + DAY_MS),
    };
  }

  if (requestedRange === "today") {
    return { range: "today", from: dateKey(today), to: dateKey(today), start: today, end: new Date(today.getTime() + DAY_MS) };
  }

  if (requestedRange === "7d") {
    const start = new Date(today.getTime() - 6 * DAY_MS);
    return { range: "7d", from: dateKey(start), to: dateKey(today), start, end: new Date(today.getTime() + DAY_MS) };
  }

  if (requestedRange === "30d" || !requestedRange) return defaultRange(now);

  return defaultRange(now);
}

function asNumber(value: CountValue | undefined) {
  const result = Number(value ?? 0);
  return Number.isFinite(result) ? result : 0;
}

function percentage(numerator: number, denominator: number) {
  if (denominator <= 0) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

export type AdminAnalyticsDashboard = {
  metrics: Record<AnalyticsEventType, number>;
  uniqueVisitors: number;
  dailySeries: Array<{
    date: string;
    pageViews: number;
    productViews: number;
    orderIntents: number;
    submittedOrders: number;
  }>;
  funnel: {
    productViewToIntent: number;
    intentToSubmitted: number;
    submittedToCompleted: number;
  };
  topProducts: Array<{
    id: string;
    name: string;
    productViews: number;
    orderIntents: number;
    submittedOrders: number;
    contactClicks: number;
  }>;
  contactChannels: Array<{ channel: ContactChannel; count: number; percentage: number }>;
  orderStatuses: Array<{ status: OrderStatus; count: number }>;
  completedOrderValue: { count: number; usdCents: number; syp: number };
};

/**
 * Builds bounded server-side aggregates. PostgreSQL date truncation and filtered
 * product totals are parameterized raw queries because Prisma groupBy cannot
 * group DateTime values by a calendar day.
 */
export async function getAdminAnalyticsDashboard(range: ResolvedAnalyticsRange): Promise<AdminAnalyticsDashboard> {
  const eventWhere = { createdAt: { gte: range.start, lt: range.end } };
  const orderWhere = { createdAt: { gte: range.start, lt: range.end } };

  const [eventCounts, visitorRows, dailyRows, productRows, channelCounts, statusCounts, completedTotals] = await Promise.all([
    prisma.analyticsEvent.groupBy({ by: ["eventType"], where: eventWhere, _count: { _all: true } }),
    prisma.$queryRaw<VisitorRow[]>`
      SELECT COUNT(DISTINCT "visitorId") AS "count"
      FROM "AnalyticsEvent"
      WHERE "createdAt" >= ${range.start} AND "createdAt" < ${range.end} AND "visitorId" IS NOT NULL
    `,
    prisma.$queryRaw<DailyRow[]>`
      SELECT
        DATE_TRUNC('day', "createdAt") AS "day",
        COUNT(*) FILTER (WHERE "eventType" = 'PAGE_VIEW') AS "pageViews",
        COUNT(*) FILTER (WHERE "eventType" = 'PRODUCT_VIEW') AS "productViews",
        COUNT(*) FILTER (WHERE "eventType" = 'ORDER_INTENT') AS "orderIntents",
        COUNT(*) FILTER (WHERE "eventType" = 'ORDER_SUBMITTED') AS "submittedOrders"
      FROM "AnalyticsEvent"
      WHERE "createdAt" >= ${range.start} AND "createdAt" < ${range.end}
      GROUP BY 1
      ORDER BY 1
    `,
    prisma.$queryRaw<ProductRow[]>`
      SELECT
        event."productId" AS "productId",
        product."name" AS "productName",
        COUNT(*) FILTER (WHERE event."eventType" = 'PRODUCT_VIEW') AS "productViews",
        COUNT(*) FILTER (WHERE event."eventType" = 'ORDER_INTENT') AS "orderIntents",
        COUNT(*) FILTER (WHERE event."eventType" = 'ORDER_SUBMITTED') AS "submittedOrders",
        COUNT(*) FILTER (WHERE event."eventType" = 'CONTACT_CLICK') AS "contactClicks"
      FROM "AnalyticsEvent" AS event
      LEFT JOIN "Product" AS product ON product."id" = event."productId"
      WHERE event."createdAt" >= ${range.start} AND event."createdAt" < ${range.end} AND event."productId" IS NOT NULL
      GROUP BY event."productId", product."name"
      ORDER BY "productViews" DESC, "orderIntents" DESC, "submittedOrders" DESC, "contactClicks" DESC, event."productId" ASC
      LIMIT 10
    `,
    prisma.analyticsEvent.groupBy({
      by: ["channel"],
      where: { ...eventWhere, eventType: "CONTACT_CLICK" },
      _count: { _all: true },
    }),
    prisma.order.groupBy({ by: ["status"], where: orderWhere, _count: { _all: true } }),
    prisma.order.aggregate({
      where: { ...orderWhere, status: "COMPLETED" },
      _count: { _all: true },
      _sum: { usdPriceCentsSnapshot: true, sypPriceSnapshot: true },
    }),
  ]);

  const metrics = Object.fromEntries(eventTypes.map((type) => [type, 0])) as Record<AnalyticsEventType, number>;
  for (const item of eventCounts) metrics[item.eventType] = item._count._all;

  const dailyByDate = new Map(dailyRows.map((row) => [dateKey(new Date(row.day)), row]));
  const dailySeries = [];
  for (let day = new Date(range.start); day < range.end; day = new Date(day.getTime() + DAY_MS)) {
    const row = dailyByDate.get(dateKey(day));
    dailySeries.push({
      date: dateKey(day),
      pageViews: asNumber(row?.pageViews),
      productViews: asNumber(row?.productViews),
      orderIntents: asNumber(row?.orderIntents),
      submittedOrders: asNumber(row?.submittedOrders),
    });
  }

  const channelByType = new Map(channelCounts.map((item) => [item.channel, item._count._all]));
  const statusByType = new Map(statusCounts.map((item) => [item.status, item._count._all]));
  const completedCount = completedTotals._count._all;

  return {
    metrics,
    uniqueVisitors: asNumber(visitorRows[0]?.count),
    dailySeries,
    funnel: {
      productViewToIntent: percentage(metrics.ORDER_INTENT, metrics.PRODUCT_VIEW),
      intentToSubmitted: percentage(metrics.ORDER_SUBMITTED, metrics.ORDER_INTENT),
      submittedToCompleted: percentage(completedCount, metrics.ORDER_SUBMITTED),
    },
    topProducts: productRows.map((row) => ({
      id: row.productId,
      name: row.productName ?? "منتج محذوف",
      productViews: asNumber(row.productViews),
      orderIntents: asNumber(row.orderIntents),
      submittedOrders: asNumber(row.submittedOrders),
      contactClicks: asNumber(row.contactClicks),
    })),
    contactChannels: contactChannels.map((channel) => {
      const count = channelByType.get(channel) ?? 0;
      return { channel, count, percentage: percentage(count, metrics.CONTACT_CLICK) };
    }),
    orderStatuses: orderStatuses.map((status) => ({ status, count: statusByType.get(status) ?? 0 })),
    completedOrderValue: {
      count: completedCount,
      usdCents: completedTotals._sum.usdPriceCentsSnapshot ?? 0,
      syp: completedTotals._sum.sypPriceSnapshot ?? 0,
    },
  };
}
