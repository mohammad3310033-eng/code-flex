import { ArrowUpRight, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { TrackedContactLink } from "@/components/analytics/tracked-contact-link";
import type { StoreLocale } from "@/i18n/routing";
import { getWhatsAppDestination } from "@/lib/contact";
import type { StorefrontSettings } from "@/lib/storefront-data";

type ContactBandProps = {
  locale: StoreLocale;
  settings: StorefrontSettings;
};

export async function ContactBand({ locale, settings }: ContactBandProps) {
  const t = await getTranslations({ locale, namespace: "Contact" });
  const contact = getWhatsAppDestination(settings.whatsapp);
  const contactValue = settings.whatsapp ?? settings.phone;

  return (
    <section
      id="contact"
      className="page-shell scroll-mt-24 py-12 sm:py-16"
      aria-labelledby="contact-title"
    >
      <div className="relative isolate overflow-hidden rounded-[1.5rem] bg-graphite px-6 py-8 text-white sm:px-10 sm:py-10 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-12">
        <div className="absolute inset-y-0 start-0 -z-10 w-1 bg-primary" />
        <div className="absolute -end-16 -bottom-24 -z-10 size-64 rounded-full border-[3rem] border-white/[0.025]" />

        <div className="max-w-2xl">
          <p className="section-kicker text-white/70">
            <span className="size-1.5 rounded-full bg-primary" />
            {t("eyebrow")}
          </p>
          <h2
            id="contact-title"
            className="mt-4 text-balance text-2xl leading-tight font-semibold tracking-[-0.035em] sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
            {t("description")}
          </p>
        </div>

        <div className="mt-7 shrink-0 lg:mt-0">
          {contact.isExternal ? (
            <TrackedContactLink
              href={contact.href}
              target="_blank"
              rel="noreferrer"
              locale={locale}
              channel="WHATSAPP"
              placement="HOME_CTA"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {t("action")}
              <ArrowUpRight
                className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
            </TrackedContactLink>
          ) : (
            <div className="inline-flex min-h-12 items-center gap-3 rounded-full border border-white/12 bg-white/6 px-5">
              <MessageCircle className="size-4 text-primary" aria-hidden="true" />
              <bdi dir="ltr" className="font-latin block text-sm font-semibold">
                {contactValue ?? "—"}
              </bdi>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
