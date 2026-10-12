import assert from "node:assert/strict";
import test from "node:test";
import { exactOwnedImages, finalizeUploadEvidence, fixtureMetadata, guardedFinalStatus, hasExpectedPickerSelection, isHydratedActiveImageInput, isVerifierPublicId, normalizeOrder, pickerEventPathComplete, pickerSelectionOutcome, planUpload, requiredBlockedSummaries, requiredDropEvents, requiredGuardedSections, verifierFixtureNames } from "./cloudinary.mjs";
test("recognizes only exact verifier-owned public IDs", () => { assert.equal(isVerifierPublicId("p", "r", "code-flex/products/p/release-verifier-r"), true); assert.equal(isVerifierPublicId("p", "r", "code-flex/products/p/other"), false); assert.equal(exactOwnedImages([{ publicId: "code-flex/products/p/release-verifier-r" }, { publicId: "code-flex/products/p/other" }], "p", "r").length, 1); });
test("fixture metadata is a tiny supported image", () => { const fixture = fixtureMetadata("r"); assert.equal(fixture.type, "image/png"); assert.ok(fixture.bytes < 10 * 1024 * 1024); });
test("multi-upload plans capacity and preserves selected order", () => { const plan = planUpload(6, [{ name: "one.jpg", type: "image/jpeg", bytes: 1 }, { name: "bad.gif", type: "image/gif", bytes: 1 }, { name: "two.png", type: "image/png", bytes: 1 }, { name: "three.webp", type: "image/webp", bytes: 1 }]); assert.deepEqual(plan.map((item) => [item.name, item.accepted, item.reason]), [["one.jpg", true, undefined], ["bad.gif", false, "unsupported"], ["two.png", true, undefined], ["three.webp", false, "capacity"]]); });
test("two-file picker and drag/drop fixtures retain deterministic entry order", () => {
  const fixtures = verifierFixtureNames("run");
  assert.equal(hasExpectedPickerSelection({ fileCount: 2, fileNames: fixtures, fixtures }), true);
  assert.equal(hasExpectedPickerSelection({ fileCount: 2, fileNames: [...fixtures].reverse(), fixtures }), false);
  assert.deepEqual(requiredDropEvents, ["dragenter", "dragover", "drop"]);
});
test("an intentional post-handler input reset does not invalidate a captured picker selection", () => {
  const fixtures = verifierFixtureNames("run");
  const accepted = pickerSelectionOutcome({ changeFileCount: 2, changeFileNames: fixtures, postHandlerFileCount: 0, fixtures, batchVisible: true });
  assert.equal(accepted.changeEventMatches, true);
  assert.equal(accepted.inputResetDetected, true);
  assert.equal(accepted.accepted, true);
  assert.equal(pickerSelectionOutcome({ changeFileCount: 2, changeFileNames: fixtures, postHandlerFileCount: 0, fixtures, batchVisible: false }).accepted, false);
});
test("requires the one hydrated active uploader input and a complete event path", () => {
  assert.equal(isHydratedActiveImageInput({ matchingCount: 1, connected: true, disabled: false, hydrated: true, type: "file", testId: "product-image-file-input" }), true);
  assert.equal(isHydratedActiveImageInput({ matchingCount: 2, connected: true, disabled: false, hydrated: true, type: "file", testId: "product-image-file-input" }), false);
  assert.equal(pickerEventPathComplete({ inputCapture: true, inputBubble: true, changeCapture: true, changeBubble: true }), true);
  assert.equal(pickerEventPathComplete({ inputCapture: true, inputBubble: false, changeCapture: true, changeBubble: true }), false);
});
test("drag reorder normalizes a contiguous UI order", () => { assert.deepEqual(normalizeOrder([{ id: "a" }, { id: "b" }, { id: "c" }], "c", "a").map((item) => item.id), ["c", "a", "b"]); });
test("guarded report status can never pass with failures or blocked lifecycle checks", () => {
  const passed = Object.fromEntries(requiredGuardedSections.map((section) => [section, [{ status: "PASS" }]]));
  assert.equal(guardedFinalStatus({ ...passed, failures: [] }), "PASS");
  assert.equal(guardedFinalStatus({ ...passed, failures: ["persistence failed"] }), "FAIL");
  assert.equal(guardedFinalStatus({ ...passed, persistence: [{ status: "BLOCKED" }], failures: [] }), "BLOCKED");
  assert.equal(guardedFinalStatus({ failures: [] }), "BLOCKED");
});
test("upload evidence reports only sanitized lifecycle facts", () => {
  const [first, second] = finalizeUploadEvidence([
    { selected: true, signatureRequestObserved: true, cloudinaryUploadStarted: true, cloudinaryUploadSucceeded: true, persistenceSaveAttemptObserved: true, productImagePersisted: true },
    { selected: true, signatureRequestObserved: true, cloudinaryUploadStarted: true, cloudinaryUploadSucceeded: true },
  ]);
  assert.equal(first.failureCategory, undefined);
  assert.equal(second.failureCategory, "PERSISTENCE_SAVE_NOT_OBSERVED");
  assert.equal(Object.hasOwn(first, "publicId"), false);
});
test("required guarded blocked checks are included in the report summary", () => {
  const summaries = requiredBlockedSummaries({ multiUpload: [{ name: "Picker", status: "PASS" }], persistence: [{ name: "Persistence", status: "BLOCKED" }] });
  assert.ok(summaries.includes("Upload Persistence: Persistence"));
  assert.ok(summaries.includes("Admin Rendering: not executed"));
  assert.equal(summaries.some((summary) => summary.includes("Multi-upload")), false);
});
