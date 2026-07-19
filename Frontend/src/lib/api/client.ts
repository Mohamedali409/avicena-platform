import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getSession, clearSession } from "@/lib/auth/session";

// Single Axios instance shared by the whole app.
// Auth is cookie-based: the backend sets httpOnly `accessToken` / `refreshToken`
// cookies at login. The browser sends them automatically because of
// `withCredentials: true`, so there is NO Authorization header and NO token in
// JavaScript / localStorage. (Requires the backend CORS to allow credentials
// with an explicit origin — already configured.)

const baseURL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
).replace(/\/+$/, ""); // strip any trailing slash to avoid `//api/...`

export const api = axios.create({
  baseURL,
  timeout: 20000,
  withCredentials: true,
});

// ---- Response: silent refresh on 401 ----
// The accessToken cookie lives 15 minutes. On the first 401 for a logged-in
// user we call /api/auth/refresh once — it reads the refreshToken cookie and
// sets a fresh accessToken cookie — then retry the original request. Auth calls
// are excluded so a failed login/refresh doesn't loop.
let refreshing: Promise<void> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const isAuthCall = (original?.url ?? "").includes("/api/auth/");

    const canRefresh =
      error.response?.status === 401 &&
      !!getSession() &&
      !original?._retry &&
      !isAuthCall;

    if (canRefresh) {
      original._retry = true;
      try {
        refreshing ??= axios
          .post(`${baseURL}/api/auth/refresh`, {}, { withCredentials: true })
          .then(() => undefined)
          .finally(() => {
            refreshing = null;
          });

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
