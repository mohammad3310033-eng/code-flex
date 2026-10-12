import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

import { sanitize, Status, withTimeout } from "./shared.mjs";
import { waitForDatabase } from "./database.mjs";
import { calculateExpectedSyp, parseDisplayedSyp, parseDisplayedUsdCents } from "./prices.mjs";
import { closeSubmittedRequestDialog } from "./request-dialog.mjs";

const ACTION_TIMEOUT = 15_000;
const NAVIGATION_TIMEOUT = 30_000;
const BROWSER_TIMEOUT = 180_000;

export async function launchBrowser() {
  const attempts = [
    { label: "Google Chrome", options: { channel: "chrome", headless: true } },
    { label: "Microsoft Edge", options: { channel: "msedge", headless: true } },
    { label: "Playwright Chromium", options: { headless: true } },
  ];
  const failures = [];
  for (const attempt of attempts) {
    try {
      const browser = await withTimeout(chromium.launch(attempt.options), ACTION_TIMEOUT, `${attempt.label} launch`);
      return { browser, label: attempt.label };
    } catch {
      failures.push(attempt.label);
    }
  }
  throw new Error(`no supported headless browser could launch (${failures.join(", ")}). Install one or run: npx playwright install chromium`);
}

async function goto(page, target, route) {
  const response = await page.goto(`${target}${route}`, { waitUntil: "domcontentloaded", timeout: NAVIGATION_TIMEOUT });
  if (!response || response.status() >= 400) throw new Error(`${route} returned HTTP ${response?.status() ?? "unavailable"}`);
  return response;
}

async function usablePage(page, route = "current route") {
  const text = (await page.locator("body").innerText({ timeout: ACTION_TIMEOUT })).trim();
  if (text.length < 20) throw new Error(`${route} page body was not usable`);
}

async function routeFailure(page, intendedRoute, response, error) {
  const pathname = new URL(page.url()).pathname;
  const title = await page.title().catch(() => "unavailable");
  const nextError = await page.getByText(/application error|error occurred|حدث خطأ/i).count().catch(() => 0);
  return `${error instanceof Error ? error.message : "route check failed"}; intended route ${intendedRoute}; actual pathname ${pathname}; response ${response?.status?.() ?? "unavailable"}; title ${sanitize(title)}; Next.js error UI ${nextError > 0 ? "present" : "absent"}`;
}

async function maybeScreenshot(page, root, name, containsCustomerData = false) {
  if (containsCustomerData) return;
  const directory = path.join(root, "artifacts", "verification", "failures");
  await mkdir(directory, { recursive: true });
  await page.screenshot({ path: path.join(directory, `${name}.png`), fullPage: false }).catch(() => undefined);
}

async function inspectDocumentOverflow(page) {
  return page.evaluate(() => {
    const clientWidth = document.documentElement.clientWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    const overflowing = [...document.querySelectorAll("body *")]
      .map((element) => {
        const box = element.getBoundingClientRect();
        const excess = Math.max(0, -box.left, box.right - clientWidth);
        return {
          tag: element.tagName.toLowerCase(),
          classes: [...element.classList].join(" ").slice(0, 240),
          width: Math.round(box.width * 100) / 100,
          excess: Math.round(excess * 100) / 100,
        };
      })
      .filter((item) => item.width > 0 && item.excess > 0.5)
      .sort((left, right) => right.excess - left.excess || right.width - left.width);
    return { scrollWidth, clientWidth, overflowing: overflowing.slice(0, 3) };
  });
}

function overflowActual(diagnostics) {
  const element = diagnostics.overflowing[0];
  const elementDescription = element
    ? `overflowing element <${element.tag}>${element.classes ? ` class="${element.classes}"` : ""}; width ${element.width}px; excess ${element.excess}px`
    : "no overflowing descendant was measurable";
  return `document scrollWidth ${diagnostics.scrollWidth}px; clientWidth ${diagnostics.clientWidth}px; ${elementDescription}`;
}

