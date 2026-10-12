"use client";

import Image from "next/image";
import { useState } from "react";

import { getCloudinaryDeliveryUrl } from "@/lib/cloudinary-delivery";

type GalleryImage = {
  id: string;
  url: string;
  alt: string;
};

type ProductImageGalleryProps = {
  images: GalleryImage[];
  thumbnailGroupLabel: string;
  thumbnailLabel: string;
};

function GalleryImageElement({
  image,
  priority = false,
}: {
  image: GalleryImage;
  priority?: boolean;
}) {
  return (
    <Image src={getCloudinaryDeliveryUrl(image.url, priority ? "f_auto,q_auto,w_1400" : "f_auto,q_auto,w_240")} alt={image.alt} fill priority={priority} sizes={priority ? "(min-width: 1024px) 52vw, 100vw" : "80px"} className="object-cover" />
  );
}

export function ProductImageGallery({
  images,
  thumbnailGroupLabel,
  thumbnailLabel,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  if (!activeImage) {
    return null;
  }

  return (
    <div>
      <div className="relative aspect-[1.08] overflow-hidden rounded-[1.5rem] border border-black/8 bg-[var(--media-surface)] sm:aspect-[1.2]">
        <GalleryImageElement image={activeImage} priority />
      </div>

      <div
        className="mt-3 flex gap-2 overflow-x-auto pb-1"
        role="group"
        aria-label={thumbnailGroupLabel}
      >
        {images.map((image, index) => {
          const active = index === activeIndex;

          return (
            <button
              key={image.id}
              type="button"
              aria-label={`${thumbnailLabel} ${index + 1}`}
              aria-pressed={active}
              onClick={() => setActiveIndex(index)}
              className={`relative size-16 shrink-0 overflow-hidden rounded-xl border bg-[var(--media-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:size-20 ${
                active
                  ? "border-primary ring-2 ring-primary/15"
                  : "border-black/10 hover:border-black/20"
              }`}
            >
              <GalleryImageElement image={image} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
