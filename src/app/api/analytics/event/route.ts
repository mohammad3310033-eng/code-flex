import { analyticsEventSchema, recordAnalyticsEvent } from "@/lib/analytics";

const MAX_BODY_BYTES = 2048;

function isExpectedOrigin(request: Request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  try {
    const originUrl = new URL(origin);
    const expectedHost = request.headers.get("x-forwarded-host") ?? new URL(request.url).host;

    return originUrl.host === expectedHost;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isExpectedOrigin(request)) {
    return new Response(null, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return new Response(null, { status: 413 });
  }

  let body: unknown;

  try {
    const rawBody = await request.text();

    if (rawBody.length > MAX_BODY_BYTES) {
      return new Response(null, { status: 413 });
    }

    body = JSON.parse(rawBody);
  } catch {
    return new Response(null, { status: 400 });
  }

  const parsed = analyticsEventSchema.safeParse(body);

  if (!parsed.success || parsed.data.eventType === "ORDER_SUBMITTED") {
    return new Response(null, { status: 400 });
  }

  try {
    await recordAnalyticsEvent(parsed.data);
    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 500 });
  }
}
