import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import {
  ActiveFilters,
  type ActiveFilterItem,
} from "@/components/catalog/active-filters";
import { CatalogEmptyState } from "@/components/catalog/catalog-empty-state";
import { CatalogFilterSheet } from "@/components/catalog/catalog-filter-sheet";
import {
  CatalogFilters,
  type CatalogCategoryFilterNode,
  type CatalogFilterOptions as CatalogFilterViewOptions,
} from "@/components/catalog/catalog-filters";
import {
  CatalogPagination,
  type CatalogPaginationItem,
} from "@/components/catalog/catalog-pagination";
import { CatalogSearch } from "@/components/catalog/catalog-search";
import { CatalogToolbar } from "@/components/catalog/catalog-toolbar";
import { ProductCard } from "@/components/storefront/product-card";
import { StorefrontFooter } from "@/components/storefront/footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import type {
  ProductCondition,
  StockStatus,
  StorageType,
} from "@/generated/prisma/enums";
import { getPathname } from "@/i18n/navigation";
import { routing, type StoreLocale } from "@/i18n/routing";
import {
  CATALOG_CONDITION_VALUES,
  CATALOG_SORT_VALUES,
  CATALOG_STOCK_VALUES,
  buildCatalogHref,
  buildLocalizedCatalogHref,
  catalogStateEntries,
  catalogStateKey,
  clearCatalogFilters,
  clearCatalogSearch,
  clearLaptopCatalogFilters,
  countActiveCatalogFilters,
  formatUsdCentsParam,
  hasActiveCatalogFilters,
  parseCatalogSearchParams,
  removeCatalogFilter,
  updateCatalogParams,
  type CatalogState,
  type CatalogSearchParamsInput,
} from "@/lib/catalog-params";
import {
  getCatalogData,
  getCategoryDescendantIds,
  type CatalogCategoryNode,
  type CatalogData,
} from "@/lib/catalog-data";
import { formatUsd } from "@/lib/money";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<CatalogSearchParamsInput>;
};

type CatalogTranslator = Awaited<ReturnType<typeof getCatalogTranslator>>;

async function getCatalogTranslator(locale: StoreLocale) {
  return getTranslations({ locale, namespace: "Catalog" });
}

export async function generateMetadata({
  params,
}: Pick<ProductsPageProps, "params">): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getCatalogTranslator(locale);

  return {
    title: t("metadataTitle"),
    description: t("metadataDescription"),
  };
}

function getStorageCapacityLabel(storageGB: number) {
  return storageGB >= 1024 && storageGB % 1024 === 0
    ? `${storageGB / 1024} TB`
    : `${storageGB} GB`;
}

function getScreenSizeLabel(screenSize: string) {
  return `${screenSize.replace(/\.0$/u, "")}″`;
}

function getLaptopCategoryIds(data: CatalogData) {
  const laptops = data.categories.find((category) => category.slug === "laptops");

  return new Set(
    laptops ? getCategoryDescendantIds(data.categories, laptops.id) : [],
  );
}

function buildCategoryView(
  nodes: readonly CatalogCategoryNode[],
  state: CatalogState,
  productsPath: string,
  locale: StoreLocale,
  laptopCategoryIds: ReadonlySet<string>,
): CatalogCategoryFilterNode[] {
  return nodes.map((node) => {
    let nextState = updateCatalogParams(state, { category: node.slug });

    if (!laptopCategoryIds.has(node.id)) {
      nextState = clearLaptopCatalogFilters(nextState);
    }

    return {
      id: node.id,
      slug: node.slug,
      name: locale === "ar" ? node.nameAr : node.nameEn,
      href: buildCatalogHref(productsPath, nextState),
      active: state.category === node.slug,
      children: buildCategoryView(
        node.children,
        state,
        productsPath,
        locale,
        laptopCategoryIds,
      ),
    };
  });
}

function getStockLabel(t: CatalogTranslator, value: StockStatus) {
  const labels = {
    IN_STOCK: t("inStock"),
    ON_REQUEST: t("onRequest"),
    OUT_OF_STOCK: t("outOfStock"),
  } satisfies Record<StockStatus, string>;

  return labels[value];
}

function getConditionLabel(t: CatalogTranslator, value: ProductCondition) {
  const labels = {
    NEW: t("newCondition"),
    USED: t("usedCondition"),
    REFURBISHED: t("refurbishedCondition"),
  } satisfies Record<ProductCondition, string>;

  return labels[value];
}

