import { ChevronLeft, ChevronRight } from "lucide-react";
import NextLink from "next/link";

export type CatalogPaginationItem =
  | { type: "page"; page: number; href: string; current: boolean }
  | { type: "ellipsis"; key: string };

type CatalogPaginationProps = {
  currentPage: number;
  totalPages: number;
  previousHref?: string;
  nextHref?: string;
  items: CatalogPaginationItem[];
  labels: {
    navigation: string;
    previous: string;
    next: string;
    page: (page: number) => string;
  };
};

const controlClassName =
  "inline-flex size-11 items-center justify-center rounded-xl border border-black/10 bg-white text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function CatalogPagination({
  currentPage,
  totalPages,
  previousHref,
  nextHref,
  items,
  labels,
}: CatalogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-2 border-t border-black/8 pt-7"
      aria-label={labels.navigation}
    >
      {previousHref ? (
        <NextLink
          href={previousHref}
          prefetch={false}
          aria-label={labels.previous}
          className={`${controlClassName} hover:border-primary/30 hover:text-primary`}
        >
          <ChevronLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        </NextLink>
      ) : (
        <span
          aria-label={labels.previous}
          aria-disabled="true"
          className={`${controlClassName} cursor-not-allowed opacity-40`}
        >
          <ChevronLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        </span>
      )}

      <div className="flex items-center gap-1" dir="ltr">
        {items.map((item) =>
          item.type === "ellipsis" ? (
            <span
              key={item.key}
              className="grid size-9 place-items-center text-sm text-muted-foreground"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <NextLink
              key={item.page}
              href={item.href}
              prefetch={false}
              aria-label={labels.page(item.page)}
              aria-current={item.current ? "page" : undefined}
              className={
                item.current
                  ? "grid size-11 place-items-center rounded-xl bg-brand-indigo font-latin text-sm font-semibold text-white"
                  : "grid size-11 place-items-center rounded-xl border border-transparent font-latin text-sm font-semibold text-foreground transition-colors hover:border-black/10 hover:bg-white focus-visible:outline-2 focus-visible:outline-primary"
              }
            >
              {item.page}
            </NextLink>
          ),
        )}
      </div>

      {nextHref ? (
        <NextLink
          href={nextHref}
          prefetch={false}
          aria-label={labels.next}
          className={`${controlClassName} hover:border-primary/30 hover:text-primary`}
        >
          <ChevronRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        </NextLink>
      ) : (
        <span
          aria-label={labels.next}
          aria-disabled="true"
          className={`${controlClassName} cursor-not-allowed opacity-40`}
        >
          <ChevronRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        </span>
      )}

      <span className="sr-only">
        {currentPage} / {totalPages}
      </span>
    </nav>
  );
}
