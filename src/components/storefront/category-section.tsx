import {
  ArrowUpRight,
  Boxes,
  Cable,
  HardDrive,
  Keyboard,
  Laptop,
  Mouse,
  type LucideIcon,
} from "lucide-react";
import NextLink from "next/link";
import { getTranslations } from "next-intl/server";

import { getPathname } from "@/i18n/navigation";
import type { StoreLocale } from "@/i18n/routing";
import type { StorefrontCategory } from "@/lib/storefront-data";
import { cn } from "@/lib/utils";

type CategorySectionProps = {
  locale: StoreLocale;
  categories: StorefrontCategory[];
};

const categoryIcons: Record<string, LucideIcon> = {
  laptops: Laptop,
  accessories: Cable,
  storage: HardDrive,
  mice: Mouse,
  keyboards: Keyboard,
};

export async function CategorySection({
  locale,
  categories,
}: CategorySectionProps) {
  const t = await getTranslations({ locale, namespace: "Categories" });

  return (
    <section
      id="categories"
      className="page-shell scroll-mt-24 py-16 sm:py-20 lg:py-24"
      aria-labelledby="categories-title"
    >
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="section-kicker text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            {t("eyebrow")}
          </p>
          <h2
            id="categories-title"
            className="mt-4 max-w-2xl text-balance text-3xl leading-tight font-semibold tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl"
          >
            {t("title")}
          </h2>
        </div>
        <p className="max-w-2xl text-pretty text-sm leading-7 text-muted-foreground lg:justify-self-end lg:text-base">
          {t("description")}
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-3 max-[359px]:grid-cols-1 lg:grid-cols-6 lg:gap-4">
          {categories.map((category, index) => {
            const Icon = categoryIcons[category.slug] ?? Boxes;
            const name = locale === "ar" ? category.nameAr : category.nameEn;
            const description =
              locale === "ar"
                ? category.descriptionAr
                : category.descriptionEn;
            const isPrimary = index < 2;

            return (
              <NextLink
                key={category.id}
                href={getPathname({
                  href: {
                    pathname: "/products",
                    query: { category: category.slug },
                  },
                  locale,
                })}
                prefetch={false}
                className={cn(
                  "category-tile group relative isolate flex min-h-40 flex-col overflow-hidden rounded-xl border border-black/8 p-3 transition-[transform,border-color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-h-44 sm:p-4 lg:p-6",
                  isPrimary
                    ? "bg-white lg:col-span-3 lg:min-h-60"
                    : "bg-[var(--category-surface)] lg:col-span-2 lg:min-h-52",
                )}
              >
                <div className="absolute inset-0 -z-10 opacity-35 transition-opacity group-hover:opacity-70 category-tile-grid" />
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-9 place-items-center rounded-xl border border-black/8 bg-background text-foreground transition-colors group-hover:border-primary/25 group-hover:text-primary sm:size-10 lg:size-11">
                    <Icon className="size-4 sm:size-5" strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <span className="font-latin text-[0.62rem] font-bold tracking-[0.16em] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="mt-auto pt-4 lg:pt-6">
                  <h3
                    className={cn(
                      "text-lg font-semibold tracking-[-0.025em] sm:text-xl lg:text-2xl",
                      isPrimary && "lg:text-3xl",
                    )}
                  >
                    {name}
                  </h3>
                  {description && (
                    <p className="mt-1 line-clamp-2 max-w-md text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6 lg:mt-2">
                      {description}
                    </p>
                  )}
                  <span className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-primary lg:mt-4 lg:text-foreground">
                    {t("explore")}
                    <ArrowUpRight
                      className="size-3.5 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </NextLink>
            );
          })}
        </div>
      ) : (
        <p className="mt-10 rounded-xl border border-dashed border-black/15 p-8 text-sm text-muted-foreground">
          {t("empty")}
        </p>
      )}
    </section>
  );
}
