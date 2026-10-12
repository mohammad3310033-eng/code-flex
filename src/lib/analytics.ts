import "server-only";

import { z } from "zod";

import { prisma } from "@/lib/prisma";

const analyticsEventTypes = [
  "PAGE_VIEW",
  "PRODUCT_VIEW",
  "CONTACT_CLICK",
  "ORDER_INTENT",
  "ORDER_SUBMITTED",
] as const;

const contactChannels = [
  "WHATSAPP",
  "PHONE",
  "FACEBOOK",
  "INSTAGRAM",
  "OTHER",
] as const;

const contactPlacements = [
  "PRODUCT_PAGE",
  "HEADER",
  "FOOTER",
  "FLOATING_BUTTON",
  "ORDER_DIALOG",
  "HOME_CTA",
] as const;

export const analyticsIdentitySchema = z
  .object({
    visitorId: z.uuid().optional(),
    sessionId: z.uuid().optional(),
    locale: z.enum(["ar", "en"]),
  })
  .strict();

const pathnameSchema = z
  .string()
  .min(1)
  .max(160)
  .regex(/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/iu);

const metadataSchema = z
  .object({
    pathname: pathnameSchema.optional(),
  })
  .strict()
  .optional();

export const analyticsEventSchema = z
  .object({
    eventType: z.enum(analyticsEventTypes),
    visitorId: z.uuid().optional(),
    sessionId: z.uuid().optional(),
    productId: z.uuid().optional(),
    categoryId: z.uuid().optional(),
    channel: z.enum(contactChannels).optional(),
    placement: z.enum(contactPlacements).optional(),
    locale: z.enum(["ar", "en"]),
    metadata: metadataSchema,
  })
  .strict()
  .superRefine((value, context) => {
    if (value.eventType === "PAGE_VIEW") {
      if (value.productId || value.categoryId || value.channel || value.placement) {
        context.addIssue({ code: "custom", message: "Invalid page-view fields." });
      }

      return;
    }

    if (value.eventType === "PRODUCT_VIEW" || value.eventType === "ORDER_INTENT" || value.eventType === "ORDER_SUBMITTED") {
      if (!value.productId || value.channel || value.placement) {
        context.addIssue({ code: "custom", message: "Invalid product-event fields." });
      }

      return;
    }

    if (value.eventType === "CONTACT_CLICK" && (!value.channel || !value.placement)) {
      context.addIssue({ code: "custom", message: "Contact events require channel and placement." });
    }
  });

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;
export type AnalyticsIdentity = z.infer<typeof analyticsIdentitySchema>;

export async function recordAnalyticsEvent(input: AnalyticsEventInput) {
  let categoryId = input.categoryId;

  if (input.productId) {
    const product = await prisma.product.findFirst({
      where: { id: input.productId, isActive: true },
      select: { categoryId: true },
    });

    if (!product) {
      return false;
    }

    categoryId = product.categoryId;
  }

  await prisma.analyticsEvent.create({
    data: {
      eventType: input.eventType,
      visitorId: input.visitorId,
      sessionId: input.sessionId,
      productId: input.productId,
      categoryId,
      channel: input.channel,
      placement: input.placement,
      locale: input.locale,
      metadata: input.metadata,
    },
  });

  return true;
}
