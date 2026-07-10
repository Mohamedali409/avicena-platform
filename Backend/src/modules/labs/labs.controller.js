import { successResponse } from "../../shared/utils/ApiResponse.js";
import catchAsync from "../../shared/utils/catchAsync.js";
import * as labService from "./labs.service.js";

const getAllLabs = catchAsync(async (req, res) => {
  const labs = await labService.getAllLabs();
  successResponse(res, "Get All Labs", { labs });
});

const getLabById = catchAsync(async (req, res) => {
  const lab = await labService.getLabById(req.params.id);
  successResponse(res, "Done get labe ", { lab });
});

const getLabProfile = catchAsync(async (req, res) => {
  const lab = await labService.getLabProfile(req.labId);
  successResponse(res, "Deon get labe profile ", { lab });
});

const updateLabeProfile = catchAsync(async (req, res) => {
  await labService.updateLabeProfile(req.labId, req.body, req.file);
  successResponse(res, "Done update profile ");
});

// add lab by admin
const addLab = catchAsync(async (req, res) => {
  await labService.addLab(req.body, req.file);
  successResponse(res, "Done create lab account");
});

export { getAllLabs, getLabById, getLabProfile, updateLabeProfile, addLab };
