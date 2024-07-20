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
