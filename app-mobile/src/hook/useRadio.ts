import { getRadios, getRadiosLiked, toggleLikeRadio } from "../services/radios-service";
import { Radio, RadioCategory, RadioLiked } from "../utils/interfaces";
import { create } from "zustand";

const initialCategory = [
  {
    id: 1,
    name: "Senegal",
    createdAt: new Date("2024-03-24 15:16:35.478"),
    updatedAt: new Date("2024-03-24 15:15:25.312"),
  },
  {
    id: 2,
    name: "Musique",
    createdAt: new Date("2024-03-24 15:16:35.478"),
    updatedAt: new Date("2024-03-24 15:15:42.055"),
  },
  {
    id: 3,
    name: "Informations",
    createdAt: new Date("2024-03-24 15:16:35.478"),
    updatedAt: new Date("2024-03-24 15:16:04.943"),
  },
  {
    id: 4,
    name: "Autres",
    createdAt: new Date("2024-03-24 15:16:35.478"),
    updatedAt: new Date("2024-03-24 15:16:46.504"),
  },
];

interface RadioStore {
  radios: Radio[];
  radiosLiked: Radio[];
  categories: RadioCategory[];
  categorySelect: number;
  setCategories: (id: number) => void;
  initRadios: (updateLocal?: boolean) => Promise<void>;
  toggleLike: (radiolId: number) => Promise<void>;
}

const useRadioStore = create<RadioStore>()((set, get) => ({
  radios: [],
  radiosLiked: [],
  categories: initialCategory,
  categorySelect: 1,
  setCategories: (id: number) => {
    set(() => ({
      categorySelect: id,
    }));
  },
  initRadios: async (updateLocal?: boolean) => {
    let RADIO: Radio[] = [];
    let RADIO_LIKED: Radio[] = [];

    const radios = await getRadios(updateLocal);
    if (radios) RADIO = radios;

    const radiosLiked = await getRadiosLiked();

    if (radiosLiked)
      RADIO_LIKED = RADIO.filter((el) => {
        return radiosLiked.some((f) => {
          return f.radioId === el.id;
        });
      });

    set(() => ({
      radios: RADIO,
      radiosLiked: RADIO_LIKED,
    }));
  },
  toggleLike: async (radiolId: number) => {
    let RADIO_LIKED: Radio[] = get().radiosLiked;

    const channelSubscribed = await toggleLikeRadio(radiolId);

    if (channelSubscribed) {
      const radiosLiked = await getRadiosLiked();

      if (radiosLiked)
        RADIO_LIKED = get().radios.filter((el) => {
          return radiosLiked.some((f) => {
            return f.radioId === el.id;
          });
        });

      if (radiosLiked)
        set(() => ({
          radiosLiked: RADIO_LIKED,
        }));
    }
  },
}));

export default useRadioStore;

// const Store = createStore({
//   initialState: {
//     radios: [],
//     categories: [],
//     categorySelect: "",
//     filterResult: [],
//     radiosLiked: [],
//   },
//   actions: {
//     setRadios:
//       (radios) =>
//       ({ setState }) => {
//         setState({
//           radios,
//         });
//       },
//     setCategories:
//       (categories) =>
//       ({ setState }) => {
//         setState({
//           categories,
//         });
//       },
//     setCategorySelect:
//       (categorySelect) =>
//       ({ setState }) => {
//         setState({
//           categorySelect,
//         });
//       },
//     setFilterResult:
//       (filterResult) =>
//       ({ setState }) => {
//         setState({
//           filterResult,
//         });
//       },
//     setRadiosLiked:
//       (radiosLiked) =>
//       ({ setState }) => {
//         setState({
//           radiosLiked,
//         });
//       },
//   },
// });

// export default function useRadio() {
//   const dataStore = createHook(Store);
//   const [
//     { radios, categories, categorySelect, filterResult, radiosLiked },
//     { setRadios, setCategories, setCategorySelect, setFilterResult, setRadiosLiked },
//   ] = dataStore();
//   const { setFiles } = usePlayer();

//   function filterByCategory(category) {
//     const filterRadio = radios.filter((item) => item.categories === category);
//     setCategorySelect(category);
//     setFilterResult(filterRadio);
//     setFiles(filterRadio);
//   }

//   async function initRadios() {
//     const radios = await getRadios();
//     const categories = radios.map((item) => item.categories);
//     const categoriesUniques = [...new Set(categories)];
//     setRadios(radios);
//     setCategories(categoriesUniques);

//     const currentLikes = await getDataOnStore("radio_liked");
//     if (currentLikes) setRadiosLiked(JSON.parse(currentLikes));
//   }

//   async function toggleRadioLike(id) {
//     const currentLikes = await getDataOnStore("radio_liked");
//     if (currentLikes) {
//       const likedArray = JSON.parse(currentLikes);
//       const ifExist = likedArray.findIndex((obj) => obj === id);

//       if (ifExist > -1) {
//         likedArray.splice(ifExist, 1);
//         await setDataOnStore("radio_liked", JSON.stringify(likedArray));
//         setRadiosLiked(likedArray);
//       } else {
//         await setDataOnStore("radio_liked", JSON.stringify([...likedArray, id]));
//         setRadiosLiked([...likedArray, id]);
//       }
//     } else {
//       await setDataOnStore("radio_liked", JSON.stringify([id]));
//       setRadiosLiked([id]);
//     }
//   }

//   return {
//     filterByCategory,
//     toggleRadioLike,
//     initRadios,
//     radiosLiked,
//     categories,
//     filterResult,
//     categorySelect,
//     radios,
//   };
// }
