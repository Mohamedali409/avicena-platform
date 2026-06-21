import { successResponse } from "../../shared/utils/ApiResponse.js";
import catchAsync from "../../shared/utils/catchAsync.js";
import * as chatService from "./chat.service.js";

const getParticipant = (req) => ({
  id: req.userId || req.docId,
  type: req.userId ? "user" : "doctor",
});

const getRoomMessages = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const message = await chatService.getMessages(roomId, req.query);
  successResponse(res, "Done get message", { message });
});

const getMyConversations = catchAsync(async (req, res) => {
  const { id } = getParticipant(req);
  const conversations = await chatService.getConversation(id);
  successResponse(res, "Done get conversations", { conversations });
});

const markRoomAsRead = catchAsync(async (req, res) => {
  const { id } = getParticipant(req);
  const { roomId } = req.params;
  await chatService.markRoomAsRead(roomId, id);
  successResponse(res, "Done update user read status");
});

const getRoomUnreadCount = catchAsync(async (req, res) => {
  const { id } = getParticipant(req);
  const { roomId } = req.params;
  const count = await chatService.getUnreadCount(roomId, id);
  successResponse(res, "Number of unread messages", { count });
});

const getRoomIdWith = catchAsync(async (req, res) => {
  const { id } = getParticipant(req);
  const { otherId } = req.params;
  const roomId = await chatService.buildRoomId(id, otherId);
  successResponse(res, "The room ID has been created", { roomId });
});

export {
  getRoomMessages,
  getMyConversations,
  markRoomAsRead,
  getRoomUnreadCount,
  getRoomIdWith,
};
