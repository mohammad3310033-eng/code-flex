import path from "node:path";
import process from "node:process";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";

import { runBrowserReadOnly, runGuardedMutations } from "./verify/browser.mjs";
import { persistInteractiveCredentialsAfterAuthentication, resolveVerifierCredentials } from "./verify/credentials.mjs";
import { createVerifierDatabase, verifyReadOnlyDatabase } from "./verify/database.mjs";
import { Progress, Status, finalStatus, promptHidden, promptVisible, runCommand, safeTarget, sanitize, writeReport } from "./verify/shared.mjs";

const root = path.resolve(import.meta.dirname, "..");
const staticOnly = process.argv.includes("--static-only");
const mutationEnabled = process.env.RUN_RELEASE_MUTATION_TESTS === "YES_I_UNDERSTAND";
const cloudinaryBlocker = "Deferred pending dedicated Cloudinary verifier/fix";

async function runStaticVerification() {
  const executable = process.execPath;
  const commands = [
    ["Prisma Validate", "npm exec prisma -- validate", executable, [path.join(root, "node_modules", "prisma", "build", "index.js"), "validate"]],
    ["Prisma Generate", "npm exec prisma -- generate", executable, [path.join(root, "node_modules", "prisma", "build", "index.js"), "generate"]],
    ["TypeScript", "npx tsc --noEmit", executable, [path.join(root, "node_modules", "typescript", "bin", "tsc"), "--noEmit"]],
    ["ESLint", "npm run lint", executable, [path.join(root, "node_modules", "eslint", "bin", "eslint.js"), "."]],
    ["Production Build", "npm run build", executable, [path.join(root, "node_modules", "next", "dist", "bin", "next"), "build"]],
    ["git diff --check", "git diff --check", "git", ["diff", "--check"]],
  ];
  const checks = [];
  for (const [name, displayCommand, command, args] of commands) {
    console.log(`  Static subcheck: ${name} START`);
    const result = await runCommand(command, args, { cwd: root });
    if (result.code !== 0) {
      checks.push({ name, command: displayCommand, status: Status.FAIL, summary: sanitize(result.output) || "Command returned a non-zero exit code" });
      return { status: Status.FAIL, detail: `${name} failed: ${sanitize(result.output)}`, checks };
    }
    checks.push({ name, command: displayCommand, status: Status.PASS, summary: "Completed successfully" });
    console.log(`  Static subcheck: ${name} PASS`);
  }
  return { status: Status.PASS, detail: "Prisma, TypeScript, ESLint, build, and git whitespace checks passed", checks };
}

async function getGitCommit() {
  const result = await runCommand("git", ["rev-parse", "--short", "HEAD"], { cwd: root, timeoutMs: 10_000 });
  return result.code === 0 ? result.output.trim() : "Unavailable";
}

function createRunId() {
  return `${new Date().toISOString().replace(/[-:.]/gu, "").replace("Z", "Z")}-${randomBytes(3).toString("hex")}`;
}

function terminalSummary(report) {
  console.log(`Verification status: ${report.status}`);
  console.log("JSON report: artifacts/verification/release-latest.json");
  console.log("Markdown report: artifacts/verification/release-latest.md");
  console.log(`Next action: ${report.status === Status.PASS ? "Review the report and proceed with the release decision." : "Run npm run verify:release with the required safe inputs, then resolve any listed failures or blockers."}`);
}

export async function resolveCredentials({
  environment = process.env,
  interactive = process.stdin.isTTY,
  askEmail = promptVisible,
  askPassword = promptHidden,
  rootDirectory = root,
  loadCache,
  notify = console.log,
} = {}) {
  return resolveVerifierCredentials({ environment, interactive, askEmail, askPassword, rootDirectory, loadCache, notify });
}

export async function getCredentials(options) {
  return (await resolveCredentials(options)).credentials;
}

async function productionPreflight(target) {
  try {
    const response = await fetch(`${target}/`, { redirect: "follow", signal: AbortSignal.timeout(30_000) });
    if (!response.ok) return { status: Status.FAIL, detail: `GET / returned HTTP ${response.status}` };
    return { status: Status.PASS, detail: "target responded successfully" };
  } catch (error) {
    return { status: Status.BLOCKED, detail: `target preflight could not run: ${sanitize(error instanceof Error ? error.message : error)}` };
  }
}

function combine(...statuses) {
  if (statuses.includes(Status.FAIL)) return Status.FAIL;
  if (statuses.includes(Status.BLOCKED)) return Status.BLOCKED;
  return Status.PASS;
}

function browserCheckStatus(browser, names, fallback = Status.BLOCKED) {
  const checks = browser.observations?.checks ?? [];
  const statuses = checks.filter((check) => names.some((name) => typeof name === "string" ? check.name === name : name.test(check.name))).map((check) => check.status);
  return statuses.length ? combine(...statuses) : fallback;
}