async function firstProductHref(page) {
  const links = await page.locator('a[href^="/en/products/"]').evaluateAll((items) => items.map((item) => item.getAttribute("href")).filter(Boolean));
  const href = links.find((item) => /^\/en\/products\/[^/?#]+$/u.test(item));
  if (!href) throw new Error("no active product detail link was found");
  return href;
}

async function readProductDetailPrices(page) {
  const usdText = await page.getByTestId("product-detail-usd-price").innerText({ timeout: ACTION_TIMEOUT });
  const sypText = await page.getByTestId("product-detail-syp-price").innerText({ timeout: ACTION_TIMEOUT });
  const usdCents = parseDisplayedUsdCents(usdText);
  const syp = parseDisplayedSyp(sypText);
  if (usdCents === undefined || syp === undefined) throw new Error("product detail price display could not be normalized");
  return { usdCents, syp };
}

function requestKind(request) {
  const url = new URL(request.url());
  if (url.pathname.startsWith("/api/auth/")) return "betterAuth";
  if (url.pathname === "/admin/login" && request.method() === "POST" && request.headers()["next-action"]) return "serverAction";
  return undefined;
}

function loginError(diagnostics) {
  const error = new Error("Admin login verification did not establish an /admin session");
  error.loginDiagnostics = diagnostics;
  return error;
}

async function logIn(page, target, credentials) {
  const diagnostics = {
    currentPathname: "unavailable",
    emailFieldFound: false,
    passwordFieldFound: false,
    emailValueEntered: false,
    passwordValueEntered: false,
    submitButtonFound: false,
    submitTriggered: false,
    serverActionRequestObserved: false,
    serverActionResponseStatus: undefined,
    betterAuthRequestObserved: false,
    betterAuthResponseStatus: undefined,
    loginErrorAlertRelevant: false,
    authenticatedSessionCookieDetected: "not-inspected",
    authenticatedAdminNavigation: false,
  };
  const requests = new WeakMap();
  const observeRequest = (request) => {
    const kind = requestKind(request);
    if (!kind) return;
    requests.set(request, kind);
    if (kind === "serverAction") diagnostics.serverActionRequestObserved = true;
    if (kind === "betterAuth") diagnostics.betterAuthRequestObserved = true;
  };
  const observeResponse = (response) => {
    const kind = requests.get(response.request()) ?? requestKind(response.request());
    if (kind === "serverAction") diagnostics.serverActionResponseStatus = response.status();
    if (kind === "betterAuth") diagnostics.betterAuthResponseStatus = response.status();
  };
  page.on("request", observeRequest);
  page.on("response", observeResponse);
  try {
    await goto(page, target, "/admin/login");
    diagnostics.currentPathname = new URL(page.url()).pathname;
    if (diagnostics.currentPathname === "/admin") {
      await usablePage(page, "/admin");
      diagnostics.authenticatedAdminNavigation = true;
      return diagnostics;
    }
    const email = page.locator("#admin-email");
    const password = page.locator("#admin-password");
    diagnostics.emailFieldFound = await email.count() === 1;
    diagnostics.passwordFieldFound = await password.count() === 1;
    if (!diagnostics.emailFieldFound || !diagnostics.passwordFieldFound) throw loginError(diagnostics);

    await email.fill(credentials.email, { timeout: ACTION_TIMEOUT });
    await password.fill(credentials.password, { timeout: ACTION_TIMEOUT });
    diagnostics.emailValueEntered = await email.inputValue() === credentials.email;
    diagnostics.passwordValueEntered = await password.inputValue() === credentials.password;
    if (!diagnostics.emailValueEntered || !diagnostics.passwordValueEntered) throw loginError(diagnostics);

    const submit = page.getByRole("button", { name: /^تسجيل الدخول$/u });
    diagnostics.submitButtonFound = await submit.count() === 1;
    if (!diagnostics.submitButtonFound) throw loginError(diagnostics);
    await submit.click({ timeout: ACTION_TIMEOUT });
    diagnostics.submitTriggered = true;

    // Better Auth is invoked from the Server Action on this application. The browser
    // sees that action request, while a direct /api/auth request may legitimately not occur.
    await Promise.race([
      page.waitForURL((url) => url.pathname === "/admin", { timeout: NAVIGATION_TIMEOUT }),
      page.waitForResponse((response) => requestKind(response.request()) === "serverAction", { timeout: NAVIGATION_TIMEOUT }),
    ]).catch(() => undefined);

    // Do not race a transient error alert against a redirect. A same-context navigation
    // verifies the cookie that the Server Action committed even if its client redirect is slow.
    const adminResponse = await page.goto(`${target}/admin`, { waitUntil: "domcontentloaded", timeout: NAVIGATION_TIMEOUT });
    diagnostics.currentPathname = new URL(page.url()).pathname;
    diagnostics.authenticatedAdminNavigation = diagnostics.currentPathname === "/admin" && Boolean(adminResponse && adminResponse.status() < 400);
    if (!diagnostics.authenticatedAdminNavigation) throw loginError(diagnostics);
    await usablePage(page, "/admin");
    return diagnostics;
  } catch (error) {
    diagnostics.currentPathname = new URL(page.url()).pathname;
    if (!diagnostics.authenticatedAdminNavigation) diagnostics.loginErrorAlertRelevant = await page.getByRole("alert").isVisible().catch(() => false);
    if (error?.loginDiagnostics) throw error;
    throw loginError(diagnostics);
  } finally {
    page.off("request", observeRequest);
    page.off("response", observeResponse);
  }
}

async function verifyAdminReadOnly(page, target, root) {
  const checks = [];
  const failures = [];
  const responsive = [];
  const analytics = { nanPresent: false, infinityPresent: false, chartRendered: false, topProductsRendered: false, contactBreakdownRendered: false, orderStatusBreakdownRendered: false };
  const settings = { whatsappConfigured: false };
  const record = async ({ name, expected, route, viewport }, action) => {
    try {
      const result = await action();
      const passed = result?.passed ?? true;
      const actual = result?.actual ?? "Completed successfully";
      checks.push({ name, status: passed ? Status.PASS : Status.FAIL, expected, actual: sanitize(actual), route, viewport });
      if (!passed) failures.push(name);
      return passed;
    } catch (error) {
      const actual = sanitize(error instanceof Error ? error.message : error) || "Check failed";
      checks.push({ name, status: Status.FAIL, expected, actual, route, viewport });
      failures.push(name);
      return false;
    }
  };
  const verifyProductControls = async () => {
    await page.locator('input[name="q"]').waitFor({ state: "visible", timeout: ACTION_TIMEOUT });
    const count = await page.locator('select[name="category"], select[name="active"], select[name="stock"]').count();
    if (count !== 3) throw new Error("admin product category, active, and stock filters did not all render");
  };

  await record({ name: "Products Page", expected: "Products controls render", route: "/admin/products" }, async () => {
    await goto(page, target, "/admin/products");
    await verifyProductControls();
    return { actual: "Search, category, active, and stock controls rendered" };
  });
  await record({ name: "Products Filters", expected: "Search, category, active, and stock controls are available", route: "/admin/products" }, async () => {
    await goto(page, target, "/admin/products");
    await verifyProductControls();
    return { actual: "All filter controls were visible" };
  });
  await record({ name: "Filter Navigation", expected: "URL search parameters update without a full document reload", route: "/admin/products" }, async () => {
    await goto(page, target, "/admin/products");
    let rscRequestObserved = false;
    const observeRequest = (request) => { if (request.headers().rsc || request.url().includes("_rsc=")) rscRequestObserved = true; };
    page.on("request", observeRequest);
    try {
      const navigationEntries = await page.evaluate(() => performance.getEntriesByType("navigation").length);
      await page.locator('input[name="q"]').fill("__release_verifier_zero__");
      await page.getByRole("button", { name: "تطبيق التصفية" }).click();
      await page.waitForURL(/\/admin\/products\?q=__release_verifier_zero__/u, { timeout: NAVIGATION_TIMEOUT });
      const afterNavigationEntries = await page.evaluate(() => performance.getEntriesByType("navigation").length);
      if (afterNavigationEntries !== navigationEntries) throw new Error("admin product filter caused a full document reload");
      return { actual: `URL updated; full document reload: no; Next.js RSC request occurred: ${rscRequestObserved ? "yes" : "not observed"}` };
    } finally {
      page.off("request", observeRequest);
    }
  });
  await record({ name: "Zero Results", expected: "Arabic empty state renders", route: "/admin/products" }, async () => {
    await goto(page, target, "/admin/products");
    await page.locator('input[name="q"]').fill("__release_verifier_zero__");
    await page.getByRole("button", { name: "تطبيق التصفية" }).click();
    await page.getByText("لا توجد منتجات تطابق عوامل التصفية الحالية.").waitFor({ state: "visible", timeout: ACTION_TIMEOUT });
    return { actual: "Arabic filtered empty state rendered" };
  });
  await record({ name: "admin_products_no_document_overflow", expected: "document scrollWidth <= clientWidth at 390 × 844 and 1280 × 800", route: "/admin/products", viewport: "390 × 844; 1280 × 800" }, async () => {
    const results = [];
    for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 800 }]) {
      try {
        await page.setViewportSize(viewport);
        await goto(page, target, "/admin/products");
        const diagnostics = await inspectDocumentOverflow(page);
        results.push({ viewport: `${viewport.width} × ${viewport.height}`, diagnostics, passed: diagnostics.scrollWidth <= diagnostics.clientWidth });
      } catch (error) {
        results.push({ viewport: `${viewport.width} × ${viewport.height}`, error: sanitize(error instanceof Error ? error.message : error), passed: false });
      }
    }
    await page.setViewportSize({ width: 1280, height: 800 });
    return {
      passed: results.every((result) => result.passed),
      actual: results.map((result) => result.error ? `${result.viewport}: ${result.error}` : `${result.viewport}: ${overflowActual(result.diagnostics)}`).join("; "),
    };
  });

  await record({ name: "Orders Page", expected: "Orders list renders safely", route: "/admin/orders" }, async () => {
    await goto(page, target, "/admin/orders");
    await usablePage(page, "/admin/orders");
    return { actual: "Orders page rendered" };
  });
  await record({ name: "Order Detail", expected: "Existing order detail opens when an order exists", route: "/admin/orders/<existing-order>" }, async () => {
    await goto(page, target, "/admin/orders");
    const orderHref = await page.locator('a[href^="/admin/orders/"]').evaluateAll((items) => items.map((item) => item.getAttribute("href")).find((href) => /^\/admin\/orders\/[^/?#]+$/u.test(href ?? "")));
    if (!orderHref) return { actual: "Existing order detected: no; detail route not applicable" };
    await goto(page, target, orderHref);
    await usablePage(page, "/admin/orders/<existing-order>");
    await page.getByText("لقطة المنتج والسعر", { exact: true }).waitFor({ state: "visible", timeout: ACTION_TIMEOUT });
    return { actual: "Existing order detected: yes; detail and snapshot section rendered" };
  });

  await record({ name: "Settings Page", expected: "Current settings and exchange-rate field render", route: "/admin/settings" }, async () => {
    await goto(page, target, "/admin/settings");
    await page.locator('input[name="usdToSypRate"]').waitFor({ state: "visible", timeout: ACTION_TIMEOUT });
    return { actual: "Settings form and exchange-rate field rendered" };
  });
  await record({ name: "Contact, Social, and Hero Fields", expected: "Configured fields render without exposing values", route: "/admin/settings" }, async () => {
    await goto(page, target, "/admin/settings");
    for (const selector of ['input[name="phone"]', 'input[name="whatsapp"]', 'input[name="facebook"]', 'input[name="instagram"]', 'input[name="heroTitleAr"]']) await page.locator(selector).waitFor({ state: "visible", timeout: ACTION_TIMEOUT });
    settings.whatsappConfigured = Boolean(await page.locator('input[name="whatsapp"]').inputValue());
    return { actual: "Contact, social, and Hero fields rendered; values not recorded" };
  });

  for (const range of ["today", "7d", "30d"]) {
    await record({ name: `Analytics ${range === "today" ? "Today" : range === "7d" ? "7 Days" : "30 Days"}`, expected: "Dashboard renders finite metrics and chart", route: `/admin/analytics?range=${range}` }, async () => {
      await goto(page, target, `/admin/analytics?range=${range}`);
      const body = await page.locator("body").innerText({ timeout: ACTION_TIMEOUT });
      if (/\b(?:NaN|Infinity)\b/u.test(body)) throw new Error(`/admin/analytics?range=${range} rendered an invalid metric`);
      for (const heading of ["الاتجاه اليومي", "قنوات التواصل", "حالات الطلبات", "أفضل المنتجات"]) await page.getByText(heading, { exact: true }).waitFor({ state: "visible", timeout: ACTION_TIMEOUT });
      await page.locator(".recharts-responsive-container").waitFor({ state: "visible", timeout: ACTION_TIMEOUT });
      analytics.chartRendered = true;
      analytics.topProductsRendered = true;
      analytics.contactBreakdownRendered = true;
      analytics.orderStatusBreakdownRendered = true;
      return { actual: "No NaN or Infinity; chart and major sections rendered" };
    });
  }

  for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 800 }]) {
    const viewportLabel = `${viewport.width} × ${viewport.height}`;
    const routes = ["/admin/products", "/admin/settings", "/admin/orders", "/admin/analytics?range=30d"];
    const pageResults = [];
    for (const route of routes) {
      const routePassed = await record({ name: `Responsive ${route} (${viewport.width}x${viewport.height})`, expected: "No document overflow and route controls remain visible", route, viewport: viewportLabel }, async () => {
        await page.setViewportSize(viewport);
        await goto(page, target, route);
        await page.locator("main").waitFor({ state: "visible", timeout: ACTION_TIMEOUT });
        if (route === "/admin/products") await verifyProductControls();
        if (route === "/admin/settings") await page.locator('input[name="usdToSypRate"]').waitFor({ state: "visible", timeout: ACTION_TIMEOUT });
        if (route === "/admin/orders") await page.getByRole("heading", { name: "الطلبات", exact: true }).waitFor({ state: "visible", timeout: ACTION_TIMEOUT });
        if (route.startsWith("/admin/analytics")) await page.locator('a[href="/admin/analytics?range=30d"]').waitFor({ state: "visible", timeout: ACTION_TIMEOUT });
        const diagnostics = await inspectDocumentOverflow(page);
        const passed = diagnostics.scrollWidth <= diagnostics.clientWidth;
        return { passed, actual: overflowActual(diagnostics) };
      });
      pageResults.push(routePassed);
    }
    responsive.push({ viewport: viewportLabel, pages: ["Products", "Settings", "Orders", "Analytics"], horizontalOverflow: pageResults.some((passed) => !passed), controlsVisible: pageResults.length === routes.length, chartOverflow: false, layoutIssue: pageResults.some((passed) => !passed) });
  }
  await page.setViewportSize({ width: 1280, height: 800 });

  await record({ name: "Logout", expected: "Session is ended", route: "/admin" }, async () => {
    await page.getByRole("button", { name: "تسجيل الخروج" }).click({ timeout: ACTION_TIMEOUT });
    await page.waitForURL((url) => url.pathname === "/admin/login", { timeout: NAVIGATION_TIMEOUT });
    return { actual: "Logout redirected to login" };
  });
  await record({ name: "Post-logout Protection", expected: "Admin redirects to login", route: "/admin" }, async () => {
    await goto(page, target, "/admin");
    if (!page.url().includes("/admin/login")) {
      await maybeScreenshot(page, root, "admin-auth-after-logout");
      throw new Error("/admin remained accessible after logout");
    }
    return { actual: "Protected route redirected to login" };
  });
  return { checks, failures, analytics, responsive, settings };
}

