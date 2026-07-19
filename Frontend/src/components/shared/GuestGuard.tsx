"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { homeFor } from "@/store/auth.store";

// Inverse of RoleGuard: auth pages (login/register/verify/forgot/reset) are for
// GUESTS only. If a session already exists, bounce to the role's dashboard —
// so the browser Back button can't reopen an auth page after logging in.
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (s) router.replace(homeFor(s.role));
    else setChecked(true);
  }, [router]);

  if (!checked) return null; // render nothing until we confirm the visitor is a guest
  return <>{children}</>;
}
