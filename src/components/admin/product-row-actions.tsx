"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ProductDeleteButton } from "@/components/admin/product-delete-button";

type ProductRowActionsProps = {
  productId: string;
  productName: string;
  compact?: boolean;
};

export function ProductRowActions({ productId, productName, compact = false }: ProductRowActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className={`flex flex-wrap items-center gap-2 ${compact ? "justify-end" : ""}`}>
      {isDeleting ? <span className="text-sm font-bold text-muted-foreground">جارٍ الحذف…</span> : <Link href={`/admin/products/${productId}/edit`} className="inline-flex min-h-10 items-center px-2 text-sm font-bold text-primary hover:underline">تعديل</Link>}
      <ProductDeleteButton productId={productId} productName={productName} compact onDeleted={() => router.refresh()} onPendingChange={setIsDeleting} />
    </div>
  );
}
