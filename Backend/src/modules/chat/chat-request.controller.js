import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/ApiResponse.js";
import * as requestService from "./chat.request.service.js";

// ── Patient ───────────────────────────────────────────

// send request to the doctor
const sendRequest = catchAsync(async (req, res) => {
  const { docId, initialMessage } = req.body;

  const request = await requestService.sendChatRequest(
    req.userId,
    docId,
    initialMessage,
  );

  successResponse(res, "the request sender success", { request }, 201);
});

const getMyRequests = catchAsync(async (req, res) => {
  const request = await requestService.getUserRequests(req.userId);
  successResponse(res, "your requests", { request });
});

// ── Doctor ───────────────────────────────────────────
// Note: these routes use authGuard, which sets req.userId (the unified login
// gives every role a userId). Fall back to req.docId for the doctorGuard path.
const getDoctorRequests = catchAsync(async (req, res) => {
  const { status } = req.query;
  const docId = req.userId ?? req.docId;
  const requests = await requestService.getDoctorRequests(docId, status);
  successResponse(res, "your request from user", { requests });
});

const acceeptRequest = catchAsync(async (req, res) => {
  const { roomId } = req.body;
  if (!roomId) throw new Error("roomId is required");

  const docId = req.userId ?? req.docId;
  const data = await requestService.acceptRequest(docId, roomId);
  successResponse(res, "the request is accepted ", { data });
});

const rejectRequest = catchAsync(async (req, res) => {
  const { roomId, rejectReason } = req.body;
  if (!roomId) throw new Error("roomId is required");

  const docId = req.userId ?? req.docId;
  const request = await requestService.rejectRequest(
    docId,
    roomId,
    rejectReason,
  );
  successResponse(res, "the doctor reject your chat request", { request });
});

export {
  sendRequest,
  getMyRequests,
  getDoctorRequests,
  acceeptRequest,
  rejectRequest,
};
