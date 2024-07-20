import quotidienScrapper from "./quotidiens-scrapper.js";
import { sendMessage } from "../../lib/telegram.js";

export default async function quotidienJob() {
  let responseText = "";

  const QUOTIDIENS = await quotidienScrapper();

  QUOTIDIENS.forEach((item) => {
    const message = item.message;
    responseText += `${message}\n`;
    responseText += "\n";
  });

  await sendMessage("RESUMER QUOTIDIEN JOB 🚩");
  await sendMessage(responseText);
  //await pushValue(`${config.AGENT}:SUMMARY`, responseText);
  return responseText;
}
