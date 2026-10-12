import { getAdminSession } from "@/lib/admin-auth";
import { apiInternalError, apiNotFound, apiSuccess, apiUnauthorized, apiValidationError } from "@/lib/admin-api-response";
import { persistAdminCategoryImage } from "@/lib/admin-category-mutations";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!await getAdminSession()) return apiUnauthorized();
  const { id } = await context.params;
  let body: { publicId?: unknown };
  try { body = await request.json(); } catch { return apiValidationError("بيانات صورة التصنيف غير صالحة."); }
  const publicId = body.publicId === null ? null : typeof body.publicId === "string" ? body.publicId : undefined;
  if (publicId === undefined) return apiValidationError("بيانات صورة التصنيف غير صالحة.");
  const result = await persistAdminCategoryImage(id, publicId);
  if (result.ok) return apiSuccess({ message: result.message, imageUrl: result.imageUrl });
  if (result.code === "NOT_FOUND") return apiNotFound(result.message);
  if (result.code === "VALIDATION_ERROR") return apiValidationError(result.message);
  return apiInternalError(result.message);
}
