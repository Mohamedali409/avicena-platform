export const ApiResponse = (res, statusCode, success, message, data = {}) => {
  return res.status(statusCode).json({ success, message, ...data });
};

export const successResponse = (res, message, data = {}, statusCode = 200) =>
  ApiResponse(res, statusCode, true, message, data);

export const errorResponse = (res, message, statusCode = 400) =>
  ApiResponse(res, statusCode, false, message);
