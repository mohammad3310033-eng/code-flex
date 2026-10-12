"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { ApiResponse } from "@/lib/admin-api-response";

export function CategoryDeleteButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>();
  const router = useRouter();
  function remove() {
    if (!window.confirm("يُسمح بحذف التصنيفات الفارغة فقط. هل تريد المتابعة؟")) return;
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/categories?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        const result = await response.json() as ApiResponse<{ message: string }>;
        setMessage(result.ok ? result.data.message : result.error.message);
        if (result.ok) router.refresh();
      } catch { setMessage("تعذر حذف التصنيف. حاول مجدداً."); }
    });
  }
  return <span><button type="button" disabled={pending} onClick={remove} className="inline-flex min-h-10 items-center gap-1 text-xs font-bold text-primary"><Trash2 className="size-3.5" aria-hidden="true" />حذف</button>{message && <span className="block text-xs text-muted-foreground">{message}</span>}</span>;
}
