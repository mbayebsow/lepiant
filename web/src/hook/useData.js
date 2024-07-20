import { createStore, createHook } from "react-sweet-state";
import { getQuotidiens, getRadios, getRevues, getTopNews } from "../services/data.service.js";

const Store = createStore({
  initialState: {
    quotidiens: null,
    revues: null,
    radios: null,
    topNews: null,
  },
  actions: {
    setQuotidiens:
      () =>
      async ({ setState }) => {
        const quotidiens = await getQuotidiens();
        setState({
          quotidiens,
        });
      },
    setRevues:
      () =>
      async ({ setState }) => {
        const revues = await getRevues();
        setState({
          revues,
        });
      },
    setRadios:
      () =>
      async ({ setState }) => {
        const radios = await getRadios();
        setState({
          radios,
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
  const [
    { quotidiens, revues, radios, topNews },
    { setTopNews, setQuotidiens, setRadios, setRevues },
  ] = dataStore();

  return {
    setQuotidiens,
    setRevues,
    setRadios,
    setTopNews,
    topNews,
    quotidiens,
    revues,
    radios,
  };
}
