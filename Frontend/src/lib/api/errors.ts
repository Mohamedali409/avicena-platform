import { AxiosError } from "axios";

// Turn any API/network error into a user-friendly Arabic message.
// Handles 429 (rate limit) specially so every form reacts consistently.
export function getErrorMessage(err: unknown, fallback = "حدث خطأ، حاول مرة أخرى"): string {
  const axiosErr = err as AxiosError<{ message?: string }>;
  const status = axiosErr?.response?.status;

  if (status === 429) return "محاولات كثيرة — من فضلك انتظر قليلاً ثم حاول مجدداً.";
  if (axiosErr?.code === "ERR_NETWORK") return "تعذّر الاتصال بالخادم. تأكد من اتصالك وحاول مجدداً.";

  return axiosErr?.response?.data?.message || fallback;
}

// True when the backend blocked login because the email isn't verified yet.
export function isUnverifiedError(err: unknown): boolean {
  const axiosErr = err as AxiosError<{ message?: string }>;
  const msg = axiosErr?.response?.data?.message?.toLowerCase() ?? "";
  return axiosErr?.response?.status === 403 && msg.includes("verify");
}
