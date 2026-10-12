"use client";

import { ImagePlus, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { productImageAccept, supportedProductImageTypes } from "@/lib/admin-product-image-client";

type ProductImageDropzoneProps = {
  busy?: boolean;
  currentCount: number;
  inputTestId: string;
  onFiles: (files: File[]) => void;
};

function hasUnsupportedDraggedFile(items: DataTransferItemList) {
  return Array.from(items).some((item) => item.kind === "file" && Boolean(item.type) && !supportedProductImageTypes.has(item.type));
}

export function ProductImageDropzone({ busy = false, currentCount, inputTestId, onFiles }: ProductImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [dragState, setDragState] = useState<"idle" | "valid" | "invalid">("idle");
  const disabled = busy || currentCount >= 8;

  useEffect(() => {
    inputRef.current?.setAttribute("data-image-uploader-hydrated", "true");
  }, []);

  return (
    <div
      data-testid={inputTestId === "product-image-file-input" ? "product-image-dropzone" : "create-product-image-dropzone"}
      onDragEnter={(event) => {
        event.preventDefault();
        dragDepth.current += 1;
        if (!disabled) setDragState(hasUnsupportedDraggedFile(event.dataTransfer.items) ? "invalid" : "valid");
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragState(hasUnsupportedDraggedFile(event.dataTransfer.items) ? "invalid" : "valid");
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        dragDepth.current = Math.max(0, dragDepth.current - 1);
        if (dragDepth.current === 0) setDragState("idle");
      }}
      onDrop={(event) => {
        event.preventDefault();
        dragDepth.current = 0;
        setDragState("idle");
        if (!disabled) onFiles(Array.from(event.dataTransfer.files));
      }}
      className={`mt-5 rounded-2xl border border-dashed p-5 text-center transition-colors ${dragState === "invalid" ? "border-destructive bg-destructive/5 text-destructive" : dragState === "valid" ? "border-primary bg-primary/8 text-primary ring-2 ring-primary/15" : "border-black/15 bg-muted/35"}`}
    >
      <input
        data-testid={inputTestId}
        ref={inputRef}
        type="file"
        multiple
        accept={productImageAccept}
        className="sr-only"
        disabled={disabled}
        onChange={(event) => {
          onFiles(Array.from(event.target.files ?? []));
          event.currentTarget.value = "";
        }}
      />
      <UploadCloud className={`mx-auto size-6 ${dragState === "invalid" ? "text-destructive" : "text-primary"}`} aria-hidden="true" />
      <p className="mt-2 text-sm font-bold">
        {dragState === "invalid" ? "بعض الملفات غير مدعومة" : dragState === "valid" ? "أفلت الصور هنا للرفع" : "اسحب الصور هنا أو اخترها من جهازك"}
      </p>
      <p className={`mt-1 text-xs ${dragState === "invalid" ? "text-destructive" : "text-muted-foreground"}`}>JPG وPNG وWebP وAVIF، حتى 10MB للصورة الواحدة.</p>
      <button type="button" onClick={() => inputRef.current?.click()} disabled={disabled} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-45">
        <ImagePlus className="size-4" aria-hidden="true" />
        {busy ? "جارٍ رفع الصور…" : currentCount >= 8 ? "اكتمل الحد الأقصى" : "اختر صوراً"}
      </button>
    </div>
  );
}
