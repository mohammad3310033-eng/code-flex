import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

export const Status = Object.freeze({ PASS: "PASS", FAIL: "FAIL", BLOCKED: "BLOCKED" });

export function sanitize(value) {
  const runIds = [];
  return String(value ?? "")
    .replace(/\brun-[a-z0-9-]{8,}\b/giu, (match) => `__RUN_ID_${runIds.push(match) - 1}__`)
    .replace(/(postgres(?:ql)?:\/\/)[^\s"']+/giu, "$1[redacted]")
    .replace(/(password|token|cookie|authorization)\s*[:=]\s*[^\s,;]+/giu, "$1=[redacted]")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/giu, "[REDACTED_EMAIL]")
    .replace(/(?:\+\d[\d\s().-]{6,}\d|\b\d{8,}\b)/gu, "[REDACTED_PHONE]")
    .replace(/__RUN_ID_(\d+)__/gu, (_, index) => runIds[Number(index)] ?? "[REDACTED]")
    .slice(0, 500);
}

export function safeNumeric(value, fallback = "not observed") {
  return typeof value === "number" && Number.isFinite(value) ? String(value) : fallback;
}

export function safeTarget(rawTarget) {
  const target = new URL(rawTarget);
  if (!/^https?:$/u.test(target.protocol)) throw new Error("TEST_BASE_URL must use http or https.");
  target.username = "";
  target.password = "";
  target.hash = "";
  return target.toString().replace(/\/$/u, "");
}

export function withTimeout(promise, milliseconds, label) {
  let timeout;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timeout = setTimeout(() => reject(new Error(`${label} timed out after ${milliseconds}ms.`)), milliseconds);
    }),
  ]).finally(() => clearTimeout(timeout));
}

export class Progress {
  constructor(total) {
    this.total = total;
    this.index = 0;
    this.failures = [];
    this.blockers = [];
  }

  async step(name, callback) {
    this.index += 1;
    const prefix = `[${this.index}/${this.total}] ${name}`;
    console.log(`${prefix} START`);
    try {
      const result = await callback();
      const status = result?.status ?? Status.PASS;
      const detail = result?.detail ? ` — ${sanitize(result.detail)}` : "";
      console.log(`${prefix} ${status}${detail}`);
      if (status === Status.FAIL) this.failures.push(`${name}: ${sanitize(result?.detail ?? "verification failed")}`);
      if (status === Status.BLOCKED) this.blockers.push(`${name}: ${sanitize(result?.detail ?? "verification blocked")}`);
      return { status, ...result };
    } catch (error) {
      const detail = sanitize(error instanceof Error ? error.message : error);
      console.log(`${prefix} ${Status.FAIL} — ${detail}`);
      this.failures.push(`${name}: ${detail}`);
      return { status: Status.FAIL, detail };
    }
  }
}

export async function runCommand(command, args, { cwd, timeoutMs = 180_000 } = {}) {
  return withTimeout(
    new Promise((resolve) => {
      const child = spawn(command, args, { cwd, shell: false, stdio: ["ignore", "pipe", "pipe"] });
      let output = "";
      child.stdout.on("data", (chunk) => { output += chunk; });
      child.stderr.on("data", (chunk) => { output += chunk; });
      child.on("error", (error) => resolve({ code: 1, output: error.message }));
      child.on("close", (code) => resolve({ code: code ?? 1, output }));
    }),
    timeoutMs,
    `${command} ${args.join(" ")}`,
  );
}

