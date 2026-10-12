import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import {
  CATALOG_PAGE_SIZE,
  CATALOG_STORAGE_TYPE_VALUES,
  INTEGRATED_GPU_VALUE,
  clearLaptopCatalogFilters,
  updateCatalogParams,
  type CatalogSort,
  type CatalogState,
} from "@/lib/catalog-params";
import { prisma } from "@/lib/prisma";
import {
  productCardSelect,
  type ProductCardProduct,
} from "@/lib/product-card-data";

const catalogCategorySelect = {
  id: true,
  parentId: true,
  slug: true,
  nameAr: true,
  nameEn: true,
  descriptionAr: true,
  descriptionEn: true,
  sortOrder: true,
} as const satisfies Prisma.CategorySelect;

const catalogSettingsSelect = {
  storeName: true,
  usdToSypRate: true,
  whatsapp: true,
  phone: true,
} as const satisfies Prisma.SiteSettingsSelect;

const laptopOptionSelect = {
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
} as const satisfies Prisma.LaptopSpecsSelect;

const catalogOrderBy = {
  recommended: [
    { isFeatured: "desc" },
    { createdAt: "desc" },
    { slug: "asc" },
  ],
  "price-asc": [{ priceUsdCents: "asc" }, { slug: "asc" }],
  "price-desc": [{ priceUsdCents: "desc" }, { slug: "asc" }],
  newest: [{ createdAt: "desc" }, { slug: "asc" }],
} as const satisfies Record<
  CatalogSort,
  readonly Prisma.ProductOrderByWithRelationInput[]
>;

const technicalCollator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

export type CatalogCategory = Prisma.CategoryGetPayload<{
  select: typeof catalogCategorySelect;
}>;

export type CatalogCategoryNode = CatalogCategory & {
  children: CatalogCategoryNode[];
};

export type CatalogSettings = Prisma.SiteSettingsGetPayload<{
  select: typeof catalogSettingsSelect;
}>;

type LaptopOptionRow = Prisma.LaptopSpecsGetPayload<{
  select: typeof laptopOptionSelect;
}>;

export type CatalogCpuModelOption = {
  value: string;
  cpuBrand: string;
};

export type CatalogGpuOption =
  | {
      value: typeof INTEGRATED_GPU_VALUE;
      gpuBrand: null;
      gpuModel: null;
      integrated: true;
    }
  | {
      value: string;
      gpuBrand: string | null;
      gpuModel: string;
      integrated: false;
    };

export type CatalogFilterOptions = {
  brands: string[];
  cpuBrands: string[];
  cpuModels: CatalogCpuModelOption[];
  cpuGenerations: string[];
  ramGB: number[];
  storageGB: number[];
  storageTypes: CatalogState["storageType"];
  gpus: CatalogGpuOption[];
  screenSizes: string[];
};

export type CatalogCategoryContext = {
  selectedCategory: CatalogCategory | null;
  selectedCategoryIds: string[];
  laptopCategoryIds: string[];
  isLaptopContext: boolean;
};

export type CatalogData = {
  state: CatalogState;
  categories: CatalogCategory[];
  categoryTree: CatalogCategoryNode[];
  selectedCategory: CatalogCategory | null;
  selectedCategoryIds: string[];
  isLaptopContext: boolean;
  options: CatalogFilterOptions;
  products: ProductCardProduct[];
  settings: CatalogSettings;
  total: number;
  currentPage: number;
  totalPages: number;
  pageSize: typeof CATALOG_PAGE_SIZE;
};

function sortText(values: Iterable<string>) {
  return Array.from(new Set(values)).sort(technicalCollator.compare);
}

function sortNumbers(values: Iterable<number>) {
  return Array.from(new Set(values)).sort((first, second) => first - second);
}

