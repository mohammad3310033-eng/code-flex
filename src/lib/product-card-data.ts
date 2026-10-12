import type { Prisma } from "@/generated/prisma/client";

export const productCardSelect = {
  id: true,
  slug: true,
  name: true,
  brand: { select: { name: true } },
  priceUsdCents: true,
  stockStatus: true,
  laptopSpecs: {
    select: {
      cpuBrand: true,
      cpuModel: true,
      ramGB: true,
      storages: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { type: true, capacityGB: true },
      },
      gpuBrand: true,
      gpuModel: true,
    },
  },
  images: {
    orderBy: { sortOrder: "asc" },
    take: 1,
    select: {
      id: true,
      url: true,
    },
  },
} as const satisfies Prisma.ProductSelect;

export type ProductCardProduct = Prisma.ProductGetPayload<{
  select: typeof productCardSelect;
}>;

export type ProductCardLaptopSpecs = NonNullable<
  ProductCardProduct["laptopSpecs"]
>;
