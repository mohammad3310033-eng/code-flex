import { getAdminSession } from "@/lib/admin-auth";
import { apiInternalError, apiNotFound, apiSuccess, apiUnauthorized, apiValidationError } from "@/lib/admin-api-response";
import { updateAdminSiteSettings } from "@/lib/admin-settings-mutations";

export async function PATCH(request: Request) {
  if (!await getAdminSession()) return apiUnauthorized();
  let payload: unknown;
  try { payload = await request.json(); } catch { return apiValidationError("تحقّق من الحقول المطلوبة وصيغة البيانات."); }

  const result = await updateAdminSiteSettings(payload);
  if (result.ok) return apiSuccess({ message: result.message });
  if (result.code === "VALIDATION_ERROR") return apiValidationError(result.message, result.fieldErrors);
  if (result.code === "NOT_FOUND") return apiNotFound(result.message);
  return apiInternalError(result.message);
}
