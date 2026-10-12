type CatalogToolbarProps = {
  action: string;
  stateKey: string;
  hiddenEntries: Array<[string, string]>;
  countLabel: string;
  contextLabels: string[];
  resultsHeading: string;
  sort: string;
  sortOptions: Array<{ value: string; label: string }>;
  sortLabel: string;
  sortApplyLabel: string;
  mobileFilters: React.ReactNode;
};

export function CatalogToolbar({
  action,
  stateKey,
  hiddenEntries,
  countLabel,
  contextLabels,
  resultsHeading,
  sort,
  sortOptions,
  sortLabel,
  sortApplyLabel,
  mobileFilters,
}: CatalogToolbarProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-black/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 id="catalog-results-title" className="sr-only">
          {resultsHeading}
        </h2>
        <p className="text-xl font-semibold tracking-[-0.025em] text-foreground">
          {countLabel}
        </p>
        {contextLabels.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {contextLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-end gap-2">
        {mobileFilters}
        <form
          key={`sort-${stateKey}`}
          action={action}
          method="get"
          className="flex min-w-0 flex-1 items-end gap-2 sm:flex-none"
        >
          {hiddenEntries.map(([name, value], index) => (
            <input
              key={`${name}-${value}-${index}`}
              type="hidden"
              name={name}
              value={value}
            />
          ))}
          <label className="min-w-0 flex-1 text-xs font-semibold text-muted-foreground sm:min-w-48">
            <span className="mb-1.5 block">{sortLabel}</span>
            <select
              name="sort"
              defaultValue={sort}
              className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="h-11 shrink-0 rounded-xl border border-brand-indigo/20 bg-brand-indigo px-3 text-xs font-semibold text-white transition-colors hover:bg-brand-indigo/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {sortApplyLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
