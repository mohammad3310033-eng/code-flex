import { z } from "zod";

import { analyticsIdentitySchema } from "@/lib/analytics";
import { convertUsdCentsToSyp } from "@/lib/money";
import { prisma } from "@/lib/prisma";

const DUPLICATE_WINDOW_MS = 45_000;
const MAX_POSTGRES_INTEGER = BigInt(2_147_483_647);

const optionalText = (maximum: number) =>
  z.string().trim().max(maximum).transform((value) => value || undefined);

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return value.trim().startsWith("+") ? `+${digits}` : digits;
}

const requestSchema = analyticsIdentitySchema.extend({
  productId: z.uuid(),
  customerName: z.string().trim().min(2).max(100),
  customerPhone: z.string().trim().min(7).max(32).regex(/^[0-9+\s().-]+$/u).refine((value) => {
    const digits = value.replace(/\D/g, "");
    const plusCount = (value.match(/\+/gu) ?? []).length;
    return digits.length >= 7 && /[1-9]/u.test(digits) && plusCount <= 1 && (plusCount === 0 || value.trim().startsWith("+"));
  }).transform(normalizePhone),
  city: optionalText(80),
  note: optionalText(1000),
});

export type ProductRequestResult =
  | { ok: true; duplicate: boolean }
  | { ok: false; kind: "validation-error"; fieldErrors: Partial<Record<"customerName" | "customerPhone" | "city" | "note", true>> }
  | { ok: false; kind: "unavailable" | "error" };

function getText(input: unknown, name: string) {
  if (!input || typeof input !== "object") return "";
  const value = (input as Record<string, unknown>)[name];
  return typeof value === "string" ? value : "";
}

function toOptional(value: string) {
  return value || undefined;
}

export async function createProductRequest(input: unknown): Promise<ProductRequestResult> {
  const parsed = requestSchema.safeParse({
    productId: getText(input, "productId"),
    visitorId: toOptional(getText(input, "visitorId")),
    sessionId: toOptional(getText(input, "sessionId")),
    locale: getText(input, "locale"),
    customerName: getText(input, "customerName"),
    customerPhone: getText(input, "customerPhone"),
    city: getText(input, "city"),
    note: getText(input, "note"),
  });
  if (!parsed.success) {
    const fields = parsed.error.flatten().fieldErrors;
    return {
      ok: false,
      kind: "validation-error",
      fieldErrors: {
        customerName: fields.customerName ? true : undefined,
        customerPhone: fields.customerPhone ? true : undefined,
        city: fields.city ? true : undefined,
        note: fields.note ? true : undefined,
      },
    };
  }

  try {
    const result = await prisma.$transaction(async (transaction) => {
      const product = await transaction.product.findFirst({
        where: { id: parsed.data.productId, isActive: true },
        select: { id: true, categoryId: true, name: true, priceUsdCents: true },
      });
      if (!product) return { kind: "unavailable" as const };

      const settings = await transaction.siteSettings.findFirst({ orderBy: { createdAt: "asc" }, select: { usdToSypRate: true } });
      if (!settings || product.priceUsdCents < 0 || settings.usdToSypRate <= 0) return { kind: "error" as const };

      const duplicate = await transaction.order.findFirst({
        where: { productId: product.id, customerPhone: parsed.data.customerPhone, createdAt: { gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) } },
        select: { id: true },
        orderBy: { createdAt: "desc" },
      });
      if (duplicate) return { kind: "duplicate" as const };

      const sypPrice = convertUsdCentsToSyp(product.priceUsdCents, settings.usdToSypRate);
      if (sypPrice > MAX_POSTGRES_INTEGER) return { kind: "error" as const };

      await transaction.order.create({
        data: {
          customerName: parsed.data.customerName,
          customerPhone: parsed.data.customerPhone,
          city: parsed.data.city,
          note: parsed.data.note,
          productId: product.id,
          productNameSnapshot: product.name,
          usdPriceCentsSnapshot: product.priceUsdCents,
          usdRateSnapshot: settings.usdToSypRate,
          sypPriceSnapshot: Number(sypPrice),
          status: "NEW",
        },
      });
      await transaction.analyticsEvent.create({
        data: {
          eventType: "ORDER_SUBMITTED",
          visitorId: parsed.data.visitorId,
          sessionId: parsed.data.sessionId,
          productId: product.id,
          categoryId: product.categoryId,
          locale: parsed.data.locale,
        },
      });
      return { kind: "created" as const };
    });

    if (result.kind === "created" || result.kind === "duplicate") return { ok: true, duplicate: result.kind === "duplicate" };
    return { ok: false, kind: result.kind };
  } catch {
    return { ok: false, kind: "error" };
  }
}
