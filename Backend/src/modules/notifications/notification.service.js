import NotificationModel from "./notification.model.js";

export const createNotification = async ({ recipientId, recipientType, type, title, message, data }) => {
  return NotificationModel.create({ recipientId, recipientType, type, title, message, data });
};

export const getNotifications = async (recipientId, recipientType) => {
  return NotificationModel.find({ recipientId, recipientType })
    .sort({ createdAt: -1 })
    .limit(50);
};

export const markAllRead = async (recipientId) => {
  await NotificationModel.updateMany({ recipientId, isRead: false }, { isRead: true });
};

export const getUnreadCount = async (recipientId) => {
  return NotificationModel.countDocuments({ recipientId, isRead: false });
};
