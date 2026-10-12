import "server-only";

import { cache } from "react";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { productCardSelect } from "@/lib/product-card-data";

export const productDetailSelect = {
  id: true,
  slug: true,
  sku: true,
  name: true,
  brand: { select: { name: true } },
  categoryId: true,
  descriptionAr: true,
  descriptionEn: true,
  shortDescriptionAr: true,
  shortDescriptionEn: true,
  priceUsdCents: true,
  stockStatus: true,
  condition: true,
  extraSpecs: true,
  category: {
    select: {
      id: true,
      slug: true,
      nameAr: true,
      nameEn: true,
      parent: {
        select: {
          slug: true,
          nameAr: true,
          nameEn: true,
        },
      },
    },
  },
  laptopSpecs: {
    select: {
      cpuBrand: true,
      cpuModel: true,
      cpuGeneration: true,
      ramGB: true,
      storages: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { type: true, capacityGB: true },
      },
      gpuBrand: true,
      gpuModel: true,
      screenSize: true,
      resolution: true,
    },
  },
  images: {
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      url: true,
      sortOrder: true,
    },
  },
} as const satisfies Prisma.ProductSelect;

export type ProductDetailProduct = Prisma.ProductGetPayload<{
  select: typeof productDetailSelect;
}>;

const relatedProductOrder: Prisma.ProductOrderByWithRelationInput[] = [
  { isFeatured: "desc" },
  { createdAt: "desc" },
  { slug: "asc" },
] as const;

const getActiveProduct = cache(async (slug: string) =>
  prisma.product.findFirst({
    where: { slug, isActive: true },
    select: productDetailSelect,
  }),
);

export const getProductDetail = cache(async (slug: string) => {
  const product = await getActiveProduct(slug);

  if (!product) {
    return null;
  }

  const [settings, sameCategory] = await Promise.all([
    prisma.siteSettings.findFirst({
      orderBy: { createdAt: "asc" },
      select: {
        storeName: true,
        usdToSypRate: true,
        whatsapp: true,
        phone: true,
      },
    }),
    prisma.product.findMany({
      where: {
        isActive: true,
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      orderBy: relatedProductOrder,
      take: 4,
      select: productCardSelect,
    }),
  ]);

  if (!settings) {
    throw new Error("Storefront SiteSettings are not configured.");
  }

  if (sameCategory.length >= 4) {
    return { product, settings, relatedProducts: sameCategory };
  }

  const relatedIds = [product.id, ...sameCategory.map((item) => item.id)];
  const fallbackProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: { not: product.categoryId },
      id: { notIn: relatedIds },
    },
    orderBy: relatedProductOrder,
    take: 4 - sameCategory.length,
    select: productCardSelect,
  });

  return {
    product,
    settings,
    relatedProducts: [...sameCategory, ...fallbackProducts],
  };
});

export type ProductDetailData = NonNullable<
  Awaited<ReturnType<typeof getProductDetail>>
>;
