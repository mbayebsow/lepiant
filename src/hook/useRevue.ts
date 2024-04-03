import { createHook, createStore } from "react-sweet-state";
import { getRevues } from "../services/revues-service";
import { create } from "zustand";
import { Revues, StorageIterface } from "../utils/interfaces";

interface RevueStore {
  revues: StorageIterface<Revues[]> | null;
  initRevues: (updateLocal?: boolean) => Promise<void>;
}

const useRevueStore = create<RevueStore>()((set, get) => ({
  revues: null,
  initRevues: async (updateLocal?: boolean) => {
    const revues = await getRevues(updateLocal);
    if (revues)
      set(() => ({
        revues,
      }));
  },
}));

export default useRevueStore;

// const Store = createStore({
//   initialState: {
//     revues: null,
//   },
//   actions: {
//     setRevues:
//       (revues) =>
//       async ({ setState }) => {
//         setState({
//           revues,
//         });
//       },
//   },
// });

// export default function useRevue() {
//   const dataStore = createHook(Store);
//   const [{ revues }, { setRevues }] = dataStore();

//   const initRevues = async () => {
//     const revues = await getRevues();
//     setRevues(revues);
//   };

//   return {
//     initRevues,
//     revues,
//   };
// }
