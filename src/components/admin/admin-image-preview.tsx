"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type AdminImagePreviewProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  unoptimized?: boolean;
};

/** A single accessible image preview pattern for operational Admin media. */
export function AdminImagePreview({
  src,
  alt,
  sizes,
  className,
  imageClassName,
  unoptimized,
}: AdminImagePreviewProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        aria-label={`تكبير ${alt}`}
        render={<button type="button" className={cn("group relative block w-full cursor-zoom-in overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", className)} />}
      >
        <Image src={src} alt={alt} fill sizes={sizes} unoptimized={unoptimized} className={cn("object-contain transition-transform duration-200 group-hover:scale-[1.02]", imageClassName)} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm" />
        <Dialog.Popup className="fixed z-[90] left-1/2 top-1/2 w-[94vw] max-w-6xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#11131d] p-3 shadow-2xl outline-none">
          <Dialog.Title className="sr-only">{alt}</Dialog.Title>
          <Dialog.Close
            aria-label="إغلاق المعاينة"
            render={<button type="button" className="absolute end-5 top-5 z-10 grid size-11 cursor-pointer place-items-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" />}
          >
            <X className="size-5" aria-hidden="true" />
          </Dialog.Close>
          <div className="relative h-[min(88vh,56rem)] w-full overflow-hidden rounded-xl">
            <Image src={src} alt={alt} fill sizes="94vw" unoptimized={unoptimized} className="object-contain" />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
