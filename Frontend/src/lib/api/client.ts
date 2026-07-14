import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ROLES } from "@/config/roles";
import { getSession, patchToken, clearSession } from "@/lib/auth/session";

// Single Axios instance shared by the whole app.
// The request interceptor injects the CORRECT auth header for the current role
// (Authorization: Bearer for patients, dtoken/atoken/ltoken for the others),
// so feature code never has to know which scheme a role uses.

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const api = axios.create({ baseURL, timeout: 20000 });

// ---- Request: attach role-specific auth header ----
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const session = getSession();
  if (session?.token) {
    const { authHeader, bearer } = ROLES[session.role];
    config.headers.set(authHeader, bearer ? `Bearer ${session.token}` : session.token);
  }
  return config;
});

// ---- Response: transparent refresh for patients on 401 (when a refreshToken exists) ----
let refreshing: Promise<string> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const session = getSession();

    const canRefresh =
      error.response?.status === 401 &&
      session?.role === "patient" &&
      !!session.refreshToken &&
      !original?._retry;

    if (canRefresh) {
      original._retry = true;
      try {
        refreshing ??= axios
          .post(`${baseURL}/api/auth/refresh`, { refreshToken: session!.refreshToken })
          .then((r) => {
            const token = r.data?.accessToken as string; // backend returns top-level accessToken
            patchToken(token);
            return token;
          })
          .finally(() => { refreshing = null; });

        const newToken = await refreshing;
        original.headers.set("Authorization", `Bearer ${newToken}`);
        return api(original);
      } catch {
        clearSession();
        if (typeof window !== "undefined") window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
