"use client";

export const productImageAccept = "image/jpeg,image/png,image/webp,image/avif,.jpg,.jpeg,.png,.webp,.avif";
export const supportedProductImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function uploadProductImageFile(productId: string, file: File) {
  try {
    const signatureResponse = await fetch(`/api/admin/products/${productId}/upload-signature`, { method: "POST" });
    if (!signatureResponse.ok) throw new Error("signature");
    const signatureBody = await signatureResponse.json() as { ok: boolean; data?: { cloudName: string; apiKey: string; timestamp: number; folder: string; allowedFormats: string[]; signature: string } };
    const signature = signatureBody.data;
    if (!signatureBody.ok || !signature) throw new Error("signature");
    const uploadForm = new FormData();
    uploadForm.set("file", file);
    uploadForm.set("api_key", signature.apiKey);
    uploadForm.set("timestamp", String(signature.timestamp));
    uploadForm.set("folder", signature.folder);
    uploadForm.set("allowed_formats", signature.allowedFormats.join(","));
    uploadForm.set("overwrite", "false");
    uploadForm.set("signature", signature.signature);
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, { method: "POST", body: uploadForm });
    if (!uploadResponse.ok) throw new Error("upload");
    const asset = await uploadResponse.json() as { public_id?: string };
    if (!asset.public_id) throw new Error("upload");
    const persistenceResponse = await fetch(`/api/admin/products/${productId}/images`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ publicId: asset.public_id }) });
    const result = await persistenceResponse.json() as { ok: boolean; data?: { image?: { id: string; publicId: string; url: string; sortOrder: number } }; error?: { message?: string } };
    if (!result.ok || !result.data?.image) return { ok: false as const, message: result.error?.message ?? "تعذر حفظ الصورة." };
    return { ok: true as const, image: result.data.image };
  } catch {
    return { ok: false as const, message: "تعذر رفع الصورة أو حفظها." };
  }
}
