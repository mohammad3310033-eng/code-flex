"use client";

import type { OrderStatus } from "@/generated/prisma/client";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { AdminSelect } from "@/components/ui/admin-select";
import type { ApiResponse } from "@/lib/admin-api-response";

const options: { value: OrderStatus; label: string }[] = [
  { value: "NEW", label: "جديد" }, { value: "CONTACTED", label: "تم التواصل" }, { value: "CONFIRMED", label: "مؤكد" }, { value: "COMPLETED", label: "مكتمل" }, { value: "CANCELLED", label: "ملغي" },
];

export function OrderStatusForm({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [message, setMessage] = useState<{ kind: "error" | "success"; text: string }>();
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selectedStatus = new FormData(event.currentTarget).get("status");
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: selectedStatus }) });
        const result = await response.json() as ApiResponse<{ message: string }>;
        setMessage(result.ok ? { kind: "success", text: result.data.message } : { kind: "error", text: result.error.message });
        if (result.ok) router.refresh();
      } catch { setMessage({ kind: "error", text: "تعذر تحديث حالة الطلب." }); }
    });
  }
  return <form onSubmit={submit} className="space-y-3"><p className="text-sm font-bold">حالة الطلب</p><div className="flex flex-col gap-3 sm:flex-row"><AdminSelect name="status" defaultValue={status} options={options} placeholder="اختر الحالة" disabled={pending} className="mt-0 flex-1" aria-label="حالة الطلب" /><button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70">{pending && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}حفظ الحالة</button></div>{message?.kind === "error" && <p role="alert" className="text-sm font-semibold text-primary">{message.text}</p>}{message?.kind === "success" && <p role="status" className="text-sm font-semibold text-status-positive">{message.text}</p>}</form>;
}
