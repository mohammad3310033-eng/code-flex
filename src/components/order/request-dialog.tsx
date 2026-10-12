"use client";

import { Dialog } from "@base-ui/react/dialog";
import { CheckCircle2, LoaderCircle, MessageCircle, Send, X } from "lucide-react";
import { useState, useTransition } from "react";

import { getAnalyticsIdentity, trackAnalyticsEvent } from "@/lib/analytics-client";
import { TrackedContactLink } from "@/components/analytics/tracked-contact-link";
import type { ApiResponse } from "@/lib/admin-api-response";

export type RequestDialogCopy = {
  title: string;
  description: string;
  name: string;
  phone: string;
  city: string;
  note: string;
  submit: string;
  submitting: string;
  directWhatsApp: string;
  close: string;
  successTitle: string;
  successDescription: string;
  genericError: string;
  unavailableError: string;
  nameError: string;
  phoneError: string;
  cityError: string;
  noteError: string;
  whatsappUnavailable: string;
};

type RequestDialogProps = {
  productId: string;
  categoryId: string;
  locale: "ar" | "en";
  requestLabel: string;
  triggerClassName: string;
  compact?: boolean;
  whatsappHref: string;
  whatsappExternal: boolean;
  copy: RequestDialogCopy;
};

type OrderRequestFormProps = Omit<
  RequestDialogProps,
  "triggerClassName" | "compact" | "requestLabel"
>;

type OrderRequestState = {
  status: "idle" | "validation-error" | "unavailable" | "error" | "success";
  fieldErrors?: Partial<Record<"customerName" | "customerPhone" | "city" | "note", true>>;
};

const initialOrderRequestState: OrderRequestState = { status: "idle" };

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className="mt-1.5 text-xs font-medium text-primary" role="alert">
      {message}
    </p>
  ) : null;
}

