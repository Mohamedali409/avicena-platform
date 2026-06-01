import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";

/**
 * Verifies the JWT from Authorization header or legacy token/dtoken/atoken headers.
 * Attaches decoded id to req.userId / req.user
 */
export const authGuard = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.split(" ")[1] ||
    req.headers.token ||
    req.cookies?.token;

  if (!token) throw new ApiError("غير مصرح لك بالدخول، سجل دخولك أولاً", 401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = decoded.id;
  req.user = decoded;
  next();
});
