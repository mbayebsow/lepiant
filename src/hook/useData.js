import { createHook, createStore } from "react-sweet-state";
import { getRadios, getRevues, getTopNews } from "../services/data.service.js";

const Store = createStore({
  initialState: {
    revues: null,
    topNews: null,
  },
  actions: {
    setRevues:
      () =>
      async ({ setState }) => {
        const revues = await getRevues();
        setState({
          revues,
        });
      },
    setTopNews:
      () =>
      async ({ setState }) => {
        const topNews = await getTopNews();
        setState({
          topNews,
        });
      },
  },
});

export default function useData() {
  const dataStore = createHook(Store);
  const [{ revues, topNews }, { setTopNews, setRevues }] = dataStore();

  return {
    setRevues,
    setTopNews,
    topNews,
    revues,
  };
}
