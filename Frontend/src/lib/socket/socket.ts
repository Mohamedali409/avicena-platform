import { io, Socket } from "socket.io-client";
import { getSession } from "@/lib/auth/session";

// One shared Socket.io connection, authenticated with the current session token.
// Used by chat, notifications, and video-call features.

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (socket?.connected) return socket;

  const url = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000";
  const session = getSession();

  socket = io(url, {
    autoConnect: true,
    transports: ["websocket"],
    auth: { token: session?.token, role: session?.role },
  });

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
