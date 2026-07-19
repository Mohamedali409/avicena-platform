import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";

export const adminGuard = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.split(" ")[1] ||
    req.headers.atoken ||
    req.cookies?.accessToken || // unified login sets this httpOnly cookie
    req.cookies?.atoken;

  if (!token) throw new ApiError("غير مصرح لك بالدخول", 401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (
    decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD &&
    decoded?.role !== "admin"
  ) {
    throw new ApiError("غير مصرح لك بالدخول", 403);
  }
  req.admin = decoded;
  req.isAdmin = true;
  next();
});
