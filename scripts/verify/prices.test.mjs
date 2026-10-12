import assert from "node:assert/strict";
import test from "node:test";

import { calculateExpectedSyp, parseDisplayedSyp, parseDisplayedUsdCents } from "./prices.mjs";

test("parses USD price displays into cents", () => {
  assert.equal(parseDisplayedUsdCents("$1,399.99"), 139999);
  assert.equal(parseDisplayedUsdCents("USD 1,400"), 140000);
  assert.equal(parseDisplayedUsdCents("invalid"), undefined);
});

test("parses SYP displays across supported numeral and grouping forms", () => {
  assert.equal(parseDisplayedSyp("SYP 17,501,275"), 17501275);
  assert.equal(parseDisplayedSyp("١٧٬٥٠١٬٢٧٥ ل.س"), 17501275);
  assert.equal(parseDisplayedSyp("invalid"), undefined);
});

test("calculates SYP with the storefront rounding rule", () => {
  assert.equal(calculateExpectedSyp(139999, 12500), 17499875);
  assert.equal(calculateExpectedSyp(139999, 12501), 17501275);
});
