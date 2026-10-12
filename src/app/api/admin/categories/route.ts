import { getAdminSession } from "@/lib/admin-auth";
import { apiConflict, apiInternalError, apiNotFound, apiSuccess, apiUnauthorized, apiValidationError } from "@/lib/admin-api-response";
import { deleteAdminCategory, saveAdminCategory, type CategoryMutationResult } from "@/lib/admin-category-mutations";

function resultResponse(result: CategoryMutationResult) {
  if (result.ok) return apiSuccess({ message: result.message, categoryId: result.categoryId });
  if (result.code === "CONFLICT") return apiConflict(result.message);
  if (result.code === "NOT_FOUND") return apiNotFound(result.message);
  if (result.code === "VALIDATION_ERROR") return apiValidationError(result.message, result.fieldErrors);
  return apiInternalError(result.message);
}

export async function POST(request: Request) {
  if (!await getAdminSession()) return apiUnauthorized();
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; } catch { return apiValidationError("بيانات التصنيف غير صالحة."); }
  return resultResponse(await saveAdminCategory(body));
}

export async function DELETE(request: Request) {
  if (!await getAdminSession()) return apiUnauthorized();
  return resultResponse(await deleteAdminCategory(new URL(request.url).searchParams.get("id") ?? ""));
}
