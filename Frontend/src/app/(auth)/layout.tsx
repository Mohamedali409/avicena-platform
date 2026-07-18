import { GuestGuard } from "@/components/shared/GuestGuard";

// Wraps every auth page (login/register/verify-email/forgot/reset-password).
// Logged-in users are redirected to their dashboard instead of seeing these.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <GuestGuard>{children}</GuestGuard>;
}
