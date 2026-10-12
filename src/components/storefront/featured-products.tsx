import { ArrowUpRight } from "lucide-react";
import NextLink from "next/link";
import { getTranslations } from "next-intl/server";

import { ProductCard } from "@/components/storefront/product-card";
import { getPathname } from "@/i18n/navigation";
import type { StoreLocale } from "@/i18n/routing";
import type { StorefrontProduct } from "@/lib/storefront-data";

type FeaturedProductsProps = {
  locale: StoreLocale;
  products: StorefrontProduct[];
  usdToSypRate: number;
};

export async function FeaturedProducts({
  locale,
  products,
  usdToSypRate,
}: FeaturedProductsProps) {
  const t = await getTranslations({ locale, namespace: "Featured" });
  const productsPath = getPathname({ href: "/products", locale });
  const labels = {
    details: t("details"),
    noImage: t("noImagePreview"),
    mediaLabel: t("mediaLabel"),
    cpu: t("cpu"),
    ram: t("ram"),
    storage: t("storage"),
    graphics: t("graphics"),
    integratedGraphics: t("integratedGraphics"),
    inStock: t("inStock"),
    outOfStock: t("outOfStock"),
    onRequest: t("onRequest"),
  };

  return (
    <section
      id="featured"
      className="border-y border-black/6 bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="featured-title"
    >
      <div className="page-shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-kicker text-primary">
              <span className="size-1.5 rounded-full bg-primary" />
              {t("eyebrow")}
            </p>
            <h2
              id="featured-title"
              className="mt-4 max-w-3xl text-balance text-3xl leading-tight font-semibold tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl"
            >
              {t("title")}
            </h2>
            <p className="mt-4 max-w-2xl text-pretty text-sm leading-7 text-muted-foreground sm:text-base">
              {t("description")}
            </p>
          </div>

          <NextLink
            href={productsPath}
            prefetch={false}
            className="group inline-flex w-fit items-center gap-2 border-b border-foreground/20 pb-1 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {t("viewAll")}
            <ArrowUpRight
              className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
          </NextLink>
        </div>

        {products.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                usdToSypRate={usdToSypRate}
                labels={labels}
              />
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-xl border border-dashed border-black/15 p-8 text-sm text-muted-foreground">
            {t("empty")}
          </p>
        )}
      </div>
    </section>
  );
}
