import type { Role } from "@/config/roles";

// Client-side session store. Auth tokens live in httpOnly cookies set by the
// backend (accessToken / refreshToken) — NEVER in localStorage. JavaScript
// cannot read httpOnly cookies, which blocks XSS token theft. Here we keep only
// non-secret data needed by the UI: the `role` (to route the user to their
// dashboard after a page reload) and a light profile for the header. No token
// is ever stored on the client.

const KEY = "avicena.session";

export interface SessionUser {
  _id: string;
  name?: string;
  email: string;
  image?: string;
}

export interface Session {
  role: Role;
  user: SessionUser;
}

export const saveSession = (s: Session) => {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(s));
};

export const getSession = (): Session | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Session) : null;
};

export const clearSession = () => {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
};
