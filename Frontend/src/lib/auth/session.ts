import type { Role } from "@/config/roles";

// Lightweight client-side session store. For production, prefer httpOnly cookies
// set by a Next.js route handler over localStorage to reduce XSS token theft.

const KEY = "avicena.session";

export interface SessionUser {
  _id: string;
  name?: string;
  email: string;
  image?: string;
}

export interface Session {
  role: Role;
  token: string;              // backend returns a single `token` (JWT, 7d)
  refreshToken?: string;      // reserved — backend does not issue one at login yet
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

export const patchToken = (token: string) => {
  const s = getSession();
  if (s) saveSession({ ...s, token });
};
