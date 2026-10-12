import NextLink from "next/link";
import { getTranslations } from "next-intl/server";

import { getPathname } from "@/i18n/navigation";
import type { StoreLocale } from "@/i18n/routing";

type StorefrontFooterProps = {
  locale: StoreLocale;
  storeName: string;
};

export async function StorefrontFooter({
  locale,
  storeName,
}: StorefrontFooterProps) {
  const t = await getTranslations({ locale, namespace: "Footer" });
  const homePath = getPathname({ href: "/", locale });

  return (
    <footer className="border-t border-black/8 py-8">
      <div className="page-shell">
        <div>
          <NextLink
            href={homePath}
            className="font-latin text-base font-bold tracking-[-0.03em] text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {storeName}
          </NextLink>
          <p className="mt-2 max-w-lg text-xs leading-5 text-muted-foreground">
            {t("description")}
          </p>
        </div>
      </div>
    </footer>
  );
}
