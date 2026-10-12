import { Skeleton, SkeletonPage } from "@/components/ui/skeleton";

export default function Loading() {
  return <SkeletonPage className="grid min-h-dvh place-items-center p-4" testId="admin-login-skeleton"><div className="w-full max-w-md rounded-2xl border border-black/8 bg-white p-6"><Skeleton className="h-8 w-48" /><Skeleton className="mt-3 h-4 w-64" /><Skeleton className="mt-8 h-12 w-full" /><Skeleton className="mt-4 h-12 w-full" /><Skeleton className="mt-6 h-12 w-full rounded-full bg-primary/25" /></div></SkeletonPage>;
}
