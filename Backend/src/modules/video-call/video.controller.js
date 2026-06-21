import { successResponse } from "../../shared/utils/ApiResponse.js";
import catchAsync from "../../shared/utils/catchAsync.js";
import * as videoService from "./video.service.js";

const getParticipant = (req) => ({
  id: req.userId || req.docId,
  type: req.userId ? "user" : "doctor",
});

const getCallHistory = catchAsync(async (req, res) => {
  const { id } = getParticipant(req);
  const calls = await videoService.getCallHistory(id, req.query);
  successResponse(res, "The call log was retrieved ", { calls });
});

const getCallById = catchAsync(async (req, res) => {
  const call = await videoService.getCall(req.params.id);
  successResponse(res, "Call data retrieved", { call });
});

export { getCallHistory, getCallById };
