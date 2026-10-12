import { getAdminSession } from "@/lib/admin-auth";
import { apiNotFound, apiServiceUnavailable, apiSuccess, apiUnauthorized, apiValidationError } from "@/lib/admin-api-response";
import { getCloudinaryUploadSignature } from "@/lib/cloudinary";
import { postgresUuidSchema } from "@/lib/postgres-uuid";
import { prisma } from "@/lib/prisma";

const idSchema = postgresUuidSchema;

export async function POST(_request: Request, context: RouteContext<"/api/admin/products/[id]/upload-signature">) {
  if (!await getAdminSession()) return apiUnauthorized();
  const { id } = await context.params;

  if (!idSchema.safeParse(id).success) {
    return apiValidationError("المنتج غير صالح.");
  }

  const product = await prisma.product.findUnique({ where: { id }, select: { id: true } });
  if (!product) {
    return apiNotFound("المنتج غير موجود.");
  }

  try {
    return apiSuccess(getCloudinaryUploadSignature(product.id));
  } catch {
    return apiServiceUnavailable("خدمة الصور غير مهيأة حالياً.");
  }
}
