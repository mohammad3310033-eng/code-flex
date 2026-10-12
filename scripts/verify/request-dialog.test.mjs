import assert from "node:assert/strict";
import test from "node:test";

import { closeSubmittedRequestDialog } from "./request-dialog.mjs";

test("closes the submitted request dialog through its unique verifier selector", async () => {
  const calls = [];
  const page = {
    getByTestId(testId) {
      calls.push({ method: "getByTestId", testId });
      return {
        async waitFor(options) {
          calls.push({ method: "waitFor", options });
        },
        getByTestId(childTestId) {
          calls.push({ method: "getByTestId", testId: childTestId });
          return {
            async click(options) {
              calls.push({ method: "click", options });
            },
          };
        },
      };
    },
  };

  await closeSubmittedRequestDialog(page);

  assert.deepEqual(calls, [
    { method: "getByTestId", testId: "request-dialog-success" },
    { method: "waitFor", options: { state: "visible", timeout: 15_000 } },
    { method: "getByTestId", testId: "request-dialog-close" },
    { method: "click", options: { timeout: 15_000 } },
  ]);
});
