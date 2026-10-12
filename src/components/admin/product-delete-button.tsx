"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

import type { ApiResponse } from "@/lib/admin-api-response";

export function ProductDeleteButton({ productId }: { productId: string }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>();
  function remove() {
    if (!window.confirm("سيحذف المنتج وصوره نهائياً. تبقى الطلبات والسجلات التاريخية محفوظة. هل تريد المتابعة؟")) return;
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/products/${encodeURIComponent(productId)}`, { method: "DELETE" });
        const result = await response.json() as ApiResponse<{ message: string }>;
        setMessage(result.ok ? result.data.message : result.error.message);
      } catch { setMessage("تعذر حذف المنتج. حاول مجدداً."); }
    });
  }
  return <div><button type="button" disabled={pending} onClick={remove} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-primary/25 px-4 text-sm font-bold text-primary hover:bg-primary/5 disabled:opacity-60"><Trash2 className="size-4" aria-hidden="true" />حذف المنتج نهائياً</button>{message && <p role="status" className="mt-2 text-sm text-muted-foreground">{message}</p>}</div>;
}
