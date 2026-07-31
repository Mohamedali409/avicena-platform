"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useNotifications } from "@/features/notifications/useNotifications";
import type { AppNotification } from "@/features/notifications/api";
import { useAuth } from "@/store/auth.store";

const iconFor = (type: string) => {
  if (type === "consultation") return "videocam";
  if (type === "chat" || type === "chat_request") return "forum";
  return "notifications";
};

const timeLabel = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
};

// Bell + unread badge + dropdown of the latest pushed notifications.
// Lives in the portal header; relies on the shared socket (post-login).
export function NotificationBell() {
  const { unread, latest, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const role = useAuth((s) => s.session?.role);
  const chatBase = role === "doctor" ? "/doctor/chat" : "/patient/chat";

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const linkFor = (n: AppNotification): string | null => {
    const roomId = n.data?.roomId as string | undefined;
    if (roomId && (n.type === "chat" || n.type === "chat_request"))
      return `${chatBase}/${roomId}`;
    return null;
  };

  const badge = useMemo(() => (unread > 9 ? "9+" : String(unread)), [unread]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
        aria-label="الإشعارات"
      >
        <span className="material-symbols-outlined">notifications</span>
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
            {badge}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-12 z-50 w-80 overflow-hidden rounded-xl bg-white shadow-card-hover">
          <div className="flex items-center justify-between border-b border-outline-variant px-4 py-3">
            <span className="text-label-md text-on-surface">الإشعارات</span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-caption text-primary hover:underline"
              >
                تعليم الكل كمقروء
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {latest.length === 0 ? (
              <p className="px-4 py-8 text-center text-caption text-on-surface-variant">
                لا توجد إشعارات جديدة
              </p>
            ) : (
              latest.map((n, i) => {
                const href = linkFor(n);
                const body = (
                  <div className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-surface-container-low">
                    <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-surface-container-low text-primary">
                      <span className="material-symbols-outlined text-[18px]">
                        {iconFor(n.type)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-label-md text-on-surface">{n.title}</p>
                      <p className="truncate text-caption text-on-surface-variant">
                        {n.message}
                      </p>
                      <p className="mt-0.5 text-[10px] text-on-surface-variant">
                        {timeLabel(n.createdAt)}
                      </p>
                    </div>
                  </div>
                );
                return href ? (
                  <Link key={n._id ?? i} href={href} onClick={() => setOpen(false)}>
                    {body}
                  </Link>
                ) : (
                  <div key={n._id ?? i}>{body}</div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
