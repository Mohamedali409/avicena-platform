"use client";

import { NotificationBell } from "./NotificationBell";
import { useSidebar } from "@/store/ui.store";

// Slim top bar for the authenticated portals. On mobile it shows a hamburger
// that toggles the sidebar drawer; on md+ the hamburger is hidden (sidebar is
// always visible). Holds the notification bell (in RTL it sits on the left).
export function PortalHeader({
  title,
  showBell = true,
}: {
  title?: string;
  showBell?: boolean;
}) {
  const toggle = useSidebar((s) => s.toggle);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-outline-variant bg-white px-4 md:px-6">
      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary md:hidden"
          aria-label="القائمة"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-label-md text-on-surface-variant">{title ?? ""}</h2>
      </div>
      {showBell && <NotificationBell />}
    </header>
  );
}
