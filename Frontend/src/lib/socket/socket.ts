import { io, Socket } from "socket.io-client";
import { getSession } from "@/lib/auth/session";

// One shared Socket.io connection for the whole app (chat, notifications, video).
// Auth rides on the httpOnly cookies via `withCredentials: true` (the handshake
// sends them automatically) — the backend socket middleware reads the
// `accessToken` cookie, so no token is ever touched by JS. `role` is passed for
// convenience/routing only.

let socket: Socket | null = null;

// Return the shared socket, creating it once. We keep the SAME instance even
// while it is still connecting (only recreate after an explicit disconnect),
// otherwise every call during the handshake would leak a new connection.
export const getSocket = (): Socket => {
  if (socket) return socket;

  // Prefer an explicit socket URL, then fall back to the API URL, then localhost.
  // ALL of these are NEXT_PUBLIC_* → inlined at BUILD time, so they must be set
  // before `next build` / redeploy (changing them at runtime does nothing).
  const url =
    process.env.NEXT_PUBLIC_SOCKET_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000";
  const session = getSession();

  socket = io(url, {
    autoConnect: true,
    // websocket first, but KEEP polling as a fallback: proxies / networks that
    // block raw WebSocket upgrades (Railway, corporate, some mobile carriers)
    // would otherwise fail to connect at all → dropped calls/notifications.
    transports: ["websocket", "polling"],
    withCredentials: true,
    // Explicit, resilient reconnection so a brief drop doesn't kill the session.
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    auth: { role: session?.role },
  });

  // Dev-only visibility into connect/disconnect churn.
  if (process.env.NODE_ENV !== "production") {
    socket.on("connect", () => console.log("[socket] connected", socket?.id));
    socket.on("disconnect", (reason) =>
      console.log("[socket] disconnected:", reason),
    );
    socket.on("connect_error", (err) =>
      console.log("[socket] connect_error:", err.message),
    );
  }

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};

export const isSocketConnected = () => Boolean(socket?.connected);
