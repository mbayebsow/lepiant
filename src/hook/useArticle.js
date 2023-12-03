import { createStore, createHook } from "react-sweet-state";
import { fetchCategories, fetchArticles, fetchRandomArticles } from "../services/article.service";
import useSession from "./useSession";

const Store = createStore({
  initialState: {
    articles: null,
    categories: null,
    categoryIndex: null,
    openArticleViewerDetails: null,
    loading: true,
  },
  actions: {
    setCategories:
      () =>
      async ({ setState }) => {
        const categories = await fetchCategories();
        setState({
          categories,
        });
      },
    setArticles:
      (articles) =>
      ({ setState }) => {
        setState({
          articles,
        });
      },
    setCategoryIndex:
      (categoryIndex) =>
      ({ setState }) => {
        setState({
          categoryIndex,
        });
      },
    setOpenArticleViewerDetails:
      (openArticleViewerDetails) =>
      ({ setState }) => {
        setState({
          openArticleViewerDetails,
        });
      },
    setLoading:
      (loading) =>
      ({ setState }) => {
        setState({
          loading,
        });
      },
  },
});

export default function useArticle() {
  const { userData } = useSession();
  const dataStore = createHook(Store);
  const [
    { articles, categories, categoryIndex, openArticleViewerDetails, loading },
    { setArticles, setCategoryIndex, setCategories, setOpenArticleViewerDetails, setLoading },
  ] = dataStore();

  const getArticlesByCategory = async (category) => {
    setLoading(true);
    setCategoryIndex(category);
    const articles = await fetchArticles(userData?.id, category);
    setArticles(articles);
    setLoading(false);
  };

  const getRandomArticles = async () => {
    const articles = await fetchRandomArticles();
    setArticles(articles);
    setLoading(false);
  };

  return {
    loading,
    articles,
    categories,
    categoryIndex,
    openArticleViewerDetails,
    setCategories,
    getArticlesByCategory,
    getRandomArticles,
    setOpenArticleViewerDetails,
  };
}
