"use client";

import type { ApiResponse } from "@/lib/admin-api-response";

export const heroImageAccept = "image/jpeg,image/png,image/webp,image/avif,.jpg,.jpeg,.png,.webp,.avif";
export const supportedHeroImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function uploadHeroImageFile(settingsId: string, file: File) {
  try {
    const signatureResponse = await fetch("/api/admin/settings/hero/upload-signature", { method: "POST" });
    if (!signatureResponse.ok) throw new Error("signature");
    const signatureBody = await signatureResponse.json() as { ok: boolean; data?: { cloudName: string; apiKey: string; timestamp: number; folder: string; allowedFormats: string[]; signature: string } };
    const signature = signatureBody.data;
    if (!signatureBody.ok || !signature) throw new Error("signature");
    const upload = new FormData();
    upload.set("file", file);
    upload.set("api_key", signature.apiKey);
    upload.set("timestamp", String(signature.timestamp));
    upload.set("folder", signature.folder);
    upload.set("allowed_formats", signature.allowedFormats.join(","));
    upload.set("overwrite", "false");
    upload.set("signature", signature.signature);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, { method: "POST", body: upload });
    if (!response.ok) throw new Error("upload");
    const asset = await response.json() as { public_id?: string };
    if (!asset.public_id) throw new Error("upload");
    const persistenceResponse = await fetch("/api/admin/settings/hero", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ settingsId, publicId: asset.public_id }),
    });
    const persistence = await persistenceResponse.json() as ApiResponse<{ message: string; image?: { url: string; publicId: string } }>;
    if (!persistence.ok) return { error: persistence.error.message };
    return { success: persistence.data.message, image: persistence.data.image };
  } catch {
    return { error: "تعذر رفع صورة Hero أو التحقق منها." };
  }
}

export async function removeHeroImageFile(settingsId: string) {
  try {
    const response = await fetch(`/api/admin/settings/hero?settingsId=${encodeURIComponent(settingsId)}`, { method: "DELETE" });
    const result = await response.json() as ApiResponse<{ message: string }>;
    return result.ok ? { success: result.data.message } : { error: result.error.message };
  } catch {
    return { error: "تعذر إزالة صورة Hero. حاول مجدداً." };
  }
}
