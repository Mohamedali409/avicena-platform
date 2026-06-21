import ApiError from "../../shared/utils/ApiError.js";
import { verifyToken } from "../../shared/utils/jwt.utlis.js";

export const socketAuthMiddleware = (socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.token;

  if (!token) throw new ApiError("Authentication error", 401);

  try {
    const decode = verifyToken(token);
    socket.userId = decode.userId;
    socket.role = decode.role || "patient";
    next();
  } catch (error) {
    throw new ApiError("Invalid token", 401);
  }
};
