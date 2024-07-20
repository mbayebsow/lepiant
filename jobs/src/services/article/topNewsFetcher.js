import { getToken } from "../../lib/getToken.js";
import config from "../../lib/config.js";

let LOGS = [];
let STEP;

let targetRoute = `${config.CDN_HOST}/top-news/2f9affbd-e79d-45c0-8279-0d8e72860d7f`;

const BEARER_TOKEN = async () => {
  const TOKEN = await getToken();
  return `Bearer ${TOKEN}`;
};

async function getNewsArticles() {
  return await fetch(
    `https://gnews.io/api/v4/top-headlines?apikey=${config.GNEWS_API_KEY}&lang=fr&category=world`,
    { method: "GET" }
  )
    .then((response) => response.json())
    .then((response) => response.articles)
    .catch((err) => console.error(err));
}

export async function topNewsFetcher() {
  STEP = "🟠 Try to get topNews";
  console.log(STEP);
  LOGS.push({ date: new Date(), message: STEP });

  const articles = await getNewsArticles();

  if (articles) {
    STEP = "🟢 All topNews are getting successfully";
    console.log(STEP);
    LOGS.push({ date: new Date(), message: STEP });
  } else {
    STEP = "🔴 Error to getting topNews";
    console.log(STEP);
    LOGS.push({ date: new Date(), message: STEP });
    return;
  }

  const normalizArticles = {
    articles: {
      iv: articles,
    },
  };

  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: await BEARER_TOKEN(),
    },
    body: JSON.stringify(normalizArticles),
  };

  STEP = "🟠 Try to post topNews to cdn";
  console.log(STEP);
  LOGS.push({ date: new Date(), message: STEP });

  try {
    const update = await fetch(targetRoute, options).then((response) => response.json());

    if (update.lastModified) {
      STEP = "🟢 All topNews are posting";
      console.log(STEP);
      LOGS.push({ date: new Date(), message: STEP });
    } else {
      STEP = "🔴 Error to post topNews";
      console.log(STEP);
      LOGS.push({ date: new Date(), message: STEP });
    }
  } catch (error) {
    console.log(error);
  }

  const CURRENT_LOGS = LOGS;
  LOGS = [];
  return CURRENT_LOGS;
}
