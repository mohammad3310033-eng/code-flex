import { getAdminSession } from "@/lib/admin-auth";
import { apiNotFound, apiSuccess, apiUnauthorized, apiValidationError } from "@/lib/admin-api-response";
import { updateAdminOrderStatus } from "@/lib/admin-order-mutations";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!await getAdminSession()) return apiUnauthorized();
  let body: { status?: unknown };
  try { body = await request.json(); } catch { return apiValidationError("تعذر تحديث حالة الطلب."); }
  const { id } = await context.params;
  const result = await updateAdminOrderStatus({ orderId: id, status: body.status });
  if (result.ok) return apiSuccess({ message: result.message });
  if (result.code === "NOT_FOUND") return apiNotFound(result.message);
  return apiValidationError(result.message);
}
