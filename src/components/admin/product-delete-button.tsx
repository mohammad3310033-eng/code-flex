"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import type { ApiResponse } from "@/lib/admin-api-response";

type ProductDeleteButtonProps = {
  productId: string;
  productName?: string;
  compact?: boolean;
  onDeleted?: () => void;
  onPendingChange?: (pending: boolean) => void;
};

export function ProductDeleteButton({ productId, productName, compact = false, onDeleted, onPendingChange }: ProductDeleteButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>();
  const deleting = useRef(false);

  function remove() {
    if (deleting.current) return;
    const productLabel = productName ? ` \"${productName}\"` : "";
    if (!window.confirm(`سيحذف المنتج${productLabel} وصوره نهائياً. تبقى الطلبات والسجلات التاريخية محفوظة. هل تريد المتابعة؟`)) return;
    deleting.current = true;
    onPendingChange?.(true);
    setMessage(undefined);
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/products/${encodeURIComponent(productId)}`, { method: "DELETE" });
        const result = await response.json() as ApiResponse<{ message: string }>;
        if (!result.ok) {
          setMessage(result.error.message);
          return;
        }
        if (onDeleted) {
          onDeleted();
        } else {
          router.replace("/admin/products");
        }
      } catch {
        setMessage("تعذر حذف المنتج. حاول مجدداً.");
      } finally {
        deleting.current = false;
        onPendingChange?.(false);
      }
    });
  }

  return <div className="min-w-0"><button type="button" disabled={pending} onClick={remove} aria-label={productName ? `حذف المنتج ${productName}` : "حذف المنتج نهائياً"} className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-destructive/30 text-sm font-bold text-destructive hover:bg-destructive/5 disabled:cursor-not-allowed disabled:opacity-60 ${compact ? "min-h-10 px-3" : "min-h-11 px-4"}`}><Trash2 className="size-4" aria-hidden="true" />{compact ? "حذف" : "حذف المنتج نهائياً"}</button>{message && <p role="status" className="mt-2 text-sm text-destructive">{message}</p>}</div>;
}
