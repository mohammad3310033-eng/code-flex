"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyPhoneButton({ phone }: { phone: string }) {
  const [copied, setCopied] = useState(false);

  async function copyPhone() {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" onClick={copyPhone} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-black/12 bg-white px-3 text-sm font-bold hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" aria-label="نسخ رقم الهاتف">
      {copied ? <Check className="size-4 text-status-positive" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      {copied ? "تم النسخ" : "نسخ الرقم"}
    </button>
  );
}
