import { fa } from "zod/locales";
import ChatModel from "./message.model.js";

const createMessage = async ({ roomId, senderId, senderType, message }) => {
  return ChatModel.create({ roomId, senderId, senderType, message });
};

const getMessagesByRoom = async (roomId, { page = 1, limit = 30 } = {}) => {
  const skip = (page - 1) * limit;
  return ChatModel.find({ roomId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

const markRoomMessageAsRead = async (rooId, readerId) => {
  return ChatModel.updateMany(
    {
      rooId,
      senderId: { $ne: readerId },
      isRead: false,
    },
    { isRead: false },
  );
};

const getUnreadCountFromRoom = async (roomId, readerId) => {
  return ChatModel.countDocuments({
    roomId,
    senderId: { $ne: readerId },
    isRead: false,
  });
};

const getRoomsForParticipant = async (participantId) => {
  const idStr = participantId.toString();
  const rooms = await ChatModel.aggregate([
    {
      $match: {
        rooId: { $regex: `^(${idStr}_)|(_${idStr})` },
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$roomId",
        lastMessage: { $first: "$$ROOT" },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ["$senderId", participantId] },
                  { $eq: ["$isRead", false] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    { $sort: { "lastMessage.createdAt": -1 } },
  ]);
  return rooms;
};

export {
  createMessage,
  getMessagesByRoom,
  markRoomMessageAsRead,
  getUnreadCountFromRoom,
  getRoomsForParticipant,
};
