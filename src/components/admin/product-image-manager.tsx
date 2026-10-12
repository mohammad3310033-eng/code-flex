"use client";

import { GripVertical, LoaderCircle, MoveDown, MoveUp, RotateCcw, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { ProductImageDropzone } from "@/components/admin/product-image-dropzone";
import { AdminImagePreview } from "@/components/admin/admin-image-preview";
import { moveProductImageByDirection, normalizeProductImageOrder, planProductImageUploads, type ImageUploadPlan } from "@/lib/admin-image-upload";
import { uploadProductImageFile } from "@/lib/admin-product-image-client";

type ManagedImage = { id: string; publicId: string; url: string; sortOrder: number };
type QueueItem = ImageUploadPlan & { file: File; status: "queued" | "uploading" | "saving" | "success" | "failed"; message?: string };
type FailedFile = { file: File; message: string };

function rejectionMessage(rejection: ImageUploadPlan["rejection"]) {
  if (rejection === "unsupported") return "صيغة الملف غير مدعومة.";
  if (rejection === "too_large") return "حجم الملف يتجاوز 10MB.";
  return "تجاوز الحد الأقصى البالغ 8 صور للمنتج.";
}

export function ProductImageManager({ productId, productName, images }: { productId: string; productName: string; images: ManagedImage[] }) {
  const router = useRouter();
  const draggingImageId = useRef<string | undefined>(undefined);
  const [status, setStatus] = useState<string>();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [orderedImages, setOrderedImages] = useState(images);
  const [persistedCount, setPersistedCount] = useState(images.length);
  const [batchProgress, setBatchProgress] = useState<{ total: number; completed: number; uploaded: number }>();
  const [failedFiles, setFailedFiles] = useState<FailedFile[]>([]);
  const [reordering, setReordering] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string>();

  function updateQueue(id: string, update: Partial<QueueItem>) {
    setQueue((items) => items.map((item) => item.id === id ? { ...item, ...update } : item));
  }

  async function uploadOne(item: QueueItem) {
    updateQueue(item.id, { status: "uploading" });
    const result = await uploadProductImageFile(productId, item.file);
    if (!result.ok) {
      updateQueue(item.id, { status: "failed", message: result.message });
      return result;
    }
    updateQueue(item.id, { status: "success" });
    return result;
  }

  async function queueFiles(selected: File[]) {
    if (deletingImageId || queue.some((item) => ["queued", "uploading", "saving"].includes(item.status)) || selected.length === 0) return;
    const plan = planProductImageUploads(persistedCount, selected.map((file, index) => ({ id: `${Date.now()}-${index}-${file.name}`, name: file.name, type: file.type, size: file.size })));
    const nextQueue = plan.map((item, index) => ({ ...item, file: selected[index]!, status: item.accepted ? "queued" as const : "failed" as const, message: item.accepted ? undefined : rejectionMessage(item.rejection) }));
    const rejected = nextQueue.filter((item) => !item.accepted).map((item) => ({ file: item.file, message: item.message ?? "تعذر قبول الصورة." }));
    const accepted = nextQueue.filter((item) => item.accepted);
    setQueue(nextQueue);
    setFailedFiles([]);
    setStatus(undefined);
    setBatchProgress({ total: nextQueue.length, completed: rejected.length, uploaded: 0 });

    const failures = [...rejected];
    const uploadedImages: ManagedImage[] = [];
    let uploaded = 0;
    let completed = rejected.length;
    for (const item of accepted) {
      const result = await uploadOne(item);
      completed += 1;
      if (result.ok) { uploaded += 1; uploadedImages.push(result.image); }
      else failures.push({ file: item.file, message: result.message });
      setBatchProgress({ total: nextQueue.length, completed, uploaded });
    }

    setPersistedCount((count) => count + uploaded);
    if (uploadedImages.length > 0) setOrderedImages((current) => [...current, ...uploadedImages]);
    setFailedFiles(failures);
    setStatus(failures.length === 0
      ? `تم رفع ${uploaded} صور بنجاح.`
      : `تم رفع ${uploaded} من ${nextQueue.length} صور. تعذر رفع ${failures.length} ${failures.length === 1 ? "صورة" : "صور"}.`);
    setBatchProgress(undefined);
    setQueue([]);
    if (uploaded > 0) router.refresh();
  }

  async function saveOrder(nextImages: ManagedImage[], previousImages: ManagedImage[]) {
    if (reordering || deletingImageId) return;
    setReordering(true); setOrderedImages(nextImages);
    const response = await fetch(`/api/admin/products/${productId}/images`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ imageIds: nextImages.map((image) => image.id) }) });
    const result = await response.json() as { ok: boolean; data?: { message?: string }; error?: { message?: string } };
    setReordering(false);
    if (!result.ok) { setOrderedImages(previousImages); setStatus(result.error?.message ?? "تعذر حفظ الترتيب."); router.refresh(); return; }
    setStatus(result.data?.message); router.refresh();
  }

  async function move(imageId: string, direction: "up" | "down") {
    if (reordering || deletingImageId) return;
    const previous = orderedImages;
    const next = moveProductImageByDirection(previous, imageId, direction);
    if (next === previous) return;
    await saveOrder(next, previous);
  }

  async function removeImage(image: ManagedImage) {
    if (deletingImageId || reordering || !window.confirm("حذف هذه الصورة نهائياً؟")) return;
    setDeletingImageId(image.id);
    setStatus(undefined);
    try {
      const response = await fetch(`/api/admin/products/${productId}/images?imageId=${encodeURIComponent(image.id)}`, { method: "DELETE" });
      const result = await response.json() as { ok: boolean; data?: { message?: string }; error?: { message?: string } };
      setStatus(result.ok ? result.data?.message : result.error?.message);
      if (result.ok) {
        setOrderedImages((current) => current.filter((item) => item.id !== image.id));
        setPersistedCount((count) => Math.max(0, count - 1));
      }
      router.refresh();
    } catch {
      setStatus("تعذر حذف الصورة. حاول مجدداً.");
    } finally {
      setDeletingImageId(undefined);
    }
  }

  const activeQueue = Boolean(batchProgress);
  const imageControlsLocked = Boolean(deletingImageId) || reordering;
  const progressPercent = batchProgress ? Math.round((batchProgress.completed / batchProgress.total) * 100) : 0;

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
      <div><h2 className="text-lg font-semibold">الصور</h2><p className="mt-1 text-sm text-muted-foreground">حتى 8 صور، وأول صورة هي الرئيسية.</p></div>
      <ProductImageDropzone busy={activeQueue || Boolean(deletingImageId)} currentCount={persistedCount} inputTestId="product-image-file-input" onFiles={(files) => void queueFiles(files)} />

      <div className="mt-4" aria-live="polite">
        {batchProgress && (
          <div data-testid="product-image-upload-batch" className="rounded-xl border border-primary/15 bg-primary/5 p-3 text-sm font-bold text-primary">
            <p className="flex items-center gap-2"><LoaderCircle className="size-4 animate-spin" aria-hidden="true" />جاري رفع {batchProgress.total} صور والتحقق منها…</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary/10"><span className="block h-full rounded-full bg-brand-gradient transition-[width]" style={{ width: `${progressPercent}%` }} /></div>
          </div>
        )}
        {!batchProgress && status && <p role="status" className={`text-sm font-bold ${failedFiles.length ? "text-destructive" : "text-status-positive"}`}>{status}</p>}
        {!batchProgress && failedFiles.length > 0 && (
          <div className="mt-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3">
            <ul className="space-y-1 text-xs text-destructive">
              {failedFiles.map((item, index) => <li key={`${item.file.name}-${index}`}><span dir="ltr" className="font-latin">{item.file.name}</span> — {item.message}</li>)}
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" disabled={Boolean(deletingImageId)} onClick={() => void queueFiles(failedFiles.map((item) => item.file))} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"><RotateCcw className="size-3.5" aria-hidden="true" />إعادة المحاولة</button>
              <button type="button" disabled={Boolean(deletingImageId)} onClick={() => setFailedFiles([])} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-black/12 px-3 text-xs font-bold disabled:opacity-60"><X className="size-3.5" aria-hidden="true" />إخفاء</button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {orderedImages.map((image, index) => (
          <article data-testid="product-image-item" key={image.id} draggable={!imageControlsLocked} onDragStart={() => { draggingImageId.current = image.id; }} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const movingId = draggingImageId.current; draggingImageId.current = undefined; if (movingId) void saveOrder(normalizeProductImageOrder(orderedImages, movingId, image.id), orderedImages); }} className={`overflow-hidden rounded-xl border border-black/10 bg-white ${imageControlsLocked ? "opacity-60" : ""}`}>
            <AdminImagePreview src={image.url} alt={index === 0 ? productName : `${productName} - ${index + 1}`} sizes="(min-width: 640px) 30vw, 100vw" className="aspect-[16/10] bg-muted p-3" imageClassName="object-contain" />
            <div className="p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-sm font-bold"><GripVertical className="size-4 text-muted-foreground" aria-hidden="true" /><span>الصورة {index + 1}</span>{reordering && <span className="text-xs text-muted-foreground">جارٍ حفظ الترتيب…</span>}</p>
                <div className="flex gap-2">
                  <button type="button" disabled={imageControlsLocked || index === 0} onClick={() => void move(image.id, "up")} className="inline-flex min-h-10 items-center rounded-lg border border-black/12 px-3 disabled:opacity-40"><MoveUp className="size-4" aria-hidden="true" /><span className="sr-only">تحريك للأعلى</span></button>
                  <button type="button" disabled={imageControlsLocked || index === orderedImages.length - 1} onClick={() => void move(image.id, "down")} className="inline-flex min-h-10 items-center rounded-lg border border-black/12 px-3 disabled:opacity-40"><MoveDown className="size-4" aria-hidden="true" /><span className="sr-only">تحريك للأسفل</span></button>
                  <button type="button" disabled={imageControlsLocked} onClick={() => void removeImage(image)} className="inline-flex min-h-10 items-center rounded-lg border border-destructive/25 px-3 text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive disabled:opacity-50">{deletingImageId === image.id ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Trash2 className="size-4" aria-hidden="true" />}<span className="sr-only">{deletingImageId === image.id ? "جارٍ الحذف" : "حذف"}</span></button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      {orderedImages.length === 0 && <p className="mt-5 rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">لا توجد صور بعد. ستظهر معاينة محايدة في المتجر.</p>}
    </section>
  );
}
