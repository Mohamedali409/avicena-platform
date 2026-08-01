"use client";

import Link from "next/link";
import { NotificationBell } from "./NotificationBell";
import { HeaderSearch } from "./HeaderSearch";
import { PortalAccountMenu } from "./PortalAccountMenu";
import { useSidebar } from "@/store/ui.store";

// Top bar for the authenticated portals: a centered role-aware search, with the
// site link, notification bell, and account menu grouped on the (left in RTL).
export function PortalHeader({ showBell = true }: { showBell?: boolean }) {
  const toggle = useSidebar((s) => s.toggle);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-outline-variant bg-white px-4 md:px-6">
      <button
        onClick={toggle}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary md:hidden"
        aria-label="القائمة"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Centered search */}
      <div className="flex flex-1 justify-center">
        <HeaderSearch />
      </div>

      {/* Actions (left in RTL): site link, notifications, account */}
      <div className="flex shrink-0 items-center gap-1">
        <Link
          href="/"
          aria-label="الموقع الرئيسي"
          className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
        >
          <span className="material-symbols-outlined">home</span>
        </Link>
        {showBell && <NotificationBell />}
        <PortalAccountMenu />
      </div>
    </header>
  );
}
