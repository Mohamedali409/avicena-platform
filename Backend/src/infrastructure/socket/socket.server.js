import { Server } from "socket.io";
import { verifyToken } from "../../shared/utils/jwt.utils.js";
import ChatModel from "../../modules/chat/message.model.js";
import NotificationModel from "../../modules/notifications/notification.model.js";

let io;

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
  });

  // Auth middleware
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token || socket.handshake.headers?.token;
    if (!token) return next(new Error("Authentication error"));
    try {
      const decoded = verifyToken(token);
      socket.userId = decoded.id;
      socket.role = decoded.role || "patient";
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Connected: ${socket.userId} [${socket.role}]`);

    // Join personal notification room
    socket.join(`user:${socket.userId}`);

    // ── Chat ───────────────────────────────────────────
    socket.on("join:room", (roomId) => {
      socket.join(roomId);
    });

    socket.on("chat:message", async ({ roomId, receiverId, message }) => {
      const senderType = socket.role === "doctor" ? "doctor" : "user";
      const saved = await ChatModel.create({
        roomId,
        senderId: socket.userId,
        senderType,
        message,
      });
      io.to(roomId).emit("chat:message", saved);

      // Notify receiver
      io.to(`user:${receiverId}`).emit("notification:new", {
        type: "chat",
        title: "رسالة جديدة",
        message: message.substring(0, 50),
      });
    });

    // ── Video Call Signaling ───────────────────────────
    socket.on("call:offer", ({ targetId, offer }) => {
      io.to(`user:${targetId}`).emit("call:offer", {
        from: socket.userId,
        offer,
      });
    });

    socket.on("call:answer", ({ targetId, answer }) => {
      io.to(`user:${targetId}`).emit("call:answer", {
        from: socket.userId,
        answer,
      });
    });

    socket.on("call:ice-candidate", ({ targetId, candidate }) => {
      io.to(`user:${targetId}`).emit("call:ice-candidate", {
        from: socket.userId,
        candidate,
      });
    });

    socket.on("call:end", ({ targetId }) => {
      io.to(`user:${targetId}`).emit("call:end", { from: socket.userId });
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Disconnected: ${socket.userId}`);
    });
  });

  return io;
};

/** Emit a notification to a specific user/doctor via socket */
export const emitNotification = (recipientId, payload) => {
  if (io) io.to(`user:${recipientId}`).emit("notification:new", payload);
};

export { io };
