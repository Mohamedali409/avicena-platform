import { Server } from "socket.io";
import { verifyToken } from "../../shared/utils/jwt.utils.js";
import ChatModel from "../../modules/chat/message.model.js";
import NotificationModel from "../../modules/notifications/notification.model.js";
import { socketAuthMiddleware } from "./socket.auth.js";
import { registerChatHandlers } from "../../modules/chat/chat.socket.js";
import { registerVideoHandlers } from "../../modules/video-call/video.socket.js";
import { registerNotificationHandlers } from "../../modules/notifications/notification.socket.js";

let io;

const onlineUser = new Map();

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        process.env.FRONTEND_URL,
        process.env.ADMIN_URL,
      ].filter(Boolean),
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    const uid = socket.userId;
    console.log(`Connected: ${uid} [${socket.role}]`);
    // Join personal notification room
    socket.join(`user:${uid}`);

    // Track online presence
    onlineUser.set(uid, socket.id);
    io.emit("presence:online", { userId: uid });

    // Chat
    registerChatHandlers(io, socket);

    // Video Call (WebRTC signaling)
    registerVideoHandlers(io, socket);

    // Notification
    registerNotificationHandlers(io, socket);

    // presence check

    socket.on("presence:check", ({ userId }) => {
      socket.emit("presence:status", {
        userId,
        online: onlineUser.has(userId),
      });
    });

    socket.on("disconnect", () => {
      console.log(`Disconnected: ${uid}`);
      onlineUser.delete(uid);
      io.emit("presence:offline", { userId: uid });
    });
  });

  return io;
};

export const emitNotification = (recipientId, payload) => {
  if (io) io.to(`user:${recipientId}`).emit("notification:new", payload);
};

export const isUserOnline = (userId) => onlineUser.has(userId.toString());

export { io };
