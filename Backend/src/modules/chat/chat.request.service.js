import ApiError from "../../shared/utils/ApiError.js";
import * as requestRepo from "./chat-request.repository.js";
import * as chatRepo from "./chat.repository.js";
import * as notifService from "../notifications/notification.service.js";
import { buildRoomId } from "./chat.service.js";
import { emitNotification } from "../../infrastructure/socket/socket.server.js";
import { chatRequestsTotal } from "../../infrastructure/monitoring/metrics.service.js";

// the patient send request to doctor to open chat
// if do not have any last request create one
// if last request pending --> user can't send message to user should be wait
// if the last requset accepted --> the chat is open
// if the last requset rejected --> not authorization send message to this doctor

const sendChatRequest = async (userId, docId, initialMessage) => {
  if (!initialMessage?.trim()) {
    throw new ApiError("the first message is required", 400);
  }

  if (!initialMessage.trim().length > 500) {
    throw new ApiError("the first message must not be bigar than 500", 400);
  }

  const roomId = buildRoomId(userId.toString(), docId.toString());

  const latest = await requestRepo.findLatestByRoomId(roomId);

  if (latest) {
    if (latest.status === "pending") {
      throw new ApiError("wait for doctor acceept your request", 409);
    }
    if (latest.status === "pending") {
      throw new ApiError(
        "the chat is opent you can sent message to the doctor",
        409,
      );
    }
  }
  chatRequestsTotal.inc({ status: "pending" });
  const request = await requestRepo.createRequest({
    userId,
    docId,
    roomId,
    initialMessage: initialMessage.trim(),
  });

  const notification = await notifService.createNotification({
    recipientId: docId,
    recipientType: "doctor",
    type: "chat_request",
    title: "new request",
    message: `مريض يريد التواصل معك: "${initialMessage.trim().substring(0, 60)}"`,
    data: { requestId: request._id, roomId, userId: userId.toString() },
  });

  emitNotification(docId.toString(), notification);

  return request;
};

const acceptRequest = async (docId, roomId) => {
  const request = await requestRepo.findLatestByRoomId(roomId);
  if (!request) throw new ApiError("The request not found", 404);
  if (request.docId.toString() !== docId.toString())
    throw new ApiError("not your request", 403);
  if (request.status !== "pending")
    throw new ApiError("the request processing before", 400);

  await requestRepo.updateLatestStatus(roomId, "accepted");

  const saveMsg = await chatRepo.createMessage({
    roomId,
    senderId: request.userId,
    senderType: "user",
    message: request.initialMessage,
  });

  const notification = await notifService.createNotification({
    recipientId: request.userId,
    recipientType: "user",
    type: "chat_request",
    title: "the request is accepted",
    message: "the doctor accepted your request, Now you can start chat",
    data: { roomId, docId: docId.toString() },
  });

  emitNotification(request.userId.toString(), notification);

  return { request, firstMessage: saveMsg };
};

const rejectRequest = async (docId, roomId, rejectReason = "") => {
  const request = await requestRepo.findLatestByRoomId(roomId);
  if (!request) throw new ApiError("The request not found", 404);
  if (request.docId.toString() !== docId.toString())
    throw new ApiError("not your request", 403);
  if (request.status !== "pending")
    throw new ApiError("the request processing before", 400);

  await requestRepo.updateLatestStatus(roomId, "accepted", rejectReason);

  const notification = await notifService.createNotification({
    recipientId: request.userId,
    recipientType: "user",
    type: "chat_request",
    title: "the request is rejected",
    message:
      rejectReason || "the doctor rejected your request, you can try next time",
    data: { roomId, docId: docId.toString() },
  });

  emitNotification(request.userId.toString(), notification);

  return { request };
};

const assertChatAllowed = async (userId, docId) => {
  const roomId = buildRoomId(userId.toString(), docId.toString());
  const latest = await requestRepo.findLatestByRoomId(roomId);

  if (!latest)
    throw new ApiError("send request to the doctor to start chat", 403);

  if (latest.status === "pending")
    throw new ApiError("the doctor not accept your requrst yet", 403);

  if (latest.status === "rejected")
    throw new ApiError(
      "the doctor reject your request, you can try it next time ",
      403,
    );

  return roomId;
};

const getDoctorRequests = (docId, status) => {
  return requestRepo.findRequestsByDoctor(docId, status);
};

const getUserRequests = (userId) => {
  return requestRepo.findRequestsByUser(userId);
};

export {
  sendChatRequest,
  acceptRequest,
  rejectRequest,
  assertChatAllowed,
  getDoctorRequests,
  getUserRequests,
};
