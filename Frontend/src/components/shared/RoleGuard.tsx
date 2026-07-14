"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/config/roles";
import { getSession } from "@/lib/auth/session";

// Wrap each role's route-group layout with this. It enforces that the visitor
// is authenticated AND holds the required role — otherwise redirects to login
// (or to their own home if they're logged in under a different role).

export function RoleGuard({ role, children }: { role: Role; children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const s = getSession();
    if (!s) { router.replace(`/login?role=${role}`); return; }
    if (s.role !== role) { router.replace("/"); }
  }, [role, router]);

  const s = getSession();
  if (!s || s.role !== role) return null; // avoid flashing protected content
  return <>{children}</>;
}
