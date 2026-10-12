import { deleteBrand, saveBrand } from "@/actions/admin-brands";
import { getAdminSession } from "@/lib/admin-auth";
import { apiConflict, apiNotFound, apiSuccess, apiUnauthorized, apiValidationError } from "@/lib/admin-api-response";

function resultResponse(result: { error?: string; success?: string }) {
  if (result.success) return apiSuccess({ message: result.success });
  if (result.error?.includes("موجودة مسبقاً")) return apiConflict(result.error);
  if (result.error?.includes("غير موجود")) return apiNotFound(result.error);
  return apiValidationError(result.error ?? "تعذر حفظ العلامة التجارية.");
}

export async function POST(request: Request) {
  if (!await getAdminSession()) return apiUnauthorized();
  let body: { id?: unknown; name?: unknown };
  try { body = await request.json(); } catch { return apiValidationError("بيانات العلامة التجارية غير صالحة."); }
  const form = new FormData(); form.set("id", typeof body.id === "string" ? body.id : ""); form.set("name", typeof body.name === "string" ? body.name : "");
  return resultResponse(await saveBrand({}, form));
}

export async function DELETE(request: Request) {
  if (!await getAdminSession()) return apiUnauthorized();
  return resultResponse(await deleteBrand(new URL(request.url).searchParams.get("id") ?? ""));
}
