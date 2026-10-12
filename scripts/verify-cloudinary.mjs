import "dotenv/config";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { v2 as cloudinary } from "cloudinary";
import { createVerifierDatabase, waitForDatabase } from "./verify/database.mjs";
import { launchBrowser } from "./verify/browser.mjs";
import { persistInteractiveCredentialsAfterAuthentication, resolveVerifierCredentials } from "./verify/credentials.mjs";
import { cloudinaryGuard, finalizeUploadEvidence, guardedFinalStatus, isHydratedActiveImageInput, pickerEventPathComplete, pickerSelectionOutcome, requiredBlockedSummaries, requiredDropEvents, verifierFixtureNames } from "./verify/cloudinary.mjs";
import { Status, promptHidden, promptVisible, runCommand, safeTarget, sanitize, withTimeout } from "./verify/shared.mjs";

const root = path.resolve(import.meta.dirname, "..");
const target = safeTarget(process.env.TEST_BASE_URL || "https://code-flex-orcin.vercel.app");
const mutationEnabled = process.env.RUN_CLOUDINARY_MUTATION_TESTS === cloudinaryGuard;
const tinyPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL8XQAAAABJRU5ErkJggg==", "base64");

function configured() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  return { cloudNameConfigured: Boolean(cloudName), apiKeyConfigured: Boolean(apiKey), apiSecretConfigured: Boolean(apiSecret), cloudName, apiKey, apiSecret };
}

function markdown(report) {
  const row = (label, status, detail = "") => `| ${label} | ${status} | ${sanitize(detail)} |`;
  const section = (title, entries) => `## ${title}\n\n| Check | Status | Detail |\n| --- | --- | --- |\n${entries.length ? entries.map((entry) => row(entry.name, entry.status, entry.detail)).join("\n") : row("Not executed", "BLOCKED", "Not executed")}`;
  const evidence = (report.uploadEvidence?.files ?? []).map((file, index) => `| ${index + 1} | ${file.selected ? "yes" : "no"} | ${file.queueState ?? "NOT_OBSERVED"} | ${file.signatureRequestObserved ? "yes" : "no"} | ${file.cloudinaryUploadStarted ? `yes (${file.cloudinaryUploadResponseStatus ?? "no status"})` : "no"} | ${file.cloudinaryUploadSucceeded ? "yes" : "no"} | ${file.persistenceSaveAttemptObserved ? "yes" : "no"} | ${file.productImagePersisted ? "yes" : "no"} | ${sanitize(file.failureCategory ?? "none")} |`).join("\n") || "| Not executed | — | — | — | — | — | — | — | BLOCKED |";
  return `# Code Flex — Cloudinary Verification Report

## Summary

- Run ID: ${report.runId}
- Target: ${sanitize(report.target || "Unavailable")}
- Overall: **${report.status}**

## Execution Mode

- Production mutation guard: ${report.execution.mutationGuardEnabled ? "ENABLED" : "DISABLED"}
- Admin credentials: ${report.execution.credentials ? "AVAILABLE" : "UNAVAILABLE"}
- Credential source: ${sanitize(report.execution.credentialSource || "unavailable")}
- Browser: ${sanitize(report.execution.browser || "not launched")}

${section("Baseline", report.baseline)}

${section("Admin Authentication", report.adminAuthentication)}

${section("Cloudinary Configuration", report.configuration)}

${section("Multi-upload", report.multiUpload)}

${section("Drag & Drop Upload", report.dragDropUpload)}

## Picker Event Diagnostics

- Matching file inputs: ${report.uploadEvidence?.picker?.matchingInputCount ?? "not observed"}
- Target connected: ${report.uploadEvidence?.picker?.connected ? "yes" : "no"}
- Target disabled: ${report.uploadEvidence?.picker?.disabled ? "yes" : "no"}
- Target visually hidden: ${report.uploadEvidence?.picker?.visuallyHidden ? "yes" : "no"}
- Hydrated: ${report.uploadEvidence?.picker?.hydrated ? "yes" : "no"}
- Input event capture: ${report.uploadEvidence?.picker?.events?.inputCapture ? "yes" : "no"}
- Input event bubble: ${report.uploadEvidence?.picker?.events?.inputBubble ? "yes" : "no"}
- Change event capture: ${report.uploadEvidence?.picker?.events?.changeCapture ? "yes" : "no"}
- Change event bubble: ${report.uploadEvidence?.picker?.events?.changeBubble ? "yes" : "no"}
- Page error: ${report.uploadEvidence?.picker?.pageError ? "yes" : "no"}
- Page error category: ${sanitize(report.uploadEvidence?.picker?.pageErrorCategory ?? "none")}
- React error UI: ${report.uploadEvidence?.picker?.reactErrorUi ? "yes" : "no"}

## Per-file Upload Evidence

- Picker input found: ${report.uploadEvidence?.picker?.inputFound ? "yes" : "no"}
- Picker multiple enabled: ${report.uploadEvidence?.picker?.multipleEnabled ? "yes" : "no"}
- setInputFiles invoked: ${report.uploadEvidence?.picker?.setInputFilesInvoked ? "yes" : "no"}
- Change-event FileList count: ${report.uploadEvidence?.changeEventFileListCount ?? "not observed"}
- Post-handler input FileList count: ${report.uploadEvidence?.postHandlerFileListCount ?? "not observed"}
- Input reset detected: ${report.uploadEvidence?.inputResetDetected === undefined ? "not observed" : report.uploadEvidence.inputResetDetected ? "yes" : "no"}
- Compact batch state visible: ${report.uploadEvidence?.batchVisible ? "yes" : "no"}

## Drag & Drop Entry Evidence

- Drop zone found: ${report.uploadEvidence?.drop?.found ? "yes" : "no"}
- DataTransfer file count: ${report.uploadEvidence?.drop?.fileCount ?? "not observed"}
- dragenter dispatched: ${report.uploadEvidence?.drop?.dragEnterDispatched ? "yes" : "no"}
- dragover dispatched: ${report.uploadEvidence?.drop?.dragOverDispatched ? "yes" : "no"}
- drop dispatched: ${report.uploadEvidence?.drop?.dropDispatched ? "yes" : "no"}
- Compact batch state visible after drop: ${report.uploadEvidence?.drop?.batchVisible ? "yes" : "no"}
- Upload processing started: ${report.uploadEvidence?.drop?.uploadProcessingStarted ? "yes" : "no"}

| File | Selected | Queue state | Signature request | Cloudinary request/status | Cloudinary success | Persistence attempt | DB row | Safe outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${evidence}

${section("Upload Persistence", report.persistence)}

${section("Admin Rendering", report.adminRendering)}

${section("Storefront Rendering", report.storefrontRendering)}

${section("Reorder", report.reorder)}

${section("Delete", report.deleteChecks)}

${section("No-image Fallback", report.fallback)}

${section("Negative / Ownership Checks", report.negativeChecks)}

${section("No-Redeploy Verification", report.noRedeploy)}

${section("Cleanup", report.cleanup)}

## Historical Orphan Note

Historical manual-test orphan reconciliation: pending. No broad Cloudinary listing or deletion was performed.

## Failures

${report.failures.length ? report.failures.map((failure) => `- ${sanitize(failure)}`).join("\n") : "None."}

## Blocked Checks

${report.blockers.length ? report.blockers.map((blocker) => `- ${sanitize(blocker)}`).join("\n") : "None."}

## Final Decision

**${report.status}**
`;
}

