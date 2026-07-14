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
  // Get active OTP
  const otpRecord = await otpRepository.findActiveOtp(userId, type);

  if (!otpRecord) {
    throw new ApiError("Invalid OTP", 403);
  }

  // Check max attempts
  if (otpRecord.attempts >= otpRecord.maxAttempts) {
    await otpRepository.deleteOne({ _id: otpRecord._id });

    throw new ApiError("OTP has been blocked. Please request a new OTP.", 403);
  }

  // Check expiration
  if (otpRecord.expiresAt < new Date()) {
    await otpRepository.deleteOne({ _id: otpRecord._id });

    throw new ApiError("OTP has expired", 400);
  }

  // Compare OTP
  const isValid = await bcrypt.compare(otp, otpRecord.code);

  if (!isValid) {
    const updatedOtp = await otpRepository.incrementAttempts(otpRecord._id);

    const remainingAttempts = updatedOtp.maxAttempts - updatedOtp.attempts;

    if (updatedOtp.attempts >= updatedOtp.maxAttempts) {
      await otpRepository.deleteOne({ _id: updatedOtp._id });

      throw new ApiError(
        "OTP has been blocked. Please request a new OTP.",
        403,
      );
    }

    throw new ApiError("Invalid OTP", 400);
  }

  // Success
  await otpRepository.markAsUsed(otpRecord._id);

  return otpRecord;
};

export { createOtp, verifyOtp };
