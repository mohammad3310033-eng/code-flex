import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const [session, newOrdersCount] = await Promise.all([
    requireAdmin(),
    prisma.order.count({ where: { status: "NEW" } }),
  ]);

  return <AdminShell email={session.user.email} newOrdersCount={newOrdersCount}>{children}</AdminShell>;
}
