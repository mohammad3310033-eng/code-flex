import { MessageCircle } from "lucide-react";

import { TrackedContactLink } from "@/components/analytics/tracked-contact-link";
import {
  RequestDialog,
  type RequestDialogCopy,
} from "@/components/order/request-dialog";

type ProductActionsProps = {
  productId: string;
  categoryId: string;
  locale: "ar" | "en";
  requestLabel: string;
  requestHint: string;
  requestDialogCopy: RequestDialogCopy;
  whatsappLabel: string;
  whatsappUnavailableLabel: string;
  whatsappHref: string;
  whatsappExternal: boolean;
  compact?: boolean;
};

export function ProductActions({
  productId,
  categoryId,
  locale,
  requestLabel,
  requestHint,
  requestDialogCopy,
  whatsappLabel,
  whatsappUnavailableLabel,
  whatsappHref,
  whatsappExternal,
  compact = false,
}: ProductActionsProps) {
  const actionClassName = compact
    ? "min-h-12 flex-1 px-3 text-sm"
    : "min-h-12 w-full px-5 text-sm";

  return (
    <div className={compact ? "flex gap-2" : "space-y-3"}>
      {whatsappExternal ? (
        <TrackedContactLink
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          locale={locale}
          channel="WHATSAPP"
          placement="PRODUCT_PAGE"
          productId={productId}
          categoryId={categoryId}
          className={`inline-flex items-center justify-center gap-2 rounded-full border border-black/12 bg-white font-semibold text-foreground transition-colors hover:border-black/20 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${actionClassName}`}
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          {whatsappLabel}
        </TrackedContactLink>
      ) : (
        <span
          aria-disabled="true"
          className={`inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full border border-black/8 bg-muted/70 font-semibold text-muted-foreground ${actionClassName}`}
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          {whatsappUnavailableLabel}
        </span>
      )}

      <RequestDialog
        productId={productId}
        categoryId={categoryId}
        locale={locale}
        requestLabel={requestLabel}
        triggerClassName={actionClassName}
        compact={compact}
        whatsappHref={whatsappHref}
        whatsappExternal={whatsappExternal}
        copy={requestDialogCopy}
      />

      {!compact && (
        <p id="product-request-hint" className="text-xs leading-5 text-muted-foreground">
          {requestHint}
        </p>
      )}
    </div>
  );
}
