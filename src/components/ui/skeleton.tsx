import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("block rounded-lg bg-black/8", className)} />;
}

export function SkeletonPage({ children, className, testId }: { children: React.ReactNode; className?: string; testId?: string }) {
  return <div aria-hidden="true" data-testid={testId} className={cn("motion-safe:animate-pulse", className)}>{children}</div>;
}
