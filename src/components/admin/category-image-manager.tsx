"use client";

import { ImagePlus, LoaderCircle, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { AdminImagePreview } from "@/components/admin/admin-image-preview";
import { categoryImageAccept, removeCategoryImageFile, supportedCategoryImageTypes, uploadCategoryImageFile } from "@/lib/admin-category-image-client";

type Message = { kind: "error" | "success"; text: string };

export function CategoryImageManager({ categoryId, initialUrl, disabled, onBusyChange }: { categoryId?: string; initialUrl: string | null; disabled?: boolean; onBusyChange?: (busy: boolean) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(initialUrl);
  const [queuedFile, setQueuedFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [message, setMessage] = useState<Message>();
  const [pending, startTransition] = useTransition();

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  useEffect(() => { onBusyChange?.(pending); }, [onBusyChange, pending]);

  function clearPreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(undefined);
  }

  function upload(category: string, file: File) {
    startTransition(async () => {
      const result = await uploadCategoryImageFile(category, file);
      if ("error" in result) {
        setMessage({ kind: "error", text: result.error });
        return;
      }
      setImageUrl(result.imageUrl);
      setQueuedFile(undefined);
      clearPreview();
      setMessage({ kind: "success", text: result.success });
      router.refresh();
    });
  }

  useEffect(() => {
    if (categoryId && queuedFile) upload(categoryId, queuedFile);
  // Upload an image selected for a new category immediately after that category exists.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  function select(file?: File) {
    if (!file || disabled || pending) return;
    if (!supportedCategoryImageTypes.has(file.type) || file.size > 10 * 1024 * 1024) {
      setMessage({ kind: "error", text: "استخدم JPG أو PNG أو WebP أو AVIF بحجم لا يتجاوز 10MB." });
      return;
    }
    clearPreview();
    setPreviewUrl(URL.createObjectURL(file));
    setQueuedFile(file);
    setMessage(categoryId ? undefined : { kind: "success", text: "ستُرفع الصورة بعد حفظ التصنيف." });
    if (categoryId) upload(categoryId, file);
  }

  function remove() {
    if (disabled || pending) return;
    setQueuedFile(undefined);
    clearPreview();
    if (!categoryId) { setImageUrl(null); setMessage(undefined); return; }
    startTransition(async () => {
      const result = await removeCategoryImageFile(categoryId);
      if ("error" in result) { setMessage({ kind: "error", text: result.error }); return; }
      setImageUrl(null);
      setMessage({ kind: "success", text: result.success });
      router.refresh();
    });
  }

  const shownUrl = previewUrl ?? imageUrl;
  const isDisabled = Boolean(disabled || pending);
  return <section className="mt-5"><p className="text-sm font-bold">صورة التصنيف (اختيارية)</p><div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); select(event.dataTransfer.files[0]); }} className="mt-2 overflow-hidden rounded-2xl border border-dashed border-brand-indigo/30 bg-brand-indigo/[0.03] p-3">{shownUrl ? <AdminImagePreview src={shownUrl} alt="معاينة صورة التصنيف" unoptimized={Boolean(previewUrl)} sizes="(min-width: 1280px) 22rem, 100vw" className="aspect-[16/9] rounded-xl bg-muted" imageClassName="object-contain" /> : <button type="button" disabled={isDisabled} onClick={() => inputRef.current?.click()} className="flex min-h-36 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl text-center text-sm font-bold text-brand-indigo hover:bg-brand-indigo/5 disabled:cursor-not-allowed disabled:opacity-60"><ImagePlus className="size-7" aria-hidden="true" />اسحب الصورة هنا أو اخترها من الجهاز<span className="text-xs font-normal text-muted-foreground">JPG, PNG, WebP, AVIF · 10MB max</span></button>}<input ref={inputRef} className="sr-only" type="file" accept={categoryImageAccept} onChange={(event) => { select(event.target.files?.[0]); event.currentTarget.value = ""; }} /><div className="mt-3 flex flex-wrap gap-2"><button type="button" disabled={isDisabled} onClick={() => inputRef.current?.click()} className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl bg-primary px-3 text-xs font-bold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60">{pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <UploadCloud className="size-4" aria-hidden="true" />}{shownUrl ? "استبدال الصورة" : "اختيار صورة"}</button>{shownUrl && <button type="button" disabled={isDisabled} onClick={remove} className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border border-destructive/25 px-3 text-xs font-bold text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"><Trash2 className="size-4" aria-hidden="true" />إزالة</button>}</div></div>{message && <p role={message.kind === "error" ? "alert" : "status"} className={`mt-2 text-sm font-bold ${message.kind === "error" ? "text-destructive" : "text-status-positive"}`}>{message.text}</p>}<p className="mt-2 text-xs text-muted-foreground">تُرفع الصورة إلى مساحة مُدارة ثم يتحقق الخادم منها قبل حفظ رابطها.</p></section>;
}
