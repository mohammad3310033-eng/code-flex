import { deleteProductImage, persistProductImage, reorderProductImages } from "@/actions/admin-products";
import { getAdminSession } from "@/lib/admin-auth";
import { apiInternalError, apiSuccess, apiUnauthorized, apiValidationError } from "@/lib/admin-api-response";

function imageResult(result: Awaited<ReturnType<typeof persistProductImage>>) {
  if (result.error) return apiValidationError(result.error);
  return apiSuccess({ image: result.image, message: result.success });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!await getAdminSession()) return apiUnauthorized();
  const { id } = await context.params;
  let body: { publicId?: unknown };
  try { body = await request.json(); } catch { return apiValidationError("بيانات الصورة غير صالحة."); }
  const formData = new FormData();
  formData.set("productId", id);
  formData.set("publicId", typeof body.publicId === "string" ? body.publicId : "");
  return imageResult(await persistProductImage({}, formData));
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!await getAdminSession()) return apiUnauthorized();
  const { id } = await context.params;
  let body: { imageIds?: unknown };
  try { body = await request.json(); } catch { return apiValidationError("ترتيب الصور غير صالح."); }
  const result = await reorderProductImages(id, Array.isArray(body.imageIds) ? body.imageIds.filter((item): item is string => typeof item === "string") : []);
  if (result.error) return apiValidationError(result.error);
  return apiSuccess({ message: result.success });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!await getAdminSession()) return apiUnauthorized();
  const { id } = await context.params;
  const imageId = new URL(request.url).searchParams.get("imageId") ?? "";
  const result = await deleteProductImage(id, imageId);
  if (result.error) return apiValidationError(result.error);
  if (!result.success) return apiInternalError("تعذر حذف الصورة.");
  return apiSuccess({ message: result.success });
}
