const digitMap = new Map([
  ...["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"].map((digit, index) => [digit, String(index)]),
  ...["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"].map((digit, index) => [digit, String(index)]),
]);

function normalizedDisplay(value) {
  return String(value ?? "")
    .replace(/[٠-٩۰-۹]/gu, (digit) => digitMap.get(digit) ?? digit)
    .replace(/[\u200E\u200F\u061C\u202A-\u202E]/gu, "")
    .replace(/\u066C/gu, ",")
    .replace(/\u066B/gu, ".")
    .replace(/[\u00A0\u202F\s]/gu, " ");
}

function firstNumericToken(value) {
  return normalizedDisplay(value).match(/\d[\d,.]*/u)?.[0];
}

export function parseDisplayedUsdCents(value) {
  const token = firstNumericToken(value);
  if (!token || token.split(".").length > 2) return undefined;
  const [wholeWithGroups, fraction = ""] = token.split(".");
  if (!/^\d{1,3}(?:,\d{3})*$/u.test(wholeWithGroups) || !/^\d{0,2}$/u.test(fraction)) return undefined;
  const whole = Number(wholeWithGroups.replaceAll(",", ""));
  if (!Number.isSafeInteger(whole)) return undefined;
  const cents = Number((fraction + "00").slice(0, 2));
  const result = whole * 100 + cents;
  return Number.isSafeInteger(result) ? result : undefined;
}

export function parseDisplayedSyp(value) {
  const token = firstNumericToken(value);
  if (!token || !/^\d{1,3}(?:,\d{3})*$/u.test(token)) return undefined;
  const result = Number(token.replaceAll(",", ""));
  return Number.isSafeInteger(result) ? result : undefined;
}

export function calculateExpectedSyp(priceUsdCents, usdToSypRate) {
  if (!Number.isSafeInteger(priceUsdCents) || !Number.isSafeInteger(usdToSypRate)) throw new Error("price and rate must be safe integers");
  return Number((BigInt(priceUsdCents) * BigInt(usdToSypRate) + 50n) / 100n);
}
