import moment from "moment";
import config from "../utils/constant/config";
import { fetcher } from "../utils/helpers/fetcher";
import { getDataOnStore, setDataOnStore } from "../utils/helpers/localStorage";
import {
  Article,
  ArticleCategory,
  ArticleContent,
  ArticleSaved,
  TopNews,
} from "../utils/interfaces";

export const fetchCategories = async (updateLocal?: boolean) => {
  const categories = await fetcher<ArticleCategory[]>(`${config.API_ENDPOINT}/article-categories`);
  return categories;
};

export const fetchArticles = async (category?: number | null, channel?: number | null) => {
  let filter = "page=1&limit=10";

  if (category) filter += `&categorie=${category}`;
  if (channel) filter += `&channel=${channel}`;

  const articles = await fetcher<Article[]>(`${config.API_ENDPOINT}/articles?${filter}`);

  return articles;
};

export const getArticle = async (id: number) => {
  const article = await fetcher<ArticleContent>(`${config.API_ENDPOINT}/articles/${id}`);
  return article;
};

export const fetchSavedArticles = async (updateLocal?: boolean) => {
  const savedArticles = await fetcher<ArticleSaved[]>(`${config.API_ENDPOINT}/articles/saved`);
  return savedArticles;
};

export const toggleSaveArticle = async (articleId: number) => {
  const response = await fetcher<{ create?: boolean; delete?: boolean; message: string }>(
    `${config.API_ENDPOINT}/articles/saved/${articleId}`,
    "POST"
  );
  return response;
};

export const fetchTopNews = async (): Promise<TopNews[] | false> => {
  let response: TopNews[] | false = [];

  const dataOnStore = await getDataOnStore("topNews");

  if (dataOnStore) {
    const parsedData = JSON.parse(dataOnStore);
    const diff = moment().diff(parsedData.addedTime, "minutes");

    if (diff >= 120 || diff === 0) {
      const topNews = await fetcher<TopNews[]>(`${config.API_ENDPOINT}/articles/live`);
      response = topNews;
    } else {
      return parsedData;
    }
  } else {
    const topNews = await fetcher<TopNews[]>(`${config.API_ENDPOINT}/articles/live`);
    response = topNews;
  }

  await setDataOnStore("topNews", JSON.stringify(response));
  return response;
};
