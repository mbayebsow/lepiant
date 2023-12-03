import { createHook, createStore } from "react-sweet-state";
import { getRadios } from "../services/data.service.js";

const Store = createStore({
  initialState: {
    radios: null,
  },
  actions: {
    setRadios:
      () =>
      async ({ setState }) => {
        const radios = await getRadios();
        setState({
          radios,
        });
      },
  },
});

export default function useRadio() {
  const dataStore = createHook(Store);
  const [{ radios }, { setRadios }] = dataStore();

  return {
    setRadios,
    radios,
  };
}
