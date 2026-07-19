import { api } from "@/lib/api/client";
import type { Role } from "@/config/roles";
import type { SessionUser } from "@/lib/auth/session";

// Auth endpoints — all under /api/auth. Backend spreads the payload at the top level.
// Tokens are delivered as httpOnly cookies (accessToken / refreshToken), so the
// response body carries only `role` + `user` — never a token.

export interface AuthResult {
  role: Role;
  user: SessionUser;
}

export const registerRequest = async (name: string, email: string, password: string) => {
  const { data } = await api.post("/api/auth/register", { name, email, password });
  return data as { message: string; user: SessionUser };
};

export const loginRequest = async (email: string, password: string) => {
  const { data } = await api.post("/api/auth/login", { email, password });
  return { role: data.role, user: data.user ?? {} } as AuthResult;
};

export const verifyEmailRequest = async (email: string, otp: string) => {
  const { data } = await api.post("/api/auth/verify-email", { email, otp });
  return { role: (data.role ?? "patient") as Role, user: data.user ?? {} } as AuthResult;
};

export const resendVerificationRequest = async (email: string) => {
  const { data } = await api.post("/api/auth/resend-verification", { email });
  return data as { message: string };
};

export const forgotPasswordRequest = async (email: string) => {
  const { data } = await api.post("/api/auth/forgot-password", { email });
  return data as { message: string };
};

export const resetPasswordRequest = async (email: string, otp: string, newPassword: string) => {
  const { data } = await api.post("/api/auth/reset-password", { email, otp, newPassword });
  return data as { message: string };
};

export const resendResetPasswordRequest = async (email: string) => {
  const { data } = await api.post("/api/auth/resend-reset-password", { email });
  return data as { message: string };
};
