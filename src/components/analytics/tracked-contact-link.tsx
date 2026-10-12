"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

import { getAnalyticsIdentity, trackAnalyticsEvent } from "@/lib/analytics-client";

type TrackedContactLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children?: ReactNode;
  locale: "ar" | "en";
  channel: "WHATSAPP" | "PHONE" | "FACEBOOK" | "INSTAGRAM" | "OTHER";
  placement: "PRODUCT_PAGE" | "HEADER" | "FOOTER" | "FLOATING_BUTTON" | "ORDER_DIALOG" | "HOME_CTA";
  productId?: string;
  categoryId?: string;
};

export function TrackedContactLink({
  locale,
  channel,
  placement,
  productId,
  categoryId,
  onClick,
  children,
  ...linkProps
}: TrackedContactLinkProps) {
  return (
    <a
      {...linkProps}
      onClick={(event) => {
        trackAnalyticsEvent({
          eventType: "CONTACT_CLICK",
          locale,
          channel,
          placement,
          productId,
          categoryId,
          ...getAnalyticsIdentity(),
        });
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
