import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: false,
});

export type StoreLocale = (typeof routing.locales)[number];
