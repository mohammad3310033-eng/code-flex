import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { CategorySection } from "@/components/storefront/category-section";
import { ContactBand } from "@/components/storefront/contact-band";
import { FeaturedProducts } from "@/components/storefront/featured-products";
import { StorefrontFooter } from "@/components/storefront/footer";
import { Hero } from "@/components/storefront/hero";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { routing } from "@/i18n/routing";
import { getStorefrontData } from "@/lib/storefront-data";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 300;

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const data = await getStorefrontData();

  return (
    <div id="top" className="min-h-dvh">
      <StorefrontHeader locale={locale} settings={data.settings} />
      <main>
        <Hero
          locale={locale}
          settings={data.settings}
          featuredProduct={data.featuredProducts[0]}
        />
        <CategorySection locale={locale} categories={data.categories} />
        <FeaturedProducts
          locale={locale}
          products={data.featuredProducts}
          usdToSypRate={data.settings.usdToSypRate}
        />
        <ContactBand locale={locale} settings={data.settings} />
      </main>
      <StorefrontFooter locale={locale} storeName={data.settings.storeName} />
    </div>
  );
}
