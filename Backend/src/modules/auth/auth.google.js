// this file responsable for verify google token
/**
 * Verify Google ID Token.
 *
 * @param {string} idToken
 * @returns {{
 *   googleId: string,
 *   email: string,
 *   name: string,
 *   image: string,
 *   emailVerified: boolean
 * }}
 */
import { OAuth2Client } from "google-auth-library";
import ApiError from "../../shared/utils/ApiError.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (idToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email_verified) {
      throw new ApiError("Google email is not verified", 401);
    }

    return {
      googleId: payload?.sub,
      email: payload?.email,
      name: payload?.name,
      image: payload?.picture,
      emailVerified: payload?.email_verified,
    };
  } catch (error) {
    console.error(error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(error.message, 401);
  }
};

export { verifyGoogleToken };
