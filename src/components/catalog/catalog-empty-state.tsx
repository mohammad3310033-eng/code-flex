import { ArrowUpRight, SearchX } from "lucide-react";
import NextLink from "next/link";

type CatalogEmptyStateProps = {
  title: string;
  description: string;
  browseAllHref: string;
  browseAllLabel: string;
  clearFiltersHref?: string;
  clearFiltersLabel?: string;
  clearSearchHref?: string;
  clearSearchLabel?: string;
};

export function CatalogEmptyState({
  title,
  description,
  browseAllHref,
  browseAllLabel,
  clearFiltersHref,
  clearFiltersLabel,
  clearSearchHref,
  clearSearchLabel,
}: CatalogEmptyStateProps) {
  return (
    <section className="rounded-2xl border border-dashed border-black/15 bg-white px-6 py-14 text-center sm:px-10">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="size-5" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-balance text-2xl font-semibold tracking-[-0.03em] text-foreground">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-7 text-muted-foreground">
        {description}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <NextLink
          href={browseAllHref}
          prefetch={false}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {browseAllLabel}
          <ArrowUpRight
            className="size-4 rtl:-scale-x-100"
            aria-hidden="true"
          />
        </NextLink>
        {clearFiltersHref && clearFiltersLabel && (
          <NextLink
            href={clearFiltersHref}
            prefetch={false}
            className="inline-flex min-h-11 items-center rounded-full border border-black/10 bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:border-black/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {clearFiltersLabel}
          </NextLink>
        )}
        {clearSearchHref && clearSearchLabel && (
          <NextLink
            href={clearSearchHref}
            prefetch={false}
            className="inline-flex min-h-11 items-center rounded-full border border-black/10 bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:border-black/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {clearSearchLabel}
          </NextLink>
        )}
      </div>
    </section>
  );
}
