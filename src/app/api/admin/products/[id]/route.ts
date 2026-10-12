import { getAdminSession } from "@/lib/admin-auth";
import { apiConflict, apiInternalError, apiNotFound, apiSuccess, apiUnauthorized, apiValidationError } from "@/lib/admin-api-response";
import { updateAdminProduct, type ProductMutationResult } from "@/lib/admin-product-mutations";
import { deleteProduct } from "@/actions/admin-products";

function productResponse(result: ProductMutationResult) {
  if (result.ok) return apiSuccess({ productId: result.productId, slug: result.slug });
  if (result.code === "VALIDATION_ERROR") return apiValidationError(result.message, result.fieldErrors);
  if (result.code === "CONFLICT") return apiConflict(result.message);
  if (result.code === "NOT_FOUND") return apiNotFound(result.message);
  return apiInternalError(result.message);
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!await getAdminSession()) {
    return apiUnauthorized();
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return apiValidationError("تعذر حفظ المنتج بسبب حقول غير صالحة.", { form: "بيانات الطلب غير صالحة." });
  }

  const { id } = await context.params;
  return productResponse(await updateAdminProduct(id, payload));
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!await getAdminSession()) return apiUnauthorized();
  const { id } = await context.params;
  const result = await deleteProduct(id);
  if (result.success) return apiSuccess({ message: result.success });
  if (result.error === "المنتج غير موجود.") return apiNotFound(result.error);
  return apiValidationError(result.error ?? "تعذر حذف المنتج.");
}
