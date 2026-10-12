import { z, type ZodType } from "zod";

import type {
  ProductCondition,
  StockStatus,
  StorageType,
} from "@/generated/prisma/enums";
import { getPathname } from "@/i18n/navigation";
import type { StoreLocale } from "@/i18n/routing";

export const CATALOG_PAGE_SIZE = 12;
export const CATALOG_MAX_FILTER_VALUES = 20;
export const CATALOG_MAX_PAGE = 100_000;
export const CATALOG_MAX_PRICE_USD_CENTS = 100_000_000;
export const INTEGRATED_GPU_VALUE = "integrated";

export const CATALOG_SORT_VALUES = [
  "recommended",
  "price-asc",
  "price-desc",
  "newest",
] as const;

export const CATALOG_STOCK_VALUES = [
  "IN_STOCK",
  "ON_REQUEST",
  "OUT_OF_STOCK",
] as const satisfies readonly StockStatus[];

export const CATALOG_CONDITION_VALUES = [
  "NEW",
  "USED",
  "REFURBISHED",
] as const satisfies readonly ProductCondition[];

export const CATALOG_STORAGE_TYPE_VALUES = [
  "NVME_SSD",
  "SATA_SSD",
  "HDD",
  "EMMC",
  "OTHER",
] as const satisfies readonly StorageType[];

export type CatalogSort = (typeof CATALOG_SORT_VALUES)[number];

export type CatalogSearchParamsInput = Record<
  string,
  string | string[] | undefined
>;

export type CatalogParams = {
  q?: string;
  category?: string;
  brand: string[];
  minPriceCents?: number;
  maxPriceCents?: number;
  stock: StockStatus[];
  condition: ProductCondition[];
  cpuBrand: string[];
  cpuModel: string[];
  cpuGeneration: string[];
  ram: number[];
  storage: number[];
  storageType: StorageType[];
  gpu: string[];
  screen: string[];
  sort: CatalogSort;
  page: number;
};

export type CatalogState = CatalogParams;

export type CatalogRepeatedParam =
  | "brand"
  | "stock"
  | "condition"
  | "cpuBrand"
  | "cpuModel"
  | "cpuGeneration"
  | "ram"
  | "storage"
  | "storageType"
  | "gpu"
  | "screen";

export type CatalogParamName =
  | "q"
  | "category"
  | CatalogRepeatedParam
  | "minPrice"
  | "maxPrice"
  | "sort"
  | "page";

export type CatalogFilterRemoval =
  | { key: "category" }
  | { key: "price" }
  | { key: "brand"; value: string }
  | { key: "stock"; value: StockStatus }
  | { key: "condition"; value: ProductCondition }
  | { key: "cpuBrand"; value: string }
  | { key: "cpuModel"; value: string }
  | { key: "cpuGeneration"; value: string }
  | { key: "ram"; value: number }
  | { key: "storage"; value: number }
  | { key: "storageType"; value: StorageType }
  | { key: "gpu"; value: string }
  | { key: "screen"; value: string };

const technicalCollator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

const sortSchema = z.enum(CATALOG_SORT_VALUES);
const stockSchema = z.enum(CATALOG_STOCK_VALUES);
const conditionSchema = z.enum(CATALOG_CONDITION_VALUES);
const storageTypeSchema = z.enum(CATALOG_STORAGE_TYPE_VALUES);

function normalizedTextSchema(maxLength: number) {
  return z
    .string()
    .trim()
    .min(1)
    .max(maxLength)
    .transform((value) => value.replace(/\s+/gu, " "));
}

const querySchema = normalizedTextSchema(80);
const categorySchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .transform((value) => value.toLowerCase())
  .pipe(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u));
const brandSchema = normalizedTextSchema(80);
const technicalValueSchema = normalizedTextSchema(120);

function integerStringSchema(minimum: number, maximum: number) {
  return z
    .string()
    .trim()
    .max(12)
    .regex(/^\d+$/u)
    .transform((value) => Number(value))
    .pipe(z.number().int().min(minimum).max(maximum));
}

const pageSchema = integerStringSchema(1, CATALOG_MAX_PAGE);
const ramSchema = integerStringSchema(1, 2_048);
const storageSchema = integerStringSchema(1, 1_048_576);

const priceSchema = z
  .string()
  .trim()
  .regex(/^\d{1,7}(?:\.\d{1,2})?$/u)
  .transform((value) => {
    const [dollars, fraction = ""] = value.split(".");
    return BigInt(dollars) * BigInt(100) + BigInt(fraction.padEnd(2, "0"));
  })
  .pipe(
    z
      .bigint()
      .min(BigInt(0))
      .max(BigInt(CATALOG_MAX_PRICE_USD_CENTS)),
  )
  .transform((value) => Number(value));

