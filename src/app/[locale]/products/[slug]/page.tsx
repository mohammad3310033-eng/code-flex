import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import NextLink from "next/link";
import { notFound } from "next/navigation";

import { ProductActions } from "@/components/product/product-actions";
import { ProductViewTracker } from "@/components/analytics/product-view-tracker";
import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { ProductMediaPlaceholder } from "@/components/product/product-media-placeholder";
import { ProductSingleImage } from "@/components/product/product-single-image";
import { ProductCard } from "@/components/storefront/product-card";
import { StorefrontFooter } from "@/components/storefront/footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import type {
  ProductCondition,
  StockStatus,
} from "@/generated/prisma/enums";
import { getPathname } from "@/i18n/navigation";
import { routing, type StoreLocale } from "@/i18n/routing";
import { getWhatsAppDestination } from "@/lib/contact";
import { getProductDetail } from "@/lib/product-detail-data";
import { getProductExtraSpecs } from "@/lib/product-detail-specs";
import { formatSyp, formatUsd } from "@/lib/money";
import { formatCpu, formatGpu, formatStorage } from "@/lib/product-specs";
import { cn } from "@/lib/utils";

type ProductPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

type ProductDetailsTranslator = Awaited<
  ReturnType<typeof getProductDetailsTranslator>
>;

const stockPresentation = {
  IN_STOCK: {
    label: "inStock",
    className: "bg-status-positive-surface text-status-positive",
    dotClassName: "bg-status-positive-mark",
  },
  ON_REQUEST: {
    label: "onRequest",
    className: "bg-status-warm-surface text-status-warm",
    dotClassName: "bg-status-warm-mark",
  },
  OUT_OF_STOCK: {
    label: "outOfStock",
    className: "bg-status-neutral-surface text-status-neutral",
    dotClassName: "bg-status-neutral-mark",
  },
} as const satisfies Record<
  StockStatus,
  {
    label: "inStock" | "onRequest" | "outOfStock";
    className: string;
    dotClassName: string;
  }
>;

async function getProductDetailsTranslator(locale: StoreLocale) {
  return getTranslations({ locale, namespace: "ProductDetails" });
}

function getConditionLabel(
  t: ProductDetailsTranslator,
  condition: ProductCondition,
) {
  const labels = {
    NEW: t("newCondition"),
    USED: t("usedCondition"),
    REFURBISHED: t("refurbishedCondition"),
  } satisfies Record<ProductCondition, string>;

  return labels[condition];
}

function formatScreenSize(value: { toString(): string } | null) {
  const screenSize = value?.toString();

  return screenSize ? `${screenSize.replace(/\.0$/u, "")}″` : undefined;
}

