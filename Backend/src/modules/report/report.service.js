import ApiError from "../../shared/utils/ApiError.js";
import * as reportRepository from "./report.repository.js";

const getReportById = async (reportId) => {
  const report = await reportRepository.getReportById(reportId);

  if (!report) throw new ApiError("The report not found", 404);

  return report;
};

export { getReportById };
