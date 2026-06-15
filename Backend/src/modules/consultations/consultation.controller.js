import { successResponse } from "../../shared/utils/ApiResponse.js";
import catchAsync from "../../shared/utils/catchAsync.js";
import * as consultationService from "./consultation.service.js";

const getConsultationById = catchAsync(async (req, res) => {
  const consultation = await consultationService.getConsultationById(
    req.params.id,
  );
  successResponse(res, "Done get consultation", { consultation });
});

export { getConsultationById };
