import "server-only";

import { v2 as cloudinary } from "cloudinary";

import { configureCloudinaryAdminSdk } from "@/lib/cloudinary-admin-config";
import {
  type CloudinaryCleanupDiagnostic,
  type CloudinaryLookupDiagnostic,
  type CloudinaryLookupSuccessDiagnostic,
  createCloudinaryCleanupDiagnostic,
  createCloudinaryLookupDiagnostic,
  exactProductImageCleanupTarget,
  isExpectedProductImagePublicId,
  safeCloudinaryPublicIdSuffix,
} from "@/lib/cloudinary-diagnostics";

const allowedFormats = ["jpg", "jpeg", "png", "webp", "avif"] as const;
const maxProductImageBytes = 10 * 1024 * 1024;
const maxHeroImageBytes = 12 * 1024 * 1024;
const maxCategoryImageBytes = 10 * 1024 * 1024;

function heroImagePrefix(settingsId: string) {
  return `code-flex/settings/${settingsId}/hero/`;
}

function categoryImagePrefix(categoryId: string) {
  return `code-flex/categories/${categoryId}/`;
}

function getCloudinaryEnv() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const diagnostic = assertCloudinaryAdminConfigured();

  return { cloudName: cloudName!, apiKey: apiKey!, apiSecret: apiSecret!, diagnostic };
}

/** Asserts and configures the sole server-side Cloudinary v2 instance. */
export function assertCloudinaryAdminConfigured() {
  return configureCloudinaryAdminSdk(cloudinary, process.env);
}

export function getCloudinaryUploadSignature(productId: string) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryEnv();
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `code-flex/products/${productId}`;
  const paramsToSign = {
    timestamp,
    folder,
    allowed_formats: allowedFormats.join(","),
    overwrite: false,
  };

  return {
    cloudName,
    apiKey,
    timestamp,
    folder,
    allowedFormats,
    signature: cloudinary.utils.api_sign_request(paramsToSign, apiSecret),
  };
}

export function getCloudinaryHeroUploadSignature(settingsId: string) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryEnv();
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = heroImagePrefix(settingsId).slice(0, -1);
  const paramsToSign = { timestamp, folder, allowed_formats: allowedFormats.join(","), overwrite: false };
  return { cloudName, apiKey, timestamp, folder, allowedFormats, signature: cloudinary.utils.api_sign_request(paramsToSign, apiSecret) };
}

export function getCloudinaryCategoryUploadSignature(categoryId: string) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryEnv();
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = categoryImagePrefix(categoryId).slice(0, -1);
  const paramsToSign = { timestamp, folder, allowed_formats: allowedFormats.join(","), overwrite: false };
  return { cloudName, apiKey, timestamp, folder, allowedFormats, signature: cloudinary.utils.api_sign_request(paramsToSign, apiSecret) };
}

export function isManagedCategoryPublicId(categoryId: string, publicId: string) {
  const prefix = categoryImagePrefix(categoryId);
  return publicId.startsWith(prefix) && publicId.length > prefix.length && !publicId.slice(prefix.length).includes("/");
}

export async function verifyManagedCategoryImage(categoryId: string, publicId: string) {
  if (!isManagedCategoryPublicId(categoryId, publicId)) return null;
  const { cloudName } = getCloudinaryEnv();
  const asset = await cloudinary.api.resource(publicId, { resource_type: "image" });
  if (asset.resource_type !== "image" || typeof asset.secure_url !== "string" || typeof asset.bytes !== "number" || asset.bytes > maxCategoryImageBytes || typeof asset.format !== "string" || !allowedFormats.includes(asset.format.toLowerCase() as (typeof allowedFormats)[number])) return null;
  const parsed = new URL(asset.secure_url);
  if (parsed.protocol !== "https:" || parsed.hostname !== "res.cloudinary.com" || !parsed.pathname.startsWith(`/${cloudName}/image/upload/`)) return null;
  return asset.secure_url;
}

export async function destroyManagedCategoryImage(categoryId: string, publicId: string) {
  if (!isManagedCategoryPublicId(categoryId, publicId)) throw new Error("Refusing unmanaged category image deletion.");
  assertCloudinaryAdminConfigured();
  const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true });
  return result.result === "ok" || result.result === "not found";
}

export function isManagedHeroPublicId(settingsId: string, publicId: string) {
  const prefix = heroImagePrefix(settingsId);
  return publicId.startsWith(prefix) && publicId.length > prefix.length && !publicId.slice(prefix.length).includes("/");
}

export async function verifyManagedHeroImage(settingsId: string, publicId: string) {
  if (!isManagedHeroPublicId(settingsId, publicId)) return null;
  const { cloudName } = getCloudinaryEnv();
  const asset = await cloudinary.api.resource(publicId, { resource_type: "image" });
  if (asset.resource_type !== "image" || typeof asset.secure_url !== "string" || typeof asset.bytes !== "number" || asset.bytes > maxHeroImageBytes || typeof asset.format !== "string" || !allowedFormats.includes(asset.format.toLowerCase() as (typeof allowedFormats)[number])) return null;
  const parsed = new URL(asset.secure_url);
  if (parsed.protocol !== "https:" || parsed.hostname !== "res.cloudinary.com" || !parsed.pathname.startsWith(`/${cloudName}/image/upload/`)) return null;
  return asset.secure_url;
}

