"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

export function BrandDeleteButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>();
  return <span><button type="button" disabled={pending} onClick={() => { if (!window.confirm("لا يمكن حذف علامة مستخدمة في منتجات. هل تريد المتابعة؟")) return; startTransition(async () => { try { const response = await fetch(`/api/admin/brands?id=${encodeURIComponent(id)}`, { method: "DELETE" }); const result = await response.json() as { ok: boolean; data?: { message?: string }; error?: { message?: string } }; setMessage(result.ok ? result.data?.message : result.error?.message); } catch { setMessage("تعذر حذف العلامة التجارية."); } }); }} className="inline-flex min-h-10 items-center gap-1 text-xs font-bold text-destructive disabled:opacity-60"><Trash2 className="size-3.5" aria-hidden="true" />حذف</button>{message && <span role="status" className="block max-w-72 text-xs text-muted-foreground">{message}</span>}</span>;
}