const screenSchema = z
  .string()
  .trim()
  .regex(/^\d{1,3}(?:\.\d)?$/u)
  .transform((value) => Number(value))
  .pipe(z.number().min(5).max(100))
  .transform((value) => String(value));

function getRawValues(input: CatalogSearchParamsInput, key: string) {
  const value = input[key];
  const values = Array.isArray(value) ? value : value === undefined ? [] : [value];

  return values.slice(0, CATALOG_MAX_FILTER_VALUES * 2);
}

function parseFirst<T>(
  input: CatalogSearchParamsInput,
  key: string,
  schema: ZodType<T>,
) {
  for (const value of getRawValues(input, key)) {
    const result = schema.safeParse(value);

    if (result.success) {
      return result.data;
    }
  }

  return undefined;
}

function uniqueKey(value: string | number) {
  return typeof value === "string"
    ? value.toLocaleLowerCase("en-US")
    : String(value);
}

function uniqueValues<T extends string | number>(values: readonly T[]) {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const value of values) {
    const key = uniqueKey(value);

    if (!seen.has(key)) {
      seen.add(key);
      result.push(value);
    }
  }

  return result;
}

function parseMany<T extends string | number>(
  input: CatalogSearchParamsInput,
  key: string,
  schema: ZodType<T>,
) {
  const parsed: T[] = [];

  for (const value of getRawValues(input, key)) {
    const result = schema.safeParse(value);

    if (result.success) {
      parsed.push(result.data);
    }
  }

  return uniqueValues(parsed).slice(0, CATALOG_MAX_FILTER_VALUES);
}

function sortText(values: readonly string[]) {
  return [...uniqueValues(values)].sort(technicalCollator.compare);
}

function sortNumbers(values: readonly number[]) {
  return [...uniqueValues(values)].sort((first, second) => first - second);
}

function sortByContract<T extends string>(
  values: readonly T[],
  contract: readonly T[],
) {
  const rank = new Map(contract.map((value, index) => [value, index]));

  return [...uniqueValues(values)].sort(
    (first, second) =>
      (rank.get(first) ?? Number.MAX_SAFE_INTEGER) -
      (rank.get(second) ?? Number.MAX_SAFE_INTEGER),
  );
}

function normalizePriceRange(
  minPriceCents: number | undefined,
  maxPriceCents: number | undefined,
) {
  if (
    minPriceCents !== undefined &&
    maxPriceCents !== undefined &&
    minPriceCents > maxPriceCents
  ) {
    return {
      minPriceCents: maxPriceCents,
      maxPriceCents: minPriceCents,
    };
  }

  return { minPriceCents, maxPriceCents };
}

function normalizeCatalogParams(params: CatalogParams): CatalogParams {
  const priceRange = normalizePriceRange(
    params.minPriceCents,
    params.maxPriceCents,
  );

  return {
    q: params.q,
    category: params.category,
    brand: sortText(params.brand),
    ...priceRange,
    stock: sortByContract(params.stock, CATALOG_STOCK_VALUES),
    condition: sortByContract(params.condition, CATALOG_CONDITION_VALUES),
    cpuBrand: sortText(params.cpuBrand),
    cpuModel: sortText(params.cpuModel),
    cpuGeneration: sortText(params.cpuGeneration),
    ram: sortNumbers(params.ram),
    storage: sortNumbers(params.storage),
    storageType: sortByContract(
      params.storageType,
      CATALOG_STORAGE_TYPE_VALUES,
    ),
    gpu: sortText(params.gpu),
    screen: [...uniqueValues(params.screen)].sort(
      (first, second) =>
        Number(first) - Number(second) || technicalCollator.compare(first, second),
    ),
    sort: params.sort,
    page: Math.min(
      CATALOG_MAX_PAGE,
      Math.max(1, Math.trunc(params.page) || 1),
    ),
  };
}

export function createDefaultCatalogParams(): CatalogParams {
  return {
    brand: [],
    stock: [],
    condition: [],
    cpuBrand: [],
    cpuModel: [],
    cpuGeneration: [],
    ram: [],
    storage: [],
    storageType: [],
    gpu: [],
    screen: [],
    sort: "recommended",
    page: 1,
  };
}

export function parseUsdToCents(value: string) {
  const result = priceSchema.safeParse(value);
  return result.success ? result.data : undefined;
}

export function formatUsdCentsParam(value: number) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error("USD cents must be a non-negative safe integer.");
  }

  const dollars = Math.trunc(value / 100);
  const cents = value % 100;

  if (cents === 0) {
    return String(dollars);
  }

  return `${dollars}.${String(cents).padStart(2, "0").replace(/0$/u, "")}`;
}

