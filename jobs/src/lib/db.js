import { createClient } from "redis";
import config from "./config.js";

const redis = await createClient({ url: config.REDIS_DB })
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect(() => console.log("DB connected"));

export const addValue = async (key, value, expire) => {
  const data = await redis.set(key, value);
  redis.expire(key, expire ? expire : 604800);
  return data;
};
export const getValue = async (key) => {
  return await redis.get(key);
};

export const addJsonValue = async (key, value, expire) => {
  const data = await redis.hSet(key, value);
  redis.expire(key, expire ? expire : 604800);
  return data;
};

export const getJsonValue = async (key) => {
  return await redis.hGetAll(key);
};

export const pushValue = async (key, value, expire) => {
  const data = await redis.lPush(key, value);
  redis.expire(key, expire ? expire : 604800);
  return data;
};

export const rangeValue = async (key) => {
  return await redis.lRange(key, 0, -1);
};