function markdown(value) {
  return sanitize(value).replace(/\|/gu, "\\|").replace(/`/gu, "'");
}

function resultRows(rows) {
  return rows.map(([name, status]) => `| ${markdown(name)} | ${markdown(status)} |`).join("\n");
}

function checkSection(title, checks) {
  return `## ${title}\n\n${checks.map((check) => `### ${markdown(check.name)}\n\n- Status: ${markdown(check.status)}\n- Expected: ${markdown(check.expected)}\n- Observed: ${markdown(check.actual)}${check.route ? `\n- Route: \`${markdown(check.route)}\`` : ""}${check.viewport ? `\n- Viewport: ${markdown(check.viewport)}` : ""}`).join("\n\n") || "No checks were recorded."}`;
}

export function createMarkdownReport(report) {
  const staticChecks = report.staticChecks ?? [];
  const browser = report.observations?.browser ?? {};
  const database = report.observations?.database ?? {};
  const mutation = report.observations?.mutation ?? {};
  const metrics = database.analytics ?? {};
  const percentage = (numerator, denominator) => denominator > 0 ? `${Math.round((numerator / denominator) * 10_000) / 100}%` : "0%";
  const failures = report.failures ?? [];
  const blockers = report.blockers ?? [];
  const staticDetails = staticChecks.map((check) => `### ${markdown(check.name)}\n\nStatus: ${markdown(check.status)}\n\nCommand: \`${markdown(check.command)}\`\n\nRelevant result: ${markdown(check.summary)}`).join("\n\n") || "No static checks were attempted.";
  const browserChecks = browser.checks ?? [];
  const browserFailureDetails = browserChecks.filter((item) => item.status === Status.FAIL).map((item) => `### ${markdown(item.name)}\n\n- Status: FAIL\n- Expected: ${markdown(item.expected)}\n- Observed: ${markdown(item.actual)}${item.route ? `\n- Route: \`${markdown(item.route)}\`` : ""}${item.viewport ? `\n- Viewport: ${markdown(item.viewport)}` : ""}`).join("\n\n");
  const check = (name, expected, route) => browserChecks.find((item) => item.name === name) ?? { name, expected, route, status: "BLOCKED", actual: "Not executed" };
  const responsive = browser.responsive ?? [];
  const mutationStatus = (value) => value === true ? Status.PASS : value === false ? Status.FAIL : [Status.PASS, Status.FAIL, Status.BLOCKED].includes(value) ? value : Status.BLOCKED;
  const mutationRows = mutation.attempted
    ? [
        ["Original rate recorded", mutationStatus(mutation.originalRateRecorded)],
        ["Temporary rate applied", mutationStatus(mutation.temporaryRateApplied)],
        ["USD price unchanged", mutationStatus(mutation.usdUnchanged)],
        ["SYP price changed", mutationStatus(mutation.sypChanged)],
        ["Temporary order created", mutationStatus(mutation.orderCreated)],
        ["Initial NEW state", mutationStatus(mutation.initialNew)],
        ["ORDER_INTENT observed", mutationStatus(mutation.orderIntent)],
        ["ORDER_SUBMITTED observed", mutationStatus(mutation.orderSubmitted)],
        ["Duplicate protection", mutationStatus(mutation.duplicateProtected)],
        ["CONTACTED status transition", mutationStatus(mutation.contactedTransition)],
        ["contactedAt recorded", mutationStatus(mutation.contactedAtRecorded)],
        ["CONFIRMED status transition", mutationStatus(mutation.confirmedTransition)],
        ["confirmedAt recorded", mutationStatus(mutation.confirmedAtRecorded)],
        ["COMPLETED status transition", mutationStatus(mutation.completedTransition)],
        ["completedAt recorded", mutationStatus(mutation.completedAtRecorded)],
        ["Prior milestone timestamps preserved", mutationStatus(mutation.priorMilestonesPreserved)],
        ["Original rate restored", mutationStatus(mutation.rateRestored)],
      ]
    : [];

  return `# Code Flex — Release Verification Report

## Summary

- Timestamp: ${markdown(report.timestamp)}
- Run ID: ${markdown(report.runId)}
- Target: ${markdown(report.target)}
- Git commit: ${markdown(report.gitCommit ?? "Unavailable")}
- Release security blocker: ${markdown(report.releaseSecurityBlocker)}

| Layer | Result |
|---|---|
${resultRows([
  ["Static", report.static],
  ["Production Read-only", report.productionReadOnly],
  ["Production Mutation", report.mutation],
  ["Cleanup", report.cleanup],
  ["Cloudinary", report.cloudinary],
  ["Overall", report.status],
])}

## Execution Mode

- Admin credentials: ${report.execution?.adminCredentialsAvailable ? "AVAILABLE" : "UNAVAILABLE"}
- Credential source: ${markdown(report.execution?.credentialSource ?? "not available")}
${report.execution?.credentialCacheWarning ? `- Credential cache warning: ${markdown(report.execution.credentialCacheWarning)}` : ""}
- Mutation guard: ${report.execution?.mutationGuardEnabled ? "ENABLED" : "DISABLED"}
- Browser verification: ${markdown(report.execution?.browser ?? "Not executed")}
- Production DB access: ${markdown(report.execution?.database ?? "Not executed")}
- Cloudinary QA: DEFERRED

## Static Verification

${staticDetails}

## Production Preflight

- Status: ${markdown(report.preflight?.status ?? "BLOCKED")}
- Target accessibility: ${markdown(report.preflight?.detail ?? "Not executed")}
- Public app availability: ${report.preflight?.status === "PASS" ? "usable response observed" : "not verified"}

${checkSection("Public Storefront Verification", [
  check("Arabic Homepage", "Arabic storefront renders", "/"),
  check("Arabic Products", "Catalog renders", "/products"),
  check("Product Detail", "An active product detail renders", "/en/products/<active-product>"),
  check("English Homepage", "English storefront renders", "/en"),
  check("English Products", "English catalog renders", "/en/products"),
])}

${checkSection("Authentication Verification", [
  check("Unauthenticated Admin", "Redirect to /admin/login", "/admin"),
  check("Admin Login", "Allowlisted Admin session is established", "/admin/login"),
  check("Authenticated Dashboard", "Admin dashboard renders", "/admin"),
  check("Session Persistence", "Session survives refresh", "/admin"),
  check("Logout", "Session is ended", "/admin"),
  check("Post-logout Protection", "Admin redirects to login", "/admin"),
])}

${browser.login ? `### Sanitized Login Diagnostics

- Current pathname: ${markdown(browser.login.currentPathname)}
- Email field found: ${browser.login.emailFieldFound ? "yes" : "no"}
- Password field found: ${browser.login.passwordFieldFound ? "yes" : "no"}
- Email value entered: ${browser.login.emailValueEntered ? "yes" : "no"}
- Password value entered: ${browser.login.passwordValueEntered ? "yes" : "no"}
- Submit button found: ${browser.login.submitButtonFound ? "yes" : "no"}
- Submit triggered: ${browser.login.submitTriggered ? "yes" : "no"}
- Server Action request observed: ${browser.login.serverActionRequestObserved ? "yes" : "no"}
- Server Action HTTP status: ${markdown(browser.login.serverActionResponseStatus ?? "not observed")}
- Direct Better Auth browser request observed: ${browser.login.betterAuthRequestObserved ? "yes" : "no (expected when Better Auth runs inside the Server Action)"}
- Direct Better Auth HTTP status: ${markdown(browser.login.betterAuthResponseStatus ?? "not observable")}
- Login error alert after a failed attempt: ${browser.login.authenticatedAdminNavigation ? "not applicable (authentication succeeded)" : browser.login.loginErrorAlertRelevant ? "yes" : "no"}
- Authenticated session cookie detected: ${markdown(browser.login.authenticatedSessionCookieDetected ?? "not-inspected")}
- Authenticated /admin navigation succeeded: ${browser.login.authenticatedAdminNavigation ? "yes" : "no"}
` : ""}

## Executed Browser Failures

${browserFailureDetails || "None."}

${checkSection("Admin Products Verification", [
  check("Products Page", "Products controls render", "/admin/products"),
  check("Products Filters", "Search, category, active, and stock controls are available", "/admin/products"),
  check("Filter Navigation", "URL search parameters update without a full document reload", "/admin/products"),
  check("Zero Results", "Arabic empty state renders", "/admin/products"),
  check("admin_products_no_document_overflow", "document scrollWidth <= clientWidth at 390 × 844 and 1280 × 800", "/admin/products"),
])}

${checkSection("Orders Read-only Verification", [
  check("Orders Page", "Orders list renders safely", "/admin/orders"),
  check("Order Detail", "Existing order detail opens when an order exists", "/admin/orders/<existing-order>"),
])}

${checkSection("Settings Read-only Verification", [
  check("Settings Page", "Current settings and exchange-rate field render", "/admin/settings"),
  check("Contact, Social, and Hero Fields", "Configured fields render without exposing values", "/admin/settings"),
])}

- WhatsApp configured: ${browser.settings?.whatsappConfigured === true ? "yes" : browser.settings ? "no" : "not verified"}

${checkSection("Analytics Verification", [
  check("Analytics Today", "Dashboard renders finite metrics and chart", "/admin/analytics?range=today"),
  check("Analytics 7 Days", "Dashboard renders finite metrics and chart", "/admin/analytics?range=7d"),
  check("Analytics 30 Days", "Dashboard renders finite metrics and chart", "/admin/analytics?range=30d"),
])}

- NaN present: ${browser.analytics?.nanPresent === false ? "no" : "not verified"}
- Infinity present: ${browser.analytics?.infinityPresent === false ? "no" : "not verified"}
- Chart rendered: ${browser.analytics?.chartRendered ? "yes" : "not verified"}
- Top products rendered: ${browser.analytics?.topProductsRendered ? "yes" : "not verified"}
- Channel breakdown rendered: ${browser.analytics?.contactBreakdownRendered ? "yes" : "not verified"}
- Order-status breakdown rendered: ${browser.analytics?.orderStatusBreakdownRendered ? "yes" : "not verified"}
- Custom range: not tested in this run
- PAGE_VIEW: ${markdown(metrics.PAGE_VIEW ?? "not verified")}
- PRODUCT_VIEW: ${markdown(metrics.PRODUCT_VIEW ?? "not verified")}
- CONTACT_CLICK: ${markdown(metrics.CONTACT_CLICK ?? "not verified")}
- ORDER_INTENT: ${markdown(metrics.ORDER_INTENT ?? "not verified")}
- ORDER_SUBMITTED: ${markdown(metrics.ORDER_SUBMITTED ?? "not verified")}
- COMPLETED orders: ${markdown(database.completedOrderCount ?? "not verified")}
- Product View → Intent: ${markdown(percentage(metrics.ORDER_INTENT ?? 0, metrics.PRODUCT_VIEW ?? 0))}
- Intent → Submitted: ${markdown(percentage(metrics.ORDER_SUBMITTED ?? 0, metrics.ORDER_INTENT ?? 0))}

## Responsive Verification

${responsive.length ? responsive.map((item) => `### ${item.viewport}\n\n- Pages checked: ${markdown(item.pages.join(", "))}\n- Horizontal overflow: ${item.horizontalOverflow ? "yes" : "no"}\n- Key controls visible: ${item.controlsVisible ? "yes" : "no"}\n- Chart/container overflow: ${item.chartOverflow ? "yes" : "no"}\n- Major layout issue: ${item.layoutIssue ? "yes" : "no"}`).join("\n\n") : "BLOCKED — authenticated responsive checks were not executed."}

## Production Mutation Verification

${mutation.attempted ? `Status: ${markdown(report.mutation)}\n\n${resultRows(mutationRows)}\n\nTemporary records are identified internally and are not printed in this report.` : "Status: BLOCKED\n\nReason: `RUN_RELEASE_MUTATION_TESTS was not enabled.`\n\nUnexecuted scenarios: settings revalidation, temporary order flow, duplicate protection, Admin status workflow, and exact-ID cleanup."}

${mutation.attempted ? `### Settings Mutation Diagnostics

- Product selected: ${markdown(mutation.settingsDiagnostics?.productSlug ?? "not recorded")}
- Public route: ${markdown(mutation.settingsDiagnostics?.publicRoute ?? "not recorded")}
- Original rate recorded: ${markdown(mutationStatus(mutation.originalRateRecorded))}
- Temporary rate applied: ${markdown(mutationStatus(mutation.temporaryRateApplied))}
- USD before (cents): ${safeNumeric(mutation.settingsDiagnostics?.usdBefore)}
- USD after (cents): ${safeNumeric(mutation.settingsDiagnostics?.usdAfter)}
- Expected SYP before: ${safeNumeric(mutation.settingsDiagnostics?.expectedSypBefore)}
- Observed SYP before: ${safeNumeric(mutation.settingsDiagnostics?.observedSypBefore)}
- Expected SYP after: ${safeNumeric(mutation.settingsDiagnostics?.expectedSypAfter)}
- Observed SYP after: ${safeNumeric(mutation.settingsDiagnostics?.observedSypAfter)}
- Route reloaded after mutation: ${mutation.settingsDiagnostics?.routeReloadedAfterMutation ? "yes" : "no"}
- Revalidation observed: ${mutation.settingsDiagnostics?.revalidationObserved ? "yes" : "no"}
- Restoration verified: ${mutation.settingsDiagnostics?.restorationVerified ? "yes" : "no"}` : ""}

${mutation.attempted ? `### Order Status Mutation Diagnostics

| Check | UI | DB | Timestamp | Preserved | Result |
| --- | --- | --- | --- | --- | --- |
${(mutation.orderStatusDiagnostics ?? []).map((item) => `| ${markdown(item.check)} | ${markdown(item.ui)} | ${markdown(item.db)} | ${markdown(item.timestamp)} | ${markdown(item.preserved)} | ${markdown(item.result)} |`).join("\n") || "| Not executed | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED |"}` : ""}

## Cleanup

${mutation.attempted ? `${resultRows([
  ["SiteSettings rate restored", mutationStatus(mutation.rateRestored)],
  ["Temporary Order residual", String(mutation.cleanup?.temporaryOrderResidual ?? "not verified")],
  ["Temporary Analytics residual", String(mutation.cleanup?.temporaryAnalyticsResidual ?? "not verified")],
  ["Existing Orders modified", mutation.cleanup?.existingOrdersModified === 0 ? "0" : "not verified"],
])}\n\nCleanup used exact IDs and verifier visitor/session IDs only; no wildcard cleanup was used.` : "BLOCKED — mutation guard was disabled, so no temporary Production state was created."}

## Database Verification

- Status: ${markdown(report.checks?.databaseReadOnly ?? "BLOCKED")}
- SiteSettings rows: ${markdown(database.siteSettingsCount ?? "not verified")}
- Existing Orders: ${markdown(database.orderCount ?? "not verified")}
- Analytics rows checked: ${markdown(database.analyticsRowsChecked ?? "not verified")}
- PII metadata violations: ${markdown(database.piiMetadataViolations ?? "not verified")}

## Cloudinary

Status: BLOCKED

Reason: Dedicated Cloudinary verifier/fix intentionally deferred. This is a separate release gate and was not tested here.

## Release Security Blockers

- Historical Neon/database credentials require rotation before final launch.
- Historical Cloudinary API credentials require rotation before final launch.
- Git history cleanup remains pending.

These are release-security actions, distinct from application functional failures.

${failures.length ? `## Failures\n\n${failures.map((failure) => `- ${markdown(failure)}`).join("\n")}` : "## Failures\n\nNone recorded."}

## Blocked Checks

${blockers.length ? blockers.map((blocker) => `- ${markdown(blocker)}`).join("\n") : "None."}

## Final Decision

Overall: **${markdown(report.status)}**

${report.status === "PASS" ? "All required checks for the selected mode executed successfully." : report.status === "FAIL" ? "At least one executed check failed; address the failure and rerun this verifier." : "At least one required Production capability was not safely executed. Resolve the listed blockers and rerun the verifier."}

### Next Command

\`npm run verify:release\`
`;
}

export async function writeReport(root, report) {
  const directory = path.join(root, "artifacts", "verification");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "release-latest.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await writeFile(path.join(directory, "release-latest.md"), createMarkdownReport(report), "utf8");
}

export function finalStatus({ staticStatus, readOnlyStatus, mutationStatus, cleanupStatus }) {
  if ([staticStatus, readOnlyStatus, mutationStatus, cleanupStatus].includes(Status.FAIL)) return Status.FAIL;
  if ([staticStatus, readOnlyStatus].includes(Status.BLOCKED)) return Status.BLOCKED;
  return Status.PASS;
}

function promptTerminal(question, { masked, input = process.stdin, output = process.stdout } = {}) {
  if (!input.isTTY || typeof input.setRawMode !== "function") return Promise.resolve(undefined);

  return new Promise((resolve, reject) => {
    let value = "";
    let settled = false;
    const wasRaw = input.isRaw === true;

    const restore = () => {
      input.off("data", onData);
      input.off("error", onError);
      process.off("SIGINT", onSignal);
      try {
        input.setRawMode(wasRaw);
      } catch {
        // A closing terminal cannot be restored; never mask the original error.
      }
      input.pause();
    };

    const finish = (result) => {
      if (settled) return;
      settled = true;
      restore();
      output.write("\n");
      resolve(result || undefined);
    };

    const onError = (error) => {
      if (settled) return;
      settled = true;
      restore();
      reject(error);
    };

    const onSignal = () => finish(undefined);

    const onData = (chunk) => {
      for (const character of String(chunk)) {
        if (character === "\u0003") {
          finish(undefined);
          return;
        }
        if (character === "\r" || character === "\n") {
          finish(value);
          return;
        }
        if (character === "\u007f" || character === "\b") {
          if (value) {
            value = value.slice(0, -1);
            if (!masked) output.write("\b \b");
          }
          continue;
        }
        if (character >= " " && character !== "\u007f") {
          value += character;
          if (!masked) output.write(character);
        }
      }
    };

    try {
      output.write(question);
      input.setRawMode(true);
      input.resume();
      input.on("data", onData);
      input.once("error", onError);
      process.once("SIGINT", onSignal);
    } catch (error) {
      onError(error);
    }
  });
}

export function promptVisible(question, streams) {
  return promptTerminal(question, { masked: false, ...streams });
}

export function promptHidden(question, streams) {
  return promptTerminal(question, { masked: true, ...streams });
}
