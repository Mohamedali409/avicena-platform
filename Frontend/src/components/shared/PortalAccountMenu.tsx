/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth.store";
import { ConfirmDialog } from "./ConfirmDialog";

const profilePathFor = (role?: string) =>
  role === "doctor"
    ? "/doctor/settings"
    : role === "patient"
      ? "/patient/profile"
      : role === "lab"
        ? "/lab/profile"
        : role === "pharmacy"
          ? "/pharmacy/profile"
          : null;

// Avatar + dropdown for the authenticated portals: profile link + logout
// (with confirmation). Renders the user's photo when available, else an initial.
export function PortalAccountMenu() {
  const router = useRouter();
  const session = useAuth((s) => s.session);
  const logout = useAuth((s) => s.logout);
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!session) return null;

  const { user, role } = session;
  const initial = user.name?.trim()?.charAt(0) || "؟";
  const profilePath = profilePathFor(role);

  const onLogout = async () => {
    setConfirmLogout(false);
    setOpen(false);
    await logout();
    router.push("/");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="حسابي"
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary-container text-sm font-bold text-white ring-2 ring-primary-container/20 transition-all hover:brightness-110"
      >
        {user.image ? (
          <img src={user.image} alt="" className="h-full w-full object-cover" />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-11 z-[60] w-60 overflow-hidden rounded-xl border border-outline-variant/40 bg-white shadow-card">
          <div className="border-b border-outline-variant/40 p-4">
            <p className="text-label-md font-bold text-on-surface">
              {user.name || "حسابي"}
            </p>
            {user.email && (
              <p
                className="truncate text-caption text-on-surface-variant"
                dir="ltr"
              >
                {user.email}
              </p>
            )}
          </div>

          {profilePath && (
            <nav className="flex flex-col p-2">
              <Link
                href={profilePath}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-body-md text-on-surface transition-colors hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined text-[20px]">
                  person
                </span>
                الملف الشخصي
              </Link>
            </nav>
          )}

          <button
            onClick={() => {
              setOpen(false);
              setConfirmLogout(true);
            }}
            className="flex w-full items-center gap-3 border-t border-outline-variant/40 px-5 py-3 text-body-md text-error transition-colors hover:bg-error-container/40"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            تسجيل الخروج
          </button>
        </div>
      )}

      <ConfirmDialog
        open={confirmLogout}
        title="تسجيل الخروج"
        message="هل أنت متأكد أنك تريد تسجيل الخروج؟"
        confirmLabel="تسجيل الخروج"
        cancelLabel="إلغاء"
        danger
        onConfirm={onLogout}
        onCancel={() => setConfirmLogout(false)}
      />
    </div>
  );
}