function getStorageTypeLabel(t: CatalogTranslator, value: StorageType) {
  const labels = {
    NVME_SSD: t("nvmeSsd"),
    SATA_SSD: t("sataSsd"),
    HDD: t("hdd"),
    EMMC: t("emmc"),
    OTHER: t("otherStorage"),
  } satisfies Record<StorageType, string>;

  return labels[value];
}

function buildFilterViewOptions(
  data: CatalogData,
  t: CatalogTranslator,
): CatalogFilterViewOptions {
  return {
    brands: data.options.brands.map((brand) => ({ value: brand, label: brand })),
    stock: CATALOG_STOCK_VALUES.map((value) => ({
      value,
      label: getStockLabel(t, value),
    })),
    conditions: CATALOG_CONDITION_VALUES.map((value) => ({
      value,
      label: getConditionLabel(t, value),
    })),
    laptop: data.isLaptopContext
      ? {
          cpuBrands: data.options.cpuBrands.map((value) => ({ value, label: value })),
          cpuModels: data.options.cpuModels.map((option) => ({
            value: option.value,
            label: `${option.cpuBrand} ${option.value}`,
          })),
          cpuGenerations: data.options.cpuGenerations.map((value) => ({
            value,
            label: value,
          })),
          ram: data.options.ramGB.map((value) => ({
            value: String(value),
            label: `${value} GB`,
          })),
          storage: data.options.storageGB.map((value) => ({
            value: String(value),
            label: getStorageCapacityLabel(value),
          })),
          storageTypes: data.options.storageTypes.map((value) => ({
            value,
            label: getStorageTypeLabel(t, value),
          })),
          gpu: data.options.gpus.map((option) => ({
            value: option.value,
            label: option.integrated
              ? t("integratedGraphics")
              : [option.gpuBrand, option.gpuModel].filter(Boolean).join(" "),
          })),
          screens: data.options.screenSizes.map((value) => ({
            value,
            label: getScreenSizeLabel(value),
          })),
        }
      : undefined,
  };
}

function buildActiveFilterItems(
  data: CatalogData,
  productsPath: string,
  t: CatalogTranslator,
  locale: StoreLocale,
): ActiveFilterItem[] {
  const { state } = data;
  const items: ActiveFilterItem[] = [];
  const hrefFor = (nextState: CatalogState) =>
    buildCatalogHref(productsPath, nextState);
  const add = (key: string, label: string, nextState: CatalogState) => {
    items.push({ key, label, href: hrefFor(nextState) });
  };
  const cpuModelLabels = new Map(
    data.options.cpuModels.map((option) => [
      option.value.toLocaleLowerCase("en-US"),
      `${option.cpuBrand} ${option.value}`,
    ]),
  );
  const gpuLabels = new Map(
    data.options.gpus.map((option) => [
      option.value.toLocaleLowerCase("en-US"),
      option.integrated
        ? t("integratedGraphics")
        : [option.gpuBrand, option.gpuModel].filter(Boolean).join(" "),
    ]),
  );

  if (state.q) {
    add("q", `“${state.q}”`, clearCatalogSearch(state));
  }

  if (state.category && data.selectedCategory) {
    add(
      "category",
      locale === "ar"
        ? data.selectedCategory.nameAr
        : data.selectedCategory.nameEn,
      removeCatalogFilter(state, { key: "category" }),
    );
  }

  for (const value of state.brand) {
    add(
      `brand-${value}`,
      value,
      removeCatalogFilter(state, { key: "brand", value }),
    );
  }

  if (
    state.minPriceCents !== undefined ||
    state.maxPriceCents !== undefined
  ) {
    const label =
      state.minPriceCents !== undefined && state.maxPriceCents !== undefined
        ? t("priceRange", {
            min: formatUsd(state.minPriceCents),
            max: formatUsd(state.maxPriceCents),
          })
        : state.minPriceCents !== undefined
          ? t("minimumPriceChip", { price: formatUsd(state.minPriceCents) })
          : t("maximumPriceChip", {
              price: formatUsd(state.maxPriceCents ?? 0),
            });

    add("price", label, removeCatalogFilter(state, { key: "price" }));
  }

  for (const value of state.stock) {
    add(
      `stock-${value}`,
      getStockLabel(t, value),
      removeCatalogFilter(state, { key: "stock", value }),
    );
  }

  for (const value of state.condition) {
    add(
      `condition-${value}`,
      getConditionLabel(t, value),
      removeCatalogFilter(state, { key: "condition", value }),
    );
  }

  const technicalFilters: Array<{
    name:
      | "cpuBrand"
      | "cpuModel"
      | "cpuGeneration"
      | "ram"
      | "storage"
      | "storageType"
      | "gpu"
      | "screen";
    values: readonly (string | number | StorageType)[];
    label: (value: string | number | StorageType) => string;
  }> = [
    { name: "cpuBrand", values: state.cpuBrand, label: String },
    {
      name: "cpuModel",
      values: state.cpuModel,
      label: (value) =>
        cpuModelLabels.get(String(value).toLocaleLowerCase("en-US")) ??
        String(value),
    },
    { name: "cpuGeneration", values: state.cpuGeneration, label: String },
    { name: "ram", values: state.ram, label: (value) => `${value} GB` },
    {
      name: "storage",
      values: state.storage,
      label: (value) => getStorageCapacityLabel(Number(value)),
    },
    {
      name: "storageType",
      values: state.storageType,
      label: (value) => getStorageTypeLabel(t, value as StorageType),
    },
    {
      name: "gpu",
      values: state.gpu,
      label: (value) =>
        gpuLabels.get(String(value).toLocaleLowerCase("en-US")) ??
        String(value),
    },
    {
      name: "screen",
      values: state.screen,
      label: (value) => getScreenSizeLabel(String(value)),
    },
  ];

  for (const filter of technicalFilters) {
    for (const value of filter.values) {
      add(
        `${filter.name}-${value}`,
        filter.label(value),
        removeCatalogFilter(state, {
          key: filter.name,
          value,
        } as Parameters<typeof removeCatalogFilter>[1]),
      );
    }
  }

  return items;
}

