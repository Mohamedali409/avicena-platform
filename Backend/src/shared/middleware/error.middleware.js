import { errorsTotal } from "../../infrastructure/monitoring/metrics.service.js";
import ApiError from "../utils/ApiError.js";

export const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field} مستخدم بالفعل`;
    statusCode = 409;
  }

  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    statusCode = 422;
  }

  if (err.name === "JsonWebTokenError") {
    message = "توكن غير صالح";
    statusCode = 401;
  }
  if (err.name === "TokenExpiredError") {
    message = "انتهت صلاحية التوكن";
    statusCode = 401;
  }
  errorsTotal.inc({
    type: err.name || "UnknownError",
    status_code: statusCode.toString(),
  });

  if (process.env.NODE_ENV === "development") console.error(" Error:", err);

  if (process.env.NODE_ENV === "development") console.error("Error:", err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
