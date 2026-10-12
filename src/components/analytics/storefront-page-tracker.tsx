"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { getAnalyticsIdentity, trackAnalyticsEvent } from "@/lib/analytics-client";

type StorefrontPageTrackerProps = {
  locale: "ar" | "en";
};

function isStorefrontPath(pathname: string) {
  return !pathname.split("/").includes("admin");
}

export function StorefrontPageTracker({ locale }: StorefrontPageTrackerProps) {
  const pathname = usePathname();
  const trackedPathnames = useRef(new Set<string>());

  useEffect(() => {
    if (!pathname || !isStorefrontPath(pathname) || trackedPathnames.current.has(pathname)) {
      return;
    }

    trackedPathnames.current.add(pathname);
    trackAnalyticsEvent({
      eventType: "PAGE_VIEW",
      locale,
      ...getAnalyticsIdentity(),
      metadata: { pathname },
    });
  }, [locale, pathname]);

  return null;
}
