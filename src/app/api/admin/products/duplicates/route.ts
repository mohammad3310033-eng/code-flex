import { getAdminSession } from "@/lib/admin-auth";
import { apiSuccess, apiUnauthorized } from "@/lib/admin-api-response";
import { prisma } from "@/lib/prisma";
import { postgresUuidSchema } from "@/lib/postgres-uuid";

export async function GET(request: Request) {
  if (!await getAdminSession()) return apiUnauthorized();

  const { searchParams } = new URL(request.url);
  const name = (searchParams.get("name") ?? "").trim().slice(0, 180);
  const excludeId = searchParams.get("excludeId");
  if (name.length < 2) return apiSuccess({ items: [] });

  const matches = await prisma.product.findMany({
    where: {
      name: { equals: name, mode: "insensitive" },
      ...(excludeId && postgresUuidSchema.safeParse(excludeId).success ? { id: { not: excludeId } } : {}),
    },
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    take: 5,
    select: { id: true, name: true, brand: { select: { name: true } }, category: { select: { nameAr: true } } },
  });

  return apiSuccess({
    items: matches.map((match) => ({
      id: match.id,
      name: match.name,
      brand: match.brand.name,
      categoryName: match.category.nameAr,
    })),
  });
}