async function main() {
  const runId = createRunId();
  const timestamp = new Date().toISOString();
  let target;
  try {
    target = safeTarget(process.env.TEST_BASE_URL || "https://code-flex-orcin.vercel.app");
  } catch (error) {
    const report = {
      runId,
      timestamp,
      status: Status.BLOCKED,
      target: "Invalid TEST_BASE_URL",
      static: Status.BLOCKED,
      productionReadOnly: Status.BLOCKED,
      mutation: Status.BLOCKED,
      cleanup: Status.BLOCKED,
      cloudinary: Status.BLOCKED,
      releaseSecurityBlocker: "exposed historical credentials still require rotation before launch",
      execution: { adminCredentialsAvailable: false, mutationGuardEnabled: mutationEnabled, browser: "Not executed", database: "Not executed", cloudinary: "Deferred" },
      staticChecks: [],
      preflight: { status: Status.BLOCKED, detail: "Invalid target" },
      observations: { browser: { checks: [] }, database: {}, mutation: { attempted: false } },
      checks: {},
      failures: [],
      blockers: [`Invalid target: ${sanitize(error instanceof Error ? error.message : error)}`],
    };
    await writeReport(root, report);
    terminalSummary(report);
    process.exitCode = 2;
    return;
  }
  console.log(`Target: ${target}`);
  const progress = new Progress(staticOnly ? 2 : 6);
  const gitCommit = await getGitCommit();
  const staticResult = await progress.step("Static verification", runStaticVerification);

  const report = {
    runId,
    timestamp,
    status: Status.BLOCKED,
    target,
    gitCommit,
    static: staticResult.status,
    productionReadOnly: Status.BLOCKED,
    mutation: Status.BLOCKED,
    cleanup: Status.BLOCKED,
    cloudinary: Status.BLOCKED,
    releaseSecurityBlocker: "exposed historical credentials still require rotation before launch",
    execution: {
      adminCredentialsAvailable: false,
      mutationGuardEnabled: mutationEnabled,
      browser: "Not executed",
      database: "Not executed",
      cloudinary: "Deferred",
    },
    staticChecks: staticResult.checks ?? [],
    preflight: { status: Status.BLOCKED, detail: "Not executed" },
    observations: { browser: { checks: [] }, database: {}, mutation: { attempted: false } },
    checks: {
      publicStorefront: Status.BLOCKED,
      adminAuth: Status.BLOCKED,
      products: Status.BLOCKED,
      ordersReadOnly: Status.BLOCKED,
      settingsReadOnly: Status.BLOCKED,
      analytics: Status.BLOCKED,
      responsive: Status.BLOCKED,
      databaseReadOnly: Status.BLOCKED,
    },
    failures: progress.failures,
    blockers: progress.blockers,
  };

  if (staticOnly) {
    report.status = staticResult.status;
    report.blockers.push("Production verification intentionally skipped by --static-only");
    report.blockers.push(`Cloudinary: ${cloudinaryBlocker}`);
    await progress.step("Write sanitized report", async () => {
      await writeReport(root, report);
      return { status: Status.PASS, detail: "report written" };
    });
    terminalSummary(report);
    process.exitCode = report.status === Status.PASS ? 0 : 1;
    return;
  }

  const preflight = await progress.step("Production preflight", () => productionPreflight(target));
  report.preflight = preflight;
  const prisma = createVerifierDatabase();
  const database = await progress.step("Production database read-only verification", async () => {
    if (!prisma) return { status: Status.BLOCKED, detail: "DATABASE_URL is required for production database verification" };
    return verifyReadOnlyDatabase(prisma);
  });
  report.checks.databaseReadOnly = database.status;
  report.observations.database = database.snapshot ?? {};
  report.execution.database = database.status === Status.PASS ? "AVAILABLE" : "UNAVAILABLE";

  const credentialResolution = await resolveCredentials();
  const credentials = credentialResolution.credentials;
  report.execution.adminCredentialsAvailable = Boolean(credentials);
  report.execution.credentialSource = credentialResolution.source;
  const browser = await progress.step("Headless Production browser verification", () => runBrowserReadOnly({ target, credentials, root }));
  report.observations.browser = browser.observations ?? { checks: [] };
  report.execution.browser = browser.observations?.engine ? `${browser.observations.engine} / Playwright headless` : "Not available";
  const browserDetail = browser.detail ?? "";
  report.checks.publicStorefront = browserCheckStatus(browser, ["Arabic Homepage", "Arabic Products", "English Homepage", "English Products", "Product Detail"], browserDetail.startsWith("public browser checks passed") ? Status.PASS : browser.status);
  const authenticated = (browser.observations?.checks ?? []).some((check) => check.name === "Admin Login" && check.status === Status.PASS);
  report.checks.adminAuth = credentials ? browserCheckStatus(browser, ["Unauthenticated Admin", "Admin Login", "Authenticated Dashboard", "Session Persistence", "Logout", "Post-logout Protection"], authenticated ? Status.BLOCKED : browser.status) : Status.BLOCKED;
  report.checks.products = credentials ? browserCheckStatus(browser, ["Products Page", "Products Filters", "Filter Navigation", "Zero Results", "admin_products_no_document_overflow"]) : Status.BLOCKED;
  report.checks.ordersReadOnly = credentials ? browserCheckStatus(browser, ["Orders Page", "Order Detail"]) : Status.BLOCKED;
  report.checks.settingsReadOnly = credentials ? browserCheckStatus(browser, ["Settings Page", "Contact, Social, and Hero Fields"]) : Status.BLOCKED;
  report.checks.analytics = credentials ? browserCheckStatus(browser, ["Analytics Today", "Analytics 7 Days", "Analytics 30 Days"]) : Status.BLOCKED;
  report.checks.responsive = credentials ? browserCheckStatus(browser, [/^Responsive /u]) : Status.BLOCKED;
  report.productionReadOnly = combine(preflight.status, database.status, browser.status);

  let mutation = { status: Status.BLOCKED, detail: "Mutation guard not enabled" };
  if (mutationEnabled) {
    mutation = await progress.step("Guarded Production mutation verification", async () => {
      if (!prisma) return { status: Status.BLOCKED, detail: "DATABASE_URL is required for guarded mutation verification" };
      return runGuardedMutations({ target, credentials, prisma });
    });
  } else {
    const skipped = await progress.step("Guarded Production mutation verification", async () => mutation);
    mutation = skipped;
  }
  report.mutation = mutation.status;
  report.observations.mutation = mutation.observations ?? { attempted: mutationEnabled };
  const provenAdminAuthentication = authenticated || mutation.observations?.adminAuthenticated === true;
  if (provenAdminAuthentication && credentialResolution.source === "interactive") {
    const cacheResult = await persistInteractiveCredentialsAfterAuthentication({ authenticated: true, source: credentialResolution.source, rootDirectory: root, credentials });
    if (cacheResult.warning) {
      console.log(`Warning: ${cacheResult.warning}`);
      report.execution.credentialCacheWarning = cacheResult.warning;
    }
  }
  report.cleanup = mutationEnabled
    ? mutation.cleanup
      ? mutation.cleanup.settingsRestored && mutation.cleanup.temporaryOrderResidual === 0 && mutation.cleanup.temporaryAnalyticsResidual === 0
        ? Status.PASS
        : Status.FAIL
      : Status.BLOCKED
    : Status.BLOCKED;
  report.cloudinary = Status.BLOCKED;
  report.blockers.push(`Cloudinary: ${cloudinaryBlocker}`);
  if (!mutationEnabled) report.blockers.push("Mutation guard not enabled");

  report.status = finalStatus({
    staticStatus: report.static,
    readOnlyStatus: report.productionReadOnly,
    mutationStatus: report.mutation,
    cleanupStatus: report.cleanup,
  });
  if (!mutationEnabled && report.status === Status.BLOCKED && ![Status.FAIL, Status.BLOCKED].includes(report.productionReadOnly)) report.status = Status.PASS;
  report.failures = progress.failures;
  report.blockers = [...new Set([...report.blockers, ...progress.blockers])];

  await progress.step("Write sanitized report", async () => {
    await writeReport(root, report);
    return { status: Status.PASS, detail: "report written" };
  });
  await prisma?.$disconnect();
  terminalSummary(report);
  process.exitCode = report.status === Status.PASS ? 0 : report.status === Status.BLOCKED ? 2 : 1;
}

async function reportUnexpectedFailure(error) {
  const report = {
    runId: createRunId(),
    timestamp: new Date().toISOString(),
    status: Status.FAIL,
    target: "Unavailable after verifier error",
    static: Status.BLOCKED,
    productionReadOnly: Status.BLOCKED,
    mutation: Status.BLOCKED,
    cleanup: Status.BLOCKED,
    cloudinary: Status.BLOCKED,
    releaseSecurityBlocker: "exposed historical credentials still require rotation before launch",
    execution: { adminCredentialsAvailable: false, mutationGuardEnabled: mutationEnabled, browser: "Not executed", database: "Not executed", cloudinary: "Deferred" },
    staticChecks: [],
    preflight: { status: Status.BLOCKED, detail: "Verifier error" },
    observations: { browser: { checks: [] }, database: {}, mutation: { attempted: false } },
    checks: {},
    failures: [sanitize(error instanceof Error ? error.message : error)],
    blockers: [],
  };
  await writeReport(root, report).catch(() => undefined);
  terminalSummary(report);
  process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(reportUnexpectedFailure);
}
