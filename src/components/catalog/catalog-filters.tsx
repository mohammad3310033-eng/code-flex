import NextLink from "next/link";

import { cn } from "@/lib/utils";

export type CatalogCategoryFilterNode = {
  id: string;
  slug: string;
  name: string;
  href: string;
  active: boolean;
  children: CatalogCategoryFilterNode[];
};

export type CatalogFilterOption = {
  value: string;
  label: string;
};

export type CatalogFilterSelections = {
  brands: string[];
  minPrice: string;
  maxPrice: string;
  stock: string[];
  conditions: string[];
  cpuBrands: string[];
  cpuModels: string[];
  cpuGenerations: string[];
  ram: string[];
  storage: string[];
  storageTypes: string[];
  gpu: string[];
  screens: string[];
};

export type CatalogFilterOptions = {
  brands: CatalogFilterOption[];
  stock: CatalogFilterOption[];
  conditions: CatalogFilterOption[];
  laptop?: {
    cpuBrands: CatalogFilterOption[];
    cpuModels: CatalogFilterOption[];
    cpuGenerations: CatalogFilterOption[];
    ram: CatalogFilterOption[];
    storage: CatalogFilterOption[];
    storageTypes: CatalogFilterOption[];
    gpu: CatalogFilterOption[];
    screens: CatalogFilterOption[];
  };
};

type CatalogFiltersProps = {
  instance: "desktop" | "mobile";
  action: string;
  stateKey: string;
  hiddenEntries: Array<[string, string]>;
  categories: CatalogCategoryFilterNode[];
  allCategoriesHref: string;
  allCategoriesActive: boolean;
  selections: CatalogFilterSelections;
  options: CatalogFilterOptions;
  clearHref: string;
  labels: {
    title: string;
    clear: string;
    allCategories: string;
    category: string;
    brand: string;
    price: string;
    minPrice: string;
    maxPrice: string;
    availability: string;
    condition: string;
    laptopSpecifications: string;
    cpuBrand: string;
    cpuModel: string;
    cpuGeneration: string;
    ram: string;
    storage: string;
    storageType: string;
    gpu: string;
    screen: string;
    apply: string;
  };
};

