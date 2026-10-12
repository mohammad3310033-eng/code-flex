export const maxProductImages = 8;
export const maxProductImageBytes = 10 * 1024 * 1024;
export const acceptedProductImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export type ImageUploadCandidate = { id: string; name: string; type: string; size: number };
export type ImageUploadPlan = ImageUploadCandidate & { accepted: boolean; rejection?: "unsupported" | "too_large" | "capacity" };

export function planProductImageUploads(existingCount: number, files: ImageUploadCandidate[]): ImageUploadPlan[] {
  let remaining = Math.max(0, maxProductImages - existingCount);
  return files.map((file) => {
    if (!acceptedProductImageTypes.has(file.type)) return { ...file, accepted: false, rejection: "unsupported" };
    if (file.size > maxProductImageBytes) return { ...file, accepted: false, rejection: "too_large" };
    if (remaining <= 0) return { ...file, accepted: false, rejection: "capacity" };
    remaining -= 1;
    return { ...file, accepted: true };
  });
}

export function normalizeProductImageOrder<T extends { id: string }>(images: T[], movingId: string, beforeId: string): T[] {
  if (movingId === beforeId) return images;
  const moving = images.find((image) => image.id === movingId);
  const targetIndex = images.findIndex((image) => image.id === beforeId);
  if (!moving || targetIndex < 0) return images;
  const withoutMoving = images.filter((image) => image.id !== movingId);
  const adjustedTargetIndex = withoutMoving.findIndex((image) => image.id === beforeId);
  return [...withoutMoving.slice(0, adjustedTargetIndex), moving, ...withoutMoving.slice(adjustedTargetIndex)];
}

export function moveProductImageByDirection<T extends { id: string }>(images: T[], imageId: string, direction: "up" | "down"): T[] {
  const index = images.findIndex((image) => image.id === imageId);
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || targetIndex < 0 || targetIndex >= images.length) return images;
  const result = [...images];
  [result[index], result[targetIndex]] = [result[targetIndex]!, result[index]!];
  return result;
}
