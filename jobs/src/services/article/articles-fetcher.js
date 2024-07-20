import { pushValue, rangeValue } from "../../lib/db.js";
import config from "../../lib/config.js";

const sleep = (m) => new Promise((r) => setTimeout(r, m));

let LOGS = [];
let STEP;

const getSources = async () => {
  const options = {
    method: "GET",
    headers: {
      Authorization: config.API_TOKEN,
    },
  };

  try {
    const sources = await fetch(`${config.API_HOST}/sources`, options)
      .then((response) => response.json())
      .catch((err) => console.error(err));

    return sources;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const postArticles = async (article) => {
  const body = JSON.stringify(article);

  const options = {
    method: "POST",
    headers: {
      Authorization: config.API_TOKEN,
      "Content-Type": "application/json",
    },
    body,
  };

  return await fetch(`${config.API_HOST}/articles/many`, options).then((response) =>
    response.json()
  );
};

const handlePostArticles = async (articlesShouldPost) => {
  let totalArticle = articlesShouldPost.length;
  let totalSaved = 0;
  let totalError = 0;
  let totalSkipped = 0;
  let currentArticle = 0;
  let errorList = [];
  let allArticles = [];

  STEP = "🟠 Try search image articles";
  console.log(STEP);
  LOGS.push({ date: new Date(), message: STEP });

  const articlesPosted = await rangeValue(`ARTICLES_POSTED`);

  for (const article of articlesShouldPost) {
    ++currentArticle;
    const ifPosted = articlesPosted
      ? articlesPosted.find((title) => title === article.title)
      : false;

    if (ifPosted) {
      ++totalSkipped;
      STEP = `🔵 ${currentArticle} / ${totalArticle} - Skipped`;
      console.log(STEP);
    } else {
      await sleep(100);

      try {
        const articleImage = await fetch(
          `https://lepiant-image-link.deno.dev?url=${article.link}`
        ).then((response) => response.json());

        allArticles.push(
          articleImage?.success ? { ...article, image: articleImage.image } : article
        );
      } catch (error) {
        console.log(error);
        allArticles.push(article);
      }

      ++totalSaved;
      STEP = `🟢 ${currentArticle} / ${totalArticle}`;
      console.log(STEP);

      await pushValue(`ARTICLES_POSTED`, article.title);
      // const post = await postArticles(
      //   articleImage?.success ? { ...article, image: articleImage.image } : article
      // );
    }
  }

  try {
    STEP = `🟠 Try to save all articles`;
    LOGS.push(STEP);
    console.log(STEP);
    const artilces = await postArticles(allArticles);
    console.log(artilces);
  } catch (error) {
    STEP = `🔴 error to save articles on db`;
    LOGS.push(STEP);
    console.log(STEP);
  }

  STEP = "🟢 Finish to post articles";
  console.log(STEP);
  LOGS.push({ date: new Date(), message: STEP });

  const summary = {
    totalArticle,
    totalSaved,
    totalSkipped,
    totalError,
    errorList,
  };

  LOGS.push({ date: new Date(), message: summary });
};

export const articlesFetcher = async () => {
  STEP = "🟠 Try to get all sources";
  console.log(STEP);
  LOGS.push({ date: new Date(), message: STEP });

  const sources = await getSources();

  if (sources) {
    STEP = "🟢 All sources are getting successfully";
    console.log(STEP);
    LOGS.push({ date: new Date(), message: STEP });
  } else {
    STEP = "🔴 Error to getting sources";
    console.log(STEP);
    LOGS.push({ date: new Date(), message: STEP });
    return;
  }

  let ARTICLES = [];

  STEP = "🟠 Try to get all articles from sources";
  console.log(STEP);
  LOGS.push({ date: new Date(), message: STEP });

  const articlesParser = sources.map(async (source) => {
    try {
      const data = await fetch(`https://parser-lepiant.deno.dev/?url=${source.url}`)
        .then((response) => response.json())
        .catch(() => null);

      if (data) {
        data.entries.map(async (article) => {
          if (article?.title)
            ARTICLES.push({
              channelId: source.channelId,
              categorieId: source.categorieId,
              title: article.title,
              link: article.link,
              published: article.published,
              description: article.description,
            });
        });
      }
    } catch (error) {
      console.log("ERROR ON: ", source.url, error);
    }
  });

  await Promise.all(articlesParser);
  STEP = "🟢 All artilces from sources are getting successfully";
  console.log(STEP);
  LOGS.push({ date: new Date(), message: STEP });
  await handlePostArticles(ARTICLES);
  const CURRENT_LOGS = LOGS;
  LOGS = [];
  return CURRENT_LOGS;
};
