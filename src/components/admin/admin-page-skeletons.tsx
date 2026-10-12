import { Skeleton, SkeletonPage } from "@/components/ui/skeleton";

function HeaderSkeleton({ action = false }: { action?: boolean }) {
  return <div className="flex items-end justify-between gap-4"><div><Skeleton className="h-3 w-24" /><Skeleton className="mt-3 h-9 w-48" /></div>{action && <Skeleton className="h-11 w-32 rounded-xl bg-primary/20" />}</div>;
}

function Rows({ count = 6 }: { count?: number }) {
  return <div className="mt-3 overflow-hidden rounded-2xl border border-black/8 bg-white"><Skeleton className="h-12 w-full rounded-none" />{Array.from({ length: count }, (_, index) => <div key={index} className="grid grid-cols-[2fr_1fr_1fr] gap-5 border-t border-black/6 p-4"><Skeleton className="h-4 w-4/5" /><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-1/2" /></div>)}</div>;
}

function FormBlocks({ count = 4 }: { count?: number }) {
  return <div className="space-y-5">{Array.from({ length: count }, (_, index) => <section key={index} className="rounded-2xl border border-black/8 bg-white p-5"><Skeleton className="h-5 w-36" /><div className="mt-5 grid gap-4 sm:grid-cols-2"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div></section>)}</div>;
}

export function AdminDashboardSkeleton() {
  return <SkeletonPage testId="admin-dashboard-skeleton"><HeaderSkeleton action /><div className="mt-7 grid gap-4 sm:grid-cols-2"><Skeleton className="h-40 rounded-2xl bg-white" /><Skeleton className="h-40 rounded-2xl bg-white" /></div><Rows count={5} /></SkeletonPage>;
}

export function AdminProductsSkeleton() {
  return <SkeletonPage testId="admin-products-skeleton"><HeaderSkeleton action /><Skeleton className="mt-7 h-44 rounded-2xl bg-white" /><Skeleton className="mt-5 h-4 w-20" /><Rows /></SkeletonPage>;
}

export function AdminFormSkeleton({ withSidebar = false }: { withSidebar?: boolean }) {
  return <SkeletonPage testId={withSidebar ? "admin-product-edit-skeleton" : "admin-product-new-skeleton"}><HeaderSkeleton /><div className={`mt-7 grid gap-7 ${withSidebar ? "xl:grid-cols-[minmax(0,1fr)_24rem]" : "max-w-4xl"}`}><FormBlocks count={5} />{withSidebar && <Skeleton className="h-[30rem] rounded-2xl bg-white" />}</div></SkeletonPage>;
}

export function AdminCategoriesSkeleton() {
  return <SkeletonPage><HeaderSkeleton /><div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_24rem]"><div className="space-y-3">{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-24 rounded-xl bg-white" />)}</div><Skeleton className="h-[32rem] rounded-2xl bg-white" /></div></SkeletonPage>;
}

export function AdminOrdersSkeleton({ detail = false }: { detail?: boolean }) {
  if (detail) return <SkeletonPage><HeaderSkeleton /><div className="mt-7 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]"><div className="space-y-5"><Skeleton className="h-80 rounded-2xl bg-white" /><Skeleton className="h-72 rounded-2xl bg-white" /></div><div className="space-y-5"><Skeleton className="h-64 rounded-2xl bg-white" /><Skeleton className="h-72 rounded-2xl bg-white" /></div></div></SkeletonPage>;
  return <SkeletonPage><HeaderSkeleton /><Skeleton className="mt-7 h-44 rounded-2xl bg-white" /><Skeleton className="mt-5 h-4 w-20" /><Rows /></SkeletonPage>;
}

export function AdminAnalyticsSkeleton() {
  return <SkeletonPage><HeaderSkeleton /><Skeleton className="mt-7 h-36 rounded-2xl bg-white" /><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-32 rounded-2xl bg-white" />)}</div><Skeleton className="mt-7 h-96 rounded-2xl bg-white" /><div className="mt-7 grid gap-7 xl:grid-cols-2"><Skeleton className="h-72 rounded-2xl bg-white" /><Skeleton className="h-72 rounded-2xl bg-white" /></div></SkeletonPage>;
}

export function AdminSettingsSkeleton() {
  return <SkeletonPage><HeaderSkeleton /><div className="mt-7 max-w-4xl"><FormBlocks count={5} /></div></SkeletonPage>;
}

export function AdminAccountSkeleton() {
  return <SkeletonPage className="max-w-xl"><HeaderSkeleton /><Skeleton className="mt-7 h-80 rounded-2xl bg-white" /></SkeletonPage>;
}