async function writeReport(report) {
  if (report.failures.length > 0 && report.status === Status.PASS) report.status = Status.FAIL;
  if (report.execution.mutationGuardEnabled) {
    const guardedStatus = guardedFinalStatus(report);
    if (guardedStatus === Status.FAIL || (report.status === Status.PASS && guardedStatus !== Status.PASS)) report.status = guardedStatus;
  }
  if (report.execution.mutationGuardEnabled) {
    for (const blocker of requiredBlockedSummaries(report)) {
      if (!report.blockers.includes(blocker)) report.blockers.push(blocker);
    }
  }
  const directory = path.join(root, "artifacts", "verification");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "cloudinary-latest.json"), `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(path.join(directory, "cloudinary-latest.md"), markdown(report));
}

async function adminLogin(page, credentials) {
  await page.goto(`${target}/admin/login`, { waitUntil: "domcontentloaded", timeout: 30_000 });
  if (new URL(page.url()).pathname !== "/admin") {
    await page.locator("#admin-email").fill(credentials.email);
    await page.locator("#admin-password").fill(credentials.password);
    await page.getByRole("button", { name: /^تسجيل الدخول$/u }).click();
    await page.waitForURL((url) => url.pathname === "/admin", { timeout: 30_000 });
  }
}

async function cloudinaryAbsent(publicId) {
  try { await cloudinary.api.resource(publicId, { resource_type: "image" }); return false; } catch (error) { return Number(error?.http_code) === 404; }
}

async function rendersCloudinaryPublicId(locator, publicId) {
  return locator.evaluateAll((images, expectedPublicId) => images.some((image) => {
    const source = image.getAttribute("src") ?? "";
    try { return decodeURIComponent(source).includes(expectedPublicId); } catch { return source.includes(expectedPublicId); }
  }), publicId);
}

async function runGuardedLifecycle(report, prisma, credentials) {
  if (!target || !prisma || !credentials) return { status: Status.BLOCKED, detail: "target, database access, and Admin credentials are required" };
  const config = configured();
  if (!config.cloudName || !config.apiKey || !config.apiSecret) return { status: Status.BLOCKED, detail: "Cloudinary Admin configuration is unavailable" };
  cloudinary.config({ cloud_name: config.cloudName, api_key: config.apiKey, api_secret: config.apiSecret });
  const runId = report.runId;
  const state = { product: undefined, original: [], created: [], uploadedPublicIds: [] };
  const evidence = [{ selected: false }, { selected: false }];
  report.uploadEvidence = { files: evidence, picker: { inputFound: false, multipleEnabled: false, setInputFilesInvoked: false, events: { inputCapture: false, inputBubble: false, changeCapture: false, changeBubble: false }, pageError: false, reactErrorUi: false }, drop: { found: false, dragEnterDispatched: false, dragOverDispatched: false, dropDispatched: false, uploadProcessingStarted: false } };
  const cloudinaryResponseTasks = [];
  let phase = "multiUpload";
  let browser;
  try {
    const product = await prisma.product.findFirst({ where: { isActive: true, images: { none: {} } }, select: { id: true, name: true, slug: true, images: { select: { id: true, publicId: true, sortOrder: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] } }, orderBy: { createdAt: "asc" } });
    if (!product) return { status: Status.BLOCKED, detail: "no active Product without images is available for the complete verifier lifecycle" };
    state.product = product;
    state.original = product.images;
    const launched = await launchBrowser();
    browser = launched.browser;
    report.execution.browser = launched.label;
    const page = await browser.newPage();
    await adminLogin(page, credentials);
    if (!report.adminAuthentication.some((check) => check.name === "Admin login" && check.status === Status.PASS)) report.adminAuthentication.push({ name: "Admin login", status: Status.PASS, detail: "authenticated session established" });
    await page.goto(`${target}/admin/products/${product.id}/edit`, { waitUntil: "domcontentloaded" });
    const input = page.getByTestId("product-image-file-input");
    const dropzone = page.getByTestId("product-image-dropzone");
    const matchingInputCount = await page.locator('input[data-testid="product-image-file-input"][type="file"]').count();
    if (matchingInputCount !== 1 || await input.count() !== 1) throw new Error("active product-image input was not uniquely identified");
    report.uploadEvidence.picker.inputFound = true;
    report.uploadEvidence.picker.matchingInputCount = matchingInputCount;
    await page.waitForFunction(() => document.querySelector('input[data-testid="product-image-file-input"]')?.getAttribute("data-image-uploader-hydrated") === "true", undefined, { timeout: 15_000 });
    const inputIdentity = await input.evaluate((element) => {
      const style = getComputedStyle(element);
      const bounds = element.getBoundingClientRect();
      return {
        connected: element.isConnected,
        disabled: element.disabled,
        visuallyHidden: style.visibility === "hidden" || style.display === "none" || bounds.width === 0 || bounds.height === 0 || style.clip !== "auto" || style.clipPath !== "none",
        hydrated: element.dataset.imageUploaderHydrated === "true",
        type: element.type,
        testId: element.dataset.testid,
        multiple: element.multiple,
      };
    });
    Object.assign(report.uploadEvidence.picker, inputIdentity);
    if (!isHydratedActiveImageInput({ matchingCount: matchingInputCount, ...inputIdentity })) throw new Error("active product-image input was not ready for React interaction");
    if (!inputIdentity.multiple) throw new Error("multi-file input is not enabled");
    report.uploadEvidence.picker.multipleEnabled = true;
    report.multiUpload.push({ name: "Multi-file picker", status: Status.PASS, detail: "multiple attribute present" });
    const pickerFunctionalCheck = { name: "Two-file picker interaction", status: Status.BLOCKED, detail: "not executed" };
    report.multiUpload.push(pickerFunctionalCheck);
    if (await dropzone.count() !== 1) throw new Error("upload drop zone is missing");
    report.uploadEvidence.drop.found = true;
    report.dragDropUpload.push({ name: "Upload drop zone", status: Status.PASS, detail: "drop zone present" });
    const dropFunctionalCheck = { name: "Two-file drag-and-drop", status: Status.BLOCKED, detail: "not executed" };
    report.dragDropUpload.push(dropFunctionalCheck);
    let signatureIndex = 0;
    let cloudinaryIndex = 0;
    let persistenceIndex = 0;
    let activeEntryPoint = "idle";
    let dropSignatureRequests = 0;
    let pickerSignatureRequests = 0;
    let resolveDropSignatures;
    let resolvePickerSignatures;
    const dropSignaturesObserved = new Promise((resolve) => { resolveDropSignatures = resolve; });
    const pickerSignaturesObserved = new Promise((resolve) => { resolvePickerSignatures = resolve; });
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (url.pathname === `/api/admin/products/${product.id}/upload-signature`) {
        if (activeEntryPoint === "drop") {
          dropSignatureRequests += 1;
          if (dropSignatureRequests === 2) resolveDropSignatures();
        }
        if (activeEntryPoint === "picker") {
          evidence[Math.min(signatureIndex, 1)].signatureRequestObserved = true;
          signatureIndex += 1;
          pickerSignatureRequests += 1;
          if (pickerSignatureRequests === 2) resolvePickerSignatures();
        }
      }
      if (activeEntryPoint === "picker" && url.hostname === "api.cloudinary.com" && /\/image\/upload$/u.test(url.pathname)) {
        evidence[Math.min(cloudinaryIndex, 1)].cloudinaryUploadStarted = true;
        cloudinaryIndex += 1;
      }
      if (activeEntryPoint === "picker" && request.headers()["next-action"] && persistenceIndex < evidence.length) {
        evidence[persistenceIndex].persistenceSaveAttemptObserved = true;
        persistenceIndex += 1;
      }
    });
    page.on("response", (response) => {
      const url = new URL(response.url());
      if (activeEntryPoint === "picker" && url.pathname === `/api/admin/products/${product.id}/upload-signature`) {
        const index = Math.min(Math.max(signatureIndex - 1, 0), 1);
        evidence[index].signatureResponseStatus = response.status();
      }
      if (activeEntryPoint === "picker" && url.hostname === "api.cloudinary.com" && /\/image\/upload$/u.test(url.pathname)) {
        const index = Math.min(Math.max(cloudinaryIndex - 1, 0), 1);
        evidence[index].cloudinaryUploadResponseStatus = response.status();
        evidence[index].cloudinaryUploadSucceeded = response.ok();
        cloudinaryResponseTasks.push(response.json().then((asset) => {
          const publicId = typeof asset?.public_id === "string" ? asset.public_id : undefined;
          if (publicId?.startsWith(`code-flex/products/${product.id}/`)) state.uploadedPublicIds[index] = publicId;
        }).catch(() => undefined));
      }
    });
    const fixtureNames = verifierFixtureNames(runId);
    const recordPickerRuntimeError = (message) => {
      if (report.uploadEvidence.picker.pageError) return;
      report.uploadEvidence.picker.pageError = true;
      report.uploadEvidence.picker.pageErrorCategory = sanitize(message || "browser runtime error");
    };
    page.on("pageerror", (error) => recordPickerRuntimeError(error instanceof Error ? error.name : "PAGE_ERROR"));
    page.on("console", (message) => { if (message.type() === "error") recordPickerRuntimeError("CONSOLE_ERROR"); });
    await input.evaluate((element) => {
      window.__codeFlexVerifierPickerEvents = { inputCapture: false, inputBubble: false, changeCapture: false, changeBubble: false };
      const record = (key) => (event) => {
        if (event.target === element) window.__codeFlexVerifierPickerEvents[key] = true;
      };
      const listeners = [["input", record("inputCapture"), true], ["input", record("inputBubble"), false], ["change", record("changeCapture"), true], ["change", record("changeBubble"), false]];
      for (const [type, listener, capture] of listeners) window.addEventListener(type, listener, capture);
      window.__codeFlexVerifierPickerCleanup = () => listeners.forEach(([type, listener, capture]) => window.removeEventListener(type, listener, capture));
      const captureSelection = (event) => {
        if (event.target !== element) return;
        const names = Array.from(element.files ?? []).map((file) => file.name);
        window.__codeFlexVerifierFileSelection = { count: names.length, names };
        window.removeEventListener("change", captureSelection, true);
      };
      window.addEventListener("change", captureSelection, true);
    });
    activeEntryPoint = "picker";
    report.uploadEvidence.picker.setInputFilesInvoked = true;
    await input.setInputFiles(fixtureNames.map((name) => ({ name, mimeType: "image/png", buffer: tinyPng })));
    const pickerSelection = await input.evaluate((element) => {
      const changeEvent = window.__codeFlexVerifierFileSelection ?? { count: 0, names: [] };
      const postHandlerFileCount = element.files?.length ?? 0;
      const events = window.__codeFlexVerifierPickerEvents ?? {};
      window.__codeFlexVerifierPickerCleanup?.();
      delete window.__codeFlexVerifierFileSelection;
      delete window.__codeFlexVerifierPickerEvents;
      delete window.__codeFlexVerifierPickerCleanup;
      return { ...changeEvent, postHandlerFileCount, events };
    });
    report.uploadEvidence.changeEventFileListCount = pickerSelection.count;
    report.uploadEvidence.postHandlerFileListCount = pickerSelection.postHandlerFileCount;
    report.uploadEvidence.picker.events = pickerSelection.events;
    report.uploadEvidence.picker.reactErrorUi = await page.getByText(/application error|error occurred|حدث خطأ/i).count() > 0;
    evidence.forEach((file) => { file.selected = true; });
    const preQueueOutcome = pickerSelectionOutcome({ changeFileCount: pickerSelection.count, changeFileNames: pickerSelection.names, postHandlerFileCount: pickerSelection.postHandlerFileCount, fixtures: fixtureNames, batchVisible: false });
    report.uploadEvidence.inputResetDetected = preQueueOutcome.inputResetDetected;
    if (!preQueueOutcome.changeEventMatches) throw new Error("picker capture-phase change listener did not observe two verifier fixtures in selected order");
    if (!pickerEventPathComplete(pickerSelection.events)) throw new Error("picker input/change event path did not reach capture and bubble listeners");
    if (report.uploadEvidence.picker.pageError || report.uploadEvidence.picker.reactErrorUi) throw new Error("picker interaction triggered a browser or React error");
    const batchState = page.getByTestId("product-image-upload-batch");
    await batchState.waitFor({ state: "visible", timeout: 15_000 });
    report.uploadEvidence.batchVisible = await batchState.isVisible();
    const pickerOutcome = pickerSelectionOutcome({ changeFileCount: pickerSelection.count, changeFileNames: pickerSelection.names, postHandlerFileCount: pickerSelection.postHandlerFileCount, fixtures: fixtureNames, batchVisible: report.uploadEvidence.batchVisible });
    if (!pickerOutcome.accepted) throw new Error("picker selection did not create the compact two-image batch state");
    await withTimeout(pickerSignaturesObserved, 15_000, "picker upload processing");
    pickerFunctionalCheck.status = Status.PASS;
    pickerFunctionalCheck.detail = "DOM FileList contained two ordered fixtures; one compact batch state rendered and upload processing started";
    phase = "persistence";
    const created = await waitForDatabase(async () => {
      const images = await prisma.productImage.findMany({ where: { productId: product.id }, select: { id: true, publicId: true, sortOrder: true, url: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
      const added = images.filter((image) => !state.original.some((original) => original.id === image.id));
      const owned = added.filter((image) => state.uploadedPublicIds.includes(image.publicId));
      return added.length === 2 && state.uploadedPublicIds.filter(Boolean).length === 2 && owned.length === 2 ? owned : undefined;
    }, { timeoutMs: 60_000 });
    report.uploadEvidence.files = finalizeUploadEvidence(evidence).map((file) => ({ ...file, queueState: "SUCCESS" }));
    if (!created) throw new Error("two verifier ProductImage rows were not persisted");
    if (created.some((image) => !state.uploadedPublicIds.includes(image.publicId))) throw new Error("persisted images did not match the exact browser-uploaded resources");
    state.created = created;
    report.uploadEvidence.files.forEach((file) => { file.productImagePersisted = true; file.failureCategory = undefined; });
    if (!created.every((image, index) => image.sortOrder === index)) throw new Error("two persisted verifier images did not preserve selected order");
    report.persistence.push({ name: "Two-image persistence", status: Status.PASS, detail: "two exact ProductImage rows persisted" });
    for (const image of created) await cloudinary.api.resource(image.publicId, { resource_type: "image" });
    phase = "dragDropUpload";
    await page.reload({ waitUntil: "domcontentloaded" });
    const signatureRoute = `**/api/admin/products/${product.id}/upload-signature`;
    await page.route(signatureRoute, (route) => route.abort("failed"));
    try {
      activeEntryPoint = "drop";
      const dropResult = await page.getByTestId("product-image-dropzone").evaluate((element, payload) => {
        const bytes = Uint8Array.from(atob(payload.base64), (character) => character.charCodeAt(0));
        const transfer = new DataTransfer();
        for (const name of payload.names) transfer.items.add(new File([bytes], name, { type: "image/png" }));
        const dispatch = (type) => {
          element.dispatchEvent(new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: transfer }));
          return true;
        };
        const dispatched = Object.fromEntries(payload.events.map((type) => [type, dispatch(type)]));
        return { fileCount: transfer.files.length, dragEnterDispatched: dispatched.dragenter === true, dragOverDispatched: dispatched.dragover === true, dropDispatched: dispatched.drop === true };
      }, { base64: tinyPng.toString("base64"), names: fixtureNames, events: requiredDropEvents });
      Object.assign(report.uploadEvidence.drop, dropResult);
      if (dropResult.fileCount !== 2 || !dropResult.dragEnterDispatched || !dropResult.dragOverDispatched || !dropResult.dropDispatched) throw new Error("two-file drag-and-drop event sequence was not dispatched");
      const dropBatch = page.getByTestId("product-image-upload-batch");
      await dropBatch.waitFor({ state: "visible", timeout: 15_000 });
      report.uploadEvidence.drop.batchVisible = await dropBatch.isVisible();
      if (!report.uploadEvidence.drop.batchVisible) throw new Error("drag-and-drop did not create the compact batch state");
      await withTimeout(dropSignaturesObserved, 15_000, "drag-and-drop upload processing");
      report.uploadEvidence.drop.uploadProcessingStarted = true;
      dropFunctionalCheck.status = Status.PASS;
      dropFunctionalCheck.detail = "dragenter, dragover, and drop created one compact batch state and started sequential upload processing";
    } finally {
      await page.unroute(signatureRoute);
      activeEntryPoint = "idle";
    }
    await page.reload({ waitUntil: "domcontentloaded" });
    phase = "adminRendering";
    report.adminRendering.push({ name: "Admin image rendering", status: await page.getByTestId("product-image-item").count() >= product.images.length + 2 ? Status.PASS : Status.FAIL, detail: "persisted images rendered in Admin" });
    if (report.adminRendering.at(-1)?.status !== Status.PASS) throw new Error("persisted images were not rendered in Admin");
    phase = "storefrontRendering";
    await page.goto(`${target}/en/products/${product.slug}`, { waitUntil: "domcontentloaded" });
    if (!await rendersCloudinaryPublicId(page.locator("img"), created[0].publicId)) throw new Error("storefront did not render the initial primary Cloudinary image");
    report.storefrontRendering.push({ name: "Product detail image", status: Status.PASS, detail: "Cloudinary image rendered without redeploy" });
    await page.goto(`${target}/en/products?q=${encodeURIComponent(product.name)}`, { waitUntil: "domcontentloaded" });
    const productCard = page.locator(`a[href="/en/products/${product.slug}"]`).locator("xpath=ancestor::article").first();
    if (await productCard.count() !== 1 || !await rendersCloudinaryPublicId(productCard.locator("img"), created[0].publicId)) throw new Error("storefront product card image did not render after upload");
    report.storefrontRendering.push({ name: "Product card image", status: Status.PASS, detail: "Cloudinary image rendered in the English catalog" });
    report.noRedeploy.push({ name: "Upload reflection", status: Status.PASS, detail: "fresh public detail and catalog routes reflected the upload" });
    phase = "reorder";
    await page.goto(`${target}/admin/products/${product.id}/edit`, { waitUntil: "domcontentloaded" });
    const items = page.getByTestId("product-image-item");
    await items.nth(product.images.length + 1).dragTo(items.nth(product.images.length));
    const reordered = await waitForDatabase(async () => {
      const images = await prisma.productImage.findMany({ where: { productId: product.id }, select: { id: true, sortOrder: true }, orderBy: { sortOrder: "asc" } });
      const order = images.map((image) => image.id);
      return order.indexOf(created[1].id) < order.indexOf(created[0].id) && images.every((image, index) => image.sortOrder === index) ? images : undefined;
    }, { timeoutMs: 30_000 });
    if (!reordered) throw new Error("drag reorder was not persisted contiguously");
    report.reorder.push({ name: "Drag reorder", status: Status.PASS, detail: "contiguous persisted order reflected without redeploy" });
    await page.goto(`${target}/admin/products/${product.id}/edit`, { waitUntil: "domcontentloaded" });
    if (!await rendersCloudinaryPublicId(page.getByTestId("product-image-item").first().locator("img"), created[1].publicId)) throw new Error("Admin image order did not reflect the persisted reorder");
    report.reorder.push({ name: "Admin order after reorder", status: Status.PASS, detail: "fresh Admin route reflected the persisted first image" });
    await page.goto(`${target}/en/products/${product.slug}`, { waitUntil: "domcontentloaded" });
    if (!await rendersCloudinaryPublicId(page.locator("img"), created[1].publicId)) throw new Error("storefront primary image did not update after reorder");
    report.reorder.push({ name: "Storefront primary after reorder", status: Status.PASS, detail: "reordered primary image reflected on a fresh public route" });
    report.noRedeploy.push({ name: "Reorder reflection", status: Status.PASS, detail: "fresh Admin route reflected the persisted order" });
    phase = "deleteChecks";
    for (const [index, image] of [...created].reverse().entries()) {
      await page.goto(`${target}/admin/products/${product.id}/edit`, { waitUntil: "domcontentloaded" });
      page.once("dialog", (dialog) => dialog.accept());
      await page.getByTestId("product-image-item").last().getByRole("button", { name: "حذف" }).click();
      const deleted = await waitForDatabase(async () => await prisma.productImage.count({ where: { id: image.id } }) === 0, { timeoutMs: 30_000 });
      if (!deleted || !await cloudinaryAbsent(image.publicId)) throw new Error("exact verifier image deletion was not confirmed");
      report.deleteChecks.push({ name: index === 0 ? "First exact image deletion" : "Second exact image deletion", status: Status.PASS, detail: "exact ProductImage row and Cloudinary resource were removed" });
      if (index === 0) {
        await page.goto(`${target}/en/products/${product.slug}`, { waitUntil: "domcontentloaded" });
        if (!await rendersCloudinaryPublicId(page.locator("img"), created[0].publicId)) throw new Error("remaining image did not render after deleting the primary image");
        report.deleteChecks.push({ name: "Remaining image rendering", status: Status.PASS, detail: "remaining image rendered after the first exact deletion" });
      }
    }
    phase = "fallback";
    for (const [locale, text] of [["", "لا توجد صورة للمعاينة"], ["/en", "No image to preview"]]) {
      await page.goto(`${target}${locale}/products/${product.slug}`, { waitUntil: "domcontentloaded" });
      if (!await page.getByText(text).count()) throw new Error(`neutral ${locale || "Arabic"} fallback was not rendered`);
    }
    report.fallback.push({ name: "Localized neutral fallback", status: Status.PASS, detail: "Arabic and English fallback reflected without redeploy" });
    report.noRedeploy.push({ name: "Delete and fallback reflection", status: Status.PASS, detail: "fresh Arabic and English public routes reflected deletion" });
    return { status: Status.PASS, detail: "guarded lifecycle completed" };
  } catch (error) {
    const detail = sanitize(error instanceof Error ? error.message : error);
    report.uploadEvidence.files = finalizeUploadEvidence(report.uploadEvidence.files);
    const phaseChecks = report[phase];
    if (Array.isArray(phaseChecks) && !phaseChecks.some((check) => check.status === Status.FAIL)) phaseChecks.push({ name: "Lifecycle step", status: Status.FAIL, detail });
    return { status: Status.FAIL, detail };
  } finally {
    await Promise.allSettled(cloudinaryResponseTasks);
    const cleanup = { rows: 0, assets: 0, originalOrder: true };
    if (state.product) {
      const cleanupPublicIds = [...new Set([...state.created.map((image) => image.publicId), ...state.uploadedPublicIds.filter(Boolean)])];
      const cleanupRows = await prisma.productImage.findMany({ where: { productId: state.product.id, publicId: { in: cleanupPublicIds } }, select: { id: true, publicId: true } });
      for (const image of cleanupRows) {
        cleanup.rows += (await prisma.productImage.deleteMany({ where: { id: image.id } })).count;
      }
      for (const publicId of cleanupPublicIds) {
        try { await cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true }); } catch { /* exact best-effort cleanup is verified below */ }
      }
      if (state.original.length) await prisma.$transaction(state.original.map((image) => prisma.productImage.update({ where: { id: image.id }, data: { sortOrder: image.sortOrder } }))).catch(() => undefined);
      const residualRows = await prisma.productImage.count({ where: { productId: state.product.id, publicId: { in: cleanupPublicIds } } });
      const residualAssets = (await Promise.all(cleanupPublicIds.map(async (publicId) => await cloudinaryAbsent(publicId)))).filter(Boolean).length;
      const restored = await prisma.productImage.findMany({ where: { id: { in: state.original.map((image) => image.id) } }, select: { id: true, sortOrder: true } });
      cleanup.originalOrder = state.original.every((image) => restored.some((row) => row.id === image.id && row.sortOrder === image.sortOrder));
      report.cleanup.push({ name: "Exact-ID cleanup", status: residualRows === 0 && residualAssets === cleanupPublicIds.length && cleanup.originalOrder ? Status.PASS : Status.FAIL, detail: `residual verifier rows ${residualRows}; residual verifier assets ${cleanupPublicIds.length - residualAssets}` });
    }
    await browser?.close();
  }
}

async function main() {
  const report = { runId: randomUUID(), timestamp: new Date().toISOString(), target, status: Status.BLOCKED, execution: { mutationGuardEnabled: mutationEnabled, credentials: false, credentialSource: undefined, browser: undefined }, baseline: [], adminAuthentication: [], configuration: [], multiUpload: [], dragDropUpload: [], persistence: [], adminRendering: [], storefrontRendering: [], reorder: [], deleteChecks: [], fallback: [], negativeChecks: [], noRedeploy: [], cleanup: [], failures: [], blockers: [] };
  const staticCommands = [["Cloudinary helper tests", process.execPath, ["--test", "scripts/verify/cloudinary.test.mjs"]], ["Cloudinary browser DataTransfer test", process.execPath, ["--import", "tsx", "--test", "scripts/verify/cloudinary-browser.test.mjs"]], ["Cloudinary diagnostics tests", process.execPath, ["--import", "tsx", "--test", "scripts/verify/cloudinary-diagnostics.test.ts"]], ["Admin image helper tests", process.execPath, ["--import", "tsx", "--test", "scripts/verify/admin-image-upload.test.ts"]]];
  for (const [name, command, args] of staticCommands) { const result = await runCommand(command, args, { cwd: root }); report.baseline.push({ name, status: result.code === 0 ? Status.PASS : Status.FAIL, detail: result.code === 0 ? "passed" : "failed" }); }
  const config = configured();
  report.configuration.push({ name: "Server configuration", status: config.cloudNameConfigured && config.apiKeyConfigured && config.apiSecretConfigured ? Status.PASS : Status.BLOCKED, detail: `cloud name ${config.cloudNameConfigured ? "yes" : "no"}; API key ${config.apiKeyConfigured ? "yes" : "no"}; API secret ${config.apiSecretConfigured ? "yes" : "no"}` });
  const prisma = createVerifierDatabase();
  if (prisma) { const product = await prisma.product.findFirst({ where: { isActive: true }, select: { id: true, images: { select: { id: true } } } }); report.baseline.push({ name: "Existing-image safe baseline", status: product ? Status.PASS : Status.BLOCKED, detail: product ? `${product.images.length} existing images on selected baseline product` : "no active product" }); }
  if (target) {
    try {
      const response = await fetch(`${target}/api/admin/products/00000000-0000-0000-0000-000000000000/upload-signature`, { redirect: "manual" });
      report.negativeChecks.push({ name: "Unauthenticated signature rejection", status: response.status === 200 ? Status.FAIL : Status.PASS, detail: response.status === 200 ? "unexpected successful signature response" : "unauthenticated request rejected" });
    } catch {
      report.negativeChecks.push({ name: "Unauthenticated signature rejection", status: Status.BLOCKED, detail: "target was not reachable from this verifier host" });
      report.blockers.push("Production HTTP target was not reachable from this verifier host");
    }
  } else report.blockers.push("TEST_BASE_URL or BETTER_AUTH_URL is required for HTTP checks");
  const credentials = await resolveVerifierCredentials({ environment: process.env, interactive: process.stdin.isTTY, askEmail: promptVisible, askPassword: promptHidden, rootDirectory: root });
  report.execution.credentials = Boolean(credentials.credentials); report.execution.credentialSource = credentials.source;
  if (!credentials.credentials) {
    try {
      const launched = await launchBrowser();
      report.execution.browser = launched.label;
      report.baseline.push({ name: "Headless browser bootstrap", status: Status.PASS, detail: launched.label });
      await launched.browser.close();
    } catch (error) {
      report.baseline.push({ name: "Headless browser bootstrap", status: Status.BLOCKED, detail: sanitize(error instanceof Error ? error.message : error) });
    }
    report.adminAuthentication.push({ name: "Credential availability", status: Status.BLOCKED, detail: "credentials unavailable after environment, secure cache, and interactive prompt" });
  } else {
    let browser;
    try {
      const launched = await launchBrowser();
      browser = launched.browser;
      report.execution.browser = launched.label;
      const page = await browser.newPage();
      await adminLogin(page, credentials.credentials);
      report.adminAuthentication.push({ name: "Admin login", status: Status.PASS, detail: "authenticated session established" });
      const cacheResult = await persistInteractiveCredentialsAfterAuthentication({ authenticated: true, source: credentials.source, rootDirectory: root, credentials: credentials.credentials });
      if (cacheResult.warning) report.blockers.push(cacheResult.warning);
    } catch (error) {
      report.adminAuthentication.push({ name: "Admin login", status: Status.BLOCKED, detail: sanitize(error instanceof Error ? error.message : error) });
    } finally {
      await browser?.close();
    }
  }
  if (mutationEnabled) {
    const lifecycle = await runGuardedLifecycle(report, prisma, credentials.credentials);
    if (lifecycle.status === Status.FAIL) report.failures.push(lifecycle.detail);
    if (lifecycle.status === Status.BLOCKED) report.blockers.push(lifecycle.detail);
  } else report.blockers.push("Cloudinary lifecycle mutation guard not enabled");
  const prerequisiteChecks = [report.baseline, report.configuration, report.negativeChecks, report.adminAuthentication].flat();
  if (prerequisiteChecks.some((check) => check.status === Status.FAIL)) report.status = Status.FAIL;
  else if (mutationEnabled) report.status = guardedFinalStatus(report);
  else report.status = Status.BLOCKED;
  await prisma?.$disconnect();
  await writeReport(report);
  console.log(`Cloudinary verification: ${report.status}`);
  process.exitCode = report.status === Status.PASS ? 0 : report.status === Status.BLOCKED ? 2 : 1;
}

main().catch(async (error) => { console.error(`Cloudinary verification: FAIL — ${sanitize(error instanceof Error ? error.message : error)}`); process.exitCode = 1; });
