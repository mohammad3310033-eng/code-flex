import { Skeleton, SkeletonPage } from "@/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <SkeletonPage className="min-h-dvh" testId="storefront-home-skeleton">
      <header className="border-b border-black/8"><div className="page-shell flex h-[4.5rem] items-center justify-between"><div className="flex items-center gap-3"><Skeleton className="size-8 bg-graphite/85" /><Skeleton className="h-4 w-24" /></div><div className="flex gap-2"><Skeleton className="h-11 w-20 rounded-full" /><Skeleton className="size-11 rounded-full bg-primary/35" /></div></div></header>
      <main className="page-shell py-3 sm:py-5 lg:py-6">
        <section className="grid min-h-[34rem] gap-10 rounded-[1.5rem] bg-graphite p-6 sm:p-10 lg:grid-cols-2 lg:p-14"><div className="self-center"><Skeleton className="h-3 w-28 bg-white/15" /><Skeleton className="mt-6 h-14 w-4/5 bg-white/12 sm:h-20" /><Skeleton className="mt-4 h-14 w-full bg-white/8" /><div className="mt-8 flex gap-3"><Skeleton className="h-12 w-36 rounded-full bg-primary/45" /><Skeleton className="h-12 w-32 rounded-full bg-white/10" /></div></div><Skeleton className="min-h-72 self-center rounded-3xl bg-white/8" /></section>
        <section className="py-16 sm:py-20"><Skeleton className="h-3 w-24" /><Skeleton className="mt-4 h-10 w-64" /><div className="mt-8 grid gap-4 md:grid-cols-6">{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className={`h-52 rounded-xl bg-white ${index < 2 ? "md:col-span-3" : "md:col-span-2"}`} />)}</div></section>
        <section className="pb-16"><div className="flex justify-between"><Skeleton className="h-10 w-56" /><Skeleton className="h-11 w-28 rounded-full" /></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-96 rounded-2xl bg-white" />)}</div></section>
      </main>
    </SkeletonPage>
  );
}
