import * as authService from "./auth.service.js";
import * as messageResponse from "../../shared/utils/ApiResponse.js";
import catchAsync from "../../shared/utils/catchAsync.js";

const register = catchAsync(async (req, res) => {
  console.log("BODY => ", req.body);
  const data = await authService.registerPatient(req.body);
  messageResponse.successResponse(res, "Account created success", data, 201);
});

const login = catchAsync(async (req, res) => {
  const data = await authService.loginPatient(req.body);
  messageResponse.successResponse(res, "Login success", data);
});

export { register, login };
