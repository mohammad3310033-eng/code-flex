import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const resolvedLocale = request.headers.get("x-next-intl-locale");
  const isResolvedLocaleRewrite = routing.locales.some(
    (locale) =>
      locale === resolvedLocale &&
      (request.nextUrl.pathname === `/${locale}` ||
        request.nextUrl.pathname.startsWith(`/${locale}/`)),
  );

  // Next 16.3 can re-enter Proxy for next-intl's internal locale rewrite.
  // The forwarded locale marks an already-resolved request and prevents a
  // canonical default-locale redirect from looping back to the same URL.
  if (isResolvedLocaleRewrite) {
    return NextResponse.next();
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
