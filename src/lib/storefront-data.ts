import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";
import {
  productCardSelect,
  type ProductCardProduct,
} from "@/lib/product-card-data";

const priorityCategorySlugs = [
  "laptops",
  "accessories",
  "storage",
  "mice",
  "keyboards",
] as const;

const readStorefrontData = unstable_cache(
  async () => {
    const [categories, featuredProducts, settings] = await Promise.all([
      prisma.category.findMany({
        where: {
          isActive: true,
          slug: { in: [...priorityCategorySlugs] },
        },
        select: {
          id: true,
          slug: true,
          nameAr: true,
          nameEn: true,
          descriptionAr: true,
          descriptionEn: true,
        },
      }),
      prisma.product.findMany({
        where: {
          isActive: true,
          isFeatured: true,
        },
        orderBy: [{ createdAt: "asc" }, { slug: "asc" }],
        take: 5,
        select: productCardSelect,
      }),
      prisma.siteSettings.findFirst({
        orderBy: { createdAt: "asc" },
        select: {
          storeName: true,
          usdToSypRate: true,
          whatsapp: true,
          phone: true,
          heroEnabled: true,
          heroTitleAr: true,
          heroTitleEn: true,
          heroSubtitleAr: true,
          heroSubtitleEn: true,
          heroImageUrl: true,
        },
      }),
    ]);

    if (!settings) {
      throw new Error("Storefront SiteSettings are not configured.");
    }

    const categoryRank = new Map<string, number>(
      priorityCategorySlugs.map((slug, index) => [slug, index]),
    );

    categories.sort(
      (first, second) =>
        (categoryRank.get(first.slug) ?? Number.MAX_SAFE_INTEGER) -
        (categoryRank.get(second.slug) ?? Number.MAX_SAFE_INTEGER),
    );

    return { categories, featuredProducts, settings };
  },
  ["storefront-home-v1"],
  {
    revalidate: 300,
    tags: ["storefront-home"],
  },
);

export function getStorefrontData() {
  return readStorefrontData();
}

export type StorefrontData = Awaited<ReturnType<typeof getStorefrontData>>;
export type StorefrontCategory = StorefrontData["categories"][number];
export type StorefrontProduct = ProductCardProduct;
export type StorefrontSettings = Pick<
  StorefrontData["settings"],
  "storeName" | "usdToSypRate" | "whatsapp" | "phone"
>;
export type HomeStorefrontSettings = StorefrontData["settings"];
