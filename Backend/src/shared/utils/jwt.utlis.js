import jwt from "jsonwebtoken";

export const signToken = (payload, expiresIn = "7d") =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

export const signAdminToken = () =>
  jwt.sign(
    process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD,
    process.env.JWT_SECRET,
  );

export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
