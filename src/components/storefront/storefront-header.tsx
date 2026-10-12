import { MessageCircle } from "lucide-react";
import NextLink from "next/link";
import { getTranslations } from "next-intl/server";

import { TrackedContactLink } from "@/components/analytics/tracked-contact-link";
import { LanguageSwitcher } from "@/components/storefront/language-switcher";
import { MobileNavigation } from "@/components/storefront/mobile-navigation";
import { getPathname } from "@/i18n/navigation";
import type { StoreLocale } from "@/i18n/routing";
import { getWhatsAppDestination } from "@/lib/contact";
import type { StorefrontSettings } from "@/lib/storefront-data";
import { cn } from "@/lib/utils";

type StorefrontHeaderProps = {
  locale: StoreLocale;
  settings: StorefrontSettings;
  activeSection?: "home" | "products";
  languageHrefs?: Partial<Record<StoreLocale, string>>;
};

type NavigationItem = {
  label: string;
  href: string;
  prefetch: boolean;
  isActive?: boolean;
};

export async function StorefrontHeader({
  locale,
  settings,
  activeSection = "home",
  languageHrefs,
}: StorefrontHeaderProps) {
  const t = await getTranslations({ locale, namespace: "Navigation" });
  const direction = locale === "ar" ? "rtl" : "ltr";
  const productsPath = getPathname({ href: "/products", locale });
  const homePath = getPathname({ href: "/", locale });
  const contact = getWhatsAppDestination(settings.whatsapp);

  const navigationItems: NavigationItem[] = [
    {
      label: t("home"),
      href: `${homePath}#top`,
      prefetch: false,
      isActive: activeSection === "home",
    },
    {
      label: t("products"),
      href: productsPath,
      prefetch: false,
      isActive: activeSection === "products",
    },
    {
      label: t("laptops"),
      href: `${productsPath}?category=laptops`,
      prefetch: false,
    },
    {
      label: t("accessories"),
      href: `${productsPath}?category=accessories`,
      prefetch: false,
    },
    { label: t("contact"), href: `${homePath}#contact`, prefetch: false },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-black/8 bg-background/92 backdrop-blur-md">
      <div className="page-shell flex h-[4.5rem] items-center justify-between gap-3">
        <NextLink
          href={homePath}
          aria-label={`${settings.storeName} — ${t("home")}`}
          className="group flex shrink-0 items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <span className="relative grid size-8 place-items-center overflow-hidden rounded-[0.55rem] bg-graphite font-latin text-[0.63rem] font-black tracking-[-0.03em] text-white shadow-sm shadow-brand-purple/20">
            CF
            <span className="bg-brand-gradient absolute inset-x-0 bottom-0 h-1" />
          </span>
          <span className="font-latin text-base font-bold tracking-[-0.035em] text-foreground max-[359px]:hidden sm:text-lg">
            {settings.storeName}
          </span>
        </NextLink>

        <nav
          aria-label={t("menuTitle")}
          className="hidden items-center gap-0.5 lg:flex"
        >
          {navigationItems.map((item) => (
            <NextLink
              key={`${item.href}-${item.label}`}
              href={item.href}
              prefetch={item.prefetch}
              aria-current={item.isActive ? "page" : undefined}
              className={cn(
                "rounded-full px-3 py-2 text-[0.82rem] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-primary",
                item.isActive
                  ? "bg-brand-indigo/10 text-brand-indigo shadow-sm shadow-brand-purple/10"
                  : "text-foreground/65 hover:bg-white hover:text-foreground",
              )}
            >
              {item.label}
            </NextLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher
            locale={locale}
            label={t("language")}
            hrefs={languageHrefs}
          />

          {contact.isExternal ? (
            <>
              <TrackedContactLink
                href={contact.href}
                target="_blank"
                rel="noreferrer"
                locale={locale}
                channel="WHATSAPP"
                placement="HEADER"
                aria-label={`${t("whatsapp")} — ${t("contact")}`}
                className="grid size-11 place-items-center rounded-full bg-primary text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
              </TrackedContactLink>

              <TrackedContactLink
                href={contact.href}
                target="_blank"
                rel="noreferrer"
                locale={locale}
                channel="WHATSAPP"
                placement="HEADER"
                className="hidden h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:flex"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                {t("whatsapp")}
              </TrackedContactLink>
            </>
          ) : (
            <span
              aria-disabled="true"
              className="hidden h-11 items-center gap-2 rounded-full bg-muted px-4 text-sm font-semibold text-muted-foreground md:flex"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {t("whatsapp")}
            </span>
          )}

          <MobileNavigation
            direction={direction}
            storeName={settings.storeName}
            openLabel={t("openMenu")}
            closeLabel={t("closeMenu")}
            title={t("menuTitle")}
            description={t("menuDescription")}
            contactLabel={t("whatsapp")}
            contactHref={contact.href}
            contactIsExternal={contact.isExternal}
            locale={locale}
            items={navigationItems}
          />
        </div>
      </div>
    </header>
  );
}
