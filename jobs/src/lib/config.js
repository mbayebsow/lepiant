import dotenv from "dotenv";
dotenv.config();

export default {
  API_HOST: process.env.API_HOST,
  API_TOKEN: process.env.API_TOKEN,
  GNEWS_API_KEY: process.env.GNEWS_API_KEY,
  IMAGEKIT_ENDPOINT: process.env.IMAGEKIT_ENDPOINT,
  IMAGEKIT_KEY: process.env.IMAGEKIT_KEY,
  NODE_ENV: process.env.NODE_ENV,
  CRON_USERNAME: process.env.CRON_USERNAME,
  CRON_PASSWORD: process.env.CRON_PASSWORD,
  REDIS_DB: process.env.REDIS_DB,
  BOT_TOKEN: process.env.BOT_TOKEN,
  TARGET_CHAT_ID: process.env.TARGET_CHAT_ID,
};
