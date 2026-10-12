import { getAdminSession } from "@/lib/admin-auth";
import { apiNotFound, apiServiceUnavailable, apiSuccess, apiUnauthorized, apiValidationError } from "@/lib/admin-api-response";
import { getCloudinaryCategoryUploadSignature } from "@/lib/cloudinary";
import { postgresUuidSchema } from "@/lib/postgres-uuid";
import { prisma } from "@/lib/prisma";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!await getAdminSession()) return apiUnauthorized();
  const { id } = await context.params;
  if (!postgresUuidSchema.safeParse(id).success) return apiValidationError("التصنيف غير صالح.");
  const category = await prisma.category.findUnique({ where: { id }, select: { id: true } });
  if (!category) return apiNotFound("التصنيف غير موجود.");
  try {
    return apiSuccess(getCloudinaryCategoryUploadSignature(id));
  } catch {
    return apiServiceUnavailable("خدمة الصور غير مهيأة حالياً.");
  }
}
