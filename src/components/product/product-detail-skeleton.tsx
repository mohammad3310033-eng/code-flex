export function ProductDetailSkeleton() {
  return (
    <div className="min-h-dvh motion-safe:animate-pulse" aria-hidden="true" data-testid="storefront-product-detail-skeleton">
      <div className="border-b border-black/8 bg-background">
        <div className="page-shell flex h-[4.5rem] items-center justify-between gap-4">
          <span className="h-8 w-32 rounded-full bg-black/8" />
          <span className="size-11 rounded-full bg-primary/80" />
        </div>
      </div>
      <main className="page-shell py-8 sm:py-12 lg:py-14">
        <span className="block h-3 w-48 rounded-full bg-black/8" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:gap-12">
          <div>
            <div className="aspect-[1.08] rounded-[1.5rem] border border-black/6 bg-black/6 sm:aspect-[1.2]" />
            <div className="mt-3 flex gap-2">
              <span className="size-16 rounded-xl bg-black/8" />
              <span className="size-16 rounded-xl bg-black/8" />
              <span className="size-16 rounded-xl bg-black/8" />
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-black/8 bg-white p-6 sm:p-8">
            <span className="block h-3 w-20 rounded-full bg-black/8" />
            <span className="mt-4 block h-12 w-4/5 rounded-full bg-black/8" />
            <span className="mt-3 block h-5 w-3/5 rounded-full bg-black/8" />
            <div className="mt-7 border-y border-black/6 py-5">
              <span className="block h-8 w-36 rounded-full bg-black/8" />
              <span className="mt-3 block h-4 w-28 rounded-full bg-black/8" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }, (_, index) => (
                <span key={index} className="h-20 rounded-xl bg-black/6" />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <span className="h-72 rounded-[1.5rem] border border-black/8 bg-white" />
          <span className="h-52 rounded-[1.5rem] border border-black/8 bg-white" />
        </div>
      </main>
    </div>
  );
}
