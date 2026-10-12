export const cloudinaryLookupCategories = [
  "AUTH",
  "NOT_FOUND",
  "RATE_LIMIT",
  "NETWORK",
  "CONFIG_MISSING_CLOUD_NAME",
  "CONFIG_MISSING_API_KEY",
  "CONFIG_MISSING_API_SECRET",
  "CONFIG_INVALID",
  "REQUEST_BUILD_ERROR",
  "CLOUDINARY_HTTP_ERROR",
  "UNKNOWN",
] as const;

export type CloudinaryLookupCategory = (typeof cloudinaryLookupCategories)[number];

export type CloudinaryLookupDiagnostic = {
  operation: "resource_lookup";
  category: CloudinaryLookupCategory;
  errorName: string;
  errorCode?: number | string;
  httpResponseObserved: boolean;
  beforeHttpResponse: boolean;
  productId: string;
  namespaceMatch: boolean;
  publicIdSuffix: string;
};

export type CloudinaryCleanupDiagnostic = Omit<CloudinaryLookupDiagnostic, "operation"> & {
  operation: "resource_cleanup";
};

export type CloudinaryLookupSuccessDiagnostic = {
  operation: "resource_lookup";
  productId: string;
  namespaceMatch: boolean;
  publicIdSuffix: string;
  resourceType: string | null;
  format: string | null;
  bytes: number | null;
  width: number | null;
  height: number | null;
  secureUrlPresent: boolean;
};

const networkErrorCodes = new Set([
  "ECONNABORTED",
  "ECONNREFUSED",
  "ECONNRESET",
  "ENETUNREACH",
  "ENOTFOUND",
  "ETIMEDOUT",
  "EAI_AGAIN",
]);

const configurationCategories = new Set<CloudinaryLookupCategory>([
  "CONFIG_MISSING_CLOUD_NAME",
  "CONFIG_MISSING_API_KEY",
  "CONFIG_MISSING_API_SECRET",
  "CONFIG_INVALID",
]);

export function isExpectedProductImagePublicId(productId: string, publicId: string) {
  const prefix = `code-flex/products/${productId}/`;
  return publicId.startsWith(prefix) && publicId.length > prefix.length;
}

/** Returns only the exact, namespace-owned asset ID that is safe to delete. */
export function exactProductImageCleanupTarget(productId: string, publicId: string) {
  return isExpectedProductImagePublicId(productId, publicId) ? publicId : null;
}

export function safeCloudinaryPublicIdSuffix(publicId: string) {
  return publicId.slice(-16);
}

function errorRecord(error: unknown) {
  return typeof error === "object" && error !== null ? error as Record<string, unknown> : {};
}

function safeErrorCode(error: unknown) {
  const record = errorRecord(error);
  for (const candidate of [record.http_code, record.httpCode, record.statusCode, record.status, record.code]) {
    if (typeof candidate === "number" && Number.isInteger(candidate)) return candidate;
    if (typeof candidate === "string" && /^(?:[1-5]\d{2}|[A-Z][A-Z0-9_]{1,63})$/u.test(candidate)) return candidate;
  }
  return undefined;
}

function httpStatus(error: unknown) {
  const record = errorRecord(error);
  for (const candidate of [record.http_code, record.httpCode, record.statusCode, record.status, record.code]) {
    const value = typeof candidate === "number" ? candidate : typeof candidate === "string" && /^\d{3}$/u.test(candidate) ? Number(candidate) : undefined;
    if (value && value >= 100 && value <= 599) return value;
  }
  return undefined;
}

function safeErrorName(error: unknown) {
  const name = errorRecord(error).name;
  return typeof name === "string" && /^[A-Za-z0-9_.-]{1,80}$/u.test(name) ? name : "Error";
}

function knownConfigurationCategory(error: unknown) {
  const record = errorRecord(error);
  const explicit = record.cloudinaryConfigurationCategory;
  if (typeof explicit === "string" && configurationCategories.has(explicit as CloudinaryLookupCategory)) return explicit as CloudinaryLookupCategory;

  const message = typeof record.message === "string" ? record.message.toLowerCase() : "";
  if (message.includes("must supply cloud_name")) return "CONFIG_MISSING_CLOUD_NAME";
  if (message.includes("must supply api_key")) return "CONFIG_MISSING_API_KEY";
  if (message.includes("must supply api_secret")) return "CONFIG_MISSING_API_SECRET";
  if (message.includes("invalid cloudinary_url protocol") || message.includes("invalid cloudinary_account_url protocol") || message.includes("invalid cloudinary configuration")) return "CONFIG_INVALID";
  return undefined;
}

export function classifyCloudinaryLookupFailure(error: unknown): CloudinaryLookupCategory {
  const configurationCategory = knownConfigurationCategory(error);
  if (configurationCategory) return configurationCategory;

  const status = httpStatus(error);
  if (status === 401 || status === 403) return "AUTH";
  if (status === 404) return "NOT_FOUND";
  if (status === 420 || status === 429) return "RATE_LIMIT";
  if (status !== undefined) return "CLOUDINARY_HTTP_ERROR";

  const record = errorRecord(error);
  const code = typeof record.code === "string" ? record.code.toUpperCase() : "";
  const message = typeof record.message === "string" ? record.message.toLowerCase() : "";
  if (networkErrorCodes.has(code) || /(?:network|socket|timed? ?out|connection reset|connection refused|dns|fetch failed)/u.test(message)) return "NETWORK";
  if (/(?:invalid uri|invalid url|failed to construct|unsupported protocol)/u.test(message)) return "REQUEST_BUILD_ERROR";
  return "UNKNOWN";
}

function createCloudinaryAdminErrorDiagnostic(productId: string, publicId: string, error: unknown) {
  const status = httpStatus(error);
  return {
    category: classifyCloudinaryLookupFailure(error),
    errorName: safeErrorName(error),
    ...(safeErrorCode(error) === undefined ? {} : { errorCode: safeErrorCode(error) }),
    httpResponseObserved: status !== undefined,
    beforeHttpResponse: status === undefined,
    productId,
    namespaceMatch: isExpectedProductImagePublicId(productId, publicId),
    publicIdSuffix: safeCloudinaryPublicIdSuffix(publicId),
  };
}

export function createCloudinaryLookupDiagnostic(productId: string, publicId: string, error: unknown): CloudinaryLookupDiagnostic {
  return { operation: "resource_lookup", ...createCloudinaryAdminErrorDiagnostic(productId, publicId, error) };
}

export function createCloudinaryCleanupDiagnostic(productId: string, publicId: string, error: unknown): CloudinaryCleanupDiagnostic {
  return { operation: "resource_cleanup", ...createCloudinaryAdminErrorDiagnostic(productId, publicId, error) };
}

export function cloudinaryLookupDiagnosticCode(category: CloudinaryLookupCategory) {
  return `CLOUDINARY_LOOKUP_${category}` as const;
}
