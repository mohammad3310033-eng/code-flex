import { getAdminSession } from "@/lib/admin-auth";
import { apiNotFound, apiServiceUnavailable, apiSuccess, apiUnauthorized } from "@/lib/admin-api-response";
import { getCloudinaryHeroUploadSignature } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export async function POST() {
  if (!await getAdminSession()) return apiUnauthorized();
  const settings = await prisma.siteSettings.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true } });
  if (!settings) return apiNotFound("إعدادات المتجر غير موجودة.");
  try {
    return apiSuccess(getCloudinaryHeroUploadSignature(settings.id));
  } catch {
    return apiServiceUnavailable("خدمة الصور غير مهيأة حالياً.");
  }
}
