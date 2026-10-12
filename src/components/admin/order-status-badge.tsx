import type { OrderStatus } from "@/generated/prisma/client";

import { orderStatusLabels, orderStatusStyles } from "@/lib/admin-presenters";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${orderStatusStyles[status]}`}>
      {orderStatusLabels[status]}
    </span>
  );
}
