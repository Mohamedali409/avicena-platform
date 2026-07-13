import client from "./redis.client.js";
import { cacheHits, cacheMisses } from "../monitoring/metrics.service.js";

export const getCache = async (key) => {
  try {
    const data = await client.get(key);
    if (data) {
      cacheHits.inc();
      return JSON.parse(data);
    }
    cacheMisses.inc();
    return null;
  } catch {
    cacheMisses.inc();
    return null;
  }
};

export const setCache = async (key, value, ttl = 120) => {
  try {
    await client.setEx(key, ttl, JSON.stringify(value));
  } catch (err) {
    console.error("Cache set error:", err.message);
  }
};

export const deleteCache = async (...keys) => {
  try {
    for (const key of keys) await client.del(key);
  } catch (err) {
    console.error("Cache delete error:", err.message);
  }
};

export const invalidatePattern = async (pattern) => {
  try {
    let cursor = 0;
    do {
      const result = await client.scan(cursor, { MATCH: pattern, COUNT: 100 });
      cursor = result.cursor;
      if (result.keys.length) await client.del(result.keys);
    } while (cursor !== 0);
  } catch (err) {
    console.error("Cache invalidate error:", err.message);
  }
};