export async function destroyManagedHeroImage(settingsId: string, publicId: string) {
  if (!isManagedHeroPublicId(settingsId, publicId)) throw new Error("Refusing unmanaged hero deletion.");
  assertCloudinaryAdminConfigured();
  const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true });
  return result.result === "ok" || result.result === "not found";
}

export function isManagedProductPublicId(productId: string, publicId: string) {
  return isExpectedProductImagePublicId(productId, publicId);
}

export class CloudinaryResourceLookupError extends Error {
  readonly diagnostic: CloudinaryLookupDiagnostic;

  constructor(diagnostic: CloudinaryLookupDiagnostic) {
    super("Cloudinary resource lookup failed.");
    this.name = "CloudinaryResourceLookupError";
    this.diagnostic = diagnostic;
  }
}

export function getCloudinaryResourceLookupDiagnostic(error: unknown) {
  return error instanceof CloudinaryResourceLookupError ? error.diagnostic : undefined;
}

export class CloudinaryProductImageCleanupError extends Error {
  readonly diagnostic: CloudinaryCleanupDiagnostic;

  constructor(diagnostic: CloudinaryCleanupDiagnostic) {
    super("Cloudinary product image cleanup failed.");
    this.name = "CloudinaryProductImageCleanupError";
    this.diagnostic = diagnostic;
  }
}

export function getCloudinaryProductImageCleanupDiagnostic(error: unknown) {
  return error instanceof CloudinaryProductImageCleanupError ? error.diagnostic : undefined;
}

export type VerifiedManagedProductImage = {
  url: string;
  diagnostic: CloudinaryLookupSuccessDiagnostic;
};

export async function verifyManagedProductImageDetails(productId: string, publicId: string): Promise<VerifiedManagedProductImage | null> {
  if (!isManagedProductPublicId(productId, publicId)) {
    return null;
  }

  let cloudName: string;
  try {
    const configured = getCloudinaryEnv();
    cloudName = configured.cloudName;
    console.info("Cloudinary Admin SDK configured", configured.diagnostic);
  } catch (error) {
    throw new CloudinaryResourceLookupError(createCloudinaryLookupDiagnostic(productId, publicId, error));
  }

  let asset: Awaited<ReturnType<typeof cloudinary.api.resource>>;
  try {
    asset = await cloudinary.api.resource(publicId, { resource_type: "image" });
  } catch (error) {
    throw new CloudinaryResourceLookupError(createCloudinaryLookupDiagnostic(productId, publicId, error));
  }
  const url = asset.secure_url;

  const diagnostic: CloudinaryLookupSuccessDiagnostic = {
    operation: "resource_lookup",
    productId,
    namespaceMatch: true,
    publicIdSuffix: safeCloudinaryPublicIdSuffix(publicId),
    resourceType: typeof asset.resource_type === "string" ? asset.resource_type : null,
    format: typeof asset.format === "string" ? asset.format : null,
    bytes: typeof asset.bytes === "number" ? asset.bytes : null,
    width: typeof asset.width === "number" ? asset.width : null,
    height: typeof asset.height === "number" ? asset.height : null,
    secureUrlPresent: typeof url === "string" && url.length > 0,
  };

  if (
    typeof url !== "string" ||
    asset.resource_type !== "image" ||
    typeof asset.bytes !== "number" ||
    asset.bytes > maxProductImageBytes ||
    typeof asset.format !== "string" ||
    !allowedFormats.includes(asset.format.toLowerCase() as (typeof allowedFormats)[number])
  ) {
    return null;
  }

  const parsed = new URL(url);
  if (parsed.protocol !== "https:" || parsed.hostname !== "res.cloudinary.com" || !parsed.pathname.startsWith(`/${cloudName}/image/upload/`)) {
    return null;
  }

  return { url, diagnostic };
}

export async function verifyManagedProductImage(productId: string, publicId: string) {
  return (await verifyManagedProductImageDetails(productId, publicId))?.url ?? null;
}

export async function destroyManagedProductImage(productId: string, publicId: string) {
  const cleanupTarget = exactProductImageCleanupTarget(productId, publicId);
  if (!cleanupTarget) {
    throw new Error("Refusing unmanaged asset deletion.");
  }

  let result: Awaited<ReturnType<typeof cloudinary.uploader.destroy>>;
  try {
    assertCloudinaryAdminConfigured();
    result = await cloudinary.uploader.destroy(cleanupTarget, {
      resource_type: "image",
      invalidate: true,
    });
  } catch (error) {
    throw new CloudinaryProductImageCleanupError(createCloudinaryCleanupDiagnostic(productId, cleanupTarget, error));
  }

  return result.result === "ok" || result.result === "not found";
}
