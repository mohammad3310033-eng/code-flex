const skeletonCards = Array.from({ length: 12 }, (_, index) => index);
const skeletonFilterGroups = [3, 5, 3, 4, 4];

function SkeletonLine({ className }: { className: string }) {
  return <span className={`block rounded-full bg-black/8 ${className}`} />;
}

function ProductCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-[1.25rem] border border-black/8 bg-white">
      <div className="aspect-[1.6] border-b border-black/6 bg-[var(--media-surface)] p-5 sm:aspect-[1.55]">
        <div className="flex items-center justify-between">
          <SkeletonLine className="h-2 w-16" />
          <SkeletonLine className="h-2 w-10" />
        </div>
        <div className="mx-auto mt-[16%] aspect-[2/1] w-[68%] rounded-xl border-[5px] border-black/8 bg-black/6" />
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <SkeletonLine className="h-2.5 w-16" />
          <SkeletonLine className="h-6 w-20" />
        </div>
        <SkeletonLine className="mt-4 h-5 w-4/5" />
        <SkeletonLine className="mt-2 h-5 w-3/5" />

        <div className="mt-4 border-y border-black/6 py-4">
          <SkeletonLine className="h-7 w-28" />
          <SkeletonLine className="mt-2 h-3 w-24" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index}>
              <SkeletonLine className="h-2.5 w-12" />
              <SkeletonLine className="mt-2 h-3 w-4/5" />
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-black/6 pt-4">
          <SkeletonLine className="h-3 w-24" />
        </div>
      </div>
    </article>
  );
}

export function CatalogSkeleton() {
  return (
    <div className="min-h-dvh motion-safe:animate-pulse" aria-hidden="true" data-testid="storefront-catalog-skeleton">
      <div className="border-b border-black/8 bg-background">
        <div className="page-shell flex h-[4.5rem] items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="size-8 rounded-[0.55rem] bg-foreground/85" />
            <SkeletonLine className="h-4 w-24 max-[359px]:hidden" />
          </div>
          <div className="flex items-center gap-2">
            <span className="h-12 w-24 rounded-full border border-black/8 bg-white" />
            <span className="size-11 rounded-full bg-primary/80" />
          </div>
        </div>
      </div>

      <main className="page-shell py-10 sm:py-14 lg:py-16">
        <div className="max-w-3xl">
          <SkeletonLine className="h-2.5 w-24" />
          <SkeletonLine className="mt-5 h-9 w-52 sm:h-11 sm:w-72" />
          <SkeletonLine className="mt-4 h-3 w-full max-w-xl" />
          <SkeletonLine className="mt-2 h-3 w-4/5 max-w-lg" />
        </div>

        <div className="mt-8 flex gap-3">
          <span className="h-12 flex-1 rounded-xl border border-black/10 bg-white" />
          <span className="h-12 w-24 rounded-full bg-foreground/85" />
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 border-y border-black/8 py-4">
          <SkeletonLine className="h-3 w-24" />
          <div className="flex gap-2">
            <span className="h-11 w-24 rounded-full border border-black/10 bg-white lg:hidden" />
            <span className="h-11 w-32 rounded-xl border border-black/10 bg-white" />
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
          <aside className="hidden rounded-[1.25rem] border border-black/8 bg-white p-5 lg:block">
            <div className="flex items-center justify-between">
              <SkeletonLine className="h-5 w-20" />
              <SkeletonLine className="h-3 w-12" />
            </div>
            <div className="mt-5 space-y-6">
              {skeletonFilterGroups.map((lineCount, groupIndex) => (
                <div
                  key={`${lineCount}-${groupIndex}`}
                  className="border-t border-black/6 pt-5 first:border-0 first:pt-0"
                >
                  <SkeletonLine className="h-3 w-20" />
                  <div className="mt-4 space-y-3">
                    {Array.from({ length: lineCount }, (_, lineIndex) => (
                      <div
                        key={lineIndex}
                        className="flex items-center gap-3"
                      >
                        <span className="size-4 rounded border border-black/10 bg-muted" />
                        <SkeletonLine
                          className={
                            lineIndex % 2 === 0 ? "h-2.5 w-28" : "h-2.5 w-20"
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <section className="min-w-0">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {skeletonCards.map((card) => (
                <ProductCardSkeleton key={card} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
