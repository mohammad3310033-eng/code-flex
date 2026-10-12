import { randomUUID } from "node:crypto";

export const cloudinaryGuard = "YES_I_UNDERSTAND";
export const maxImages = 8;
export const requiredDropEvents = Object.freeze(["dragenter", "dragover", "drop"]);
export function verifierFixtureNames(runId) {
  return [`release-verifier-${runId}-one.png`, `release-verifier-${runId}-two.png`];
}
export function hasExpectedPickerSelection({ fileCount, fileNames, fixtures }) {
  return fileCount === 2 && Array.isArray(fileNames) && fileNames.length === 2 && fileNames.every((name, index) => name === fixtures[index]);
}
export function pickerSelectionOutcome({ changeFileCount, changeFileNames, postHandlerFileCount, fixtures, batchVisible }) {
  const changeEventMatches = hasExpectedPickerSelection({ fileCount: changeFileCount, fileNames: changeFileNames, fixtures });
  return {
    changeEventMatches,
    inputResetDetected: changeFileCount > 0 && postHandlerFileCount === 0,
    batchVisible: batchVisible === true,
    accepted: changeEventMatches && batchVisible === true,
  };
}
export function isHydratedActiveImageInput({ matchingCount, connected, disabled, hydrated, type, testId }) {
  return matchingCount === 1 && connected && !disabled && hydrated && type === "file" && testId === "product-image-file-input";
}
export function pickerEventPathComplete(events) {
  return ["inputCapture", "inputBubble", "changeCapture", "changeBubble"].every((name) => events[name] === true);
}
export function planUpload(existingCount, files) {
  let remaining = Math.max(0, maxImages - existingCount);
  return files.map((file) => {
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) return { ...file, accepted: false, reason: "unsupported" };
    if (file.bytes > 10 * 1024 * 1024) return { ...file, accepted: false, reason: "too_large" };
    if (remaining-- <= 0) return { ...file, accepted: false, reason: "capacity" };
    return { ...file, accepted: true };
  });
}
export function normalizeOrder(images, movingId, beforeId) {
  const moving = images.find((image) => image.id === movingId);
  const remaining = images.filter((image) => image.id !== movingId);
  const index = remaining.findIndex((image) => image.id === beforeId);
  return !moving || index < 0 ? images : [...remaining.slice(0, index), moving, ...remaining.slice(index)];
}
export const requiredGuardedSections = ["multiUpload", "dragDropUpload", "persistence", "adminRendering", "storefrontRendering", "reorder", "deleteChecks", "fallback", "noRedeploy", "cleanup"];
export function guardedFinalStatus(report) {
  if ((report.failures ?? []).length > 0) return "FAIL";
  const checks = requiredGuardedSections.flatMap((section) => report[section] ?? []);
  if (checks.some((check) => check.status === "FAIL")) return "FAIL";
  if (checks.length === 0 || checks.some((check) => check.status !== "PASS")) return "BLOCKED";
  return "PASS";
}
export function requiredBlockedSummaries(report) {
  const labels = {
    multiUpload: "Multi-upload",
    dragDropUpload: "Drag & Drop Upload",
    persistence: "Upload Persistence",
    adminRendering: "Admin Rendering",
    storefrontRendering: "Storefront Rendering",
    reorder: "Reorder",
    deleteChecks: "Delete",
    fallback: "No-image Fallback",
    noRedeploy: "No-Redeploy Verification",
    cleanup: "Cleanup",
  };
  return requiredGuardedSections.flatMap((section) => {
    const checks = report[section] ?? [];
    if (checks.length === 0) return [`${labels[section]}: not executed`];
    return checks.filter((check) => check.status === "BLOCKED").map((check) => `${labels[section]}: ${check.name}`);
  });
}
export function finalizeUploadEvidence(files) {
  return files.map((file) => ({
    selected: Boolean(file.selected),
    signatureRequestObserved: Boolean(file.signatureRequestObserved),
    signatureResponseStatus: Number.isInteger(file.signatureResponseStatus) ? file.signatureResponseStatus : undefined,
    cloudinaryUploadStarted: Boolean(file.cloudinaryUploadStarted),
    cloudinaryUploadResponseStatus: Number.isInteger(file.cloudinaryUploadResponseStatus) ? file.cloudinaryUploadResponseStatus : undefined,
    cloudinaryUploadSucceeded: Boolean(file.cloudinaryUploadSucceeded),
    persistenceSaveAttemptObserved: Boolean(file.persistenceSaveAttemptObserved),
    productImagePersisted: Boolean(file.productImagePersisted),
    queueState: ["QUEUED", "UPLOADING", "SAVING", "SUCCESS", "FAILED", "NOT_OBSERVED"].includes(file.queueState) ? file.queueState : "NOT_OBSERVED",
    failureCategory: file.productImagePersisted ? undefined : !file.selected ? "UI_SELECTION_NOT_OBSERVED" : !file.signatureRequestObserved ? "SIGNATURE_REQUEST_NOT_OBSERVED" : !file.cloudinaryUploadStarted ? "CLOUDINARY_UPLOAD_NOT_STARTED" : !file.cloudinaryUploadSucceeded ? "CLOUDINARY_UPLOAD_FAILED" : !file.persistenceSaveAttemptObserved ? "PERSISTENCE_SAVE_NOT_OBSERVED" : "PRODUCT_IMAGE_NOT_PERSISTED",
  }));
}
export function isVerifierPublicId(productId, runId, publicId) {
  return publicId === `code-flex/products/${productId}/release-verifier-${runId}`;
}
export function exactOwnedImages(images, productId, runId) {
  return images.filter((image) => isVerifierPublicId(productId, runId, image.publicId));
}
export function fixtureMetadata(runId = randomUUID()) {
  return { name: `release-verifier-${runId}.png`, type: "image/png", bytes: 68 };
}
export function cloudinaryReport({ runId, mutationEnabled, configuration = "BLOCKED", detail = "Cloudinary mutation guard not enabled" }) {
  return { runId, status: "BLOCKED", configuration, mutation: "BLOCKED", cleanup: "BLOCKED", failures: [], blockers: [detail], execution: { mutationGuardEnabled: mutationEnabled } };
}
