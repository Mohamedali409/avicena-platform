import * as chatService from "./chat.service.js";
import * as requestService from "./chat.request.service.js";
import * as notificationService from "../notifications/notification.service.js";
import { emitNotification } from "../../infrastructure/socket/socket.server.js";
import { chatMessagesTotal } from "../../infrastructure/monitoring/metrics.service.js";

const registerChatHandlers = (io, socket) => {
  socket.on("chat:join", (roomId) => socket.join(roomId));
  socket.on("chat:leave", (roomId) => socket.leave(roomId));

  socket.on("chat:message", async ({ roomId, receiverId, message }) => {
    try {
      if (socket.role !== "doctor") {
        await requestService.assertChatAllowed(socket.userId, receiverId);
      }

      const senderType = socket.role === "doctor" ? "doctor" : "user";

      const saved = await chatService.saveMessage({
        roomId,
        senderId: socket.userId,
        senderType,
        message,
      });

      socket.to(roomId).emit("chat:message", saved);
      socket.emit("chat:message:sent", saved);
      chatMessagesTotal.inc({ sender_type: socket.role || "user" });

      if (receiverId) {
        const recipientType = senderType === "doctor" ? "user" : "doctor";
        const notification = await notifService.createNotification({
          recipientId: receiverId,
          recipientType,
          type: "chat",
          title: "رسالة جديدة",
          message: message.substring(0, 50),
          data: { roomId, senderId: socket.userId },
        });
        emitNotification(receiverId, notification);
      }
    } catch (err) {
      socket.emit("chat:error", { message: err.message });
    }
  });

  socket.on("chat:typing", ({ roomId }) =>
    socket.to(roomId).emit("chat:typing", { roomId, senderId: socket.userId }),
  );
  socket.on("chat:stopTyping", ({ roomId }) =>
    socket
      .to(roomId)
      .emit("chat:stopTyping", { roomId, senderId: socket.userId }),
  );

  socket.on("chat:read", async ({ roomId }) => {
    try {
      await chatService.markRoomAsRead(roomId, socket.userId);
      socket.to(roomId).emit("chat:read", { roomId, readerId: socket.userId });
    } catch (err) {
      socket.emit("chat:error", { message: err.message });
    }
  });
};

export { registerChatHandlers };
