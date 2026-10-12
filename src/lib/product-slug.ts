const maxSlugLength = 120;

export function normalizeProductSlug(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/gu, "")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/-+/gu, "-")
    .replace(/^-|-$/gu, "")
    .slice(0, maxSlugLength)
    .replace(/-$/u, "");

  return normalized || "product";
}

export function productSlugWithSuffix(base: string, suffix: number) {
  if (suffix <= 1) return base;
  const ending = `-${suffix}`;
  return `${base.slice(0, maxSlugLength - ending.length).replace(/-$/u, "")}${ending}`;
}