export function buildCatalogCategoryTree(
  categories: readonly CatalogCategory[],
) {
  const nodesById = new Map<string, CatalogCategoryNode>(
    categories.map((category) => [category.id, { ...category, children: [] }]),
  );
  const roots: CatalogCategoryNode[] = [];

  for (const category of categories) {
    const node = nodesById.get(category.id);

    if (!node) continue;

    const parent = category.parentId
      ? nodesById.get(category.parentId)
      : undefined;

    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export function getCategoryDescendantIds(
  categories: readonly CatalogCategory[],
  categoryId: string,
) {
  const knownIds = new Set(categories.map((category) => category.id));

  if (!knownIds.has(categoryId)) {
    return [];
  }

  const childrenByParent = new Map<string, string[]>();

  for (const category of categories) {
    if (!category.parentId) continue;

    const children = childrenByParent.get(category.parentId) ?? [];
    children.push(category.id);
    childrenByParent.set(category.parentId, children);
  }

  const descendants: string[] = [];
  const visited = new Set<string>();
  const stack = [categoryId];

  while (stack.length > 0) {
    const currentId = stack.pop();

    if (!currentId || visited.has(currentId)) continue;

    visited.add(currentId);
    descendants.push(currentId);

    const children = childrenByParent.get(currentId) ?? [];

    for (let index = children.length - 1; index >= 0; index -= 1) {
      stack.push(children[index]);
    }
  }

  return descendants;
}

export function resolveCatalogCategoryContext(
  categories: readonly CatalogCategory[],
  categorySlug: string | undefined,
): CatalogCategoryContext {
  const categoryBySlug = new Map(
    categories.map((category) => [category.slug, category]),
  );
  const selectedCategory = categorySlug
    ? (categoryBySlug.get(categorySlug) ?? null)
    : null;
  const laptopCategory = categoryBySlug.get("laptops");
  const laptopCategoryIds = laptopCategory
    ? getCategoryDescendantIds(categories, laptopCategory.id)
    : [];
  const laptopCategoryIdSet = new Set(laptopCategoryIds);
  const selectedCategoryIds = selectedCategory
    ? getCategoryDescendantIds(categories, selectedCategory.id)
    : [];

  return {
    selectedCategory,
    selectedCategoryIds,
    laptopCategoryIds,
    isLaptopContext: selectedCategory
      ? laptopCategoryIdSet.has(selectedCategory.id)
      : false,
  };
}

function buildSearchWhere(query: string | undefined) {
  if (!query) return undefined;

  const terms = query.split(/\s+/u).filter(Boolean).slice(0, 8);

  return {
    AND: terms.map(
      (term): Prisma.ProductWhereInput => ({
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { brand: { is: { name: { contains: term, mode: "insensitive" } } } },
          { sku: { contains: term, mode: "insensitive" } },
          {
            laptopSpecs: {
              is: {
                OR: [
                  { cpuBrand: { contains: term, mode: "insensitive" } },
                  { cpuModel: { contains: term, mode: "insensitive" } },
                ],
              },
            },
          },
        ],
      }),
    ),
  } satisfies Prisma.ProductWhereInput;
}

function buildBaseContextWhere(
  state: CatalogState,
  selectedCategoryIds: readonly string[],
) {
  const and: Prisma.ProductWhereInput[] = [{ isActive: true }];
  const searchWhere = buildSearchWhere(state.q);

  if (selectedCategoryIds.length > 0) {
    and.push({ categoryId: { in: [...selectedCategoryIds] } });
  }

  if (searchWhere) {
    and.push(searchWhere);
  }

  return { AND: and } satisfies Prisma.ProductWhereInput;
}

export function buildCatalogProductWhere(
  state: CatalogState,
  selectedCategoryIds: readonly string[],
  isLaptopContext: boolean,
) {
  const and: Prisma.ProductWhereInput[] = [
    buildBaseContextWhere(state, selectedCategoryIds),
  ];

  if (state.brand.length > 0) {
    and.push({ brand: { is: { name: { in: state.brand, mode: "insensitive" } } } });
  }

  if (
    state.minPriceCents !== undefined ||
    state.maxPriceCents !== undefined
  ) {
    and.push({
      priceUsdCents: {
        gte: state.minPriceCents,
        lte: state.maxPriceCents,
      },
    });
  }

  if (state.stock.length > 0) {
    and.push({ stockStatus: { in: state.stock } });
  }

  if (state.condition.length > 0) {
    and.push({ condition: { in: state.condition } });
  }

  if (isLaptopContext) {
    const laptopAnd: Prisma.LaptopSpecsWhereInput[] = [];

    if (state.cpuBrand.length > 0) {
      laptopAnd.push({
        cpuBrand: { in: state.cpuBrand, mode: "insensitive" },
      });
    }

    if (state.cpuModel.length > 0) {
      laptopAnd.push({
        cpuModel: { in: state.cpuModel, mode: "insensitive" },
      });
    }

    if (state.cpuGeneration.length > 0) {
      laptopAnd.push({
        cpuGeneration: {
          in: state.cpuGeneration,
          mode: "insensitive",
        },
      });
    }

    if (state.ram.length > 0) {
      laptopAnd.push({ ramGB: { in: state.ram } });
    }

    if (state.storage.length > 0) {
      laptopAnd.push({ storages: { some: { capacityGB: { in: state.storage } } } });
    }

    if (state.storageType.length > 0) {
      laptopAnd.push({ storages: { some: { type: { in: state.storageType } } } });
    }

    if (state.screen.length > 0) {
      laptopAnd.push({ screenSize: { in: state.screen } });
    }

    if (state.gpu.length > 0) {
      const dedicatedGpuModels = state.gpu.filter(
        (gpu) => gpu.toLocaleLowerCase("en-US") !== INTEGRATED_GPU_VALUE,
      );
      const includesIntegrated = state.gpu.some(
        (gpu) => gpu.toLocaleLowerCase("en-US") === INTEGRATED_GPU_VALUE,
      );
      const gpuOr: Prisma.LaptopSpecsWhereInput[] = [];

      if (dedicatedGpuModels.length > 0) {
        gpuOr.push({
          gpuModel: {
            in: dedicatedGpuModels,
            mode: "insensitive",
          },
        });
      }

      if (includesIntegrated) {
        gpuOr.push({ gpuModel: null });
      }

      if (gpuOr.length > 0) {
        laptopAnd.push({ OR: gpuOr });
      }
    }

    if (laptopAnd.length > 0) {
      and.push({ laptopSpecs: { is: { AND: laptopAnd } } });
    }
  }

  return { AND: and } satisfies Prisma.ProductWhereInput;
}

export function getCatalogOrderBy(sort: CatalogSort) {
  return catalogOrderBy[sort].map((orderBy) => ({ ...orderBy }));
}

function buildCatalogFilterOptions(
  brandRows: readonly { name: string }[],
  laptopRows: readonly LaptopOptionRow[],
): CatalogFilterOptions {
  const cpuModels = new Map<string, CatalogCpuModelOption>();
  const gpuModels = new Map<string, CatalogGpuOption>();
  let includesIntegratedGraphics = false;

  for (const row of laptopRows) {
    const cpuModelKey = row.cpuModel.toLocaleLowerCase("en-US");

    if (!cpuModels.has(cpuModelKey)) {
      cpuModels.set(cpuModelKey, {
        value: row.cpuModel,
        cpuBrand: row.cpuBrand,
      });
    }

    if (row.gpuModel) {
      const gpuModelKey = row.gpuModel.toLocaleLowerCase("en-US");

      if (!gpuModels.has(gpuModelKey)) {
        gpuModels.set(gpuModelKey, {
          value: row.gpuModel,
          gpuBrand: row.gpuBrand,
          gpuModel: row.gpuModel,
          integrated: false,
        });
      }
    } else {
      includesIntegratedGraphics = true;
    }
  }

  const gpus = Array.from(gpuModels.values()).sort((first, second) =>
    technicalCollator.compare(
      [first.gpuBrand, first.gpuModel].filter(Boolean).join(" "),
      [second.gpuBrand, second.gpuModel].filter(Boolean).join(" "),
    ),
  );

  if (includesIntegratedGraphics) {
    gpus.unshift({
      value: INTEGRATED_GPU_VALUE,
      gpuBrand: null,
      gpuModel: null,
      integrated: true,
    });
  }

  return {
    brands: sortText(brandRows.map((row) => row.name)),
    cpuBrands: sortText(laptopRows.map((row) => row.cpuBrand)),
    cpuModels: Array.from(cpuModels.values()).sort((first, second) =>
      technicalCollator.compare(
        `${first.cpuBrand} ${first.value}`,
        `${second.cpuBrand} ${second.value}`,
      ),
    ),
    cpuGenerations: sortText(
      laptopRows.flatMap((row) =>
        row.cpuGeneration ? [row.cpuGeneration] : [],
      ),
    ),
    ramGB: sortNumbers(laptopRows.map((row) => row.ramGB)),
    storageGB: sortNumbers(laptopRows.flatMap((row) => row.storages.map((storage) => storage.capacityGB))),
    storageTypes: CATALOG_STORAGE_TYPE_VALUES.filter((storageType) =>
      laptopRows.some((row) => row.storages.some((storage) => storage.type === storageType)),
    ),
    gpus,
    screenSizes: Array.from(
      new Set(
        laptopRows.flatMap((row) =>
          row.screenSize ? [row.screenSize.toString()] : [],
        ),
      ),
    ).sort(
      (first, second) =>
        Number(first) - Number(second) || technicalCollator.compare(first, second),
    ),
  };
}

export async function getCatalogData(
  requestedState: CatalogState,
): Promise<CatalogData> {
  const [categories, settings] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
      select: catalogCategorySelect,
    }),
    prisma.siteSettings.findFirst({
      orderBy: { createdAt: "asc" },
      select: catalogSettingsSelect,
    }),
  ]);

  if (!settings) {
    throw new Error("Catalog SiteSettings are not configured.");
  }

  const categoryContext = resolveCatalogCategoryContext(
    categories,
    requestedState.category,
  );
  let state = updateCatalogParams(
    requestedState,
    { category: categoryContext.selectedCategory?.slug },
    { resetPage: false },
  );

  if (!categoryContext.isLaptopContext) {
    state = clearLaptopCatalogFilters(state, { resetPage: false });
  }

  const where = buildCatalogProductWhere(
    state,
    categoryContext.selectedCategoryIds,
    categoryContext.isLaptopContext,
  );
  const optionWhere = buildBaseContextWhere(
    state,
    categoryContext.selectedCategoryIds,
  );
  const laptopOptionsPromise = categoryContext.isLaptopContext
    ? prisma.laptopSpecs.findMany({
        where: { product: { is: optionWhere } },
        orderBy: [
          { cpuBrand: "asc" },
          { cpuModel: "asc" },
          { productId: "asc" },
        ],
        select: laptopOptionSelect,
      })
    : Promise.resolve<LaptopOptionRow[]>([]);

  const [total, brandRows, laptopRows] = await Promise.all([
    prisma.product.count({ where }),
    prisma.brand.findMany({
      where: { products: { some: optionWhere } },
      orderBy: [{ normalizedName: "asc" }, { id: "asc" }],
      select: { name: true },
    }),
    laptopOptionsPromise,
  ]);
  const totalPages = Math.max(1, Math.ceil(total / CATALOG_PAGE_SIZE));
  const currentPage = Math.min(state.page, totalPages);

  state = updateCatalogParams(
    state,
    { page: currentPage },
    { resetPage: false },
  );

  const products = await prisma.product.findMany({
    where,
    orderBy: getCatalogOrderBy(state.sort),
    skip: (currentPage - 1) * CATALOG_PAGE_SIZE,
    take: CATALOG_PAGE_SIZE,
    select: productCardSelect,
  });

  return {
    state,
    categories,
    categoryTree: buildCatalogCategoryTree(categories),
    selectedCategory: categoryContext.selectedCategory,
    selectedCategoryIds: categoryContext.selectedCategoryIds,
    isLaptopContext: categoryContext.isLaptopContext,
    options: buildCatalogFilterOptions(brandRows, laptopRows),
    products,
    settings,
    total,
    currentPage,
    totalPages,
    pageSize: CATALOG_PAGE_SIZE,
  };
}
