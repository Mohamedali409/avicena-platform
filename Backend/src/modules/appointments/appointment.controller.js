import { successResponse } from "../../shared/utils/ApiResponse.js";
import catchAsync from "../../shared/utils/catchAsync.js";
import * as appointmentService from "./appointment.service.js";

const getAppointmentById = catchAsync(async (req, res) => {
  const appointment = await appointmentService.getAppointmentById(
    req.params.id,
  );

  successResponse(res, "get single appointment ", { appointment });
});

export { getAppointmentById };
