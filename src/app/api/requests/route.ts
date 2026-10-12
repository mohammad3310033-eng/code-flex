import { apiInternalError, apiNotFound, apiSuccess, apiValidationError } from "@/lib/admin-api-response";
import { createProductRequest } from "@/lib/product-request-mutations";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return apiValidationError("تحقّق من الحقول المطلوبة وصيغة البيانات.");
  }

  const result = await createProductRequest(payload);
  if (result.ok) return apiSuccess({ duplicate: result.duplicate }, result.duplicate ? 200 : 201);
  if (result.kind === "validation-error") {
    return apiValidationError("تحقّق من الحقول المطلوبة وصيغة البيانات.", Object.fromEntries(Object.keys(result.fieldErrors).map((field) => [field, "تحقّق من قيمة هذا الحقل."])));
  }
  if (result.kind === "unavailable") return apiNotFound("المنتج غير متاح حالياً.");
  return apiInternalError("تعذر إرسال الطلب. حاول مجدداً.");
}
