import "server-only";

import type { Category, Prisma } from "@/generated/prisma/client";

export type AdminCategoryOption = Pick<Category, "id" | "parentId" | "slug" | "nameAr" | "nameEn" | "sortOrder" | "isActive">;

export function getAdminCategoryDescendantIds(categories: readonly AdminCategoryOption[], categoryId: string) {
  const childrenByParent = new Map<string, string[]>();
  for (const category of categories) {
    if (!category.parentId) continue;
    childrenByParent.set(category.parentId, [...(childrenByParent.get(category.parentId) ?? []), category.id]);
  }
  const result: string[] = [];
  const visited = new Set<string>();
  const stack = [categoryId];
  while (stack.length) {
    const current = stack.pop();
    if (!current || visited.has(current)) continue;
    visited.add(current); result.push(current);
    stack.push(...(childrenByParent.get(current) ?? []));
  }
  return result;
}

export function getLaptopCategoryIds(categories: readonly AdminCategoryOption[]) {
  const laptopCategory = categories.find((category) => category.slug === "laptops");
  return laptopCategory ? getAdminCategoryDescendantIds(categories, laptopCategory.id) : [];
}

export function normalizeSortOrders<T extends { id: string; sortOrder: number }>(items: readonly T[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id));
}

export function buildSafeExtraSpecs(rows: unknown): Prisma.JsonObject | null {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  if (rows.length > 20) throw new Error("TOO_MANY_SPECS");

  const result: Prisma.JsonObject = {};
  const knownKeys = new Set<string>();

  for (const row of rows) {
    if (!row || typeof row !== "object" || Array.isArray(row)) throw new Error("INVALID_SPECS");
    const { key, value } = row as { key?: unknown; value?: unknown };
    if (typeof key !== "string" || typeof value !== "string") throw new Error("INVALID_SPECS");
    const normalizedKey = key.trim();
    const normalizedValue = value.trim();
    if (!normalizedKey || normalizedKey.length > 60 || normalizedValue.length > 240) throw new Error("INVALID_SPECS");
    if (["__proto__", "prototype", "constructor"].includes(normalizedKey.toLowerCase())) throw new Error("INVALID_SPECS");
    const keyIdentity = normalizedKey.toLocaleLowerCase("en-US");
    if (knownKeys.has(keyIdentity)) throw new Error("DUPLICATE_SPEC");
    knownKeys.add(keyIdentity);
    result[normalizedKey] = normalizedValue;
  }

  return result;
}
