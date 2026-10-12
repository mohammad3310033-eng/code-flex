import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

type OrderMutationFailure = {
  ok: false;
  code: "VALIDATION_ERROR" | "NOT_FOUND";
  message: string;
};

export type OrderMutationResult = { ok: true; message: string } | OrderMutationFailure;

const orderStatusSchema = z.object({
  orderId: z.uuid(),
  status: z.enum(["NEW", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED"]),
});

export async function updateAdminOrderStatus(input: unknown): Promise<OrderMutationResult> {
  const parsed = orderStatusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, code: "VALIDATION_ERROR", message: "تعذر تحديث حالة الطلب." };

  const existingOrder = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    select: { contactedAt: true, confirmedAt: true, completedAt: true, cancelledAt: true },
  });
  if (!existingOrder) return { ok: false, code: "NOT_FOUND", message: "الطلب غير موجود." };

  const now = new Date();
  const timestampUpdates =
    parsed.data.status === "CONTACTED" && !existingOrder.contactedAt
      ? { contactedAt: now }
      : parsed.data.status === "CONFIRMED" && !existingOrder.confirmedAt
        ? { confirmedAt: now }
        : parsed.data.status === "COMPLETED" && !existingOrder.completedAt
          ? { completedAt: now }
          : parsed.data.status === "CANCELLED" && !existingOrder.cancelledAt
            ? { cancelledAt: now }
            : {};

  await prisma.order.update({
    where: { id: parsed.data.orderId },
    data: { status: parsed.data.status, ...timestampUpdates },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${parsed.data.orderId}`);

  return { ok: true, message: "تم تحديث حالة الطلب." };
}
