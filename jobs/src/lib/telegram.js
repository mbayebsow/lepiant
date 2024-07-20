import TelegramBot from "node-telegram-bot-api";
import config from "./config.js";

const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });

export const sendMessage = async (message) => await bot.sendMessage(config.TARGET_CHAT_ID, message);
