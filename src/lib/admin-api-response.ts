export type ApiFieldErrors = Record<string, string>;
export type ApiSuccess<T> = { ok: true; data: T };
export type ApiError = {
  ok: false;
  error: { code: string; message: string; fieldErrors?: ApiFieldErrors };
};
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

const jsonHeaders = { "content-type": "application/json; charset=utf-8" };

function apiJson(body: ApiResponse<unknown>, status: number) {
  return Response.json(body, { status, headers: jsonHeaders });
}

export function apiSuccess<T>(data: T, status = 200) {
  return apiJson({ ok: true, data }, status);
}

function apiError(code: string, message: string, status: number, fieldErrors?: ApiFieldErrors) {
  return apiJson({ ok: false, error: { code, message, ...(fieldErrors ? { fieldErrors } : {}) } }, status);
}

export function apiValidationError(message: string, fieldErrors?: ApiFieldErrors) {
  return apiError("VALIDATION_ERROR", message, 422, fieldErrors);
}

export function apiConflict(message: string) {
  return apiError("CONFLICT", message, 409);
}

export function apiUnauthorized(message = "انتهت صلاحية جلسة الإدارة.") {
  return apiError("UNAUTHORIZED", message, 401);
}

export function apiForbidden(message = "لا تملك صلاحية تنفيذ هذا الإجراء.") {
  return apiError("FORBIDDEN", message, 403);
}

export function apiNotFound(message: string) {
  return apiError("NOT_FOUND", message, 404);
}

export function apiInternalError(message = "تعذر حفظ المنتج. حاول مجدداً.") {
  return apiError("INTERNAL_ERROR", message, 500);
}

export function apiServiceUnavailable(message: string) {
  return apiError("SERVICE_UNAVAILABLE", message, 503);
}
