"use client";

import type { ApiResponse } from "@/lib/admin-api-response";

export const categoryImageAccept = "image/jpeg,image/png,image/webp,image/avif,.jpg,.jpeg,.png,.webp,.avif";
export const supportedCategoryImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
type UploadResult = { imageUrl: string; success: string } | { error: string };
type RemoveResult = { success: string } | { error: string };

export async function uploadCategoryImageFile(categoryId: string, file: File): Promise<UploadResult> {
  try {
    const signatureResponse = await fetch(`/api/admin/categories/${encodeURIComponent(categoryId)}/upload-signature`, { method: "POST" });
    const signatureBody = await signatureResponse.json() as ApiResponse<{ cloudName: string; apiKey: string; timestamp: number; folder: string; allowedFormats: string[]; signature: string }>;
    if (!signatureResponse.ok || !signatureBody.ok) return { error: signatureBody.ok ? "تعذر تجهيز رفع الصورة." : signatureBody.error.message };

    const signature = signatureBody.data;
    const upload = new FormData();
    upload.set("file", file);
    upload.set("api_key", signature.apiKey);
    upload.set("timestamp", String(signature.timestamp));
    upload.set("folder", signature.folder);
    upload.set("allowed_formats", signature.allowedFormats.join(","));
    upload.set("overwrite", "false");
    upload.set("signature", signature.signature);
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, { method: "POST", body: upload });
    if (!uploadResponse.ok) return { error: "تعذر رفع الصورة إلى التخزين." };
    const asset = await uploadResponse.json() as { public_id?: string };
    if (!asset.public_id) return { error: "تعذر التحقق من الصورة المرفوعة." };

    const persistenceResponse = await fetch(`/api/admin/categories/${encodeURIComponent(categoryId)}/image`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ publicId: asset.public_id }),
    });
    const persistence = await persistenceResponse.json() as ApiResponse<{ message: string; imageUrl: string | null }>;
    if (!persistence.ok || !persistence.data.imageUrl) return { error: persistence.ok ? "تعذر حفظ صورة التصنيف." : persistence.error.message };
    return { imageUrl: persistence.data.imageUrl, success: persistence.data.message };
  } catch {
    return { error: "تعذر رفع صورة التصنيف أو حفظها." };
  }
}

export async function removeCategoryImageFile(categoryId: string): Promise<RemoveResult> {
  try {
    const response = await fetch(`/api/admin/categories/${encodeURIComponent(categoryId)}/image`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ publicId: null }),
    });
    const result = await response.json() as ApiResponse<{ message: string; imageUrl: string | null }>;
    return result.ok ? { success: result.data.message } : { error: result.error.message };
  } catch {
    return { error: "تعذر إزالة صورة التصنيف. حاول مجدداً." };
  }
}
