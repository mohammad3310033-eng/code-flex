import { X } from "lucide-react";
import NextLink from "next/link";

export type ActiveFilterItem = {
  key: string;
  label: string;
  href: string;
};

type ActiveFiltersProps = {
  items: ActiveFilterItem[];
  clearHref: string;
  title: string;
  clearLabel: string;
  removeLabel: (label: string) => string;
};

export function ActiveFilters({
  items,
  clearHref,
  title,
  clearLabel,
  removeLabel,
}: ActiveFiltersProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-4" aria-labelledby="active-filters-title">
      <div className="flex items-center justify-between gap-4">
        <h2
          id="active-filters-title"
          className="text-xs font-semibold text-muted-foreground"
        >
          {title}
        </h2>
        <NextLink
          href={clearHref}
          prefetch={false}
          className="text-xs font-semibold text-foreground underline decoration-black/20 underline-offset-4 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {clearLabel}
        </NextLink>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <NextLink
            key={item.key}
            href={item.href}
            prefetch={false}
            aria-label={removeLabel(item.label)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 text-xs font-semibold text-foreground transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <bdi dir="auto">{item.label}</bdi>
            <X className="size-3.5" aria-hidden="true" />
          </NextLink>
        ))}
      </div>
    </section>
  );
}
