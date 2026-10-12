import Image from "next/image";

import { getCloudinaryDeliveryUrl } from "@/lib/cloudinary-delivery";

type ProductSingleImageProps = {
  image: { url: string; alt: string };
};

export function ProductSingleImage({ image }: ProductSingleImageProps) {
  return (
    <div className="relative aspect-[1.08] overflow-hidden rounded-[1.5rem] border border-black/8 bg-[var(--media-surface)] sm:aspect-[1.2]">
      <Image src={getCloudinaryDeliveryUrl(image.url, "f_auto,q_auto,w_1400")} alt={image.alt} fill priority sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" />
    </div>
  );
}
