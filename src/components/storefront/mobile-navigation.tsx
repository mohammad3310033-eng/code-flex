"use client";

import { ArrowUpRight, Menu, MessageCircle } from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { TrackedContactLink } from "@/components/analytics/tracked-contact-link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type MobileNavigationProps = {
  direction: "rtl" | "ltr";
  storeName: string;
  openLabel: string;
  closeLabel: string;
  title: string;
  description: string;
  contactLabel: string;
  contactHref: string;
  contactIsExternal: boolean;
  locale: "ar" | "en";
  items: Array<{
    href: string;
    label: string;
    prefetch?: boolean;
    isActive?: boolean;
  }>;
};

export function MobileNavigation({
  direction,
  storeName,
  openLabel,
  closeLabel,
  title,
  description,
  contactLabel,
  contactHref,
  contactIsExternal,
  locale,
  items,
}: MobileNavigationProps) {
  const pathname = usePathname();
  const [openState, setOpenState] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const open = openState && menuPath === pathname;
  const setOpen = (nextOpen: boolean) => {
    setMenuPath(pathname);
    setOpenState(nextOpen);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button
            type="button"
            data-testid="mobile-menu-trigger"
            className="grid size-11 cursor-pointer place-items-center rounded-full border border-black/10 bg-white text-foreground transition-colors hover:border-black/20 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
            aria-label={openLabel}
          />
        }
      >
        <Menu className="size-[1.15rem]" aria-hidden="true" />
      </SheetTrigger>

      <SheetContent
        side={direction === "rtl" ? "right" : "left"}
        dir={direction}
        closeLabel={closeLabel}
        className="w-[min(88vw,23rem)] gap-0 border-black/10 bg-background p-0 shadow-2xl"
      >
        <SheetHeader className="border-b border-black/8 px-6 py-6 pe-14">
          <span className="font-latin text-xs font-bold tracking-[0.18em] text-primary uppercase">
            {storeName}
          </span>
          <SheetTitle className="mt-3 text-xl font-semibold">{title}</SheetTitle>
          <SheetDescription className="mt-1 leading-6">
            {description}
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col px-3 py-4" aria-label={title}>
          {items.map((item, index) => (
            <SheetClose
              key={`${item.href}-${item.label}`}
              nativeButton={false}
              render={
                <NextLink
                  href={item.href}
                  onClick={() => setOpen(false)}
                  prefetch={item.prefetch}
                  aria-current={item.isActive ? "page" : undefined}
                  className={cn(
                    "group flex min-h-14 cursor-pointer items-center justify-between rounded-xl px-3 text-base font-medium text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-primary",
                    item.isActive ? "bg-white" : "hover:bg-white",
                  )}
                />
              }
            >
              <span className="flex items-center gap-3">
                <span className="font-latin text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.label}
              </span>
              <ArrowUpRight
                className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100"
                aria-hidden="true"
              />
            </SheetClose>
          ))}
        </nav>

        <div className="mt-auto border-t border-black/8 p-5">
          {contactIsExternal ? (
            <SheetClose
              nativeButton={false}
              render={
                <TrackedContactLink
                  href={contactHref}
                  target="_blank"
                  rel="noreferrer"
                  locale={locale}
                  channel="WHATSAPP"
                  placement="HEADER"
                  onClick={() => setOpen(false)}
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                />
              }
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {contactLabel}
            </SheetClose>
          ) : (
            <span
              aria-disabled="true"
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-muted px-5 font-semibold text-muted-foreground"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {contactLabel}
            </span>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
