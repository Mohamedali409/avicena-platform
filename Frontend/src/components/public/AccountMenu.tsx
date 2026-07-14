"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, homeFor } from "@/store/auth.store";

// Single account entry point used in every header (desktop + mobile).
// - Logged out: the icon links straight to /login.
// - Logged in:  the icon opens a dropdown (account links + logout).
export function AccountMenu() {
  const router = useRouter();
  const session = useAuth((s) => s.session);
  const logout = useAuth((s) => s.logout);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Logged out: a clean outlined circle with a person icon → links to login.
  if (!session) {
    return (
      <Link
        href="/login"
        aria-label="تسجيل الدخول"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/60 bg-white text-primary transition-all hover:border-primary hover:bg-surface-container-low"
      >
        <span className="material-symbols-outlined text-[22px]">person</span>
      </Link>
    );
  }

  // Logged in: a teal avatar chip showing the user's initial.
  const initial = session.user?.name?.trim()?.charAt(0) || "؟";

  const onLogout = async () => {
    await logout();
    setOpen(false);
    router.push("/");
  };

  const item = (href: string, icon: string, label: string) => (
    <Link href={href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-body-md text-on-surface transition-colors hover:bg-surface-container-low">
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
      {label}
    </Link>
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="حسابي"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-base font-bold text-white shadow-sm ring-2 ring-primary-container/20 transition-all hover:brightness-110"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute left-0 top-12 z-[60] w-60 overflow-hidden rounded-xl border border-outline-variant/40 bg-white shadow-card">
          <div className="border-b border-outline-variant/40 p-4">
            <p className="text-label-md font-bold text-on-surface">{session.user?.name || "حسابي"}</p>
            {session.user?.email && <p className="truncate text-caption text-on-surface-variant" dir="ltr">{session.user.email}</p>}
          </div>
          <nav className="flex flex-col p-2">
            {item(homeFor(session.role), "dashboard", "لوحة حسابي")}
            {item("/points", "stars", "نقاطي")}
            {item("/patient/profile", "person", "الملف الشخصي")}
          </nav>
          <button onClick={onLogout} className="flex w-full items-center gap-3 border-t border-outline-variant/40 px-5 py-3 text-body-md text-error transition-colors hover:bg-error-container/40">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
}
