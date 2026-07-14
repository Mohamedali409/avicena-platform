import * as applicationService from "./application.service.js";
import { successResponse } from "../../../shared/utils/ApiResponse.js";
import catchAsync from "../../../shared/utils/catchAsync.js";

// Submit Application
const submitApplication = catchAsync(async (req, res) => {
  const data = await applicationService.submitApplication({
    ...req.body,
    documents: req.file?.path,
  });

  successResponse(
    res,
    "Application submitted successfully.",
    { application: data },
    201,
  );
});

// Get All Applications
const getAllApplications = catchAsync(async (req, res) => {
  const applications = await applicationService.getAllApplication();

  successResponse(res, "Applications fetched successfully.", {
    applications,
  });
});

// Get Application By Id
const getApplicationById = catchAsync(async (req, res) => {
  const application = await applicationService.getApplicationById(
    req.params.id,
  );

  successResponse(res, "Application fetched successfully.", {
    application,
  });
});

// Approve Application
const approveApplication = catchAsync(async (req, res) => {
  const application = await applicationService.approveApplication(
    req.params.id,
    req.admin.id,
  );

  successResponse(res, "Application approved successfully.", {
    application,
  });
});

// Reject Application
const rejectApplication = catchAsync(async (req, res) => {
  const { rejectReason } = req.body;

  const application = await applicationService.rejectApplication(
    req.params.id,
    req.admin.id,
    rejectReason,
  );

  successResponse(res, "Application rejected successfully.", {
    application,
  });
});

// Delete Application
const deleteApplication = catchAsync(async (req, res) => {
  const data = await applicationService.deleteApplication(req.params.id);

  successResponse(res, data.message);
});

// Statistics
const getStatistics = catchAsync(async (req, res) => {
  const statistics = await applicationService.getApplicationStatistics();

  successResponse(res, "Statistics fetched successfully.", {
    statistics,
  });
});

export {
  submitApplication,
  getAllApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
  deleteApplication,
  getStatistics,
};
