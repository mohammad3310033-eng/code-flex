"use client";

import type { ProductCondition, StockStatus, StorageType } from "@/generated/prisma/client";
import { LoaderCircle, Minus, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import { ProductImageDropzone } from "@/components/admin/product-image-dropzone";
import { AdminSelect, type AdminSelectOption } from "@/components/ui/admin-select";
import { planProductImageUploads } from "@/lib/admin-image-upload";
import { uploadProductImageFile } from "@/lib/admin-product-image-client";

type CategoryOption = { id: string; parentId: string | null; nameAr: string; nameEn: string; isActive: boolean };
type BrandOption = { id: string; name: string };
type SpecRow = { key: string; value: string };
type StorageRow = { type: StorageType | ""; capacityGB: string };
type DuplicateProductMatch = { id: string; name: string; brand: string; categoryName: string };
type ProductMutationFailure = { ok: false; error: { code: string; message: string; fieldErrors?: Record<string, string> } };
type ProductMutationSuccess = { ok: true; data: { productId: string; slug: string } };
type ProductMutationResponse = ProductMutationFailure | ProductMutationSuccess;
type ProductInitial = {
  id: string; name: string; slug: string; brandId: string; categoryId: string; descriptionAr: string;
  descriptionEn: string | null; shortDescriptionAr: string | null; shortDescriptionEn: string | null;
  priceUsdCents: number; stockStatus: StockStatus; condition: ProductCondition | null; isFeatured: boolean;
  isActive: boolean; extraSpecs: unknown;
  laptopSpecs: { cpuBrand: string; cpuModel: string; cpuGeneration: string | null; ramGB: number; storages: Array<{ type: StorageType; capacityGB: number }>; gpuBrand: string | null; gpuModel: string | null; screenSize: { toString(): string } | null; resolution: string | null } | null;
};

const controlClass = "font-latin mt-2 min-h-12 w-full rounded-xl border border-black/12 bg-white px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";
const stockOptions: AdminSelectOption[] = [
  { value: "IN_STOCK", label: "متوفر" },
  { value: "OUT_OF_STOCK", label: "غير متوفر" },
  { value: "ON_REQUEST", label: "حسب الطلب" },
];
const conditionOptions: AdminSelectOption[] = [
  { value: "NEW", label: "جديد" },
  { value: "USED", label: "مستعمل" },
  { value: "REFURBISHED", label: "مجدد" },
];
const storageTypeOptions: AdminSelectOption[] = [
  { value: "NVME_SSD", label: "NVMe SSD" },
  { value: "SATA_SSD", label: "SATA SSD" },
  { value: "HDD", label: "HDD" },
  { value: "EMMC", label: "eMMC" },
  { value: "OTHER", label: "Other" },
];

function sanitizeIntegerInput(value: string) {
  return value.replaceAll(/\D/gu, "");
}

function sanitizeDecimalInput(value: string) {
  const [whole = "", ...fractions] = value.replaceAll(/[^\d.]/gu, "").split(".");
  return fractions.length ? `${whole}.${fractions.join("")}` : whole;
}

function centsToInput(cents: number) {
  return (cents / 100).toFixed(cents % 100 === 0 ? 0 : 2);
}

function toRows(value: unknown): SpecRow[] {
  if (!value || Array.isArray(value) || typeof value !== "object") return [];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, raw]) =>
    typeof raw === "string" || typeof raw === "number" || typeof raw === "boolean" ? [{ key, value: String(raw) }] : [],
  );
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return <label className="block text-sm font-bold text-foreground"><span>{label}</span>{children}{error && <span role="alert" className="mt-1.5 block text-xs text-destructive">{error}</span>}</label>;
}

