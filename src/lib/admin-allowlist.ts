function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function getAdminEmailSet() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map(normalizeEmail)
      .filter(Boolean),
  );
}

export function isAllowlistedAdminEmail(email: string | null | undefined) {
  return Boolean(email && getAdminEmailSet().has(normalizeEmail(email)));
}
