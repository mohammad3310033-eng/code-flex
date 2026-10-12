import assert from "node:assert/strict";
import test from "node:test";

import { moveProductImageByDirection, normalizeProductImageOrder, planProductImageUploads } from "../../src/lib/admin-image-upload";

test("validates each selected image while preserving valid selected order", () => {
  const plan = planProductImageUploads(5, [
    { id: "a", name: "a.jpg", type: "image/jpeg", size: 1 },
    { id: "b", name: "b.gif", type: "image/gif", size: 1 },
    { id: "c", name: "c.png", type: "image/png", size: 1 },
    { id: "d", name: "d.webp", type: "image/webp", size: 1 },
  ]);
  assert.deepEqual(plan.map((item) => [item.id, item.accepted, item.rejection]), [["a", true, undefined], ["b", false, "unsupported"], ["c", true, undefined], ["d", true, undefined]]);
});

test("enforces the total eight-image limit and normalizes drag order", () => {
  assert.equal(planProductImageUploads(8, [{ id: "a", name: "a.jpg", type: "image/jpeg", size: 1 }])[0]?.rejection, "capacity");
  const images = [{ id: "one" }, { id: "two" }, { id: "three" }];
  assert.deepEqual(normalizeProductImageOrder(images, "three", "one").map((item) => item.id), ["three", "one", "two"]);
  assert.deepEqual(moveProductImageByDirection(images, "two", "up").map((item) => item.id), ["two", "one", "three"]);
});