function OrderRequestForm({
  productId,
  categoryId,
  locale,
  whatsappHref,
  whatsappExternal,
  copy,
}: OrderRequestFormProps) {
  const [state, setState] = useState<OrderRequestState>(initialOrderRequestState);
  const [pending, startTransition] = useTransition();
  const identity = getAnalyticsIdentity();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    startTransition(async () => {
      try {
        const response = await fetch("/api/requests", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json() as ApiResponse<{ duplicate: boolean }>;
        if (result.ok) {
          setState({ status: "success" });
          return;
        }
        if (result.error.code === "VALIDATION_ERROR") {
          const fieldErrors = Object.fromEntries(Object.keys(result.error.fieldErrors ?? {}).map((field) => [field, true])) as OrderRequestState["fieldErrors"];
          setState({ status: "validation-error", fieldErrors });
          return;
        }
        setState({ status: result.error.code === "NOT_FOUND" ? "unavailable" : "error" });
      } catch {
        setState({ status: "error" });
      }
    });
  }

  if (state.status === "success") {
    return (
      <div data-testid="request-dialog-success" className="py-4 text-center" aria-live="polite">
        <CheckCircle2 className="mx-auto size-11 text-status-positive" aria-hidden="true" />
        <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-foreground">
          {copy.successTitle}
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {copy.successDescription}
        </p>
        <div className="mt-6 grid gap-3">
          {whatsappExternal ? (
            <TrackedContactLink
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              locale={locale}
              channel="WHATSAPP"
              placement="ORDER_DIALOG"
              productId={productId}
              categoryId={categoryId}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/12 bg-white px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {copy.directWhatsApp}
            </TrackedContactLink>
          ) : (
            <span className="inline-flex min-h-12 items-center justify-center rounded-full bg-muted px-5 text-sm font-semibold text-muted-foreground" aria-disabled="true">
              {copy.whatsappUnavailable}
            </span>
          )}
          <Dialog.Close data-testid="request-dialog-close" className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            {copy.close}
          </Dialog.Close>
        </div>
      </div>
    );
  }

  const formError =
    state.status === "unavailable"
      ? copy.unavailableError
      : state.status === "error"
        ? copy.genericError
        : undefined;

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="visitorId" value={identity.visitorId ?? ""} />
      <input type="hidden" name="sessionId" value={identity.sessionId ?? ""} />
      <input type="hidden" name="locale" value={locale} />

      <div>
        <label htmlFor="request-customer-name" className="text-sm font-semibold text-foreground">
          {copy.name}
        </label>
        <input
          autoFocus
          id="request-customer-name"
          name="customerName"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          aria-invalid={state.fieldErrors?.customerName || undefined}
          aria-describedby={state.fieldErrors?.customerName ? "request-customer-name-error" : undefined}
          className="mt-2 min-h-12 w-full rounded-xl border border-black/12 bg-white px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        <FieldError id="request-customer-name-error" message={state.fieldErrors?.customerName ? copy.nameError : undefined} />
      </div>

      <div>
        <label htmlFor="request-customer-phone" className="text-sm font-semibold text-foreground">
          {copy.phone}
        </label>
        <input
          id="request-customer-phone"
          name="customerPhone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          minLength={7}
          maxLength={32}
          pattern="[0-9+\\s().-]+"
          dir="ltr"
          aria-invalid={state.fieldErrors?.customerPhone || undefined}
          aria-describedby={state.fieldErrors?.customerPhone ? "request-customer-phone-error" : undefined}
          className="font-latin mt-2 min-h-12 w-full rounded-xl border border-black/12 bg-white px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        <FieldError id="request-customer-phone-error" message={state.fieldErrors?.customerPhone ? copy.phoneError : undefined} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="request-city" className="text-sm font-semibold text-foreground">
            {copy.city}
          </label>
          <input
            id="request-city"
            name="city"
            autoComplete="address-level2"
            maxLength={80}
            aria-invalid={state.fieldErrors?.city || undefined}
            className="mt-2 min-h-12 w-full rounded-xl border border-black/12 bg-white px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <FieldError id="request-city-error" message={state.fieldErrors?.city ? copy.cityError : undefined} />
        </div>
        <div>
          <label htmlFor="request-note" className="text-sm font-semibold text-foreground">
            {copy.note}
          </label>
          <textarea
            id="request-note"
            name="note"
            rows={2}
            maxLength={1000}
            aria-invalid={state.fieldErrors?.note || undefined}
            className="mt-2 min-h-12 w-full resize-y rounded-xl border border-black/12 bg-white px-3.5 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <FieldError id="request-note-error" message={state.fieldErrors?.note ? copy.noteError : undefined} />
        </div>
      </div>

      {formError && (
        <p className="rounded-xl bg-status-warm-surface px-3.5 py-3 text-sm font-medium text-status-warm" role="alert">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
        {pending ? copy.submitting : copy.submit}
      </button>

      {whatsappExternal && (
        <TrackedContactLink
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          locale={locale}
          channel="WHATSAPP"
          placement="ORDER_DIALOG"
          productId={productId}
          categoryId={categoryId}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-black/12 bg-white px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          {copy.directWhatsApp}
        </TrackedContactLink>
      )}
    </form>
  );
}

export function RequestDialog({
  productId,
  categoryId,
  locale,
  requestLabel,
  triggerClassName,
  compact = false,
  whatsappHref,
  whatsappExternal,
  copy,
}: RequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (!nextOpen) {
          setFormKey((value) => value + 1);
        }
      }}
    >
      <Dialog.Trigger
        type="button"
        onClick={() => {
          trackAnalyticsEvent({
            eventType: "ORDER_INTENT",
            locale,
            productId,
            categoryId,
            ...getAnalyticsIdentity(),
          });
        }}
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-primary font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${triggerClassName}`}
      >
        <Send className="size-4" aria-hidden="true" />
        {requestLabel}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
        <Dialog.Popup
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="fixed inset-x-3 top-1/2 z-50 max-h-[calc(100dvh-1.5rem)] w-auto -translate-y-1/2 overflow-y-auto rounded-[1.5rem] border border-black/10 bg-background p-5 shadow-2xl sm:start-1/2 sm:end-auto sm:w-[min(100%-2rem,32rem)] sm:-translate-x-1/2 sm:p-7"
        >
          <Dialog.Close
            aria-label={copy.close}
            className="absolute end-3 top-3 grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <X className="size-4" aria-hidden="true" />
          </Dialog.Close>
          <Dialog.Title className="pe-12 text-2xl font-semibold tracking-[-0.035em] text-foreground">
            {copy.title}
          </Dialog.Title>
          <Dialog.Description className="mt-2 pe-4 text-sm leading-6 text-muted-foreground">
            {copy.description}
          </Dialog.Description>
          <OrderRequestForm
            key={formKey}
            productId={productId}
            categoryId={categoryId}
            locale={locale}
            whatsappHref={whatsappHref}
            whatsappExternal={whatsappExternal}
            copy={copy}
          />
          {!whatsappExternal && (
            <p className="mt-4 text-center text-xs text-muted-foreground">{copy.whatsappUnavailable}</p>
          )}
          {compact && <span className="sr-only">{requestLabel}</span>}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
