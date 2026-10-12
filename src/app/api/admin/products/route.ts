import { getAdminSession } from "@/lib/admin-auth";
import { apiConflict, apiInternalError, apiNotFound, apiSuccess, apiUnauthorized, apiValidationError } from "@/lib/admin-api-response";
import { createAdminProduct, type ProductMutationResult } from "@/lib/admin-product-mutations";

function productResponse(result: ProductMutationResult) {
  if (result.ok) return apiSuccess({ productId: result.productId, slug: result.slug }, 201);
  if (result.code === "VALIDATION_ERROR") return apiValidationError(result.message, result.fieldErrors);
  if (result.code === "CONFLICT") return apiConflict(result.message);
  if (result.code === "NOT_FOUND") return apiNotFound(result.message);
  return apiInternalError(result.message);
}

export async function POST(request: Request) {
  if (!await getAdminSession()) {
    return apiUnauthorized();
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return apiValidationError("تعذر حفظ المنتج بسبب حقول غير صالحة.", { form: "بيانات الطلب غير صالحة." });
  }

  return productResponse(await createAdminProduct(payload));
}
