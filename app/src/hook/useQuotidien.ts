import { createStore, createHook } from "react-sweet-state";
import { getQuotidiens } from "../services/quotidiens-service";
import { create } from "zustand";
import { Quotidien, StorageIterface } from "../utils/interfaces";

// interface QuotidienState {
//   addedTime: Date;
//   createdTime: Date;
//   files: Quotidien[];
// }

interface QuotidienStore {
  quotidiens: StorageIterface<Quotidien[]> | null;
  openQModal: boolean;
  qIndex: 0;
  avarageColor: string;
  // setQuotidiens: (quotidiens: StorageIterface<Quotidien>) => void
  initQuotidiens: (updateLocal?: boolean) => Promise<void>;
}

const useQuotidienStore = create<QuotidienStore>()((set) => ({
  quotidiens: null,
  openQModal: false,
  qIndex: 0,
  avarageColor: "",
  // setQuotidiens: (quotidiens: StorageIterface<Quotidien>) => set(() => ({ quotidiens })),
  initQuotidiens: async (updateLocal?: boolean) => {
    const quotidiens = await getQuotidiens(updateLocal);
    if (quotidiens) set(() => ({ quotidiens }));
  },
}));

export default useQuotidienStore;

// const Store = createStore({
//   initialState: { quotidiens: "", openQModal: false, qIndex: 0, avarageColor: "" },
//   actions: {
//     setQuotidiens:
//       (quotidiens) =>
//       async ({ setState }) => {
//         setState({
//           quotidiens,
//         });
//       },
//     setOpenQModal:
//       (openQModal) =>
//       ({ setState }) => {
//         setState({
//           openQModal,
//         });
//       },
//     setQIndex:
//       (qIndex) =>
//       ({ setState }) => {
//         setState({
//           qIndex,
//         });
//       },
//     setAvarageColor:
//       (avarageColor) =>
//       ({ setState }) => {
//         setState({
//           avarageColor,
//         });
//       },
//   },
// });

// export default function useQuotidien() {
//   const dataStore = createHook(Store);
//   const [
//     { quotidiens, openQModal, qIndex, avarageColor },
//     { setQuotidiens, setOpenQModal, setQIndex, setAvarageColor },
//   ] = dataStore();

//   const initQuotidiens = async () => {
//     const quotidiens = await getQuotidiens();
//     setQuotidiens(quotidiens);
//   };

//   return {
//     initQuotidiens,
//     setOpenQModal,
//     setQIndex,
//     avarageColor,
//     quotidiens,
//     openQModal,
//     qIndex,
//     setAvarageColor,
//   };
// }
