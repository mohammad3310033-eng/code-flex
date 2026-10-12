import NextLink from "next/link";

import { getPathname } from "@/i18n/navigation";
import type { StoreLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  locale: StoreLocale;
  label: string;
  hrefs?: Partial<Record<StoreLocale, string>>;
};

export function LanguageSwitcher({
  locale,
  label,
  hrefs,
}: LanguageSwitcherProps) {
  return (
    <nav
      aria-label={label}
      className="flex h-12 items-center rounded-full border border-black/10 bg-white p-0.5 text-[0.68rem] font-bold tracking-[0.08em] text-muted-foreground"
    >
      {(["ar", "en"] as const).map((targetLocale) => (
        <NextLink
          key={targetLocale}
          href={
            hrefs?.[targetLocale] ??
            getPathname({ href: "/", locale: targetLocale })
          }
          hrefLang={targetLocale}
          lang={targetLocale}
          aria-current={locale === targetLocale ? "page" : undefined}
          className={cn(
            "grid h-11 min-w-11 place-items-center rounded-full px-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            locale === targetLocale
              ? "bg-brand-indigo text-white"
              : "hover:text-foreground",
          )}
        >
          {targetLocale.toUpperCase()}
        </NextLink>
      ))}
    </nav>
  );
}
