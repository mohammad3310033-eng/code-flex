import { ArrowUpRight, Cpu, Database, MemoryStick, MonitorCog } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";

import { getPathname } from "@/i18n/navigation";
import type { StoreLocale } from "@/i18n/routing";
import { formatSyp, formatUsd } from "@/lib/money";
import { getCloudinaryDeliveryUrl } from "@/lib/cloudinary-delivery";
import type { ProductCardProduct } from "@/lib/product-card-data";
import { formatCpu, formatGpu, formatStorage } from "@/lib/product-specs";
import { cn } from "@/lib/utils";

type ProductCardLabels = {
  details: string;
  mediaLabel: string;
  noImage: string;
  cpu: string;
  ram: string;
  storage: string;
  graphics: string;
  integratedGraphics: string;
  inStock: string;
  outOfStock: string;
  onRequest: string;
};

type ProductCardProps = {
  product: ProductCardProduct;
  locale: StoreLocale;
  usdToSypRate: number;
  labels: ProductCardLabels;
};

const stockPresentation = {
  IN_STOCK: {
    label: "inStock",
    className: "bg-status-positive-surface text-status-positive",
    dotClassName: "bg-status-positive-mark",
  },
  OUT_OF_STOCK: {
    label: "outOfStock",
    className: "bg-status-neutral-surface text-status-neutral",
    dotClassName: "bg-status-neutral-mark",
  },
  ON_REQUEST: {
    label: "onRequest",
    className: "bg-status-warm-surface text-status-warm",
    dotClassName: "bg-status-warm-mark",
  },
} as const satisfies Record<
  ProductCardProduct["stockStatus"],
  {
    label: keyof Pick<
      ProductCardLabels,
      "inStock" | "outOfStock" | "onRequest"
    >;
    className: string;
    dotClassName: string;
  }
>;

export function ProductCard({
  product,
  locale,
  usdToSypRate,
  labels,
}: ProductCardProps) {
  const stock = stockPresentation[product.stockStatus];
  const specs = product.laptopSpecs;
  const graphics = specs
    ? formatGpu(specs, labels.integratedGraphics)
    : undefined;
  const graphicsDirection = specs?.gpuModel || locale === "en" ? "ltr" : "rtl";
  const productPath = getPathname({
    href: `/products/${product.slug}`,
    locale,
  });
  const primaryImage = product.images[0];
  const imageAlt = product.name;

  return (
    <article className="product-card group flex min-w-0 flex-col overflow-hidden rounded-[1.25rem] border border-black/8 bg-white transition-[transform,border-color,box-shadow]">
      <div
        className="product-media relative aspect-[2.05] overflow-hidden border-b border-black/6 bg-[var(--media-surface)] p-4 sm:aspect-[1.55] sm:p-5"
        role="img"
        aria-label={`${labels.mediaLabel}: ${product.name}`}
        dir="ltr"
      >
        {primaryImage ? (
          <Image
            src={getCloudinaryDeliveryUrl(primaryImage.url, "f_auto,q_auto,c_fill,w_900")}
            alt={imageAlt}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover"
          />
        ) : <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.9),rgba(245,246,248,0.9)_45%,rgba(229,231,235,0.75))] p-5"><span className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-center text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur-sm" dir="auto">{labels.noImage}</span></div>}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="font-latin text-[0.65rem] font-bold tracking-[0.15em] text-muted-foreground uppercase">
            <bdi dir="ltr">{product.brand.name}</bdi>
          </span>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.66rem] font-semibold",
              stock.className,
            )}
          >
            <span
              className={cn("size-1.5 rounded-full", stock.dotClassName)}
              aria-hidden="true"
            />
            {labels[stock.label]}
          </span>
        </div>

        <h3
          className="font-latin mt-2 line-clamp-2 text-start text-base leading-5 font-semibold tracking-[-0.025em] text-foreground sm:mt-3 sm:min-h-[3rem] sm:text-lg sm:leading-6"
        >
          <bdi dir="ltr" className="inline-block">
            {product.name}
          </bdi>
        </h3>

        <div className="mt-3 border-y border-black/6 py-2.5 sm:mt-4 sm:py-3.5">
          <p className="font-latin text-start text-xl font-semibold tracking-[-0.04em] text-foreground sm:text-2xl">
            <bdi dir="ltr">{formatUsd(product.priceUsdCents)}</bdi>
          </p>
          <p className="font-latin mt-1 text-start text-xs font-medium text-muted-foreground">
            <bdi dir="ltr">
              {formatSyp(product.priceUsdCents, usdToSypRate, locale)}
            </bdi>
          </p>
        </div>

        {specs && (
          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:mt-4 sm:gap-y-3 [&_dd]:break-words">
            <div className="min-w-0">
              <dt className="flex items-center gap-1.5 text-[0.64rem] text-muted-foreground">
                <Cpu className="size-3.5" strokeWidth={1.7} aria-hidden="true" />
                {labels.cpu}
              </dt>
              <dd className="font-latin mt-1 text-start leading-5 font-semibold text-foreground">
                <bdi dir="ltr">{formatCpu(specs)}</bdi>
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="flex items-center gap-1.5 text-[0.64rem] text-muted-foreground">
                <MemoryStick className="size-3.5" strokeWidth={1.7} aria-hidden="true" />
                {labels.ram}
              </dt>
              <dd className="font-latin mt-1 font-semibold text-foreground">
                <bdi dir="ltr">{specs.ramGB} GB</bdi>
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="flex items-center gap-1.5 text-[0.64rem] text-muted-foreground">
                <Database className="size-3.5" strokeWidth={1.7} aria-hidden="true" />
                {labels.storage}
              </dt>
              <dd className="font-latin mt-1 text-start leading-5 font-semibold text-foreground">
                <bdi dir="ltr">{formatStorage(specs)}</bdi>
              </dd>
            </div>
            <div className="hidden min-w-0 sm:block">
              <dt className="flex items-center gap-1.5 text-[0.64rem] text-muted-foreground">
                <MonitorCog className="size-3.5" strokeWidth={1.7} aria-hidden="true" />
                {labels.graphics}
              </dt>
              <dd
                className={cn(
                  "mt-1 text-start leading-5 font-semibold text-foreground",
                  graphicsDirection === "ltr" && "font-latin",
                )}
              >
                <bdi dir={graphicsDirection}>{graphics}</bdi>
              </dd>
            </div>
          </dl>
        )}

        <NextLink
          href={productPath}
          prefetch={false}
          className="mt-3 inline-flex min-h-10 items-center justify-between gap-3 border-t border-black/6 pt-2 text-xs font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:mt-5 sm:min-h-11 sm:pt-3 sm:text-foreground"
        >
          {labels.details}
          <ArrowUpRight
            className="size-4 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
        </NextLink>
      </div>
    </article>
  );
}
