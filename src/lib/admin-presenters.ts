import type { OrderStatus } from "@/generated/prisma/client";

import { formatSyp, formatUsd } from "@/lib/money";

export const orderStatusLabels: Record<OrderStatus, string> = {
  NEW: "جديد",
  CONTACTED: "تم التواصل",
  CONFIRMED: "مؤكد",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغي",
};

export const orderStatusStyles: Record<OrderStatus, string> = {
  NEW: "bg-status-warm-surface text-status-warm",
  CONTACTED: "bg-blue-50 text-blue-800",
  CONFIRMED: "bg-violet-50 text-violet-800",
  COMPLETED: "bg-status-positive-surface text-status-positive",
  CANCELLED: "bg-muted text-muted-foreground",
};

export function formatAdminDate(value: Date) {
  return new Intl.DateTimeFormat("ar-SY-u-nu-latn", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function formatAdminSyp(priceUsdCents: number, usdRate: number) {
  return formatSyp(priceUsdCents, usdRate, "ar");
}

export { formatUsd };
