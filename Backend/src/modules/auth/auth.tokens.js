import { signToken, signRefreshToken } from "../../shared/utils/jwt.utlis.js";

import { saveRefreshToken } from "../../infrastructure/redis/session.service.js";

export const issueTokens = async (user) => {
  const payload = {
    id: user._id,
    role: user.role,
  };

  const accessToken = signToken(payload);

  const refreshToken = signRefreshToken(payload);

  await saveRefreshToken(user._id, refreshToken);

  return {
    accessToken,
    refreshToken,
  };
};
