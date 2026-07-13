import bcrypt from "bcrypt";
import * as otpRepository from "./otp.repository.js";
import { generateOtp } from "../../shared/utils/otp.js";
import { OTP_EXPIRES_IN_MINUTES, OTP_SALT_ROUNDS } from "./otp.constants.js";
import ApiError from "../../shared/utils/ApiError.js";

const createOtp = async (userId, type) => {
  // remove any old otp
  await otpRepository.deleteMany({
    user: userId,
    type,
  });

  // generation otp
  const otp = generateOtp();

  // hash otp
  const hashedOtp = await bcrypt.hash(otp, OTP_SALT_ROUNDS);

  // expiration data
  const expiresAt = new Date(Date.now() + OTP_EXPIRES_IN_MINUTES * 60 * 1000);

  // create and save otp
  await otpRepository.create({
    user: userId,
    code: hashedOtp,
    type,
    expiresAt,
  });

  // return otp to controller
  return { otp, expiresAt };
};

const verifyOtp = async (userId, type, otp) => {
  // get active OTP
  const otpRecord = await otpRepository.findActiveOtp(userId, type);

  if (!otpRecord) throw new ApiError("Invalid OTP", 403);

  // check expiration
  if (otpRecord.attempts >= 5) {
    throw new ApiError("OTP has been blocked. Please request a new OTP.", 403);
  }

  if (otpRecord.expiresAt < new Date()) throw new ApiError("OTP has expired");

  // Compare OTP
  const isValid = await bcrypt.compare(otp, otpRecord.code);

  if (!isValid) throw new ApiError("Invalid OTP", 403);

  await otpRepository.markAsUsed(otpRecord._id);

  return otpRecord;
};
export { createOtp, verifyOtp };
