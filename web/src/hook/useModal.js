import { createStore, createHook } from "react-sweet-state";

const Store = createStore({
  initialState: { openQuotidienModalIndex:null },
  actions: {
    setOpenQuotidienModalIndex:
      (bool) =>
        ({ setState }) => {
          setState({
            openQuotidienModalIndex: bool,
          });
        },
  },
});

export default function useModal() {
  const modalStore = createHook(Store);
  const [{ openQuotidienModalIndex }, { setOpenQuotidienModalIndex }] = modalStore();

  return {
    openQuotidienModalIndex,
    setOpenQuotidienModalIndex
  };
}
