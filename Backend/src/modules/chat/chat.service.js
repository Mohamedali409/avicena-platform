import ApiError from "../../shared/utils/ApiError.js";
import * as chatRepo from "./chat.repository.js";

const buildRoomId = (idA, idB) => {
  const [a, b] = [idA.toString(), idB.toString()].sort();
  return `${a}_${b}`;
};

const saveMessage = async ({ roomId, senderId, senderType, message }) => {
  if (!message || !message.trim()) {
    throw new ApiError("The message cannot be empty", 400);
  }
  return chatRepo.createMessage({
    roomId,
    senderId,
    senderType,
    message: message.trim(),
  });
};

const getMessages = async (roomId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 30;
  const message = await chatRepo.getMessagesByRoom(roomId, { page, limit });
  return message.reverse();
};

const markRoomAsRead = async (roomId, readerId) => {
  return chatRepo.markRoomMessageAsRead(roomId, readerId);
};

const getUnreadCount = async (roomId, readerId) => {
  return chatRepo.getUnreadCountFromRoom(roomId, readerId);
};

const getConversation = async (participantId) => {
  return chatRepo.getRoomsForParticipant(participantId);
};

export {
  buildRoomId,
  saveMessage,
  getMessages,
  markRoomAsRead,
  getUnreadCount,
  getConversation,
};
