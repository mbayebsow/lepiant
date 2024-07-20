import { articlesFetcher } from "./articles-fetcher.js";
import { topNewsFetcher } from "./topNewsFetcher.js";
import { sendMessage } from "../../lib/telegram.js";
// import { pushValue } from "./lib/db.js";

export default async function articleJob() {
  let responseText = "";

  // const TOPNEWS = await topNewsFetcher(); \\TODO
  const ARTICLES = await articlesFetcher();

  const response = ARTICLES; //TOPNEWS.concat(ARTICLES);

  response.forEach((item) => {
    // const date = item.date ? new Date(item.date).toLocaleString() : "";
    const message = item.message;

    if (message.totalArticle) {
      responseText += `🟣 SUMMARY\n`;
      responseText += `Total Articles - ${message.totalArticle}, Saved - ${message.totalSaved}, Skipped - ${message.totalSkiped}, Errors - ${message.totalError}\n`;

      if (message.errorList.length === 0) return;
      responseText += "\n";

      responseText += `🔴 ERROR LIST\n`;
      responseText += message.errorList
        .map((error) => `-------\n LINK: ${error.link}\n ERROR: ${error.error}\n`)
        .toString();
      return;
    }

    responseText += `${message}\n`;
    responseText += "\n";
  });
  await sendMessage("RESUMER ARTICLE JOB 🚩");
  await sendMessage(responseText);
  //await pushValue(`${config.AGENT}:SUMMARY`, responseText);
  return responseText;
}
