import client from "./redis.client.js";

/**
 * Get cached value. Returns parsed object or null.
 */
export const getCache = async (key) => {
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

/**
 * Set cache with TTL in seconds (default 2 min).
 */
export const setCache = async (key, value, ttl = 120) => {
  try {
    await client.setEx(key, ttl, JSON.stringify(value));
  } catch (err) {
    console.error("Cache set error:", err.message);
  }
};

/**
 * Delete one or more cache keys (supports wildcard pattern via scan).
 */
export const deleteCache = async (...keys) => {
  try {
    for (const key of keys) {
      await client.del(key);
    }
  } catch (err) {
    console.error("Cache delete error:", err.message);
  }
};

/**
 * Invalidate all keys matching a pattern e.g. "user-*"
 */
export const invalidatePattern = async (pattern) => {
  try {
    let cursor = 0;
    do {
      const result = await client.scan(cursor, { MATCH: pattern, COUNT: 100 });
      cursor = result.cursor;
      if (result.keys.length) {
        await client.del(result.keys);
      }
    } while (cursor !== 0);
  } catch (err) {
    console.error("Cache invalidate error:", err.message);
  }
};
