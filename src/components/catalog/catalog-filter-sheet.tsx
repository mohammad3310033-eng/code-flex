"use client";

import { SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type CatalogFilterSheetProps = {
  children: ReactNode;
  direction: "rtl" | "ltr";
  title: string;
  openLabel: string;
  closeLabel: string;
  activeFilterCount: number;
  activeFilterCountLabel: string;
};

export function CatalogFilterSheet({
  children,
  direction,
  title,
  openLabel,
  closeLabel,
  activeFilterCount,
  activeFilterCountLabel,
}: CatalogFilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <button
            type="button"
            aria-label={`${openLabel} — ${activeFilterCountLabel}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-foreground transition-colors hover:border-black/20 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
          />
        }
      >
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        <span>{openLabel}</span>
        {activeFilterCount > 0 && (
          <span
            className="font-latin grid min-h-6 min-w-6 place-items-center rounded-full bg-brand-indigo px-1.5 text-[0.68rem] font-bold text-white"
            aria-hidden="true"
          >
            {activeFilterCount}
          </span>
        )}
      </SheetTrigger>

      <SheetContent
        side={direction === "rtl" ? "right" : "left"}
        dir={direction}
        closeLabel={closeLabel}
        className="w-[min(92vw,24rem)] gap-0 overflow-hidden border-black/10 bg-background p-0 shadow-2xl"
      >
        <SheetHeader className="shrink-0 border-b border-black/8 bg-background px-5 py-5 pe-16">
          <SheetTitle className="text-lg font-semibold text-foreground">
            {title}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {activeFilterCountLabel}
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
