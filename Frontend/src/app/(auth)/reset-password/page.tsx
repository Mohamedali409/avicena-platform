import { redirect } from "next/navigation";

// The full reset flow (email → OTP → new password) now lives on /forgot-password.
// Keep this route working for any old links.
export default function ResetPasswordRedirect() {
  redirect("/forgot-password");
}
