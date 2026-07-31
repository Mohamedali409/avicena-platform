import { verifyToken } from "../../shared/utils/jwt.utlis.js";

// Parse a raw Cookie header ("a=1; b=2") into a plain object.
const parseCookies = (header = "") =>
  header.split(";").reduce((acc, part) => {
    const idx = part.indexOf("=");
    if (idx === -1) return acc;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key) acc[key] = decodeURIComponent(val);
    return acc;
  }, {});

// Socket.IO auth middleware.
// The token can arrive three ways so the same server works for the web app
// (httpOnly cookie via `withCredentials: true`) and for native/mobile clients
// (explicit token in the handshake auth payload or a header):
//   1. socket.handshake.auth.token
//   2. socket.handshake.headers.token
//   3. the `accessToken` / `token` / `dtoken` cookie (same as the REST guards)
// On failure we MUST call next(err) — throwing inside a Socket.IO middleware is
// not caught and leaves the handshake hanging.
export const socketAuthMiddleware = (socket, next) => {
  try {
    const cookies = parseCookies(socket.handshake.headers?.cookie);

    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.token ||
      cookies.accessToken ||
      cookies.token ||
      cookies.dtoken;

    if (!token) return next(new Error("Authentication error: no token"));

    const decoded = verifyToken(token);
    socket.userId = (decoded.id || decoded.userId)?.toString();
    socket.role = decoded.role || "patient";

    if (!socket.userId) return next(new Error("Authentication error: bad token"));

    return next();
  } catch (error) {
    return next(new Error("Authentication error: invalid token"));
  }
};
