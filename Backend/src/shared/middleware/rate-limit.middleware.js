import rateLimit from "express-rate-limit";

export const authlimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: "draft-6",
  legacyHeaders: false,
  message: { success: false, message: "محاولات كثيرة، حاول بعد قليل" },
});

export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-6",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP requests. Please try again in 15 minutes.",
  },
});

export const normalLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  limit: 400,
  standardHeaders: "draft-6",
  legacyHeaders: false,
  message: { success: false, message: "محاولات كثيرة، حاول بعد قليل" },
});
