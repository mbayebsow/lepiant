import { createStore, createHook } from "react-sweet-state";
import { getQuotidiens } from "../services/data.service.js";

const Store = createStore({
  initialState: { quotidiens: null, openQModal: false, qIndex: 0, avarageColor: null },
  actions: {
    setQuotidiens:
      () =>
      async ({ setState }) => {
        const quotidiens = await getQuotidiens();
        setState({
          quotidiens,
        });
      },
    setOpenQModal:
      (openQModal) =>
      ({ setState }) => {
        setState({
          openQModal,
        });
      },
    setQIndex:
      (qIndex) =>
      ({ setState }) => {
        setState({
          qIndex,
        });
      },
    setAvarageColor:
      (avarageColor) =>
      ({ setState }) => {
        setState({
          avarageColor,
        });
      },
  },
});

export default function useQuotidien() {
  const dataStore = createHook(Store);
  const [
    { quotidiens, openQModal, qIndex, avarageColor },
    { setQuotidiens, setOpenQModal, setQIndex, setAvarageColor },
  ] = dataStore();

  return {
    setQuotidiens,
    setOpenQModal,
    setQIndex,
    avarageColor,
    quotidiens,
    openQModal,
    qIndex,
    setAvarageColor,
  };
}
