"use client";

import { useEffect, useRef } from "react";

import { getAnalyticsIdentity, trackAnalyticsEvent } from "@/lib/analytics-client";

type ProductViewTrackerProps = {
  productId: string;
  categoryId: string;
  locale: "ar" | "en";
};

export function ProductViewTracker({
  productId,
  categoryId,
  locale,
}: ProductViewTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) {
      return;
    }

    hasTracked.current = true;
    trackAnalyticsEvent({
      eventType: "PRODUCT_VIEW",
      locale,
      productId,
      categoryId,
      ...getAnalyticsIdentity(),
    });
  }, [categoryId, locale, productId]);

  return null;
}
