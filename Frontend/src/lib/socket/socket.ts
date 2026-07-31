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

  const url = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000";
  const session = getSession();

  socket = io(url, {
    autoConnect: true,
    transports: ["websocket"],
    withCredentials: true,
    auth: { role: session?.role },
  });

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};

export const isSocketConnected = () => Boolean(socket?.connected);
