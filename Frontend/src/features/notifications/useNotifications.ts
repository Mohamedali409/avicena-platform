"use client";

import { useCallback, useEffect, useState } from "react";
import { getSocket } from "@/lib/socket/socket";
import { SOCKET_EVENTS } from "@/lib/socket/events";
import { getUnreadCount, getNotifications } from "./api";
import type { AppNotification } from "./api";

interface UseNotificationsResult {
  unread: number;
  latest: AppNotification[];
  markAllRead: () => void;
}

// Live notifications: seeds the unread count over REST, then keeps it in sync
// via the socket. `latest` accumulates pushed notifications this session (for a
// dropdown/toast). Mount this once high in the tree (e.g. the app header).
export function useNotifications(max = 20): UseNotificationsResult {
  const [unread, setUnread] = useState(0);
  const [latest, setLatest] = useState<AppNotification[]>([]);

  useEffect(() => {
    const socket = getSocket();

    getUnreadCount()
      .then(setUnread)
      .catch(() => {});

    // Seed the dropdown with the persisted history (so past bookings/messages
    // show even after a reload — not just notifications pushed this session).
    getNotifications(1, max)
      .then((res: unknown) => {
        const r = res as { notifications?: AppNotification[]; data?: AppNotification[] };
        const list = r.notifications ?? r.data ?? (Array.isArray(res) ? res : []);
        setLatest(list as AppNotification[]);
      })
      .catch(() => {});

    const onNew = (notif: AppNotification) => {
      setLatest((prev) =>
        [notif, ...prev.filter((n) => n._id !== notif._id)].slice(0, max),
      );
      setUnread((c) => c + 1);
    };
    const onCount = (p: { count: number }) => setUnread(p.count);
    const onAllRead = () => setUnread(0);

    socket.on(SOCKET_EVENTS.notifNew, onNew);
    socket.on(SOCKET_EVENTS.notifUnreadCount, onCount);
    socket.on(SOCKET_EVENTS.notifAllRead, onAllRead);

    // ask the server for the authoritative unread count
    socket.emit(SOCKET_EVENTS.notifFetchUnread);

    return () => {
      socket.off(SOCKET_EVENTS.notifNew, onNew);
      socket.off(SOCKET_EVENTS.notifUnreadCount, onCount);
      socket.off(SOCKET_EVENTS.notifAllRead, onAllRead);
    };
  }, [max]);

  const markAllRead = useCallback(() => {
    getSocket().emit(SOCKET_EVENTS.notifMarkAllRead);
    setUnread(0);
  }, []);

  return { unread, latest, markAllRead };
}
