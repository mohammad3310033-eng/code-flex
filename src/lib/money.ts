import type { StoreLocale } from "@/i18n/routing";

function assertInteger(value: number, label: string) {
  if (!Number.isSafeInteger(value)) {
    throw new Error(`${label} must be a safe integer.`);
  }
}

export function formatUsd(priceUsdCents: number) {
  assertInteger(priceUsdCents, "USD cents");

  const hasFraction = priceUsdCents % 100 !== 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(priceUsdCents / 100);
}

export function convertUsdCentsToSyp(
  priceUsdCents: number,
  usdToSypRate: number,
) {
  assertInteger(priceUsdCents, "USD cents");
  assertInteger(usdToSypRate, "USD to SYP rate");

  const numerator = BigInt(priceUsdCents) * BigInt(usdToSypRate);

  return (numerator + BigInt(50)) / BigInt(100);
}

export function formatSyp(
  priceUsdCents: number,
  usdToSypRate: number,
  locale: StoreLocale,
) {
  const amount = convertUsdCentsToSyp(priceUsdCents, usdToSypRate);
  const formatted = new Intl.NumberFormat(
    locale === "ar" ? "ar-SY-u-nu-latn" : "en-US",
    { maximumFractionDigits: 0 },
  ).format(amount);

  return locale === "ar" ? `${formatted} ل.س` : `SYP ${formatted}`;
}
