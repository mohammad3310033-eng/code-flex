import type { Prisma } from "@/generated/prisma/client";

export type ProductExtraSpec = {
  key: string;
  value: string;
};

type ExtraSpecLabels = Record<string, string>;

function isScalar(value: Prisma.JsonValue): value is string | number | boolean {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}

function formatValue(value: string | number | boolean) {
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return String(value);
}

function humanizeKey(key: string) {
  return key
    .replace(/([a-z])([A-Z])/gu, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/gu, "$1 $2")
    .replace(/[_-]+/gu, " ")
    .replace(/^./u, (character) => character.toUpperCase());
}

export function getProductExtraSpecs(
  extraSpecs: Prisma.JsonValue | null,
  labels: ExtraSpecLabels,
  booleanLabels: { yes: string; no: string },
): ProductExtraSpec[] {
  if (!extraSpecs || Array.isArray(extraSpecs) || typeof extraSpecs !== "object") {
    return [];
  }

  return Object.entries(extraSpecs as Record<string, Prisma.JsonValue>)
    .flatMap(([key, rawValue]) => {
      const label = labels[key] ?? humanizeKey(key);

      if (typeof rawValue === "boolean") {
        return [{ key: label, value: rawValue ? booleanLabels.yes : booleanLabels.no }];
      }

      if (isScalar(rawValue)) {
        const value = formatValue(rawValue).trim();
        return value ? [{ key: label, value }] : [];
      }

      if (Array.isArray(rawValue) && rawValue.every(isScalar)) {
        const value = rawValue.map(formatValue).filter(Boolean).join(", ");
        return value ? [{ key: label, value }] : [];
      }

      return [];
    });
}
