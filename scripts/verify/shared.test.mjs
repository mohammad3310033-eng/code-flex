import assert from "node:assert/strict";
import test from "node:test";

import { safeNumeric, sanitize } from "./shared.mjs";

test("safe numeric diagnostics preserve SYP amounts, timestamps, and run IDs", () => {
  assert.equal(safeNumeric(17_501_275), "17501275");
  assert.equal(sanitize("2026-09-22T03:22:47.010Z run-20260922"), "2026-09-22T03:22:47.010Z run-20260922");
});

test("free text continues to redact phones, credentials, and tokens", () => {
  assert.match(sanitize("phone +15550100000"), /\[REDACTED_PHONE\]/u);
  assert.match(sanitize("token=secret-value"), /token=\[redacted\]/u);
});
