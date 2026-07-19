import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";

export const labGuard = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.split(" ")[1] ||
    req.headers.ltoken ||
    req.cookies?.accessToken || // unified login sets this httpOnly cookie
    req.cookies?.ltoken;

  if (!token) throw new ApiError("غير مصرح لك بالدخول", 401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.labId = decoded.id;
  next();
});
