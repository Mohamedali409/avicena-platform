import NotificationModel from "./notification.model.js";

export const createNotification = async ({
  recipientId,
  recipientType,
  type,
  title,
  message,
  data,
}) => {
  return NotificationModel.create({
    recipientId,
    recipientType,
    type,
    title,
    message,
    data,
  });
};

export const getNotifications = async (
  recipientId,
  recipientType,
  { page = 1, limit = 20 } = {},
) => {
  const skip = (page - 1) * limit;
  const [notifications, total, unread] = await Promise.all([
    NotificationModel.find({ recipientId, recipientType })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    NotificationModel.countDocuments({ recipientId }),
    NotificationModel.countDocuments({ recipientId, isRead: false }),
  ]);
  return {
    notifications,
    total,
    unread,
    page,
    pages: Math.ceil(total / limit),
  };
};

export const markAllRead = async (recipientId) => {
  await NotificationModel.updateMany(
    { recipientId, isRead: false },
    { isRead: true },
  );
};

export const markOneRead = async (recipientId, notifId) => {
  await NotificationModel.findOneAndUpdate(
    { _id: notifId, recipientId },
    { isRead: true },
  );
};

export const getUnreadCount = async (recipientId) => {
  return NotificationModel.countDocuments({ recipientId, isRead: false });
};
