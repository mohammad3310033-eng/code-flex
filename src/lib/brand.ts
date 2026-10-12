export function normalizeBrandName(value: string) {
  return value.trim().replace(/\s+/gu, " ").toLocaleLowerCase("en-US");
}
