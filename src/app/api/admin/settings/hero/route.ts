import { getAdminSession } from "@/lib/admin-auth";
import { apiInternalError, apiNotFound, apiSuccess, apiUnauthorized, apiValidationError } from "@/lib/admin-api-response";
import { persistAdminHeroImage, removeAdminHeroImage } from "@/lib/admin-settings-mutations";

function response(result: Awaited<ReturnType<typeof persistAdminHeroImage>>) {
  if (result.ok) return apiSuccess({ message: result.message, ...(result.image ? { image: result.image } : {}) });
  if (result.code === "VALIDATION_ERROR") return apiValidationError(result.message, result.fieldErrors);
  if (result.code === "NOT_FOUND") return apiNotFound(result.message);
  return apiInternalError(result.message);
}

export async function POST(request: Request) {
  if (!await getAdminSession()) return apiUnauthorized();
  let payload: unknown;
  try { payload = await request.json(); } catch { return apiValidationError("بيانات صورة Hero غير صالحة."); }
  return response(await persistAdminHeroImage(payload));
}

export async function DELETE(request: Request) {
  if (!await getAdminSession()) return apiUnauthorized();
  const result = await removeAdminHeroImage(new URL(request.url).searchParams.get("settingsId") ?? "");
  return response(result);
}
