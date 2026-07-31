"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/config/roles";
import { getSession } from "@/lib/auth/session";

// Wrap each role's route-group layout with this. It enforces that the visitor
// is authenticated AND holds the required role — otherwise redirects to login
// (or to "/" if they're logged in under a different role).
//
// The session lives in localStorage, which is unavailable during SSR. Reading
// it during render made the server output (null) differ from the client output
// (the content) → hydration mismatch. So we render nothing until mounted, then
// validate in an effect. Server and first client render now agree (both null).
export function RoleGuard({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace(`/login?role=${role}`);
      return;
    }
    if (s.role !== role) {
      router.replace("/");
      return;
    }
    setReady(true);
  }, [role, router]);

  if (!ready) return null; // consistent on server + first client render
  return <>{children}</>;
}