export function parseCatalogParams(
  input: CatalogSearchParamsInput,
): CatalogParams {
  const minPriceCents = parseFirst(input, "minPrice", priceSchema);
  const maxPriceCents = parseFirst(input, "maxPrice", priceSchema);
  const priceRange = normalizePriceRange(minPriceCents, maxPriceCents);

  return normalizeCatalogParams({
    q: parseFirst(input, "q", querySchema),
    category: parseFirst(input, "category", categorySchema),
    brand: parseMany(input, "brand", brandSchema),
    ...priceRange,
    stock: parseMany(input, "stock", stockSchema),
    condition: parseMany(input, "condition", conditionSchema),
    cpuBrand: parseMany(input, "cpuBrand", technicalValueSchema),
    cpuModel: parseMany(input, "cpuModel", technicalValueSchema),
    cpuGeneration: parseMany(input, "cpuGeneration", technicalValueSchema),
    ram: parseMany(input, "ram", ramSchema),
    storage: parseMany(input, "storage", storageSchema),
    storageType: parseMany(input, "storageType", storageTypeSchema),
    gpu: parseMany(input, "gpu", technicalValueSchema),
    screen: parseMany(input, "screen", screenSchema),
    sort: parseFirst(input, "sort", sortSchema) ?? "recommended",
    page: parseFirst(input, "page", pageSchema) ?? 1,
  });
}

export const parseCatalogSearchParams = parseCatalogParams;

function appendRepeated(
  searchParams: URLSearchParams,
  name: CatalogRepeatedParam,
  values: readonly (string | number)[],
) {
  for (const value of values) {
    searchParams.append(name, String(value));
  }
}

export function serializeCatalogParams(params: CatalogParams) {
  const normalized = normalizeCatalogParams(params);
  const searchParams = new URLSearchParams();

  if (normalized.q) searchParams.set("q", normalized.q);
  if (normalized.category) searchParams.set("category", normalized.category);
  appendRepeated(searchParams, "brand", normalized.brand);

  if (normalized.minPriceCents !== undefined) {
    searchParams.set(
      "minPrice",
      formatUsdCentsParam(normalized.minPriceCents),
    );
  }

  if (normalized.maxPriceCents !== undefined) {
    searchParams.set(
      "maxPrice",
      formatUsdCentsParam(normalized.maxPriceCents),
    );
  }

  appendRepeated(searchParams, "stock", normalized.stock);
  appendRepeated(searchParams, "condition", normalized.condition);
  appendRepeated(searchParams, "cpuBrand", normalized.cpuBrand);
  appendRepeated(searchParams, "cpuModel", normalized.cpuModel);
  appendRepeated(
    searchParams,
    "cpuGeneration",
    normalized.cpuGeneration,
  );
  appendRepeated(searchParams, "ram", normalized.ram);
  appendRepeated(searchParams, "storage", normalized.storage);
  appendRepeated(searchParams, "storageType", normalized.storageType);
  appendRepeated(searchParams, "gpu", normalized.gpu);
  appendRepeated(searchParams, "screen", normalized.screen);

  if (normalized.sort !== "recommended") {
    searchParams.set("sort", normalized.sort);
  }

  if (normalized.page > 1) {
    searchParams.set("page", String(normalized.page));
  }

  return searchParams;
}

export function catalogParamsToEntries(
  params: CatalogParams,
  omit: readonly CatalogParamName[] = [],
) {
  const omitted = new Set<string>(omit);

  return Array.from(serializeCatalogParams(params).entries()).filter(
    ([name]) => !omitted.has(name),
  );
}

export const catalogStateEntries = catalogParamsToEntries;

export type CatalogStatePatch = Partial<CatalogState>;

export type CatalogHrefOptions = { resetPage?: boolean };

export function updateCatalogParams(
  params: CatalogParams,
  updates: CatalogStatePatch,
  options: CatalogHrefOptions = {},
) {
  const next = {
    ...params,
    ...updates,
    brand: [...(updates.brand ?? params.brand)],
    stock: [...(updates.stock ?? params.stock)],
    condition: [...(updates.condition ?? params.condition)],
    cpuBrand: [...(updates.cpuBrand ?? params.cpuBrand)],
    cpuModel: [...(updates.cpuModel ?? params.cpuModel)],
    cpuGeneration: [
      ...(updates.cpuGeneration ?? params.cpuGeneration),
    ],
    ram: [...(updates.ram ?? params.ram)],
    storage: [...(updates.storage ?? params.storage)],
    storageType: [...(updates.storageType ?? params.storageType)],
    gpu: [...(updates.gpu ?? params.gpu)],
    screen: [...(updates.screen ?? params.screen)],
  } satisfies CatalogParams;

  if (options.resetPage !== false && updates.page === undefined) {
    next.page = 1;
  }

  return normalizeCatalogParams(next);
}

