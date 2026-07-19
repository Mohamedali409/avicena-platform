import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getSession, clearSession } from "@/lib/auth/session";

// Single Axios instance. Auth uses httpOnly cookies, so:
//  - withCredentials: true  → the browser sends/receives the auth cookies automatically
//  - no Authorization header to attach (JS can't read the token)
const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const api = axios.create({ baseURL, timeout: 20000, withCredentials: true });

// On a 401, silently refresh the access-token cookie once, then retry the request.
let refreshing: Promise<void> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    const isAuthCall = original?.url?.includes("/api/auth/");

    // Only try refresh when we think we're logged in and this isn't an auth call itself.
    if (status === 401 && getSession() && !original?._retry && !isAuthCall) {
      original._retry = true;
      try {
        // refresh token is read from the httpOnly cookie server-side (no body needed)
        refreshing ??= axios
          .post(`${baseURL}/api/auth/refresh`, {}, { withCredentials: true })
          .then(() => {})
          .finally(() => { refreshing = null; });
        await refreshing;
        return api(original);
      } catch {
        clearSession();
        if (typeof window !== "undefined") window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
