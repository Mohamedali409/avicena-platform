import { io, Socket } from "socket.io-client";
import { getSession } from "@/lib/auth/session";

// One shared Socket.io connection. Auth rides on the httpOnly cookies via
// `withCredentials: true` (the handshake sends them automatically) — no token
// is read from JS. `role` is passed for convenience/routing only.
// Used by chat, notifications, and video-call features.

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (socket?.connected) return socket;

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
