import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { isAllowlistedAdminEmail } from "@/lib/admin-allowlist";
import { auth } from "@/lib/auth";

export async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user || !isAllowlistedAdminEmail(session.user.email)) {
    return null;
  }

  return session;
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
