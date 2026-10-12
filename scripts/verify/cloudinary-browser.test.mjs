import assert from "node:assert/strict";
import test from "node:test";

import { launchBrowser } from "./browser.mjs";
import { requiredDropEvents, verifierFixtureNames } from "./cloudinary.mjs";

test("picker input and change events reach capture and bubble before a delegated handler resets the input", async () => {
  const launched = await launchBrowser();
  try {
    const page = await launched.browser.newPage();
    await page.setContent('<div id="root"><input id="picker" type="file" multiple></div>');
    const input = page.locator("#picker");
    await input.evaluate((element) => {
      window.__codeFlexVerifierPickerEvents = { inputCapture: false, inputBubble: false, changeCapture: false, changeBubble: false };
      for (const [type, key, capture] of [["input", "inputCapture", true], ["input", "inputBubble", false], ["change", "changeCapture", true], ["change", "changeBubble", false]]) {
        window.addEventListener(type, (event) => {
          if (event.target === element) window.__codeFlexVerifierPickerEvents[key] = true;
        }, capture);
      }
      const root = document.querySelector("#root");
      root?.addEventListener("change", (event) => {
        if (event.target === element) element.value = "";
      }, true);
      const captureSelection = (event) => {
        if (event.target !== element) return;
        window.__codeFlexVerifierFileSelection = Array.from(element.files ?? []).map((file) => file.name);
        window.removeEventListener("change", captureSelection, true);
      };
      window.addEventListener("change", captureSelection, true);
    });
    const fixtures = verifierFixtureNames("browser-test");
    await input.setInputFiles(fixtures.map((name) => ({ name, mimeType: "image/png", buffer: Buffer.from([1]) })));
    const observed = await input.evaluate((element) => ({ captured: window.__codeFlexVerifierFileSelection, events: window.__codeFlexVerifierPickerEvents, postHandlerCount: element.files?.length ?? 0 }));
    assert.deepEqual(observed.captured, fixtures);
    assert.deepEqual(observed.events, { inputCapture: true, inputBubble: true, changeCapture: true, changeBubble: true });
    assert.equal(observed.postHandlerCount, 0);
  } finally {
    await launched.browser.close();
  }
});

test("a synchronous picker handler failure is visible through Playwright pageerror diagnostics", async () => {
  const launched = await launchBrowser();
  try {
    const page = await launched.browser.newPage();
    const pageError = new Promise((resolve) => page.once("pageerror", () => resolve(true)));
    await page.setContent('<div id="root"><input id="picker" type="file" multiple></div>');
    const input = page.locator("#picker");
    await input.evaluate((element) => {
      document.querySelector("#root")?.addEventListener("change", (event) => {
        if (event.target === element) throw new Error("verifier test picker failure");
      }, true);
    });
    await input.setInputFiles({ name: "fixture.png", mimeType: "image/png", buffer: Buffer.from([1]) });
    assert.equal(await pageError, true);
  } finally {
    await launched.browser.close();
  }
});

test("a post-mount readiness signal can be awaited before targeting the picker", async () => {
  const launched = await launchBrowser();
  try {
    const page = await launched.browser.newPage();
    await page.setContent('<input data-testid="product-image-file-input" type="file">');
    await page.evaluate(() => queueMicrotask(() => document.querySelector("input")?.setAttribute("data-image-uploader-hydrated", "true")));
    await page.waitForFunction(() => document.querySelector('input[data-testid="product-image-file-input"]')?.getAttribute("data-image-uploader-hydrated") === "true");
    assert.equal(await page.locator('input[data-testid="product-image-file-input"]').getAttribute("data-image-uploader-hydrated"), "true");
  } finally {
    await launched.browser.close();
  }
});

test("single-file and two-file picker interactions reach a delegated queue handler", async () => {
  const launched = await launchBrowser();
  try {
    const page = await launched.browser.newPage();
    const fixtures = verifierFixtureNames("picker-cases");
    for (const names of [[fixtures[0]], fixtures]) {
      await page.setContent('<div id="root"><input id="picker" type="file" multiple><ul id="queue"></ul></div>');
      const input = page.locator("#picker");
      await input.evaluate((element) => {
        const root = document.querySelector("#root");
        root?.addEventListener("change", (event) => {
          if (event.target !== element) return;
          Array.from(element.files ?? []).forEach(() => document.querySelector("#queue")?.append(document.createElement("li")));
          element.value = "";
        }, true);
      });
      await input.setInputFiles(names.map((name) => ({ name, mimeType: "image/png", buffer: Buffer.from([1]) })));
      assert.equal(await page.locator("#queue li").count(), names.length);
      assert.equal(await input.evaluate((element) => element.files?.length ?? 0), 0);
    }
  } finally {
    await launched.browser.close();
  }
});

test("browser DataTransfer carries two files through the required drop event sequence", async () => {
  const launched = await launchBrowser();
  try {
    const page = await launched.browser.newPage();
    const observed = await page.evaluate((events) => {
      const zone = document.createElement("div");
      document.body.append(zone);
      const received = [];
      for (const type of events) zone.addEventListener(type, (event) => {
        received.push({ type, fileCount: event.dataTransfer?.files.length ?? 0 });
        if (type === "dragover") event.preventDefault();
      });
      const transfer = new DataTransfer();
      transfer.items.add(new File([new Uint8Array([1])], "fixture-one.png", { type: "image/png" }));
      transfer.items.add(new File([new Uint8Array([2])], "fixture-two.png", { type: "image/png" }));
      for (const type of events) zone.dispatchEvent(new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: transfer }));
      return { received, transferFileCount: transfer.files.length };
    }, requiredDropEvents);
    assert.equal(observed.transferFileCount, 2);
    assert.deepEqual(observed.received.map((event) => event.type), requiredDropEvents);
    assert.ok(observed.received.every((event) => event.fileCount === 2));
  } finally {
    await launched.browser.close();
  }
});