export function buildCatalogHref(
  pathname: string,
  params: CatalogParams,
  updates?: CatalogStatePatch,
  options?: CatalogHrefOptions,
) {
  const state = updates
    ? updateCatalogParams(params, updates, options)
    : normalizeCatalogParams(params);
  const search = serializeCatalogParams(state).toString();

  return search ? `${pathname}?${search}` : pathname;
}

export function buildLocalizedCatalogHref(
  locale: StoreLocale,
  params: CatalogParams,
  updates?: CatalogStatePatch,
  options?: CatalogHrefOptions,
) {
  return buildCatalogHref(
    getPathname({ href: "/products", locale }),
    params,
    updates,
    options,
  );
}

export function catalogStateKey(params: CatalogParams) {
  return serializeCatalogParams(params).toString();
}

export function countActiveCatalogFilters(params: CatalogParams) {
  return (
    (params.category ? 1 : 0) +
    params.brand.length +
    (params.minPriceCents !== undefined || params.maxPriceCents !== undefined
      ? 1
      : 0) +
    params.stock.length +
    params.condition.length +
    params.cpuBrand.length +
    params.cpuModel.length +
    params.cpuGeneration.length +
    params.ram.length +
    params.storage.length +
    params.storageType.length +
    params.gpu.length +
    params.screen.length
  );
}

export function hasActiveCatalogFilters(params: CatalogParams) {
  return countActiveCatalogFilters(params) > 0;
}

export function hasLaptopCatalogFilters(params: CatalogParams) {
  return (
    params.cpuBrand.length > 0 ||
    params.cpuModel.length > 0 ||
    params.cpuGeneration.length > 0 ||
    params.ram.length > 0 ||
    params.storage.length > 0 ||
    params.storageType.length > 0 ||
    params.gpu.length > 0 ||
    params.screen.length > 0
  );
}

export function clearLaptopCatalogFilters(
  params: CatalogParams,
  options: { resetPage?: boolean } = {},
) {
  return updateCatalogParams(
    params,
    {
      cpuBrand: [],
      cpuModel: [],
      cpuGeneration: [],
      ram: [],
      storage: [],
      storageType: [],
      gpu: [],
      screen: [],
    },
    options,
  );
}

export function clearCatalogSearch(params: CatalogParams) {
  return updateCatalogParams(params, { q: undefined });
}

export function clearCatalogFilters(params: CatalogParams) {
  return normalizeCatalogParams({
    ...createDefaultCatalogParams(),
    q: params.q,
    sort: params.sort,
  });
}

export function clearAllCatalogParams() {
  return createDefaultCatalogParams();
}

function removeOne<T>(values: readonly T[], value: T) {
  return values.filter((candidate) => candidate !== value);
}

export function removeCatalogFilter(
  params: CatalogParams,
  removal: CatalogFilterRemoval,
) {
  switch (removal.key) {
    case "category":
      return clearLaptopCatalogFilters(
        updateCatalogParams(params, { category: undefined }),
      );
    case "price":
      return updateCatalogParams(params, {
        minPriceCents: undefined,
        maxPriceCents: undefined,
      });
    case "brand":
      return updateCatalogParams(params, {
        brand: removeOne(params.brand, removal.value),
      });
    case "stock":
      return updateCatalogParams(params, {
        stock: removeOne(params.stock, removal.value),
      });
    case "condition":
      return updateCatalogParams(params, {
        condition: removeOne(params.condition, removal.value),
      });
    case "cpuBrand":
      return updateCatalogParams(params, {
        cpuBrand: removeOne(params.cpuBrand, removal.value),
      });
    case "cpuModel":
      return updateCatalogParams(params, {
        cpuModel: removeOne(params.cpuModel, removal.value),
      });
    case "cpuGeneration":
      return updateCatalogParams(params, {
        cpuGeneration: removeOne(params.cpuGeneration, removal.value),
      });
    case "ram":
      return updateCatalogParams(params, {
        ram: removeOne(params.ram, removal.value),
      });
    case "storage":
      return updateCatalogParams(params, {
        storage: removeOne(params.storage, removal.value),
      });
    case "storageType":
      return updateCatalogParams(params, {
        storageType: removeOne(params.storageType, removal.value),
      });
    case "gpu":
      return updateCatalogParams(params, {
        gpu: removeOne(params.gpu, removal.value),
      });
    case "screen":
      return updateCatalogParams(params, {
        screen: removeOne(params.screen, removal.value),
      });
  }
}