function CategoryTree({ nodes }: { nodes: CatalogCategoryFilterNode[] }) {
  return (
    <ul className="space-y-1">
      {nodes.map((node) => (
        <li key={node.id}>
          <NextLink
            href={node.href}
            prefetch={false}
            aria-current={node.active ? "page" : undefined}
            className={cn(
              "flex min-h-10 items-center rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary",
              node.active
                ? "bg-brand-indigo text-white"
                : "text-foreground/72 hover:bg-muted hover:text-foreground",
            )}
          >
            {node.name}
          </NextLink>
          {node.children.length > 0 && (
            <div className="ms-3 mt-1 border-s border-black/8 ps-2">
              <CategoryTree nodes={node.children} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function CheckboxGroup({
  instance,
  name,
  legend,
  options,
  selected,
  technical = false,
}: {
  instance: "desktop" | "mobile";
  name: string;
  legend: string;
  options: CatalogFilterOption[];
  selected: string[];
  technical?: boolean;
}) {
  if (options.length === 0) {
    return null;
  }

  const selectedValues = new Set(selected);

  return (
    <fieldset className="border-t border-black/6 pt-5">
      <legend className="text-xs font-bold tracking-[0.02em] text-foreground">
        {legend}
      </legend>
      <div className="mt-3 space-y-0.5">
        {options.map((option, index) => {
          const id = `${instance}-${name}-${index}`;

          return (
            <label
              key={option.value}
              htmlFor={id}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm text-foreground/76 transition-colors hover:bg-muted hover:text-foreground"
            >
              <input
                id={id}
                type="checkbox"
                name={name}
                value={option.value}
                defaultChecked={selectedValues.has(option.value)}
                className="size-4 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
              <bdi dir={technical ? "ltr" : "auto"} className="min-w-0">
                {option.label}
              </bdi>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function CatalogFilters({
  instance,
  action,
  stateKey,
  hiddenEntries,
  categories,
  allCategoriesHref,
  allCategoriesActive,
  selections,
  options,
  clearHref,
  labels,
}: CatalogFiltersProps) {
  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-4",
          instance === "desktop" ? "justify-between" : "justify-end",
        )}
      >
        {instance === "desktop" && (
          <h2 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
            {labels.title}
          </h2>
        )}
        <NextLink
          href={clearHref}
          prefetch={false}
          className="text-xs font-semibold text-muted-foreground underline decoration-black/20 underline-offset-4 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {labels.clear}
        </NextLink>
      </div>

      <nav className="mt-5" aria-label={labels.category}>
        <p className="mb-3 text-xs font-bold tracking-[0.02em] text-foreground">
          {labels.category}
        </p>
        <NextLink
          href={allCategoriesHref}
          prefetch={false}
          aria-current={allCategoriesActive ? "page" : undefined}
          className={cn(
            "mb-1 flex min-h-10 items-center rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary",
            allCategoriesActive
              ? "bg-brand-indigo text-white"
              : "text-foreground/72 hover:bg-muted hover:text-foreground",
          )}
        >
          {labels.allCategories}
        </NextLink>
        <CategoryTree nodes={categories} />
      </nav>

      <form
        key={`filters-${instance}-${stateKey}`}
        action={action}
        method="get"
        className="mt-5 space-y-5"
      >
        {hiddenEntries.map(([name, value], index) => (
          <input
            key={`${name}-${value}-${index}`}
            type="hidden"
            name={name}
            value={value}
          />
        ))}

        <fieldset className="border-t border-black/6 pt-5">
          <legend className="text-xs font-bold tracking-[0.02em] text-foreground">
            {labels.price}
          </legend>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <label className="text-[0.68rem] font-semibold text-muted-foreground">
              <span className="mb-1.5 block">{labels.minPrice}</span>
              <span className="relative block" dir="ltr">
                <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 font-latin text-xs text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  name="minPrice"
                  min="0"
                  max="1000000"
                  step="0.01"
                  inputMode="decimal"
                  defaultValue={selections.minPrice}
                  aria-label={labels.minPrice}
                  className="h-11 w-full rounded-lg border border-black/10 bg-background ps-7 pe-2 font-latin text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </span>
            </label>
            <label className="text-[0.68rem] font-semibold text-muted-foreground">
              <span className="mb-1.5 block">{labels.maxPrice}</span>
              <span className="relative block" dir="ltr">
                <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 font-latin text-xs text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  name="maxPrice"
                  min="0"
                  max="1000000"
                  step="0.01"
                  inputMode="decimal"
                  defaultValue={selections.maxPrice}
                  aria-label={labels.maxPrice}
                  className="h-11 w-full rounded-lg border border-black/10 bg-background ps-7 pe-2 font-latin text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </span>
            </label>
          </div>
        </fieldset>

        <CheckboxGroup
          instance={instance}
          name="brand"
          legend={labels.brand}
          options={options.brands}
          selected={selections.brands}
          technical
        />
        <CheckboxGroup
          instance={instance}
          name="stock"
          legend={labels.availability}
          options={options.stock}
          selected={selections.stock}
        />
        <CheckboxGroup
          instance={instance}
          name="condition"
          legend={labels.condition}
          options={options.conditions}
          selected={selections.conditions}
        />

        {options.laptop && (
          <div className="space-y-5 border-t border-black/10 pt-5">
            <p className="text-sm font-semibold text-foreground">
              {labels.laptopSpecifications}
            </p>
            <CheckboxGroup
              instance={instance}
              name="cpuBrand"
              legend={labels.cpuBrand}
              options={options.laptop.cpuBrands}
              selected={selections.cpuBrands}
              technical
            />
            <CheckboxGroup
              instance={instance}
              name="cpuModel"
              legend={labels.cpuModel}
              options={options.laptop.cpuModels}
              selected={selections.cpuModels}
              technical
            />
            <CheckboxGroup
              instance={instance}
              name="cpuGeneration"
              legend={labels.cpuGeneration}
              options={options.laptop.cpuGenerations}
              selected={selections.cpuGenerations}
              technical
            />
            <CheckboxGroup
              instance={instance}
              name="ram"
              legend={labels.ram}
              options={options.laptop.ram}
              selected={selections.ram}
              technical
            />
            <CheckboxGroup
              instance={instance}
              name="storage"
              legend={labels.storage}
              options={options.laptop.storage}
              selected={selections.storage}
              technical
            />
            <CheckboxGroup
              instance={instance}
              name="storageType"
              legend={labels.storageType}
              options={options.laptop.storageTypes}
              selected={selections.storageTypes}
              technical
            />
            <CheckboxGroup
              instance={instance}
              name="gpu"
              legend={labels.gpu}
              options={options.laptop.gpu}
              selected={selections.gpu}
              technical
            />
            <CheckboxGroup
              instance={instance}
              name="screen"
              legend={labels.screen}
              options={options.laptop.screens}
              selected={selections.screens}
              technical
            />
          </div>
        )}

        <div
          className={cn(
            "grid grid-cols-2 gap-2 border-t border-black/8 pt-5",
            instance === "mobile" &&
              "sticky bottom-0 -mx-5 bg-background px-5 pb-1",
          )}
        >
          <NextLink
            href={clearHref}
            prefetch={false}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold text-foreground transition-colors hover:border-black/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {labels.clear}
          </NextLink>
          <button
            type="submit"
            className="min-h-11 rounded-xl bg-primary px-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {labels.apply}
          </button>
        </div>
      </form>
    </div>
  );
}
