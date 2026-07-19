import { create } from "zustand";
import type { Role } from "@/config/roles";
import { ROLES } from "@/config/roles";
import { clearSession, getSession, saveSession, type Session } from "@/lib/auth/session";
import { disconnectSocket } from "@/lib/socket/socket";
import {
  loginRequest,
  registerRequest,
  verifyEmailRequest,
  type AuthResult,
} from "@/features/auth/api";
import { api } from "@/lib/api/client";

interface AuthState {
  session: Session | null;
  loading: boolean;
  hydrate: () => void;
  /** Unified login — the backend detects the role from the email. May throw 403 if unverified. */
  login: (email: string, password: string) => Promise<Session>;
  /** Register a patient. Returns nothing usable — the account must verify its email first. */
  register: (name: string, email: string, password: string) => Promise<{ email: string }>;
  /** Verify the email OTP → returns a token and logs the user in. */
  verifyEmail: (email: string, otp: string) => Promise<Session>;
  logout: () => Promise<void>;
}

const toSession = (r: AuthResult): Session => ({
  role: r.role,
  token: r.token,
  user: r.user,
});

export const useAuth = create<AuthState>((set) => ({
  session: null,
  loading: false,

  hydrate: () => set({ session: getSession() }),

  login: async (email, password) => {
    set({ loading: true });
    try {
      const session = toSession(await loginRequest(email, password));
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
      await registerRequest(name, email, password); // no token yet — must verify email
      return { email };
    } finally {
      set({ loading: false });
    }
  },

  verifyEmail: async (email, otp) => {
    set({ loading: true });
    try {
      const session = toSession(await verifyEmailRequest(email, otp));
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
