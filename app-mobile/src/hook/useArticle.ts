import { create } from "zustand";
import {
  fetchCategories,
  fetchArticles,
  fetchSavedArticles,
  toggleSaveArticle,
  fetchTopNews,
} from "../services/articles-service";
import { Article, ArticleCategory, ArticleSaved } from "../utils/interfaces";

interface ArticleStore {
  articles: Article[];
  topNews: Article[];
  categories: ArticleCategory[];
  savedArticles: ArticleSaved[];
  categoryActiveIndex: number;
  loading: boolean;
  textZoom: number;
  initArticles: (updateLocal?: boolean) => Promise<void>;
  getArticlesByCategory: (id: number) => Promise<void>;
  toggleSaveArticle: (articleId: number) => Promise<void>;
  getCategory: (categoryId: number) => Promise<ArticleCategory | undefined>;
}

const useArticleStore = create<ArticleStore>()((set, get) => ({
  articles: [],
  topNews: [],
  categories: [],
  savedArticles: [],
  categoryActiveIndex: 0,
  loading: true,
  textZoom: 1,
  initArticles: async (updateLocal?: boolean) => {
    set(() => ({ loading: true, categoryActiveIndex: 0 }));
    const articles = await fetchArticles();
    const categories = await fetchCategories(updateLocal);
    const savedArticles = await fetchSavedArticles(updateLocal);
    const topNews = await fetchTopNews();

    if (categories) set(() => ({ categories: [{ id: 0, name: "Tout" }].concat(categories) }));
    if (articles) set(() => ({ articles, loading: false }));
    if (savedArticles) set(() => ({ savedArticles }));
    if (topNews) set(() => ({ topNews }));
  },
  getArticlesByCategory: async (id: number) => {
    set(() => ({ loading: true, categoryActiveIndex: id }));
    const articles = await fetchArticles(id);

    if (articles) {
      set(() => ({ articles, loading: false }));
    }
  },
  toggleSaveArticle: async (articleId: number) => {
    const savedArticles = await toggleSaveArticle(articleId);
    // console.log(savedArticles);

    if (savedArticles) {
      const savedArticles = await fetchSavedArticles(true);
      if (savedArticles) set(() => ({ savedArticles }));
    }
  },
  getCategory: async (id: number) => {
    const details = get().categories.find((obj) => obj.id === id);
    return details;
  },
}));

export default useArticleStore;

// const Store = createStore({
//   initialState: {
//     articles: [],
//     categories: [],
//     categoryIndex: 1,
//     openArticleViewerDetails: null,
//     loading: true,
//     textZoom: 1,
//   },
//   actions: {
//     setCategories:
//       (categories) =>
//       async ({ setState }) => {
//         setState({
//           categories,
//         });
//       },
//     setArticles:
//       (articles) =>
//       ({ setState }) => {
//         setState({
//           articles,
//         });
//       },
//     setCategoryIndex:
//       (categoryIndex) =>
//       ({ setState }) => {
//         setState({
//           categoryIndex,
//         });
//       },
//     setOpenArticleViewerDetails:
//       (openArticleViewerDetails) =>
//       ({ setState }) => {
//         setState({
//           openArticleViewerDetails,
//         });
//       },
//     setLoading:
//       (loading) =>
//       ({ setState }) => {
//         setState({
//           loading,
//         });
//       },
//     setTextZoom:
//       (textZoom) =>
//       ({ setState }) => {
//         setState({
//           textZoom,
//         });
//       },
//   },
// });

// export default function useArticle() {
//   const { userData } = useSession();
//   const dataStore = createHook(Store);
//   const [
//     { articles, categories, categoryIndex, openArticleViewerDetails, loading, textZoom },
//     {
//       setArticles,
//       setCategoryIndex,
//       setCategories,
//       setOpenArticleViewerDetails,
//       setLoading,
//       setTextZoom,
//     },
//   ] = dataStore();

//   const initArticles = async (category = 1) => {
//     setLoading(true);
//     setCategoryIndex(category);
//     const articles = await fetchArticles(category);
//     const categories = await fetchCategories();
//     setArticles(articles);
//     setCategories(categories);
//     setLoading(false);
//   };

//   return {
//     loading,
//     articles,
//     categories,
//     categoryIndex,
//     openArticleViewerDetails,
//     textZoom,
//     setTextZoom,
//     setCategories,
//     initArticles,
//     setOpenArticleViewerDetails,
//   };
// }
