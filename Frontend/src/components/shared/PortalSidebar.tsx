"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/store/auth.store";
import { useSidebar } from "@/store/ui.store";
import { ConfirmDialog } from "./ConfirmDialog";

export interface PortalNavItem {
  href: string;
  label: string;
  icon: string;
}

interface PortalSidebarProps {
  brand: { icon: string; label: string };
  /** optional user card under the brand (name comes from the session) */
  user?: { icon: string; roleLabel: string };
  nav: PortalNavItem[];
}

// One responsive sidebar for every portal. On mobile it's an off-canvas drawer
// (fixed, slides in from the right in RTL) controlled by the shared useSidebar
// store; on md+ it's a static in-flow column. Closes itself on route change.
export function PortalSidebar({ brand, user, nav }: PortalSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const name = useAuth((s) => s.session?.user.name);
  const logout = useAuth((s) => s.logout);
  const { open, close } = useSidebar();
  const [confirmLogout, setConfirmLogout] = useState(false);

  // close the mobile drawer whenever the route changes (e.g. nav link tapped)
  useEffect(() => {
    close();
  }, [pathname, close]);

  const handleLogout = async () => {
    setConfirmLogout(false);
    await logout();
    router.push("/");
  };

  return (
    <>
      {/* Backdrop (mobile only, when open) */}
      {open && (
        <div
          onClick={close}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-40 flex w-64 flex-col border-l border-outline-variant bg-white p-4 transition-transform duration-300 md:static md:z-auto md:translate-x-0 ${
          open ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="mb-6 flex items-center gap-2 px-2 py-3">
          <span className="material-symbols-outlined text-primary">
            {brand.icon}
          </span>
          <span className="text-headline-md text-on-surface">{brand.label}</span>
        </div>

        {/* User */}
        {user && (
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-surface-container-low p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-white">
              <span className="material-symbols-outlined">{user.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-label-md text-on-surface">
                {name ?? user.roleLabel}
              </p>
              <p className="text-caption text-on-surface-variant">
                {user.roleLabel}
              </p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-label-md transition-colors ${
                  active
                    ? "bg-primary-container text-white"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={() => setConfirmLogout(true)}
          className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-label-md text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>تسجيل الخروج</span>
        </button>
      </aside>

      <ConfirmDialog
        open={confirmLogout}
        title="تسجيل الخروج"
        message="هل أنت متأكد أنك تريد تسجيل الخروج؟"
        confirmLabel="تسجيل الخروج"
        cancelLabel="إلغاء"
        danger
        onConfirm={handleLogout}
        onCancel={() => setConfirmLogout(false)}
      />
    </>
  );
}
