import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";

export const pharmacyGuard = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.split(" ")[1] ||
    req.headers.phtoken ||
    req.cookies?.accessToken || // unified login sets this httpOnly cookie
    req.cookies?.phtoken; // was `req.coolies` (typo) — cookies never matched

  if (!token) throw new ApiError("Not authorization to you.", 401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded?.role !== "pharmacy")
    throw new ApiError("Not authorization to you.", 401);

  req.pharmacyId = decoded.id;
  next();
});