function getPaginationPages(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  return Array.from(
    new Set([1, 2, currentPage - 1, currentPage, currentPage + 1, totalPages - 1, totalPages]),
  )
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((first, second) => first - second);
}

function buildPaginationItems(
  state: CatalogState,
  productsPath: string,
  currentPage: number,
  totalPages: number,
): CatalogPaginationItem[] {
  const pages = getPaginationPages(currentPage, totalPages);
  const items: CatalogPaginationItem[] = [];

  pages.forEach((page, index) => {
    const previousPage = pages[index - 1];

    if (previousPage !== undefined && page - previousPage > 1) {
      items.push({ type: "ellipsis", key: `ellipsis-${previousPage}-${page}` });
    }

    items.push({
      type: "page",
      page,
      current: page === currentPage,
      href: buildCatalogHref(
        productsPath,
        state,
        { page },
        { resetPage: false },
      ),
    });
  });

  return items;
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const [{ locale }, rawSearchParams] = await Promise.all([params, searchParams]);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const [data, t, featuredT] = await Promise.all([
    getCatalogData(parseCatalogSearchParams(rawSearchParams)),
    getCatalogTranslator(locale),
    getTranslations({ locale, namespace: "Featured" }),
  ]);
  const { state } = data;
  const productsPath = getPathname({ href: "/products", locale });
  const stateKey = catalogStateKey(state);
  const activeFilterCount = countActiveCatalogFilters(state);
  const laptopCategoryIds = getLaptopCategoryIds(data);
  const categoryNodes = buildCategoryView(
    data.categoryTree,
    state,
    productsPath,
    locale,
    laptopCategoryIds,
  );
  const allCategoriesState = clearLaptopCatalogFilters(
    updateCatalogParams(state, { category: undefined }),
  );
  const allCategoriesHref = buildCatalogHref(productsPath, allCategoriesState);
  const clearFiltersState = clearCatalogFilters(state);
  const clearFiltersHref = buildCatalogHref(productsPath, clearFiltersState);
  const clearSearchHref = buildCatalogHref(productsPath, clearCatalogSearch(state));
  const filterOptions = buildFilterViewOptions(data, t);
  const filterSelections = {
    brands: state.brand,
    minPrice:
      state.minPriceCents === undefined
        ? ""
        : formatUsdCentsParam(state.minPriceCents),
    maxPrice:
      state.maxPriceCents === undefined
        ? ""
        : formatUsdCentsParam(state.maxPriceCents),
    stock: state.stock,
    conditions: state.condition,
    cpuBrands: state.cpuBrand,
    cpuModels: state.cpuModel,
    cpuGenerations: state.cpuGeneration,
    ram: state.ram.map(String),
    storage: state.storage.map(String),
    storageTypes: state.storageType,
    gpu: state.gpu,
    screens: state.screen,
  };
  const filterLabels = {
    title: t("filtersTitle"),
    clear: t("clearFilters"),
    allCategories: t("allCategories"),
    category: t("category"),
    brand: t("brand"),
    price: t("price"),
    minPrice: t("minPrice"),
    maxPrice: t("maxPrice"),
    availability: t("availability"),
    condition: t("condition"),
    laptopSpecifications: t("laptopSpecifications"),
    cpuBrand: t("cpuBrand"),
    cpuModel: t("cpuModel"),
    cpuGeneration: t("cpuGeneration"),
    ram: t("ram"),
    storage: t("storage"),
    storageType: t("storageType"),
    gpu: t("gpu"),
    screen: t("screen"),
    apply: t("applyFilters"),
  };
  const filterHiddenEntries = catalogStateEntries(state, [
    "brand",
    "minPrice",
    "maxPrice",
    "stock",
    "condition",
    "cpuBrand",
    "cpuModel",
    "cpuGeneration",
    "ram",
    "storage",
    "storageType",
    "gpu",
    "screen",
    "page",
  ]);
  const activeItems = buildActiveFilterItems(data, productsPath, t, locale);
  const selectedCategoryName = data.selectedCategory
    ? locale === "ar"
      ? data.selectedCategory.nameAr
      : data.selectedCategory.nameEn
    : undefined;
  const contextLabels = [
    selectedCategoryName
      ? t("categoryContext", { category: selectedCategoryName })
      : undefined,
    state.q ? t("searchContext", { query: state.q }) : undefined,
  ].filter((label): label is string => Boolean(label));
  const productCardLabels = {
    details: featuredT("details"),
    noImage: featuredT("noImagePreview"),
    mediaLabel: featuredT("mediaLabel"),
    cpu: featuredT("cpu"),
    ram: featuredT("ram"),
    storage: featuredT("storage"),
    graphics: featuredT("graphics"),
    integratedGraphics: featuredT("integratedGraphics"),
    inStock: featuredT("inStock"),
    outOfStock: featuredT("outOfStock"),
    onRequest: featuredT("onRequest"),
  };
  const direction = locale === "ar" ? "rtl" : "ltr";
  const mobileFilters = (
    <CatalogFilterSheet
      key={`mobile-filters-${stateKey}`}
      direction={direction}
      title={t("filtersTitle")}
      openLabel={t("openFilters")}
      closeLabel={t("closeFilters")}
      activeFilterCount={activeFilterCount}
      activeFilterCountLabel={t("activeFilterCount", {
        count: activeFilterCount,
      })}
    >
      <CatalogFilters
        instance="mobile"
        action={productsPath}
        stateKey={stateKey}
        hiddenEntries={filterHiddenEntries}
        categories={categoryNodes}
        allCategoriesHref={allCategoriesHref}
        allCategoriesActive={!state.category}
        selections={filterSelections}
        options={filterOptions}
        clearHref={clearFiltersHref}
        labels={filterLabels}
      />
    </CatalogFilterSheet>
  );
  const previousHref =
    data.currentPage > 1
      ? buildCatalogHref(
          productsPath,
          state,
          { page: data.currentPage - 1 },
          { resetPage: false },
        )
      : undefined;
  const nextHref =
    data.currentPage < data.totalPages
      ? buildCatalogHref(
          productsPath,
          state,
          { page: data.currentPage + 1 },
          { resetPage: false },
        )
      : undefined;
  const isCategoryOnlyEmpty =
    data.total === 0 &&
    Boolean(state.category) &&
    !state.q &&
    activeFilterCount === 1;

  return (
    <div id="top" className="min-h-dvh">
      <StorefrontHeader
        locale={locale}
        settings={data.settings}
        activeSection="products"
        languageHrefs={{
          ar: buildLocalizedCatalogHref("ar", state, undefined, {
            resetPage: false,
          }),
          en: buildLocalizedCatalogHref("en", state, undefined, {
            resetPage: false,
          }),
        }}
      />

      <main>
        <section className="page-shell py-10 sm:py-14 lg:py-16" aria-labelledby="catalog-title">
          <div className="max-w-3xl">
            <p className="section-kicker text-primary">
              <span className="size-1.5 rounded-full bg-primary" />
              {t("eyebrow")}
            </p>
            <h1
              id="catalog-title"
              className="mt-4 max-w-2xl text-balance text-4xl leading-[1.15] font-semibold tracking-[-0.04em] text-foreground sm:text-[2.75rem] lg:text-5xl"
            >
              {t("title")}
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-sm leading-7 text-muted-foreground sm:text-base">
              {t("description")}
            </p>
          </div>

          <div className="mt-8">
            <CatalogSearch
              action={productsPath}
              query={state.q ?? ""}
              hiddenEntries={catalogStateEntries(state, ["q", "page"])}
              clearHref={clearSearchHref}
              stateKey={stateKey}
              labels={{
                label: t("searchLabel"),
                placeholder: t("searchPlaceholder"),
                submit: t("searchSubmit"),
                clear: t("clearSearch"),
              }}
            />
            <ActiveFilters
              items={activeItems}
              clearHref={productsPath}
              title={t("activeFilters")}
              clearLabel={t("clearAll")}
              removeLabel={(label) => t("removeFilter", { label })}
            />
          </div>

          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
            <aside className="sticky top-24 hidden rounded-[1.25rem] border border-black/8 bg-white p-5 lg:block">
              <CatalogFilters
                instance="desktop"
                action={productsPath}
                stateKey={stateKey}
                hiddenEntries={filterHiddenEntries}
                categories={categoryNodes}
                allCategoriesHref={allCategoriesHref}
                allCategoriesActive={!state.category}
                selections={filterSelections}
                options={filterOptions}
                clearHref={clearFiltersHref}
                labels={filterLabels}
              />
            </aside>

            <section className="min-w-0" aria-labelledby="catalog-results-title">
              <CatalogToolbar
                action={productsPath}
                stateKey={stateKey}
                hiddenEntries={catalogStateEntries(state, ["sort", "page"])}
                countLabel={t("resultsCount", { count: data.total })}
                contextLabels={contextLabels}
                resultsHeading={t("resultsHeading")}
                sort={state.sort}
                sortOptions={CATALOG_SORT_VALUES.map((value) => ({
                  value,
                  label:
                    value === "recommended"
                      ? t("sortRecommended")
                      : value === "price-asc"
                        ? t("sortPriceAsc")
                        : value === "price-desc"
                          ? t("sortPriceDesc")
                          : t("sortNewest"),
                }))}
                sortLabel={t("sortLabel")}
                sortApplyLabel={t("sortApply")}
                mobileFilters={mobileFilters}
              />

              {data.products.length > 0 ? (
                <>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {data.products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        locale={locale}
                        usdToSypRate={data.settings.usdToSypRate}
                        labels={productCardLabels}
                      />
                    ))}
                  </div>
                  <CatalogPagination
                    currentPage={data.currentPage}
                    totalPages={data.totalPages}
                    previousHref={previousHref}
                    nextHref={nextHref}
                    items={buildPaginationItems(
                      state,
                      productsPath,
                      data.currentPage,
                      data.totalPages,
                    )}
                    labels={{
                      navigation: t("paginationLabel"),
                      previous: t("previousPage"),
                      next: t("nextPage"),
                      page: (page) => t("pageLabel", { page }),
                    }}
                  />
                </>
              ) : (
                <div className="mt-6">
                  <CatalogEmptyState
                    title={
                      isCategoryOnlyEmpty
                        ? t("noCategoryTitle")
                        : t("noResultsTitle")
                    }
                    description={
                      isCategoryOnlyEmpty
                        ? t("noCategoryDescription")
                        : t("noResultsDescription")
                    }
                    browseAllHref={productsPath}
                    browseAllLabel={t("browseAll")}
                    clearFiltersHref={
                      hasActiveCatalogFilters(state)
                        ? clearFiltersHref
                        : undefined
                    }
                    clearFiltersLabel={t("clearFilters")}
                    clearSearchHref={state.q ? clearSearchHref : undefined}
                    clearSearchLabel={t("clearSearch")}
                  />
                </div>
              )}
            </section>
          </div>
        </section>
      </main>

      <StorefrontFooter locale={locale} storeName={data.settings.storeName} />
    </div>
  );
}
