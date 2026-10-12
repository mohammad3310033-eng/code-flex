import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  clearSavedCredentials,
  loadSavedCredentials,
  persistInteractiveCredentialsAfterAuthentication,
  resolveVerifierCredentials,
  saveCredentialsAfterAuthentication,
  savedCredentialsStatus,
} from "./credentials.mjs";
import { createMarkdownReport } from "./shared.mjs";

test("environment credentials take precedence without cache access or prompts", async () => {
  const resolution = await resolveVerifierCredentials({
    environment: { TEST_ADMIN_EMAIL: "admin@example.test", TEST_ADMIN_PASSWORD: "not-a-real-password" },
    interactive: true,
    askEmail: async () => { throw new Error("email prompt should not run"); },
    askPassword: async () => { throw new Error("password prompt should not run"); },
    rootDirectory: "unused",
    loadCache: async () => { throw new Error("cache should not load"); },
    notify: () => undefined,
  });
  assert.equal(resolution.source, "environment");
  assert.equal(resolution.credentials?.email, "admin@example.test");
});

test("saved credentials are used without prompts and announce no values", async () => {
  const output = [];
  const resolution = await resolveVerifierCredentials({
    environment: {},
    interactive: true,
    askEmail: async () => { throw new Error("email prompt should not run"); },
    askPassword: async () => { throw new Error("password prompt should not run"); },
    rootDirectory: "unused",
    loadCache: async () => ({ credentials: { email: "admin@example.test", password: "not-a-real-password" } }),
    notify: (message) => output.push(message),
  });
  assert.equal(resolution.source, "secure-cache");
  assert.deepEqual(output, ["Admin credentials: loaded from secure local cache"]);
});

test("a partial environment configuration prompts only for the missing credential", async () => {
  const prompts = [];
  const resolution = await resolveVerifierCredentials({
    environment: { TEST_ADMIN_EMAIL: "admin@example.test" },
    interactive: true,
    askEmail: async () => { prompts.push("email"); return "unused@example.test"; },
    askPassword: async () => { prompts.push("password"); return "not-a-real-password"; },
    rootDirectory: "unused",
    loadCache: async () => { throw new Error("cache should not load when an environment value is present"); },
    notify: () => undefined,
  });
  assert.equal(resolution.source, "interactive");
  assert.deepEqual(prompts, ["password"]);
});

test("credentials are saved only after interactive authentication succeeds", async () => {
  const credentials = { email: "admin@example.test", password: "not-a-real-password" };
  let saveCalls = 0;
  const saveCache = async () => { saveCalls += 1; return { saved: true }; };
  const rejected = await persistInteractiveCredentialsAfterAuthentication({ authenticated: false, source: "interactive", rootDirectory: "unused", credentials, saveCache });
  assert.equal(rejected.saved, false);
  assert.equal(saveCalls, 0);
  const accepted = await persistInteractiveCredentialsAfterAuthentication({ authenticated: true, source: "interactive", rootDirectory: "unused", credentials, saveCache });
  assert.equal(accepted.saved, true);
  assert.equal(saveCalls, 1);
});

test("credential execution metadata keeps email and password out of JSON and Markdown reports", () => {
  const email = "admin@example.test";
  const password = "not-a-real-password";
  const report = {
    runId: "test-run",
    timestamp: "2026-09-22T00:00:00.000Z",
    status: "PASS",
    target: "https://example.test",
    static: "PASS",
    productionReadOnly: "PASS",
    mutation: "BLOCKED",
    cleanup: "BLOCKED",
    cloudinary: "BLOCKED",
    execution: { adminCredentialsAvailable: true, credentialSource: "secure-cache", mutationGuardEnabled: false, browser: "Not executed", database: "Not executed", cloudinary: "Deferred" },
    staticChecks: [],
    preflight: { status: "PASS", detail: "not relevant" },
    observations: { browser: { checks: [] }, database: {}, mutation: { attempted: false } },
    checks: {},
    failures: [],
    blockers: [],
  };
  assert.equal(JSON.stringify(report).includes(email), false);
  assert.equal(JSON.stringify(report).includes(password), false);
  const markdown = createMarkdownReport(report);
  assert.equal(markdown.includes(email), false);
  assert.equal(markdown.includes(password), false);
});

test("Windows DPAPI cache is encrypted, loadable, and removable", { skip: process.platform !== "win32" }, async () => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "code-flex-credentials-"));
  const credentials = { email: "admin@example.test", password: "not-a-real-password" };
  try {
    const saved = await saveCredentialsAfterAuthentication(temporaryRoot, credentials);
    assert.equal(saved.saved, true, saved.warning);
    assert.equal(await savedCredentialsStatus(temporaryRoot), true);
    const encrypted = await readFile(path.join(temporaryRoot, "artifacts", "verification", ".admin-credentials.enc"), "utf8");
    assert.equal(encrypted.includes(credentials.email), false);
    assert.equal(encrypted.includes(credentials.password), false);
    assert.deepEqual((await loadSavedCredentials(temporaryRoot)).credentials, credentials);
    await clearSavedCredentials(temporaryRoot);
    assert.equal(await savedCredentialsStatus(temporaryRoot), false);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});
