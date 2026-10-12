"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { isAllowlistedAdminEmail } from "@/lib/admin-allowlist";
import { requireAdmin } from "@/lib/admin-auth";
import { auth } from "@/lib/auth";

export type AdminFormState = {
  error?: string;
  success?: string;
};

const credentialsSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(10).max(128),
});

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1).max(128),
    newPassword: z.string().min(10).max(128),
    confirmPassword: z.string().min(10).max(128),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "كلمتا المرور الجديدتان غير متطابقتين.",
    path: ["confirmPassword"],
  });

const invalidLogin: AdminFormState = {
  error: "تعذر تسجيل الدخول. تحقّق من بيانات الدخول.",
};

export async function signInAdmin(
  _previousState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success || !isAllowlistedAdminEmail(parsed.data.email)) {
    return invalidLogin;
  }

  try {
    await auth.api.signInEmail({
      body: parsed.data,
      headers: await headers(),
    });
  } catch {
    return invalidLogin;
  }

  redirect("/admin");
}

export async function signOutAdmin() {
  await requireAdmin();
  await auth.api.signOut({ headers: await headers() });
  redirect("/admin/login");
}

export async function changeAdminPassword(
  _previousState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const parsed = passwordChangeSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "تحقّق من البيانات المدخلة." };
  }

  try {
    await auth.api.changePassword({
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    });
  } catch {
    return { error: "تعذر تغيير كلمة المرور. تحقّق من كلمة المرور الحالية." };
  }

  return { success: "تم تغيير كلمة المرور وإلغاء الجلسات الأخرى." };
}