export function ProductForm({ product, categories, brands, laptopCategoryIds }: { product?: ProductInitial; categories: CategoryOption[]; brands: BrandOption[]; laptopCategoryIds: string[] }) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [extraSpecs, setExtraSpecs] = useState<SpecRow[]>(() => toRows(product?.extraSpecs));
  const [storages, setStorages] = useState<StorageRow[]>(() => product?.laptopSpecs?.storages.map((storage) => ({ type: storage.type, capacityGB: String(storage.capacityGB) })) ?? [{ type: "", capacityGB: "" }]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [duplicateMatches, setDuplicateMatches] = useState<DuplicateProductMatch[]>([]);
  const [duplicateLookupName, setDuplicateLookupName] = useState("");
  const [duplicatePending, setDuplicatePending] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageSelectionError, setImageSelectionError] = useState<string>();
  const [uploadProgress, setUploadProgress] = useState<{ total: number; completed: number }>();
  const [state, setState] = useState<{ error?: string }>({});
  const [partialProductId, setPartialProductId] = useState<string>();
  const [pending, startTransition] = useTransition();
  const isLaptop = laptopCategoryIds.includes(categoryId);
  const categoryOptions = useMemo(
    () => categories
      .filter((category) => (category.isActive || category.id === product?.categoryId) && category.nameAr.trim() && category.nameEn.trim())
      .map((category) => ({ value: category.id, label: `${category.nameEn.trim()} — ${category.nameAr.trim()}` })),
    [categories, product?.categoryId],
  );

  useEffect(() => {
    const normalizedName = name.trim();
    if (normalizedName.length < 2) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setDuplicatePending(true);
      try {
        const query = new URLSearchParams({ name: normalizedName });
        if (product?.id) query.set("excludeId", product.id);
        const response = await fetch(`/api/admin/products/duplicates?${query.toString()}`);
        const result = await response.json() as { ok: boolean; data?: { items?: DuplicateProductMatch[] } };
        const matches = result.ok ? result.data?.items ?? [] : [];
        if (!cancelled) {
          setDuplicateMatches(matches);
          setDuplicateLookupName(normalizedName.toLocaleLowerCase());
        }
      } finally {
        if (!cancelled) setDuplicatePending(false);
      }
    }, 400);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [name, product?.id]);

  const currentDuplicateMatches = duplicateLookupName === name.trim().toLocaleLowerCase() ? duplicateMatches : [];

  function focusField(form: HTMLFormElement, field: string) {
    const target = field.startsWith("storages.")
      ? form.querySelector<HTMLElement>(`[data-field="${field}"]`)
      : form.querySelector<HTMLElement>(`[data-field="${field}"], [name="${field}"]`);
    target?.scrollIntoView({ block: "center", behavior: "smooth" });
    target?.focus();
  }

  function selectImages(files: File[]) {
    const plan = planProductImageUploads(selectedImages.length, files.map((file, index) => ({ id: `${Date.now()}-${index}-${file.name}`, name: file.name, type: file.type, size: file.size })));
    const accepted = plan.flatMap((item, index) => item.accepted ? [files[index]!] : []);
    const rejected = plan.filter((item) => !item.accepted);
    setSelectedImages((current) => [...current, ...accepted]);
    setImageSelectionError(rejected.length ? "تعذر قبول بعض الصور. استخدم JPG أو PNG أو WebP أو AVIF بحجم لا يتجاوز 10MB، وبحد أقصى 8 صور." : undefined);
  }

  function clientErrors(form: HTMLFormElement) {
    const values = new FormData(form);
    const errors: Record<string, string> = {};
    const required = ["name", "brandId", "categoryId", "price", "descriptionAr", ...(isLaptop ? ["cpuBrand", "cpuModel", "ramGB"] : [])];
    for (const field of required) {
      if (!String(values.get(field) ?? "").trim()) errors[field] = "هذا الحقل مطلوب.";
    }
    const price = String(values.get("price") ?? "").trim();
    if (price && (!/^\d{1,6}(?:\.\d{1,2})?$/u.test(price) || !Number.isFinite(Number(price)) || Number(price) <= 0)) errors.price = "السعر يجب أن يكون رقماً موجباً بمنزلتين عشريتين كحد أقصى.";
    if (isLaptop) {
      const ramGB = String(values.get("ramGB") ?? "").trim();
      if (ramGB && (!/^[1-9]\d*$/u.test(ramGB) || Number(ramGB) > 512)) errors.ramGB = "RAM يجب أن يكون عدداً صحيحاً موجباً.";
      const screenSize = String(values.get("screenSize") ?? "").trim();
      if (screenSize && (!/^\d+(?:\.\d+)?$/u.test(screenSize) || !Number.isFinite(Number(screenSize)) || Number(screenSize) < 5 || Number(screenSize) > 30)) errors.screenSize = "حجم الشاشة يجب أن يكون رقماً بين 5 و30.";
      if (storages.length === 0 || storages.length > 8) errors.storages = "أدخل من 1 إلى 8 وحدات تخزين.";
      storages.forEach((storage, index) => {
        if (!storage.type) errors[`storages.${index}.type`] = "اختر نوع التخزين.";
        if (!/^[1-9]\d*$/u.test(storage.capacityGB) || Number(storage.capacityGB) > 200_000) errors[`storages.${index}.capacityGB`] = "أدخل سعة صحيحة موجبة.";
      });
    }
    return errors;
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const errors = clientErrors(form);
    if (Object.keys(errors).length) {
      setValidationErrors(errors);
      focusField(form, Object.keys(errors)[0]!);
      return;
    }

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""), brandId: String(formData.get("brandId") ?? ""), categoryId: String(formData.get("categoryId") ?? ""),
      descriptionAr: String(formData.get("descriptionAr") ?? ""), descriptionEn: String(formData.get("descriptionEn") ?? ""),
      shortDescriptionAr: String(formData.get("shortDescriptionAr") ?? ""), shortDescriptionEn: String(formData.get("shortDescriptionEn") ?? ""),
      price: String(formData.get("price") ?? ""), stockStatus: String(formData.get("stockStatus") ?? ""), condition: String(formData.get("condition") ?? ""),
      isFeatured: formData.get("isFeatured") === "on", isActive: formData.get("isActive") === "on", extraSpecs,
      cpuBrand: String(formData.get("cpuBrand") ?? ""), cpuModel: String(formData.get("cpuModel") ?? ""), cpuGeneration: String(formData.get("cpuGeneration") ?? ""),
      ramGB: String(formData.get("ramGB") ?? ""), storages, gpuBrand: String(formData.get("gpuBrand") ?? ""), gpuModel: String(formData.get("gpuModel") ?? ""),
      screenSize: String(formData.get("screenSize") ?? ""), resolution: String(formData.get("resolution") ?? ""),
    };
    setValidationErrors({}); setState({}); setPartialProductId(undefined);

    startTransition(async () => {
      let result: ProductMutationResponse;
      try {
        const response = await fetch(product ? `/api/admin/products/${product.id}` : "/api/admin/products", {
          method: product ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload),
        });
        result = await response.json() as ProductMutationResponse;
      } catch {
        setState({ error: "تعذر الاتصال بخدمة حفظ المنتج. حاول مجدداً." });
        return;
      }
      if (!result.ok) {
        const fieldErrors = result.error.fieldErrors ?? {};
        setState({ error: result.error.message }); setValidationErrors(fieldErrors);
        const first = Object.keys(fieldErrors)[0];
        if (first) window.requestAnimationFrame(() => focusField(form, first));
        return;
      }
      if (product) { router.push("/admin/products?saved=updated"); router.refresh(); return; }
      if (selectedImages.length) {
        let completed = 0; let failures = 0;
        setUploadProgress({ total: selectedImages.length, completed: 0 });
        for (const file of selectedImages) {
          const upload = await uploadProductImageFile(result.data.productId, file);
          completed += 1; if (!upload.ok) failures += 1;
          setUploadProgress({ total: selectedImages.length, completed });
        }
        setUploadProgress(undefined);
        if (failures) {
          setPartialProductId(result.data.productId);
          setState({ error: `تم إنشاء المنتج، لكن تعذر رفع ${failures} ${failures === 1 ? "صورة" : "صور"}. يمكنك متابعة التعديل وإعادة المحاولة.` });
          return;
        }
      }
      router.push("/admin/products?saved=created"); router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold">1. المعلومات الأساسية</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="اسم المنتج" error={validationErrors.name}><input name="name" required aria-invalid={Boolean(validationErrors.name)} value={name} onChange={(event) => { setDuplicatePending(false); setName(event.target.value); }} dir="ltr" className={controlClass} /></Field>
          <Field label="العلامة التجارية" error={validationErrors.brandId}><AdminSelect name="brandId" required invalid={Boolean(validationErrors.brandId)} defaultValue={product?.brandId ?? ""} placeholder="Select a brand" options={brands.map((brand) => ({ value: brand.id, label: brand.name }))} dir="ltr" data-field="brandId" /></Field>
        </div>
        {brands.length === 0 && <p role="alert" className="mt-3 text-sm font-bold text-destructive">أضف علامة تجارية من صفحة العلامات التجارية قبل إنشاء منتج.</p>}
        {duplicatePending && <p className="mt-3 text-xs text-muted-foreground">جارٍ التحقق من الأسماء المشابهة…</p>}
        {currentDuplicateMatches.length > 0 && <div data-testid="duplicate-product-warning" className="mt-4 rounded-xl border border-brand-purple/25 bg-brand-purple/5 p-4"><p className="text-sm font-bold text-brand-indigo">يوجد منتج بهذا الاسم مسبقًا. يمكنك المتابعة وإنشاء منتج جديد.</p><ul className="mt-3 space-y-2">{currentDuplicateMatches.map((match) => <li key={match.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white/75 px-3 py-2 text-sm"><span><bdi dir="ltr" className="font-latin font-bold">{match.name}</bdi><span className="text-muted-foreground"> — {match.brand} · {match.categoryName}</span></span><Link href={`/admin/products/${match.id}/edit`} className="font-bold text-primary hover:underline">عرض المنتج</Link></li>)}</ul></div>}
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><h2 className="text-lg font-semibold">2. السعر والتوفر</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="السعر بالدولار" error={validationErrors.price}><input name="price" required aria-invalid={Boolean(validationErrors.price)} type="text" inputMode="decimal" pattern="[0-9]*[.]?[0-9]*" onChange={(event) => { event.currentTarget.value = sanitizeDecimalInput(event.currentTarget.value); }} defaultValue={product ? centsToInput(product.priceUsdCents) : ""} dir="ltr" className={controlClass} /></Field><Field label="حالة المخزون" error={validationErrors.stockStatus}><AdminSelect name="stockStatus" invalid={Boolean(validationErrors.stockStatus)} defaultValue={product?.stockStatus ?? "IN_STOCK"} placeholder="اختر حالة المخزون" options={stockOptions} data-field="stockStatus" /></Field><Field label="الحالة" error={validationErrors.condition}><AdminSelect name="condition" invalid={Boolean(validationErrors.condition)} defaultValue={product?.condition ?? ""} placeholder="غير محدد" allowClear options={conditionOptions} data-field="condition" /></Field></div></section>
      <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><h2 className="text-lg font-semibold">3. التصنيف</h2><Field label="التصنيف" error={validationErrors.categoryId}><AdminSelect name="categoryId" required invalid={Boolean(validationErrors.categoryId)} value={categoryId} onValueChange={setCategoryId} placeholder="اختر تصنيفاً" options={categoryOptions} data-field="categoryId" /></Field></section>

      {isLaptop ? <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><h2 className="text-lg font-semibold">4. مواصفات اللابتوب</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="CPU Brand" error={validationErrors.cpuBrand}><input name="cpuBrand" required aria-invalid={Boolean(validationErrors.cpuBrand)} defaultValue={product?.laptopSpecs?.cpuBrand ?? ""} dir="ltr" className={controlClass} /></Field><Field label="CPU Model" error={validationErrors.cpuModel}><input name="cpuModel" required aria-invalid={Boolean(validationErrors.cpuModel)} defaultValue={product?.laptopSpecs?.cpuModel ?? ""} dir="ltr" className={controlClass} /></Field><Field label="CPU Generation"><input name="cpuGeneration" defaultValue={product?.laptopSpecs?.cpuGeneration ?? ""} dir="ltr" className={controlClass} /></Field><Field label="RAM GB" error={validationErrors.ramGB}><input name="ramGB" required aria-invalid={Boolean(validationErrors.ramGB)} type="text" inputMode="numeric" pattern="[0-9]*" onChange={(event) => { event.currentTarget.value = sanitizeIntegerInput(event.currentTarget.value); }} defaultValue={product?.laptopSpecs?.ramGB ?? ""} dir="ltr" className={controlClass} /></Field></div><div className="mt-5 rounded-xl border border-black/10 bg-muted/30 p-4"><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-bold">وحدات التخزين</h3><button type="button" disabled={storages.length >= 8} onClick={() => setStorages((rows) => [...rows, { type: "", capacityGB: "" }])} className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl bg-primary px-3 text-xs font-bold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"><Plus className="size-4" aria-hidden="true" />إضافة تخزين</button></div><div className="mt-3 space-y-3">{storages.map((storage, index) => <div key={index} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"><div><AdminSelect name={`storageType-${index}`} data-field={`storages.${index}.type`} aria-label={`نوع التخزين ${index + 1}`} invalid={Boolean(validationErrors[`storages.${index}.type`])} value={storage.type} onValueChange={(value) => setStorages((rows) => rows.map((row, rowIndex) => rowIndex === index ? { ...row, type: value as StorageRow["type"] } : row))} placeholder="اختر النوع" options={storageTypeOptions} />{validationErrors[`storages.${index}.type`] && <p role="alert" className="mt-1 text-xs text-destructive">{validationErrors[`storages.${index}.type`]}</p>}</div><div><input data-field={`storages.${index}.capacityGB`} aria-label={`سعة التخزين ${index + 1} بالغيغابايت`} aria-invalid={Boolean(validationErrors[`storages.${index}.capacityGB`])} value={storage.capacityGB} onChange={(event) => setStorages((rows) => rows.map((row, rowIndex) => rowIndex === index ? { ...row, capacityGB: sanitizeIntegerInput(event.target.value) } : row))} type="text" inputMode="numeric" pattern="[0-9]*" placeholder="GB" dir="ltr" className="font-latin min-h-11 w-full rounded-xl border border-black/12 px-3 outline-none focus:border-primary" />{validationErrors[`storages.${index}.capacityGB`] && <p role="alert" className="mt-1 text-xs text-destructive">{validationErrors[`storages.${index}.capacityGB`]}</p>}</div><button type="button" disabled={storages.length === 1} onClick={() => setStorages((rows) => rows.filter((_, rowIndex) => rowIndex !== index))} className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-destructive/20 px-3 text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-40"><Minus className="size-4" aria-hidden="true" /><span className="sr-only">حذف وحدة التخزين</span></button></div>)}</div>{validationErrors.storages && <p role="alert" className="mt-2 text-xs font-bold text-destructive">{validationErrors.storages}</p>}</div><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="GPU Brand"><input name="gpuBrand" defaultValue={product?.laptopSpecs?.gpuBrand ?? ""} dir="ltr" className={controlClass} /></Field><Field label="GPU Model"><input name="gpuModel" defaultValue={product?.laptopSpecs?.gpuModel ?? ""} dir="ltr" className={controlClass} /></Field><Field label="حجم الشاشة بالبوصة" error={validationErrors.screenSize}><input name="screenSize" aria-invalid={Boolean(validationErrors.screenSize)} type="text" inputMode="decimal" pattern="[0-9]*[.]?[0-9]*" onChange={(event) => { event.currentTarget.value = sanitizeDecimalInput(event.currentTarget.value); }} defaultValue={product?.laptopSpecs?.screenSize?.toString() ?? ""} dir="ltr" className={controlClass} /></Field><Field label="الدقة"><input name="resolution" defaultValue={product?.laptopSpecs?.resolution ?? ""} dir="ltr" className={controlClass} /></Field></div></section> : <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><h2 className="text-lg font-semibold">4. مواصفات إضافية</h2><p className="mt-1 text-sm text-muted-foreground">مفاتيح وقيم بسيطة للملحقات.</p><div className="mt-5 space-y-3">{extraSpecs.map((row, index) => <div key={index} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"><input value={row.key} onChange={(event) => setExtraSpecs((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, key: event.target.value } : item))} placeholder="Key" dir="ltr" className="font-latin min-h-11 rounded-xl border border-black/12 px-3 outline-none focus:border-primary" /><input value={row.value} onChange={(event) => setExtraSpecs((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item))} placeholder="Value" dir="ltr" className="font-latin min-h-11 rounded-xl border border-black/12 px-3 outline-none focus:border-primary" /><button type="button" onClick={() => setExtraSpecs((items) => items.filter((_, itemIndex) => itemIndex !== index))} className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-black/12 px-3 text-sm font-bold hover:bg-muted"><Minus className="size-4" aria-hidden="true" /><span className="sr-only">حذف</span></button></div>)}</div>{validationErrors.extraSpecs && <p role="alert" className="mt-2 text-xs text-destructive">{validationErrors.extraSpecs}</p>}<button type="button" onClick={() => setExtraSpecs((items) => [...items, { key: "", value: "" }])} className="mt-4 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-black/12 px-3 text-sm font-bold hover:bg-muted"><Plus className="size-4" aria-hidden="true" />إضافة مواصفة</button></section>}

      <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><h2 className="text-lg font-semibold">5. الوصف</h2><div className="mt-5 grid gap-4"><Field label="الوصف العربي" error={validationErrors.descriptionAr}><textarea name="descriptionAr" required aria-invalid={Boolean(validationErrors.descriptionAr)} rows={6} defaultValue={product?.descriptionAr} className="mt-2 w-full rounded-xl border border-black/12 px-3 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></Field><Field label="English description" error={validationErrors.descriptionEn}><textarea name="descriptionEn" aria-invalid={Boolean(validationErrors.descriptionEn)} rows={6} defaultValue={product?.descriptionEn ?? ""} dir="ltr" className="font-latin mt-2 w-full rounded-xl border border-black/12 px-3 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></Field><Field label="الوصف العربي القصير" error={validationErrors.shortDescriptionAr}><textarea name="shortDescriptionAr" aria-invalid={Boolean(validationErrors.shortDescriptionAr)} rows={2} defaultValue={product?.shortDescriptionAr ?? ""} className="mt-2 w-full rounded-xl border border-black/12 px-3 py-3 outline-none focus:border-primary" /></Field><Field label="English short description" error={validationErrors.shortDescriptionEn}><textarea name="shortDescriptionEn" aria-invalid={Boolean(validationErrors.shortDescriptionEn)} rows={2} defaultValue={product?.shortDescriptionEn ?? ""} dir="ltr" className="font-latin mt-2 w-full rounded-xl border border-black/12 px-3 py-3 outline-none focus:border-primary" /></Field></div></section>
      {!product && <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><h2 className="text-lg font-semibold">6. الصور</h2><p className="mt-1 text-sm text-muted-foreground">اختر الصور الآن. سيُنشأ المنتج أولاً، ثم تُرفع الصور بأمان إلى مساره الخاص.</p><ProductImageDropzone busy={pending} currentCount={selectedImages.length} inputTestId="create-product-image-file-input" onFiles={selectImages} />{imageSelectionError && <p role="alert" className="mt-3 text-sm font-bold text-destructive">{imageSelectionError}</p>}{selectedImages.length > 0 && <ul data-testid="create-product-selected-images" className="mt-4 grid gap-2 sm:grid-cols-2">{selectedImages.map((file, index) => <li key={`${file.name}-${file.lastModified}-${index}`} className="flex min-w-0 items-center justify-between gap-2 rounded-lg bg-muted/60 px-3 py-2 text-xs"><span dir="ltr" className="font-latin truncate">{file.name}</span><button type="button" onClick={() => setSelectedImages((files) => files.filter((_, fileIndex) => fileIndex !== index))} className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-destructive hover:bg-destructive/10 focus-visible:outline-2 focus-visible:outline-destructive"><Trash2 className="size-4" aria-hidden="true" /><span className="sr-only">إزالة الصورة</span></button></li>)}</ul>}</section>}
      <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><h2 className="text-lg font-semibold">{product ? "6" : "7"}. الظهور</h2><div className="mt-4 flex flex-wrap gap-5"><label className="inline-flex min-h-11 items-center gap-2 text-sm font-bold"><input name="isActive" type="checkbox" defaultChecked={product?.isActive ?? true} className="size-4 accent-primary" />نشط في المتجر</label><label className="inline-flex min-h-11 items-center gap-2 text-sm font-bold"><input name="isFeatured" type="checkbox" defaultChecked={product?.isFeatured ?? false} className="size-4 accent-primary" />منتج مميز</label></div></section>
      {uploadProgress && <div data-testid="create-product-upload-batch" role="status" className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm font-bold text-primary"><p className="flex items-center gap-2"><LoaderCircle className="size-4 animate-spin" aria-hidden="true" />جاري رفع {uploadProgress.total} صور والتحقق منها… ({uploadProgress.completed}/{uploadProgress.total})</p></div>}
      {state.error && <div role="alert" className="rounded-xl bg-status-warm-surface px-4 py-3 text-sm font-bold text-status-warm"><p>{state.error}</p>{partialProductId && <Link href={`/admin/products/${partialProductId}/edit`} className="mt-3 inline-flex min-h-10 items-center rounded-lg bg-primary px-3 text-white hover:bg-primary-hover">متابعة التعديل وإعادة رفع الصور</Link>}</div>}
      <button type="submit" disabled={pending} className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70">{pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}{pending ? uploadProgress ? "جارٍ رفع الصور…" : "جارٍ الحفظ…" : product ? "حفظ التعديلات" : "إنشاء المنتج"}</button>
    </form>
  );
}
