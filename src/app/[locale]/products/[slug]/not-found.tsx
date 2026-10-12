import { getLocale, getTranslations } from "next-intl/server";
import NextLink from "next/link";

import { getPathname } from "@/i18n/navigation";
import type { StoreLocale } from "@/i18n/routing";

export default async function ProductNotFound() {
  const locale = (await getLocale()) as StoreLocale;
  const t = await getTranslations({ locale, namespace: "ProductDetails" });
  const productsPath = getPathname({ href: "/products", locale });
  const laptopsPath = `${productsPath}?category=laptops`;
  const accessoriesPath = `${productsPath}?category=accessories`;

  return (
    <main className="page-shell grid min-h-[72dvh] place-items-center py-16 sm:py-20">
      <section className="w-full max-w-2xl rounded-[1.5rem] border border-black/8 bg-white p-6 sm:rounded-[2rem] sm:p-10">
        <p className="section-kicker text-primary">
          <span className="size-1.5 rounded-full bg-primary" />
          {t("notFoundEyebrow")}
        </p>
        <h1 className="mt-4 text-balance text-3xl leading-tight font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
          {t("notFoundTitle")}
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-sm leading-7 text-muted-foreground sm:text-base">
          {t("notFoundDescription")}
        </p>
        <div className="mt-8 flex flex-col gap-3 min-[430px]:flex-row min-[430px]:flex-wrap">
          <NextLink href={productsPath} prefetch={false} className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            {t("backToProducts")}
          </NextLink>
          <NextLink href={laptopsPath} prefetch={false} className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/12 bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:border-black/20 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            {t("browseLaptops")}
          </NextLink>
          <NextLink href={accessoriesPath} prefetch={false} className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/12 bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:border-black/20 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            {t("browseAccessories")}
          </NextLink>
        </div>
      </section>
    </main>
  );
}
