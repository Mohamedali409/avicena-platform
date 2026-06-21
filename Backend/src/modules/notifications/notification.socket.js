import * as notificationService from "./notification.service.js";

const registerNotificationHandlers = (io, socket) => {
  socket.on("notification:fetchUnread", async () => {
    try {
      const recipientType = socket.role === "doctor" ? "doctor" : "user";
      const count = await notificationService.getUnreadCount(socket.userId);
      socket.emit("notification:UnreadCount", { count });
    } catch (error) {
      socket.emit("notification:error", { message: error.message });
    }
  });

  socket.on("notification:markAllRead", async () => {
    try {
      await notificationService.markAllRead(socket.userId);
      socket.emit("notification:allRead");
    } catch (error) {
      socket.emit("notification:error", { message: error.message });
    }
  });
};

export { registerNotificationHandlers };
