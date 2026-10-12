"use client";

import { ImagePlus, LoaderCircle, Trash2, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { AdminImagePreview } from "@/components/admin/admin-image-preview";
import { heroImageAccept, removeHeroImageFile, supportedHeroImageTypes, uploadHeroImageFile } from "@/lib/admin-hero-image-client";

export function HeroImageManager({ settingsId, initialUrl, initialPublicId }: { settingsId: string; initialUrl: string | null; initialPublicId: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState(initialUrl ? { url: initialUrl, publicId: initialPublicId } : null);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [message, setMessage] = useState<{ kind: "error" | "success"; text: string }>();
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function select(file?: File) {
    if (!file) return;
    if (!supportedHeroImageTypes.has(file.type) || file.size > 12 * 1024 * 1024) {
      setMessage({ kind: "error", text: "استخدم JPG أو PNG أو WebP أو AVIF بحجم لا يتجاوز 12MB." });
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const nextPreview = URL.createObjectURL(file);
    setPreviewUrl(nextPreview);
    setMessage(undefined);
    startTransition(async () => {
      const result = await uploadHeroImageFile(settingsId, file);
      URL.revokeObjectURL(nextPreview);
      setPreviewUrl(undefined);
      if (result.error || !result.image) setMessage({ kind: "error", text: result.error ?? "تعذر حفظ الصورة." });
      else {
        setImage(result.image);
        setMessage({ kind: "success", text: result.success ?? "تم تحديث صورة Hero." });
        router.refresh();
      }
    });
  }

  function remove() {
    startTransition(async () => {
      const result = await removeHeroImageFile(settingsId);
      if (result.error) setMessage({ kind: "error", text: result.error });
      else { setImage(null); setMessage({ kind: "success", text: result.success ?? "تمت إزالة الصورة." }); router.refresh(); }
    });
  }

  const shownUrl = previewUrl ?? image?.url;
  return (
    <div className="mt-5">
      <p className="text-sm font-bold">صورة Hero (اختيارية)</p>
      <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); select(event.dataTransfer.files[0]); }} className="mt-2 overflow-hidden rounded-2xl border border-dashed border-brand-indigo/30 bg-brand-indigo/[0.03] p-3">
        {shownUrl ? <AdminImagePreview src={shownUrl} alt="معاينة صورة Hero" unoptimized={Boolean(previewUrl)} sizes="(min-width: 768px) 760px, 100vw" className="aspect-[2/1] rounded-xl bg-muted" imageClassName="object-contain" /> : <button type="button" disabled={pending} onClick={() => inputRef.current?.click()} className="flex min-h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl text-center text-sm font-bold text-brand-indigo hover:bg-brand-indigo/5"><ImagePlus className="size-8" aria-hidden="true" />اسحب الصورة هنا أو اخترها من الجهاز<span className="text-xs font-normal text-muted-foreground">JPG, PNG, WebP, AVIF · 12MB max</span></button>}
        <input ref={inputRef} className="sr-only" type="file" accept={heroImageAccept} onChange={(event) => { select(event.target.files?.[0]); event.currentTarget.value = ""; }} />
        <div className="mt-3 flex flex-wrap gap-2"><button type="button" disabled={pending} onClick={() => inputRef.current?.click()} className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl bg-primary px-3 text-xs font-bold text-white hover:bg-primary-hover disabled:opacity-60">{pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <UploadCloud className="size-4" aria-hidden="true" />}{image ? "استبدال الصورة" : "رفع صورة"}</button>{image && <button type="button" disabled={pending} onClick={remove} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-destructive/25 px-3 text-xs font-bold text-destructive hover:bg-destructive/10 disabled:opacity-60"><Trash2 className="size-4" aria-hidden="true" />إزالة</button>}</div>
      </div>
      {message && <p role={message.kind === "error" ? "alert" : "status"} className={`mt-2 text-sm font-bold ${message.kind === "error" ? "text-destructive" : "text-status-positive"}`}>{message.text}</p>}
      <p className="mt-2 text-xs text-muted-foreground">تُرفع الصورة مباشرة إلى مساحة مُدارة وموقّعة، ثم يتحقق الخادم منها قبل حفظها.</p>
    </div>
  );
}
