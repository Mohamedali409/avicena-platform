import { MESSAGES } from "../constants/messages.js";
import AppError from "../utils/AppError.js";

const allowTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError(MESSAGES.UNAUTHORIZED, 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(MESSAGES.FORBIDDEN, 403));
    }

    next();
  };
};

export default allowTo;