function getCategoryHref(locale: StoreLocale, categorySlug: string) {
  const productsPath = getPathname({ href: "/products", locale });
  return `${productsPath}?category=${encodeURIComponent(categorySlug)}`;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const [data, t] = await Promise.all([
    getProductDetail(slug),
    getProductDetailsTranslator(locale),
  ]);

  if (!data) {
    notFound();
  }

  const description =
    locale === "en"
      ? data.product.shortDescriptionEn ??
        data.product.descriptionEn ??
        data.product.shortDescriptionAr ??
        data.product.descriptionAr
      : data.product.shortDescriptionAr ?? data.product.descriptionAr;

  return {
    title: `${data.product.name} | ${data.settings.storeName}`,
    description: description || t("metadataDescription"),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const [data, t, featuredT, orderT] = await Promise.all([
    getProductDetail(slug),
    getProductDetailsTranslator(locale),
    getTranslations({ locale, namespace: "Featured" }),
    getTranslations({ locale, namespace: "OrderRequest" }),
  ]);

  if (!data) {
    notFound();
  }

  const { product, settings, relatedProducts } = data;
  const categoryName =
    locale === "ar" ? product.category.nameAr : product.category.nameEn;
  const parentCategoryName = product.category.parent
    ? locale === "ar"
      ? product.category.parent.nameAr
      : product.category.parent.nameEn
    : undefined;
  const productsPath = getPathname({ href: "/products", locale });
  const homePath = getPathname({ href: "/", locale });
  const languageHrefs = {
    ar: getPathname({ href: `/products/${product.slug}`, locale: "ar" }),
    en: getPathname({ href: `/products/${product.slug}`, locale: "en" }),
  };
  const stock = stockPresentation[product.stockStatus];
  const laptopSpecs = product.laptopSpecs;
  const screenSize = formatScreenSize(laptopSpecs?.screenSize ?? null);
  const graphics = laptopSpecs
    ? formatGpu(laptopSpecs, t("integratedGraphics"))
    : undefined;
  const graphicsDirection = laptopSpecs?.gpuModel || locale === "en" ? "ltr" : "rtl";
  const description =
    locale === "en"
      ? product.descriptionEn ?? product.descriptionAr
      : product.descriptionAr;
  const imageData = product.images.map((image, index) => ({
    id: image.id,
    url: image.url,
    alt: index === 0 ? product.name : `${product.name} - ${index + 1}`,
  }));
  const extraSpecs = getProductExtraSpecs(
    product.extraSpecs,
    {
      color: t("extraSpecs.color"),
      conditionNote: t("extraSpecs.conditionNote"),
      cooling: t("extraSpecs.cooling"),
      operatingSystem: t("extraSpecs.operatingSystem"),
      graphics: t("extraSpecs.graphics"),
      gpuMemoryGB: t("extraSpecs.gpuMemoryGB"),
      wifi: t("extraSpecs.wifi"),
      weightKg: t("extraSpecs.weightKg"),
      capacityGB: t("extraSpecs.capacityGB"),
      interface: t("extraSpecs.interface"),
      formFactor: t("extraSpecs.formFactor"),
      sequentialReadMBps: t("extraSpecs.sequentialReadMBps"),
      spindleSpeedRPM: t("extraSpecs.spindleSpeedRPM"),
      connector: t("extraSpecs.connector"),
      connectivity: t("extraSpecs.connectivity"),
      sensorDpi: t("extraSpecs.sensorDpi"),
      handedness: t("extraSpecs.handedness"),
      batteryType: t("extraSpecs.batteryType"),
      programmableButtons: t("extraSpecs.programmableButtons"),
      lighting: t("extraSpecs.lighting"),
      layout: t("extraSpecs.layout"),
      switchType: t("extraSpecs.switchType"),
      driverSizeMM: t("extraSpecs.driverSizeMM"),
      ethernet: t("extraSpecs.ethernet"),
      fingerprintReader: t("extraSpecs.fingerprintReader"),
      microphone: t("extraSpecs.microphone"),
      compatibility: t("extraSpecs.compatibility"),
      powerWatts: t("extraSpecs.powerWatts"),
      inputVoltage: t("extraSpecs.inputVoltage"),
      powerDelivery: t("extraSpecs.powerDelivery"),
      compatibleSizeInches: t("extraSpecs.compatibleSizeInches"),
      material: t("extraSpecs.material"),
      carryingStyle: t("extraSpecs.carryingStyle"),
      keyboardBacklight: t("extraSpecs.keyboardBacklight"),
      keyboardLayout: t("extraSpecs.keyboardLayout"),
      ports: t("extraSpecs.ports"),
      refreshRateHz: t("extraSpecs.refreshRateHz"),
      warrantyMonths: t("extraSpecs.warrantyMonths"),
      webcam: t("extraSpecs.webcam"),
      webcamShield: t("extraSpecs.webcamShield"),
    },
    { yes: t("yes"), no: t("no") },
  );
  const whatsApp = getWhatsAppDestination(settings.whatsapp);
  const actionProps = {
    productId: product.id,
    categoryId: product.categoryId,
    locale,
    requestLabel: t("requestNow"),
    requestHint: t("requestHint"),
    requestDialogCopy: {
      title: orderT("title"),
      description: orderT("description"),
      name: orderT("name"),
      phone: orderT("phone"),
      city: orderT("city"),
      note: orderT("note"),
      submit: orderT("submit"),
      submitting: orderT("submitting"),
      directWhatsApp: orderT("directWhatsApp"),
      close: orderT("close"),
      successTitle: orderT("successTitle"),
      successDescription: orderT("successDescription"),
      genericError: orderT("genericError"),
      unavailableError: orderT("unavailableError"),
      nameError: orderT("nameError"),
      phoneError: orderT("phoneError"),
      cityError: orderT("cityError"),
      noteError: orderT("noteError"),
      whatsappUnavailable: orderT("whatsappUnavailable"),
    },
    whatsappLabel: t("whatsapp"),
    whatsappUnavailableLabel: t("whatsappUnavailable"),
    whatsappHref: whatsApp.href,
    whatsappExternal: whatsApp.isExternal,
  };
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

  return (
    <div className="min-h-dvh">
      <StorefrontHeader
        locale={locale}
        settings={settings}
        activeSection="products"
        languageHrefs={languageHrefs}
      />
      <ProductViewTracker
        productId={product.id}
        categoryId={product.categoryId}
        locale={locale}
      />

      <main className="pb-28 md:pb-0">
        <section className="page-shell py-7 sm:py-10 lg:py-12">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <NextLink href={homePath} className="hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              {t("home")}
            </NextLink>
            <span aria-hidden="true">/</span>
            <NextLink href={productsPath} className="hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              {t("products")}
            </NextLink>
            {product.category.parent && parentCategoryName && (
              <>
                <span aria-hidden="true">/</span>
                <NextLink
                  href={getCategoryHref(locale, product.category.parent.slug)}
                  className="hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {parentCategoryName}
                </NextLink>
              </>
            )}
            <span aria-hidden="true">/</span>
            <NextLink
              href={getCategoryHref(locale, product.category.slug)}
              className="hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {categoryName}
            </NextLink>
            <span aria-hidden="true">/</span>
            <span className="font-latin max-w-[22ch] truncate text-foreground" dir="ltr">
              {product.name}
            </span>
          </nav>

          <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:gap-12">
            <section aria-label={t("mediaLabel")}>
              {imageData.length === 0 ? (
                <ProductMediaPlaceholder
                  name={product.name}
                  label={t("noImagePreview")}
                />
              ) : imageData.length === 1 ? (
                <ProductSingleImage image={imageData[0]} />
              ) : (
                <ProductImageGallery
                  images={imageData}
                  thumbnailGroupLabel={t("galleryThumbnails")}
                  thumbnailLabel={t("galleryThumbnail")}
                />
              )}
            </section>

            <section className="rounded-[1.5rem] border border-black/8 bg-white p-5 sm:p-7" aria-labelledby="product-title">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                  <span className="font-latin" dir="ltr">{product.brand.name}</span>
                  <span className="size-1 rounded-full bg-primary" aria-hidden="true" />
                  <span>{categoryName}</span>
                </div>
                <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold", stock.className)}>
                  <span className={cn("size-1.5 rounded-full", stock.dotClassName)} aria-hidden="true" />
                  {t(stock.label)}
                </span>
              </div>

              <h1 id="product-title" className="font-latin mt-4 text-balance text-3xl leading-tight font-semibold tracking-[-0.045em] text-foreground sm:text-4xl" dir="ltr">
                {product.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                {product.sku && (
                  <p>
                    {t("sku")}: <bdi className="font-latin font-semibold text-foreground" dir="ltr">{product.sku}</bdi>
                  </p>
                )}
                {product.condition && (
                  <p>
                    {t("condition")}: <span className="font-medium text-foreground">{getConditionLabel(t, product.condition)}</span>
                  </p>
                )}
              </div>

              <div className="mt-6 border-y border-black/6 py-5">
                <p className="text-xs font-semibold text-muted-foreground">{t("price")}</p>
                <p data-testid="product-detail-usd-price" className="font-latin mt-2 text-4xl font-semibold tracking-[-0.05em] text-foreground" dir="ltr">
                  {formatUsd(product.priceUsdCents)}
                </p>
                <p data-testid="product-detail-syp-price" className="font-latin mt-1 text-sm font-medium text-muted-foreground" dir="ltr">
                  {t("estimatedSyp")}: {formatSyp(product.priceUsdCents, settings.usdToSypRate, locale)}
                </p>
              </div>

              {laptopSpecs && (
                <section className="mt-6" aria-labelledby="key-specifications-title">
                  <h2 id="key-specifications-title" className="text-sm font-semibold text-foreground">
                    {t("keySpecifications")}
                  </h2>
                  <dl className="mt-3 grid grid-cols-2 gap-3">
                    {[
                      [t("processor"), formatCpu(laptopSpecs)],
                      [t("memory"), `${laptopSpecs.ramGB} GB`],
                      [t("storage"), formatStorage(laptopSpecs)],
                      [t("graphics"), graphics],
                      ...(screenSize ? [[t("screen"), screenSize]] : []),
                    ].map(([label, value]) => (
                      <div key={label} className="min-w-0 rounded-xl bg-background p-3">
                        <dt className="text-[0.68rem] font-medium text-muted-foreground">{label}</dt>
                        <dd className="font-latin mt-1 break-words text-sm leading-5 font-semibold text-foreground" dir="ltr">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              <div className="mt-7 hidden md:block">
                <ProductActions {...actionProps} />
              </div>
            </section>
          </div>

          <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <section className="rounded-[1.5rem] border border-black/8 bg-white p-5 sm:p-7" aria-labelledby="specifications-title">
              <h2 id="specifications-title" className="text-2xl font-semibold tracking-[-0.035em] text-foreground">
                {laptopSpecs ? t("specifications") : t("additionalSpecifications")}
              </h2>

              {laptopSpecs && (
                <dl className="mt-5 divide-y divide-black/6 border-y border-black/6">
                  {[
                    [t("processor"), formatCpu(laptopSpecs)],
                    laptopSpecs.cpuGeneration ? [t("cpuGeneration"), laptopSpecs.cpuGeneration] : undefined,
                    [t("memory"), `${laptopSpecs.ramGB} GB`],
                    [t("storage"), formatStorage(laptopSpecs)],
                    [t("graphics"), graphics],
                    screenSize ? [t("screen"), screenSize] : undefined,
                    laptopSpecs.resolution ? [t("resolution"), laptopSpecs.resolution] : undefined,
                  ].filter((entry): entry is [string, string] => Boolean(entry)).map(([label, value]) => (
                    <div key={label} className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-5">
                      <dt className="text-sm text-muted-foreground">{label}</dt>
                      <dd className={cn("break-words text-sm font-semibold text-foreground", label === t("graphics") && graphicsDirection === "ltr" && "font-latin")}> 
                        <bdi dir="ltr">{value}</bdi>
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {extraSpecs.length > 0 && (
                <div className={laptopSpecs ? "mt-8" : "mt-5"}>
                  {laptopSpecs && <h3 className="text-base font-semibold text-foreground">{t("additionalSpecifications")}</h3>}
                  <dl className={cn("divide-y divide-black/6 border-y border-black/6", laptopSpecs ? "mt-4" : "")}> 
                    {extraSpecs.map((specification) => (
                      <div key={specification.key} className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-5">
                        <dt className="text-sm text-muted-foreground">{specification.key}</dt>
                        <dd className="font-latin break-words text-sm font-semibold text-foreground" dir="auto">
                          {specification.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </section>

            <section className="rounded-[1.5rem] border border-black/8 bg-white p-5 sm:p-7" aria-labelledby="description-title">
              <h2 id="description-title" className="text-xl font-semibold tracking-[-0.03em] text-foreground">
                {t("description")}
              </h2>
              <p className="mt-4 text-pretty text-sm leading-7 text-muted-foreground whitespace-pre-line">
                {description}
              </p>
            </section>
          </div>

          {relatedProducts.length > 0 && (
            <section className="mt-12 sm:mt-16" aria-labelledby="related-products-title">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="section-kicker text-primary">
                    <span className="size-1.5 rounded-full bg-primary" />
                    {categoryName}
                  </p>
                  <h2 id="related-products-title" className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-3xl">
                    {t("relatedProducts")}
                  </h2>
                </div>
                <NextLink href={getCategoryHref(locale, product.category.slug)} className="hidden text-sm font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:inline">
                  {categoryName}
                </NextLink>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                    locale={locale}
                    usdToSypRate={settings.usdToSypRate}
                    labels={productCardLabels}
                  />
                ))}
              </div>
            </section>
          )}
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-background/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-sm md:hidden">
        <div className="page-shell">
          <ProductActions {...actionProps} compact />
        </div>
      </div>

      <StorefrontFooter locale={locale} storeName={settings.storeName} />
    </div>
  );
}
