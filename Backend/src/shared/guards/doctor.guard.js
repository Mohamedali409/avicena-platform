import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";

export const doctorGuard = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.split(" ")[1] ||
    req.headers.dtoken ||
    req.cookies?.dtoken;

  if (!token) throw new ApiError("غير مصرح لك بالدخول", 401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.docId = decoded.id;
  req.doctor = decoded;
  next();
});