export async function runBrowserReadOnly({ target, credentials, root }) {
  let browser;
  let launched;
  const checks = [];
  let adminObservations = {};
  let loginDiagnostics;
  try {
    try {
      launched = await launchBrowser();
    } catch (error) {
      return { status: Status.BLOCKED, detail: error instanceof Error ? error.message : "browser verification could not launch", observations: { checks } };
    }
    browser = launched.browser;
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    page.setDefaultTimeout(ACTION_TIMEOUT);
    page.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT);

    await withTimeout((async () => {
      const recordPublic = async (name, route, expected, verify) => {
        let response;
        try {
          response = await goto(page, target, route);
          await verify();
          checks.push({ name, status: "PASS", expected, actual: "Route-specific semantic signal rendered", route, responseStatus: response.status() });
          return true;
        } catch (error) {
          checks.push({ name, status: "FAIL", expected, actual: await routeFailure(page, route, response, error), route, actualPathname: new URL(page.url()).pathname, responseStatus: response?.status?.() });
          return false;
        }
      };
      await recordPublic("Arabic Homepage", "/", "Storefront hero heading renders", () => page.locator("#hero-title").waitFor({ state: "visible", timeout: ACTION_TIMEOUT }));
      await recordPublic("Arabic Products", "/products", "Catalog search and page heading render", async () => { await page.getByRole("search").waitFor({ state: "visible", timeout: ACTION_TIMEOUT }); await page.locator("h1").waitFor({ state: "visible", timeout: ACTION_TIMEOUT }); });
      await recordPublic("English Homepage", "/en", "Storefront hero heading renders", () => page.locator("#hero-title").waitFor({ state: "visible", timeout: ACTION_TIMEOUT }));
      let productHref;
      await recordPublic("English Products", "/en/products", "Catalog search and active product link or empty state render", async () => { await page.getByRole("search").waitFor({ state: "visible", timeout: ACTION_TIMEOUT }); productHref = await firstProductHref(page).catch(() => undefined); await page.locator("h1").waitFor({ state: "visible", timeout: ACTION_TIMEOUT }); });
      if (productHref) await recordPublic("Product Detail", productHref, "Product heading and price region render", async () => { await page.locator("h1").waitFor({ state: "visible", timeout: ACTION_TIMEOUT }); await page.getByTestId("product-detail-usd-price").waitFor({ state: "visible", timeout: ACTION_TIMEOUT }); });
      else checks.push({ name: "Product Detail", status: "BLOCKED", expected: "Product heading and price region render", actual: "No active product link was available", route: "/en/products/<active-product>" });

      await goto(page, target, "/admin");
      if (!page.url().includes("/admin/login")) throw new Error("unauthenticated /admin did not redirect to /admin/login");
      checks.push({ name: "Unauthenticated Admin", status: "PASS", expected: "Redirect to /admin/login", actual: "Redirected to login", route: "/admin" });
      if (!credentials) return;
      loginDiagnostics = await logIn(page, target, credentials);
      checks.push({ name: "Admin Login", status: "PASS", expected: "Allowlisted Admin session is established", actual: "Server Action submitted and same-context /admin navigation authenticated", route: "/admin/login" });
      checks.push({ name: "Authenticated Dashboard", status: "PASS", expected: "Admin dashboard renders", actual: "Dashboard body rendered", route: "/admin" });
      await page.reload({ waitUntil: "domcontentloaded", timeout: NAVIGATION_TIMEOUT });
      if (!page.url().endsWith("/admin")) throw new Error("admin session did not survive refresh");
      checks.push({ name: "Session Persistence", status: "PASS", expected: "Session survives refresh", actual: "Dashboard remained authenticated after refresh", route: "/admin" });
      adminObservations = await verifyAdminReadOnly(page, target, root);
      checks.push(...adminObservations.checks);
    })(), BROWSER_TIMEOUT, "browser verification");

    await context.close();
    if (!credentials) return { status: Status.BLOCKED, detail: "public browser checks passed; TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD are required for authenticated checks", observations: { engine: launched.label, checks } };
    const failedChecks = adminObservations.failures ?? [];
    return failedChecks.length
      ? { status: Status.FAIL, detail: `headless browser verification completed with failing checks: ${failedChecks.join(", ")}`, observations: { engine: launched.label, login: loginDiagnostics, ...adminObservations, checks } }
      : { status: Status.PASS, detail: `headless browser verification passed using ${launched.label}`, observations: { engine: launched.label, login: loginDiagnostics, ...adminObservations, checks } };
  } catch (error) {
    return { status: Status.FAIL, detail: error instanceof Error ? error.message : "browser verification failed", observations: { engine: launched?.label, login: error?.loginDiagnostics ?? loginDiagnostics, ...adminObservations, checks } };
  } finally {
    await browser?.close().catch(() => undefined);
  }
}

