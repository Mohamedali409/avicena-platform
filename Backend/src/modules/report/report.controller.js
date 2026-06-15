import { successResponse } from "../../shared/utils/ApiResponse.js";
import catchAsync from "../../shared/utils/catchAsync.js";
import * as reportService from "./report.service.js";

const getReportById = catchAsync(async (req, res) => {
  const report = await reportService.getReportById(req.params.id);
  successResponse(res, "Done get report", { report });
});

export { getReportById };
