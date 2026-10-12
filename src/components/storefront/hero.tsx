import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
import { getTranslations } from "next-intl/server";

import { TrackedContactLink } from "@/components/analytics/tracked-contact-link";
import { getPathname } from "@/i18n/navigation";
import type { StoreLocale } from "@/i18n/routing";
import { getWhatsAppDestination } from "@/lib/contact";
import { getCloudinaryDeliveryUrl } from "@/lib/cloudinary-delivery";
import { formatUsd } from "@/lib/money";
import { formatCpu, formatGpu, formatStorage } from "@/lib/product-specs";
import type {
  HomeStorefrontSettings,
  StorefrontProduct,
} from "@/lib/storefront-data";
import { cn } from "@/lib/utils";

type HeroProps = {
  locale: StoreLocale;
  settings: HomeStorefrontSettings;
  featuredProduct?: StorefrontProduct;
};

export async function Hero({
  locale,
  settings,
  featuredProduct,
}: HeroProps) {
  const t = await getTranslations({ locale, namespace: "Hero" });
  const contact = getWhatsAppDestination(settings.whatsapp);
  const specs = featuredProduct?.laptopSpecs;
  const graphics = specs
    ? formatGpu(specs, t("integratedGraphics"))
    : undefined;
  const interfaceDirection = locale === "ar" ? "rtl" : "ltr";
  const graphicsDirection = specs?.gpuModel || locale === "en" ? "ltr" : "rtl";
  const productsPath = getPathname({ href: "/products", locale });
  const heroTitle = settings.heroEnabled
    ? (locale === "ar" ? settings.heroTitleAr : settings.heroTitleEn) ?? t("headline")
    : t("headline");
  const heroSubtitle = settings.heroEnabled
    ? (locale === "ar" ? settings.heroSubtitleAr : settings.heroSubtitleEn) ?? t("description")
    : t("description");

  return (
    <section className="page-shell pt-3 sm:pt-5 lg:pt-6" aria-labelledby="hero-title">
      <div
        className="relative isolate overflow-hidden rounded-[1.5rem] bg-graphite px-5 py-8 text-white sm:rounded-[2rem] sm:px-8 sm:py-10 lg:grid lg:min-h-[38rem] lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-12 lg:px-14 lg:py-14"
      >
        <div className="technical-grid pointer-events-none absolute inset-0 -z-10 opacity-45" />
        <div className="pointer-events-none absolute -start-20 top-1/2 -z-10 size-64 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />

        <div className="hero-reveal max-w-2xl">
          <p className="section-kicker text-white/72">
            <span className="size-1.5 rounded-full bg-primary" />
            {t("eyebrow")}
          </p>
          <h1
            id="hero-title"
            className={cn(
              "mt-5 text-balance font-semibold tracking-[-0.055em]",
              locale === "en"
                ? "max-w-[12ch] text-[clamp(2.6rem,6vw,4.75rem)] leading-[0.98]"
                : "text-[clamp(2.5rem,7vw,5.7rem)] leading-[0.98]",
            )}
          >
            {heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-[0.98rem] leading-7 text-white/72 sm:text-[1.05rem]">
            {heroSubtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 min-[430px]:flex-row">
            <NextLink
              href={productsPath}
              prefetch={false}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t("browse")}
              <ArrowUpRight
                className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
            </NextLink>
            {contact.isExternal ? (
              <TrackedContactLink
                href={contact.href}
                target="_blank"
                rel="noreferrer"
                locale={locale}
                channel="WHATSAPP"
                placement="HOME_CTA"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/16 bg-white/6 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                {t("contact")}
              </TrackedContactLink>
            ) : (
              <span
                aria-disabled="true"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 text-sm font-semibold text-white/55"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                {t("contact")}
              </span>
            )}
          </div>

          <ul className="mt-8 grid gap-3 text-xs text-white/72 min-[370px]:grid-cols-3 min-[370px]:gap-2 sm:max-w-2xl">
            {[t("signalOne"), t("signalTwo"), t("signalThree")].map(
              (signal) => (
                <li key={signal} className="flex items-start gap-2">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/8">
                    <Check className="size-3 text-primary" aria-hidden="true" />
                  </span>
                  {signal}
                </li>
              ),
            )}
          </ul>
        </div>

        <div
          className="hero-reveal hero-reveal-delay relative mx-auto mt-10 w-full max-w-[38rem] lg:mt-0"
          dir="ltr"
          role="img"
          aria-label={t("visualLabel")}
        >
          <div className="relative aspect-[1.05] min-h-[18rem] sm:aspect-[1.15] sm:min-h-[21rem]">
            {settings.heroImageUrl?.startsWith("https://res.cloudinary.com/") && (
              <div className="absolute inset-[3%] z-30 overflow-hidden rounded-[1.6rem] border border-white/12 bg-[#111] shadow-[0_35px_100px_rgba(0,0,0,0.45)]">
                <Image src={getCloudinaryDeliveryUrl(settings.heroImageUrl, "f_auto,q_auto,c_fill,w_1200")} alt={heroTitle} fill priority sizes="(min-width: 1024px) 48vw, 90vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              </div>
            )}
            <div className="absolute inset-x-[7%] top-[5%] bottom-[13%] rounded-[1.6rem] border border-white/12 bg-[#202020] p-2 shadow-[0_35px_100px_rgba(0,0,0,0.45)] sm:p-3">
              <div className="relative h-full overflow-hidden rounded-[1.1rem] border border-white/8 bg-[#111] p-5 sm:p-7">
                <div className="absolute inset-0 technical-screen-grid opacity-50" />
                <div className="relative flex items-center justify-between">
                  <span className="font-latin text-[0.62rem] font-bold tracking-[0.2em] text-white/60 uppercase">
                    {settings.storeName} / 01
                  </span>
                  <span className="flex items-center gap-2 text-[0.6rem] text-white/68 uppercase">
                    <span className="size-1.5 rounded-full bg-brand-cyan shadow-[0_0_0_4px_rgba(85,237,224,0.12)]" />
                    <bdi dir={interfaceDirection}>{t("performance")}</bdi>
                  </span>
                </div>

                <div className="relative mt-[14%]">
                  <p className="font-latin text-[0.63rem] font-semibold tracking-[0.18em] text-white/70 uppercase">
                    <bdi dir="ltr">
                      {featuredProduct?.brand.name ?? settings.storeName}
                    </bdi>
                  </p>
                  <p className="font-latin mt-2 max-w-[82%] text-xl leading-tight font-semibold tracking-[-0.035em] text-white sm:text-3xl">
                    <bdi dir="ltr">
                      {featuredProduct?.name ?? settings.storeName}
                    </bdi>
                  </p>
                  {featuredProduct && (
                    <p className="font-latin mt-3 text-sm font-medium text-white/72">
                      <bdi dir="ltr">
                        {formatUsd(featuredProduct.priceUsdCents)}
                      </bdi>
                    </p>
                  )}
                </div>

                <div className="absolute inset-x-5 bottom-5 grid grid-cols-3 gap-2 sm:inset-x-7 sm:bottom-7">
                  {[
                    [t("memory"), specs ? `${specs.ramGB} GB` : "—"],
                    [t("storage"), specs ? formatStorage(specs).split(" ").slice(0, 2).join(" ") : "—"],
                    [
                      t("graphics"),
                      graphics?.replace("NVIDIA GeForce ", "") ?? "—",
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-lg border border-white/8 bg-white/[0.04] p-2.5 backdrop-blur-sm sm:p-3"
                    >
                      <span
                        dir={interfaceDirection}
                        className="block text-start text-[0.56rem] tracking-[0.12em] text-white/60 uppercase"
                      >
                        {label}
                      </span>
                      <span className="font-latin mt-1 block truncate text-[0.68rem] font-semibold text-white/88 sm:text-xs">
                        <bdi dir="ltr">{value}</bdi>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute inset-x-[3%] bottom-[8%] h-[7%] rounded-b-[2rem] bg-gradient-to-b from-[#3a3a3a] to-[#202020] shadow-[0_18px_30px_rgba(0,0,0,0.32)]">
              <div className="absolute start-1/2 top-0 h-[35%] w-[18%] -translate-x-1/2 rounded-b-lg bg-[#171717]" />
            </div>

            {specs && (
              <div className="absolute end-0 top-[13%] max-w-[52%] rounded-xl border border-white/12 bg-white px-3.5 py-3 text-graphite shadow-2xl sm:px-4">
                <span className="block text-[0.55rem] font-bold tracking-[0.16em] text-primary uppercase">
                  CPU
                </span>
                <span className="font-latin mt-1 block text-xs font-semibold leading-4 sm:text-sm">
                  <bdi dir="ltr">{formatCpu(specs)}</bdi>
                </span>
              </div>
            )}

            {specs && (
              <div className="absolute start-0 bottom-[3%] max-w-[58%] rounded-xl border border-white/12 bg-[#2b2b2b] px-3.5 py-3 text-white shadow-2xl sm:px-4">
                <span className="block text-[0.55rem] font-bold tracking-[0.16em] text-white/68 uppercase">
                  GPU
                </span>
                <span className="font-latin mt-1 block truncate text-xs font-semibold text-white/90 sm:text-sm">
                  <bdi dir={graphicsDirection}>{graphics}</bdi>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
