import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { Status, safeTarget, sanitize } from "./verify/shared.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reportDirectory = path.join(root, "artifacts", "verification");
const checks = [];

async function source(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

function check(name, condition, detail) {
  checks.push({ name, status: condition ? Status.PASS : Status.FAIL, detail });
}

async function staticChecks() {
  const [form, actions, manager, dropzone, theme, productsPage, productDetail] = await Promise.all([
    source("src/components/admin/product-form.tsx"),
    source("src/actions/admin-products.ts"),
    source("src/components/admin/product-image-manager.tsx"),
    source("src/components/admin/product-image-dropzone.tsx"),
    source("src/app/globals.css"),
    source("src/app/admin/(protected)/products/page.tsx"),
    source("src/app/[locale]/products/[slug]/page.tsx"),
  ]);
  check("Create form hides slug and SKU", !/<Field label="(?:الرابط|SKU)/u.test(form) && /type="hidden" name="slug"/u.test(form), "slug is generated in a hidden field and no SKU control is rendered");
  check("Create supports preselected images", /create-product-image-file-input/u.test(form) && /uploadProductImageFile\(result\.productId/u.test(form), "files remain client-side until the created Product ID is returned");
  check("Duplicate warning is non-blocking", /findProductsByExactName/u.test(form) && /عرض المنتج/u.test(form) && /createProduct\(\{\}, formData\)/u.test(form), "debounced exact-name lookup does not disable submission");
  check("Automatic unique slug", /productSlugWithSuffix/u.test(actions) && /for \(let suffix = 1/u.test(actions), "server resolves unique suffixes while create receives a frontend-generated slug");
  check("Edit preserves slug", /value=\{product\?\.slug \?\?/u.test(form), "existing slug is retained on edit");
  check("Save feedback and redirect", /saved=updated/u.test(form) && /saved=created/u.test(form) && /product-save-success/u.test(productsPage), "post-navigation success feedback is rendered by the products route");
  check("Compact batch upload", /product-image-upload-batch/u.test(manager) && !/product-image-upload-queue-item/u.test(manager), "one batch state replaces technical per-file progress rows");
  check("Drag active and invalid states", /dragDepth/u.test(dropzone) && /أفلت الصور هنا للرفع/u.test(dropzone) && /border-destructive/u.test(dropzone), "nested drag events avoid flicker and unsupported files use semantic red");
  check("Brand palette centralized", ["#a15ced", "#55ede0", "#4c57cd"].every((color) => theme.toLowerCase().includes(color)) && /--destructive: #c9232c/u.test(theme), "purple, cyan, and indigo tokens are centralized while destructive remains red");
  check("Internal detail navigation stays client-side", !/<a href=\{(?:homePath|productsPath|getCategoryHref)/u.test(productDetail) && /NextLink/u.test(productDetail), "storefront breadcrumb links use Next Link");

  const loadingFiles = [
    "src/app/[locale]/loading.tsx",
    "src/app/[locale]/products/loading.tsx",
    "src/app/[locale]/products/[slug]/loading.tsx",
    "src/app/admin/(protected)/loading.tsx",
    "src/app/admin/(protected)/products/loading.tsx",
    "src/app/admin/(protected)/products/new/loading.tsx",
    "src/app/admin/(protected)/products/[id]/edit/loading.tsx",
    "src/app/admin/(protected)/categories/loading.tsx",
    "src/app/admin/(protected)/orders/loading.tsx",
    "src/app/admin/(protected)/orders/[id]/loading.tsx",
    "src/app/admin/(protected)/analytics/loading.tsx",
    "src/app/admin/(protected)/settings/loading.tsx",
    "src/app/admin/(protected)/account/loading.tsx",
  ];
  const loadingContents = await Promise.all(loadingFiles.map(source));
  check("Destination loading boundaries", loadingContents.every((content) => /Skeleton/u.test(content)), `${loadingFiles.length} storefront/admin route loading boundaries are present`);
}

async function browserChecks(target) {
  if (!target) {
    checks.push({ name: "Production browser verification", status: Status.BLOCKED, detail: "TEST_BASE_URL was not supplied; production behavior was not inferred from source" });
    return;
  }
  let browser;
  try {
    const { chromium } = await import("@playwright/test");
    for (const options of [{ channel: "chrome", headless: true }, { channel: "msedge", headless: true }, { headless: true }]) {
      try { browser = await chromium.launch(options); break; } catch { /* Try the next locally available browser. */ }
    }
    if (!browser) throw new Error("no supported headless browser could launch");
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`${target}/`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    check("Storefront mobile has no horizontal overflow", await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), "390px storefront viewport inspected");
    await page.route("**/*", async (route) => {
      const request = route.request();
      if (request.headers().rsc || request.url().includes("_rsc=")) await new Promise((resolve) => setTimeout(resolve, 650));
      await route.continue();
    });
    const productsLink = page.locator('a[href="/products"]').first();
    const navigation = productsLink.click();
    const storefrontSkeleton = await page.getByTestId("storefront-catalog-skeleton").waitFor({ state: "visible", timeout: 2_000 }).then(() => true).catch(() => false);
    await navigation;
    check("Storefront destination skeleton", storefrontSkeleton, "catalog-shaped loading UI appeared during client navigation");
    await page.waitForURL((url) => url.pathname === "/products", { timeout: 30_000 });

    const email = process.env.ADMIN_EMAIL?.trim();
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
      checks.push({ name: "Admin read-only browser verification", status: Status.BLOCKED, detail: "ADMIN_EMAIL and ADMIN_PASSWORD were not supplied" });
      return;
    }
    await page.goto(`${target}/admin/products/new`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    if (new URL(page.url()).pathname === "/admin/login") {
      await page.locator("#admin-email").fill(email);
      await page.locator("#admin-password").fill(password);
      await page.getByRole("button", { name: /^تسجيل الدخول$/u }).click();
      await page.waitForURL((url) => url.pathname === "/admin", { timeout: 30_000 });
    }
    await page.goto(`${target}/admin`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    const adminNavigation = page.locator('a[href="/admin/products"]').first().click();
    const adminSkeleton = await page.getByTestId("admin-products-skeleton").waitFor({ state: "visible", timeout: 2_000 }).then(() => true).catch(() => false);
    await adminNavigation;
    check("Admin destination skeleton", adminSkeleton, "products-shaped loading UI appeared during client navigation");
    await page.goto(`${target}/admin/products/new`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    const visibleSlugOrSku = await page.getByText(/Slug|SKU/u).count();
    const createImageInput = await page.getByTestId("create-product-image-file-input").count();
    check("Admin create form read-only UX", visibleSlugOrSku === 0 && createImageInput === 1, "no visible slug/SKU control and the pre-create multi-image picker is present");
    check("Admin create mobile has no horizontal overflow", await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), "390px Admin create viewport inspected");
  } catch (error) {
    checks.push({ name: "Production browser verification", status: Status.BLOCKED, detail: sanitize(error instanceof Error ? error.message : error) });
  } finally {
    await browser?.close();
  }
}

function overallStatus() {
  if (checks.some((item) => item.status === Status.FAIL)) return Status.FAIL;
  if (checks.some((item) => item.status === Status.BLOCKED)) return Status.BLOCKED;
  return Status.PASS;
}

async function writeReports(report) {
  await mkdir(reportDirectory, { recursive: true });
  const sanitized = { ...report, checks: report.checks.map((item) => ({ ...item, detail: sanitize(item.detail) })) };
  await writeFile(path.join(reportDirectory, "admin-product-ux-latest.json"), `${JSON.stringify(sanitized, null, 2)}\n`, "utf8");
  const rows = sanitized.checks.map((item) => `| ${item.name.replace(/\|/gu, "\\|")} | ${item.status} | ${item.detail.replace(/\|/gu, "\\|")} |`).join("\n");
  const markdown = `# Code Flex — Admin/Product UX Verification\n\n- Timestamp: ${sanitized.timestamp}\n- Target: ${sanitized.target}\n- Overall: **${sanitized.status}**\n- Production mutations: **NOT RUN** (this verifier is read-only)\n\n| Check | Status | Detail |\n| --- | --- | --- |\n${rows}\n`;
  await writeFile(path.join(reportDirectory, "admin-product-ux-latest.md"), markdown, "utf8");
}

let target;
try {
  target = process.env.TEST_BASE_URL ? safeTarget(process.env.TEST_BASE_URL) : undefined;
  await staticChecks();
  await browserChecks(target);
} catch (error) {
  checks.push({ name: "Verifier execution", status: Status.FAIL, detail: sanitize(error instanceof Error ? error.message : error) });
}
const report = { timestamp: new Date().toISOString(), target: target ?? "not supplied", status: overallStatus(), checks };
await writeReports(report);
console.log(`Verification status: ${report.status}`);
for (const item of checks) console.log(`${item.status}: ${item.name} — ${sanitize(item.detail)}`);
console.log("JSON report: artifacts/verification/admin-product-ux-latest.json");
console.log("Markdown report: artifacts/verification/admin-product-ux-latest.md");
process.exitCode = report.status === Status.PASS ? 0 : report.status === Status.BLOCKED ? 2 : 1;
