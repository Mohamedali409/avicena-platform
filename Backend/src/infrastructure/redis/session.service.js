import client from "./redis.client.js";

const REFRESH_TTL = 7 * 24 * 60 * 60;

const saveRefreshToken = async (userId, token) => {
  await client.setEx(`refresh:${userId}`, REFRESH_TTL, token);
};

const getRefreshToken = async (userId) => {
  return client.get(`refresh:${userId}`);
};

const deleteRefreshToken = async (userId) => {
  await client.del(`refresh:${userId}`);
};

export { saveRefreshToken, getRefreshToken, deleteRefreshToken };
