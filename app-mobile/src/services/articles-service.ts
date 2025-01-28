import config from "../utils/constant/config";
import { fetcher } from "../utils/helpers/fetcher";
import { Article, ArticleCategory, ArticleContent, ArticleSaved } from "../utils/interfaces";

export const fetchCategories = async (updateLocal?: boolean) => {
  const categories = await fetcher<ArticleCategory[]>(`${config.API_ENDPOINT}/articles/categories`);
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

export const fetchTopNews = async () => {
  const topNews = await fetcher<Article[]>(`${config.API_ENDPOINT}/articles/live`);
  return topNews;
};
