import { signToken, signRefreshToken } from "../../shared/utils/jwt.utlis.js";

import { saveRefreshToken } from "../../infrastructure/redis/session.service.js";

export const issueTokens = async (user) => {
  // Accept either a Mongoose user (`_id`) or a plain `{ id }` payload — the
  // unified login passes `{ id: user._id, role }`, so reading only `_id` here
  // produced a token with NO id (breaking authGuard + socket auth downstream).
  const id = user._id ?? user.id;
  const payload = {
    id,
    role: user.role,
  };

  const accessToken = signToken(payload);

  const refreshToken = signRefreshToken(payload);

  await saveRefreshToken(id, refreshToken);

  return {
    accessToken,
    refreshToken,
  };
};
