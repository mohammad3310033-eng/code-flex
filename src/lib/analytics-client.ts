"use client";

type AnalyticsEventType =
  | "PAGE_VIEW"
  | "PRODUCT_VIEW"
  | "CONTACT_CLICK"
  | "ORDER_INTENT";

type ContactChannel = "WHATSAPP" | "PHONE" | "FACEBOOK" | "INSTAGRAM" | "OTHER";
type ContactPlacement =
  | "PRODUCT_PAGE"
  | "HEADER"
  | "FOOTER"
  | "FLOATING_BUTTON"
  | "ORDER_DIALOG"
  | "HOME_CTA";

export type AnalyticsIdentity = {
  visitorId?: string;
  sessionId?: string;
};

export type ClientAnalyticsEvent = AnalyticsIdentity & {
  eventType: AnalyticsEventType;
  locale: "ar" | "en";
  productId?: string;
  categoryId?: string;
  channel?: ContactChannel;
  placement?: ContactPlacement;
  metadata?: { pathname?: string };
};

const visitorKey = "code-flex:visitor-id";
const sessionKey = "code-flex:session-id";
let memoryVisitorId: string | undefined;
let memorySessionId: string | undefined;

function createId() {
  if (typeof crypto === "undefined") {
    return undefined;
  }

  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const values = new Uint32Array(4);
  crypto.getRandomValues(values);
  const hex = Array.from(values, (value) => value.toString(16).padStart(8, "0")).join("");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-8${hex.slice(17, 20)}-${hex.slice(20)}`;
}

function getStoredId(storage: Storage, key: string) {
  try {
    const existing = storage.getItem(key);

    if (existing) {
      return existing;
    }

    const created = createId();

    if (created) {
      storage.setItem(key, created);
    }

    return created;
  } catch {
    return undefined;
  }
}

export function getAnalyticsIdentity(): AnalyticsIdentity {
  if (typeof window === "undefined") {
    return {};
  }

  memoryVisitorId ??= getStoredId(window.localStorage, visitorKey) ?? createId();
  memorySessionId ??= getStoredId(window.sessionStorage, sessionKey) ?? createId();

  return { visitorId: memoryVisitorId, sessionId: memorySessionId };
}

export function trackAnalyticsEvent(event: ClientAnalyticsEvent) {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return;
  }

  const payload = JSON.stringify(event);

  try {
    const delivered = navigator.sendBeacon?.(
      "/api/analytics/event",
      new Blob([payload], { type: "application/json" }),
    );

    if (delivered) {
      return;
    }
  } catch {
    // Analytics must never interrupt a customer action.
  }

  void fetch("/api/analytics/event", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}
