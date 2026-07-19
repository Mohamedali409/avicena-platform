import type { Role } from "@/config/roles";

// The JWT lives in an httpOnly cookie (JS can't read it). We only persist the
// non-sensitive identity needed for routing + UI: the role and basic profile.

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
