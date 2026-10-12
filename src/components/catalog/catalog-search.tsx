import { Search, X } from "lucide-react";
import NextLink from "next/link";

type CatalogSearchProps = {
  action: string;
  query: string;
  hiddenEntries: Array<[string, string]>;
  clearHref: string;
  stateKey: string;
  labels: {
    label: string;
    placeholder: string;
    submit: string;
    clear: string;
  };
};

export function CatalogSearch({
  action,
  query,
  hiddenEntries,
  clearHref,
  stateKey,
  labels,
}: CatalogSearchProps) {
  return (
    <form
      key={`search-${stateKey}`}
      action={action}
      method="get"
      role="search"
      className="rounded-2xl border border-black/8 bg-white p-3 sm:p-4"
    >
      {hiddenEntries.map(([name, value], index) => (
        <input
          key={`${name}-${value}-${index}`}
          type="hidden"
          name={name}
          value={value}
        />
      ))}

      <label htmlFor="catalog-search" className="sr-only">
        {labels.label}
      </label>
      <div className="flex min-w-0 items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="catalog-search"
            type="search"
            name="q"
            defaultValue={query}
            placeholder={labels.placeholder}
            maxLength={80}
            dir="auto"
            className="h-12 w-full rounded-xl border border-black/10 bg-background ps-11 pe-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>

        {query && (
          <NextLink
            href={clearHref}
            prefetch={false}
            aria-label={labels.clear}
            className="grid size-12 shrink-0 place-items-center rounded-xl border border-black/10 bg-background text-muted-foreground transition-colors hover:border-black/20 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <X className="size-4" aria-hidden="true" />
          </NextLink>
        )}

        <button
          type="submit"
          className="h-12 shrink-0 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-6"
        >
          {labels.submit}
        </button>
      </div>
    </form>
  );
}