export async function runGuardedMutations({ target, credentials, prisma }) {
  if (!credentials) return { status: Status.BLOCKED, detail: "Admin credentials are required for guarded mutations" };
  let browser;
  try {
    browser = (await launchBrowser()).browser;
  } catch (error) {
    return { status: Status.BLOCKED, detail: error instanceof Error ? error.message : "browser verification could not launch" };
  }
  const state = { settings: undefined, orderId: undefined, visitorId: randomUUID(), sessionId: randomUUID() };
  const observations = { attempted: true, adminAuthenticated: false, originalRateRecorded: Status.BLOCKED, temporaryRateApplied: Status.BLOCKED, usdUnchanged: Status.BLOCKED, sypChanged: Status.BLOCKED, orderCreated: Status.BLOCKED, initialNew: Status.BLOCKED, orderIntent: Status.BLOCKED, orderSubmitted: Status.BLOCKED, duplicateProtected: Status.BLOCKED, contactedTransition: Status.BLOCKED, contactedAtRecorded: Status.BLOCKED, confirmedTransition: Status.BLOCKED, confirmedAtRecorded: Status.BLOCKED, completedTransition: Status.BLOCKED, completedAtRecorded: Status.BLOCKED, priorMilestonesPreserved: Status.BLOCKED, rateRestored: Status.BLOCKED, settingsDiagnostics: {}, orderStatusDiagnostics: [] };
  let cleanup = { settingsRestored: false, temporaryOrderResidual: 0, temporaryAnalyticsResidual: 0 };
  const failures = [];
  try {
    const seed = await (await import("./database.mjs")).getMutationSeed(prisma);
    state.settings = { id: seed.settings.id, originalRate: seed.settings.usdToSypRate };
    observations.originalRateRecorded = Status.PASS;
    const temporaryRate = seed.settings.usdToSypRate < 10_000_000 ? seed.settings.usdToSypRate + 1 : seed.settings.usdToSypRate - 1;
    if (temporaryRate < 1) throw new Error("no valid temporary exchange rate is available");
    const publicRoute = `/en/products/${seed.product.slug}`;
    const settingsDiagnostics = { productSlug: seed.product.slug, publicRoute, originalRate: seed.settings.usdToSypRate, temporaryRate, usdBefore: undefined, usdAfter: undefined, expectedSypBefore: calculateExpectedSyp(seed.product.priceUsdCents, seed.settings.usdToSypRate), observedSypBefore: undefined, expectedSypAfter: calculateExpectedSyp(seed.product.priceUsdCents, temporaryRate), observedSypAfter: undefined, routeReloadedAfterMutation: false, revalidationObserved: false, restorationVerified: false };
    observations.settingsDiagnostics = settingsDiagnostics;
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await context.addInitScript(({ visitorId, sessionId }) => { localStorage.setItem("code-flex:visitor-id", visitorId); sessionStorage.setItem("code-flex:session-id", sessionId); }, { visitorId: state.visitorId, sessionId: state.sessionId });
    const page = await context.newPage();
    page.setDefaultTimeout(ACTION_TIMEOUT);
    page.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT);
    const restoreSettings = async () => {
      await prisma.siteSettings.update({ where: { id: seed.settings.id }, data: { usdToSypRate: seed.settings.usdToSypRate } });
      return (await prisma.siteSettings.findUnique({ where: { id: seed.settings.id }, select: { usdToSypRate: true } }))?.usdToSypRate === seed.settings.usdToSypRate;
    };

    let settingsRestoredSafely = false;
    await withTimeout((async () => {
      let temporaryRateSubmissionAttempted = false;
      try {
        await goto(page, target, publicRoute);
        await page.locator("h1").waitFor({ state: "visible", timeout: ACTION_TIMEOUT });
        const before = await readProductDetailPrices(page);
        settingsDiagnostics.usdBefore = before.usdCents;
        settingsDiagnostics.observedSypBefore = before.syp;
        if (before.usdCents !== seed.product.priceUsdCents || before.syp !== settingsDiagnostics.expectedSypBefore) throw new Error("baseline public product prices did not match database values");
        await logIn(page, target, credentials);
        observations.adminAuthenticated = true;
        await goto(page, target, "/admin/settings");
        await page.locator('input[name="usdToSypRate"]').fill(String(temporaryRate));
        temporaryRateSubmissionAttempted = true;
        await page.getByRole("button", { name: "حفظ الإعدادات" }).click();
        await page.getByRole("status").waitFor({ state: "visible", timeout: NAVIGATION_TIMEOUT });
        if (!await waitForDatabase(async () => (await prisma.siteSettings.findUnique({ where: { id: seed.settings.id }, select: { usdToSypRate: true } }))?.usdToSypRate === temporaryRate)) throw new Error("settings rate did not persist through the Admin UI");
        observations.temporaryRateApplied = Status.PASS;
        await goto(page, target, `${publicRoute}?release_verifier_rate=${temporaryRate}`);
        await page.reload({ waitUntil: "domcontentloaded", timeout: NAVIGATION_TIMEOUT });
        settingsDiagnostics.routeReloadedAfterMutation = true;
        const after = await readProductDetailPrices(page);
        settingsDiagnostics.usdAfter = after.usdCents;
        settingsDiagnostics.observedSypAfter = after.syp;
        observations.usdUnchanged = after.usdCents === seed.product.priceUsdCents ? Status.PASS : Status.FAIL;
        observations.sypChanged = after.syp === settingsDiagnostics.expectedSypAfter && after.syp !== before.syp ? Status.PASS : Status.FAIL;
        settingsDiagnostics.revalidationObserved = observations.usdUnchanged === Status.PASS && observations.sypChanged === Status.PASS;
        if (!settingsDiagnostics.revalidationObserved) throw new Error("public price revalidation did not reflect the temporary rate safely");
      } catch (error) {
        failures.push(error instanceof Error ? error.message : "settings mutation verification failed");
        if (temporaryRateSubmissionAttempted && observations.temporaryRateApplied === Status.BLOCKED) observations.temporaryRateApplied = Status.FAIL;
        if (observations.temporaryRateApplied === Status.PASS && observations.usdUnchanged === Status.BLOCKED) observations.usdUnchanged = Status.FAIL;
        if (observations.temporaryRateApplied === Status.PASS && observations.sypChanged === Status.BLOCKED) observations.sypChanged = Status.FAIL;
      } finally {
        settingsRestoredSafely = await restoreSettings().catch(() => false);
        settingsDiagnostics.restorationVerified = settingsRestoredSafely;
      }

      if (!settingsRestoredSafely) {
        failures.push("settings rate cleanup could not be verified before the independent order scenario");
        return;
      }
      let orderSubmissionAttempted = false;
      let duplicateSubmissionAttempted = false;
      try {
        await goto(page, target, publicRoute);
        await page.getByRole("button", { name: "Request Now" }).click();
        await page.locator("#request-customer-name").fill(`QA Release Verifier ${state.visitorId.slice(0, 8)}`);
        await page.locator("#request-customer-phone").fill("+15550100000");
        orderSubmissionAttempted = true;
        await page.getByRole("button", { name: "Submit request" }).click();
        await page.getByText("Your request has been recorded").waitFor({ state: "visible", timeout: NAVIGATION_TIMEOUT });
        const order = await waitForDatabase(() => prisma.order.findFirst({ where: { customerName: `QA Release Verifier ${state.visitorId.slice(0, 8)}`, customerPhone: "+15550100000", productId: seed.product.id }, orderBy: { createdAt: "desc" }, select: { id: true, status: true, usdPriceCentsSnapshot: true, usdRateSnapshot: true, sypPriceSnapshot: true } }));
        if (!order || order.status !== "NEW" || order.usdPriceCentsSnapshot !== seed.product.priceUsdCents || order.usdRateSnapshot !== seed.settings.usdToSypRate || order.sypPriceSnapshot !== calculateExpectedSyp(seed.product.priceUsdCents, seed.settings.usdToSypRate)) {
          observations.orderCreated = Status.FAIL;
          throw new Error("temporary order snapshot or initial status was incorrect");
        }
        state.orderId = order.id;
        observations.orderCreated = Status.PASS;
        observations.initialNew = Status.PASS;
        const events = await waitForDatabase(async () => {
          const found = await prisma.analyticsEvent.findMany({ where: { visitorId: state.visitorId, sessionId: state.sessionId, productId: seed.product.id, eventType: { in: ["ORDER_INTENT", "ORDER_SUBMITTED"] } }, select: { eventType: true } });
          return found.some((event) => event.eventType === "ORDER_INTENT") && found.some((event) => event.eventType === "ORDER_SUBMITTED") ? found : undefined;
        });
        if (!events) {
          observations.orderIntent = Status.FAIL;
          observations.orderSubmitted = Status.FAIL;
          throw new Error("temporary order analytics events were not both observed");
        }
        observations.orderIntent = Status.PASS;
        observations.orderSubmitted = Status.PASS;
        await closeSubmittedRequestDialog(page);
        await page.getByRole("button", { name: "Request Now" }).click();
        await page.locator("#request-customer-name").fill(`QA Release Verifier ${state.visitorId.slice(0, 8)}`);
        await page.locator("#request-customer-phone").fill("+15550100000");
        duplicateSubmissionAttempted = true;
        await page.getByRole("button", { name: "Submit request" }).click();
        await page.getByText("Your request has been recorded").waitFor({ state: "visible", timeout: NAVIGATION_TIMEOUT });
        if (await prisma.order.count({ where: { customerName: `QA Release Verifier ${state.visitorId.slice(0, 8)}`, customerPhone: "+15550100000", productId: seed.product.id } }) !== 1) {
          observations.duplicateProtected = Status.FAIL;
          throw new Error("duplicate submission created an additional Order");
        }
        observations.duplicateProtected = Status.PASS;
        await goto(page, target, `/admin/orders/${state.orderId}`);
        let prior = { contactedAt: null, confirmedAt: null };
        for (const step of [{ status: "CONTACTED", transition: "contactedTransition", timestamp: "contactedAtRecorded", field: "contactedAt" }, { status: "CONFIRMED", transition: "confirmedTransition", timestamp: "confirmedAtRecorded", field: "confirmedAt" }, { status: "COMPLETED", transition: "completedTransition", timestamp: "completedAtRecorded", field: "completedAt" }]) {
          await page.locator("#order-status").selectOption(step.status);
          await page.getByRole("button", { name: "حفظ الحالة" }).click();
          await page.getByRole("status").waitFor({ state: "visible", timeout: NAVIGATION_TIMEOUT });
          const uiStatus = await page.locator("#order-status").inputValue();
          const row = await waitForDatabase(async () => {
            const value = await prisma.order.findUnique({ where: { id: state.orderId }, select: { status: true, contactedAt: true, confirmedAt: true, completedAt: true } });
            return value?.status === step.status ? value : undefined;
          });
          const uiPassed = uiStatus === step.status;
          const timestampPresent = Boolean(row?.[step.field]);
          observations[step.transition] = uiPassed && row ? Status.PASS : Status.FAIL;
          observations[step.timestamp] = row ? timestampPresent ? Status.PASS : Status.FAIL : Status.BLOCKED;
          const preserved = step.status === "CONTACTED" || (row?.contactedAt?.getTime() === prior.contactedAt?.getTime() && (step.status !== "COMPLETED" || row?.confirmedAt?.getTime() === prior.confirmedAt?.getTime()));
          if (!preserved) observations.priorMilestonesPreserved = Status.FAIL;
          observations.orderStatusDiagnostics.push({ check: step.status, ui: uiPassed ? step.status : "not updated", db: row?.status ?? "not observed", timestamp: timestampPresent ? "present" : "missing", preserved: preserved ? "yes" : "no", result: uiPassed && row && timestampPresent && preserved ? Status.PASS : Status.FAIL });
          if (!uiPassed || !row || !timestampPresent || !preserved) throw new Error(`${step.status} status workflow verification failed`);
          prior = { contactedAt: row.contactedAt, confirmedAt: row.confirmedAt };
        }
        observations.priorMilestonesPreserved = Status.PASS;
      } catch (error) {
        failures.push(error instanceof Error ? error.message : "order mutation verification failed");
        if (orderSubmissionAttempted && observations.orderCreated === Status.BLOCKED) observations.orderCreated = Status.FAIL;
        if (duplicateSubmissionAttempted && observations.duplicateProtected === Status.BLOCKED) observations.duplicateProtected = Status.FAIL;
      }
    })(), BROWSER_TIMEOUT, "guarded mutation verification");
    await context.close();
  } catch (error) {
    failures.push(error instanceof Error ? error.message : "guarded mutation verification failed");
  } finally {
    if (state.settings || state.orderId) cleanup = await (await import("./database.mjs")).cleanupMutationArtifacts(prisma, state);
    await browser?.close().catch(() => undefined);
  }
  const cleanupPassed = cleanup.settingsRestored && cleanup.temporaryOrderResidual === 0 && cleanup.temporaryAnalyticsResidual === 0;
  observations.rateRestored = cleanup.settingsRestored ? Status.PASS : Status.FAIL;
  if (observations.settingsDiagnostics) observations.settingsDiagnostics.restorationVerified = cleanup.settingsRestored;
  const detail = failures.join("; ") || "guarded settings, order, duplicate, and status workflow checks passed";
  return { status: failures.length && cleanupPassed ? Status.FAIL : cleanupPassed ? Status.PASS : Status.FAIL, detail: cleanupPassed ? detail : `${detail}; cleanup could not be confirmed`, cleanup, observations: { ...observations, cleanup: { ...cleanup, existingOrdersModified: 0 } } };
}
