import { createStore, createHook } from "react-sweet-state";
import { getCategories, getArticles, getRandomArticles } from "../services/article.service";
import useSession from "./useSession";

const Store = createStore({
  initialState: {
    articles: null,
    categiries: null,
    categorieIndex: null,
    openArticleViewer: false,
    openArticleViewerDetails: null,
    loading: true,
  },
  actions: {
    setCategiries:
      () =>
      async ({ setState }) => {
        const categiries = await getCategories();
        setState({
          categiries,
        });
      },
    setArticles:
      (articles) =>
      async ({ setState }) => {
        setState({
          articles,
        });
      },
    setCategorieIndex:
      (categorieIndex) =>
      async ({ setState }) => {
        setState({
          categorieIndex,
        });
      },
    setOpenArticleViewer:
      (openArticleViewer) =>
      async ({ setState }) => {
        setState({
          openArticleViewer,
        });
      },
    setOpenArticleViewerDetails:
      (openArticleViewerDetails) =>
      async ({ setState }) => {
        setState({
          openArticleViewerDetails,
        });
      },
    setLoading:
      (loading) =>
      async ({ setState }) => {
        setState({
          loading,
        });
      },
  },
});

export default function useArticle() {
  const { isLogin } = useSession();
  const dataStore = createHook(Store);
  const [
    { articles, categiries, categorieIndex, openArticleViewer, openArticleViewerDetails, loading },
    {
      setArticles,
      setCategorieIndex,
      setCategiries,
      setOpenArticleViewer,
      setOpenArticleViewerDetails,
      setLoading,
    },
  ] = dataStore();

  const getArticlesByCategorie = async (categorie) => {
    setLoading(true);
    if (isLogin) {
      setCategorieIndex(categorie ? categorie : "7c2471e9-9f9f-4919-b4dc-502031e38d14");
      const articles = await getArticles(categorie ? categorie : "7c2471e9-9f9f-4919-b4dc-502031e38d14");
      setArticles(articles);
      setLoading(false);
    } else {
      const articles = await getRandomArticles();
      setArticles(articles);
      setLoading(false);
    }
  };

  return {
    loading,
    articles,
    categiries,
    categorieIndex,
    openArticleViewer,
    openArticleViewerDetails,
    setCategiries,
    setOpenArticleViewer,
    getArticlesByCategorie,
    setOpenArticleViewerDetails,
  };
}
