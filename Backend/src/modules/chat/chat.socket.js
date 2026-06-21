import * as chatService from "./chat.service.js";
import * as notificationService from "../notifications/notification.service.js";
import { emitNotification } from "../../infrastructure/socket/socket.server.js";

const registerChatHandlers = (io, socket) => {
  socket.on("chat:join", (roomId) => {
    socket.join(roomId);
  });

  socket.on("chat:leave", (roomId) => {
    socket.leave(roomId);
  });

  socket.on("chat:message", async ({ roomId, receiverId, message }) => {
    try {
      const senderType = socket.role === "doctor" ? "doctor" : "user";
      const saved = await chatService.saveMessage({
        roomId,
        senderId: socket.userId,
        senderType,
        message,
      });

      io.to(roomId).emit("chat:message", saved);

      const notification = await notificationService.createNotification({
        recipientId: receiverId,
        recipientType: senderType === "doctor" ? "user" : "doctor",
        type: "chat",
        title: "New Message",
        message: message.substring(0, 50),
        data: { roomId, senderId: socket.userId },
      });

      emitNotification(receiverId, notification);
    } catch (error) {
      socket.emit("chat:error", { message: error.message });
    }
  });

  socket.on("chat:typing", ({ roomId, receiverId }) => {
    io.to(roomId).emit("chat:typing", { roomId, senderId: socket.userId });
  });

  socket.on("chat:stopTyping", ({ roomId, receiverId }) => {
    io.to(roomId).emit("chat:stopTyping", { roomId, senderId: socket.userId });
  });

  socket.on("chat:read", async ({ roomId }) => {
    try {
      await chatService.markRoomAsRead(roomId, socket.userId);
      io.to(roomId).emit("chat:read", { roomId, readerId: socket.userId });
    } catch (error) {
      socket.emit("chat:error", { message: error.message });
    }
  });
};

export { registerChatHandlers };
