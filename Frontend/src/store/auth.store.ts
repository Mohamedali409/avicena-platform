import { create } from "zustand";
import type { Role } from "@/config/roles";
import { ROLES } from "@/config/roles";
import { api } from "@/lib/api/client";
import { clearSession, getSession, saveSession, type Session, type SessionUser } from "@/lib/auth/session";
import { disconnectSocket } from "@/lib/socket/socket";

interface AuthState {
  session: Session | null;
  loading: boolean;
  hydrate: () => void;
  /** Unified login — the backend detects the role from the email. */
  login: (email: string, password: string) => Promise<Session>;
  register: (name: string, email: string, password: string) => Promise<Session>;
  logout: () => Promise<void>;
}

// The backend spreads the payload at the TOP LEVEL and names the profile object
// per role: user | doctor | admin | lab. It returns `token` (not accessToken),
// and does NOT issue a refreshToken at login yet.
const profileKey: Record<Role, "user" | "doctor" | "admin" | "lab"> = {
  patient: "user",
  doctor: "doctor",
  admin: "admin",
  lab: "lab",
};

const toSession = (role: Role, body: Record<string, unknown>): Session => {
  const profile = (body[profileKey[role]] ?? {}) as SessionUser;
  return {
    role,
    token: body.token as string,
    refreshToken: body.refreshToken as string | undefined,
    user: profile,
  };
};

export const useAuth = create<AuthState>((set) => ({
  session: null,
  loading: false,

  hydrate: () => set({ session: getSession() }),

  login: async (email, password) => {
    set({ loading: true });
    try {
      // Unified endpoint returns { token, role, user } — role decided server-side.
      const { data } = await api.post("/api/auth/login", { email, password });
      const role = data.role as Role;
      const session: Session = {
        role,
        token: data.token as string,
        refreshToken: data.refreshToken as string | undefined,
        user: (data.user ?? {}) as SessionUser,
      };
      saveSession(session);
      set({ session });
      return session;
    } finally {
      set({ loading: false });
    }
  },

  register: async (name, email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post("/api/auth/register", { name, email, password });
      const session = toSession("patient", data);
      saveSession(session);
      set({ session });
      return session;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try { await api.post("/api/auth/logout"); } catch { /* best effort */ }
    clearSession();
    disconnectSocket();
    set({ session: null });
  },
}));

export const homeFor = (role: Role) => ROLES[role].home;
