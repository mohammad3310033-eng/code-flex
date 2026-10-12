"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";

import { getPathname } from "@/i18n/navigation";
import type { StoreLocale } from "@/i18n/routing";

type ProductsErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

const errorCopy = {
  ar: {
    eyebrow: "خطأ مؤقت",
    title: "لم نتمكن من عرض المنتجات الآن.",
    description:
      "حدث خلل أثناء تحميل الكتالوج. يمكنك المحاولة مرة أخرى أو العودة إلى جميع المنتجات.",
    retry: "المحاولة مرة أخرى",
    browse: "تصفّح كل المنتجات",
  },
  en: {
    eyebrow: "Temporary error",
    title: "We could not display the products right now.",
    description:
      "Something went wrong while loading the catalog. Try again or return to all products.",
    retry: "Try again",
    browse: "Browse all products",
  },
} as const;

export default function ProductsError({ retry }: ProductsErrorProps) {
  const params = useParams<{ locale?: string }>();
  const locale: StoreLocale = params.locale === "en" ? "en" : "ar";
  const copy = errorCopy[locale];
  const productsPath = getPathname({ href: "/products", locale });

  return (
    <main className="page-shell grid min-h-[72dvh] place-items-center py-16 sm:py-20">
      <section className="w-full max-w-2xl rounded-[1.5rem] border border-black/8 bg-white p-6 sm:rounded-[2rem] sm:p-10">
        <p className="section-kicker text-primary">
          <span className="size-1.5 rounded-full bg-primary" />
          {copy.eyebrow}
        </p>
        <h1 className="mt-4 text-balance text-3xl leading-tight font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-sm leading-7 text-muted-foreground sm:text-base">
          {copy.description}
        </p>

        <div className="mt-8 flex flex-col gap-3 min-[430px]:flex-row">
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {copy.retry}
          </button>
          <NextLink
            href={productsPath}
            prefetch={false}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/12 bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:border-black/20 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {copy.browse}
          </NextLink>
        </div>
      </section>
    </main>
  );
}
