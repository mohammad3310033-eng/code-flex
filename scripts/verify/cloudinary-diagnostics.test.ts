import assert from "node:assert/strict";
import test from "node:test";

import {
  classifyCloudinaryLookupFailure,
  createCloudinaryLookupDiagnostic,
  exactProductImageCleanupTarget,
  isExpectedProductImagePublicId,
} from "../../src/lib/cloudinary-diagnostics";
import {
  CloudinaryAdminConfigurationError,
  configureCloudinaryAdminSdk,
  inspectCloudinaryAdminConfiguration,
} from "../../src/lib/cloudinary-admin-config";

const productId = "d37c91e6-73ec-4c12-8d60-1c78e0512534";
const publicId = `code-flex/products/${productId}/upload-1234567890`;

test("classifies Cloudinary lookup failures without retaining error messages", () => {
  assert.equal(classifyCloudinaryLookupFailure({ http_code: 401 }), "AUTH");
  assert.equal(classifyCloudinaryLookupFailure({ http_code: 403 }), "AUTH");
  assert.equal(classifyCloudinaryLookupFailure({ http_code: 404 }), "NOT_FOUND");
  assert.equal(classifyCloudinaryLookupFailure({ http_code: 420 }), "RATE_LIMIT");
  assert.equal(classifyCloudinaryLookupFailure({ statusCode: 429 }), "RATE_LIMIT");
  assert.equal(classifyCloudinaryLookupFailure({ code: "ETIMEDOUT", message: "socket timed out" }), "NETWORK");
  assert.equal(classifyCloudinaryLookupFailure({ http_code: 500 }), "CLOUDINARY_HTTP_ERROR");
  assert.equal(classifyCloudinaryLookupFailure(new Error("Must supply api_key")), "CONFIG_MISSING_API_KEY");
  assert.equal(classifyCloudinaryLookupFailure({}), "UNKNOWN");
});

test("diagnostics keep only safe metadata", () => {
  const diagnostic = createCloudinaryLookupDiagnostic(productId, publicId, { http_code: 401, message: "api_secret=super-secret" });
  const serialized = JSON.stringify(diagnostic);
  assert.equal(diagnostic.operation, "resource_lookup");
  assert.equal(diagnostic.category, "AUTH");
  assert.equal(diagnostic.namespaceMatch, true);
  assert.equal(serialized.includes("super-secret"), false);
  assert.equal(serialized.includes(publicId), false);
});

test("diagnostics distinguish failures before a response from Cloudinary HTTP errors", () => {
  const preNetwork = createCloudinaryLookupDiagnostic(productId, publicId, new Error("Must supply api_key"));
  const httpFailure = createCloudinaryLookupDiagnostic(productId, publicId, { name: "Error", http_code: 500, message: "secret response body" });
  assert.deepEqual([preNetwork.category, preNetwork.httpResponseObserved, preNetwork.beforeHttpResponse, preNetwork.errorName], ["CONFIG_MISSING_API_KEY", false, true, "Error"]);
  assert.deepEqual([httpFailure.category, httpFailure.httpResponseObserved, httpFailure.beforeHttpResponse, httpFailure.errorCode], ["CLOUDINARY_HTTP_ERROR", true, false, 500]);
});

test("Admin SDK configuration asserts each required value without exposing it", () => {
  const environment = { CLOUDINARY_CLOUD_NAME: "cloud", CLOUDINARY_API_KEY: "key-123", CLOUDINARY_API_SECRET: "super-secret" };
  const valid = inspectCloudinaryAdminConfiguration(environment);
  assert.equal(valid.category, "VALID");
  assert.deepEqual([valid.cloudNameConfigured, valid.apiKeyConfigured, valid.apiSecretConfigured], [true, true, true]);

  assert.equal(inspectCloudinaryAdminConfiguration({ ...environment, CLOUDINARY_CLOUD_NAME: "" }).category, "CONFIG_MISSING_CLOUD_NAME");
  assert.equal(inspectCloudinaryAdminConfiguration({ ...environment, CLOUDINARY_API_KEY: "" }).category, "CONFIG_MISSING_API_KEY");
  assert.equal(inspectCloudinaryAdminConfiguration({ ...environment, CLOUDINARY_API_SECRET: "" }).category, "CONFIG_MISSING_API_SECRET");
  assert.equal(JSON.stringify(valid).includes("super-secret"), false);
});

test("one configured SDK instance is used for Admin API and cleanup callers", () => {
  let stored: Record<string, string> = {};
  let writeCalls = 0;
  const sdk = {
    config(options?: Record<string, string>) {
      if (options) {
        stored = { ...stored, ...options };
        writeCalls += 1;
      }
      return stored;
    },
  };
  const diagnostic = configureCloudinaryAdminSdk(sdk, { CLOUDINARY_CLOUD_NAME: "cloud", CLOUDINARY_API_KEY: "key", CLOUDINARY_API_SECRET: "secret" });
  assert.equal(writeCalls, 1);
  assert.deepEqual([diagnostic.cloudNameMatchesExpected, diagnostic.apiKeyMatchesExpected, diagnostic.apiSecretMatchesExpected], [true, true, true]);
  assert.equal(stored.api_secret, "secret");
});

test("configuration assertion fails before an HTTP response is possible", () => {
  assert.throws(
    () => configureCloudinaryAdminSdk({ config: () => ({}) }, { CLOUDINARY_CLOUD_NAME: "cloud", CLOUDINARY_API_KEY: "", CLOUDINARY_API_SECRET: "secret" }),
    (error: unknown) => error instanceof CloudinaryAdminConfigurationError && error.diagnostic.category === "CONFIG_MISSING_API_KEY",
  );
});

test("only the exact expected product namespace is eligible for cleanup", () => {
  assert.equal(isExpectedProductImagePublicId(productId, publicId), true);
  assert.equal(exactProductImageCleanupTarget(productId, publicId), publicId);
  assert.equal(exactProductImageCleanupTarget(productId, `code-flex/products/${productId}-other/upload`), null);
  assert.equal(exactProductImageCleanupTarget(productId, "code-flex/products/foreign/upload"), null);
  assert.equal(exactProductImageCleanupTarget(productId, `code-flex/products/${productId}/`), null);
});
