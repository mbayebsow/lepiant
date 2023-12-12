import { createHook, createStore } from "react-sweet-state";
import { setDataOnStore, getDataOnStore } from "../lib";
import { getRadios } from "../services/data.service.js";
import usePlayer from "./usePlayer";

const Store = createStore({
  initialState: {
    radios: [],
    categories: [],
    categorySelect: "",
    filterResult: [],
    radiosLiked: [],
  },
  actions: {
    setRadios:
      (radios) =>
      ({ setState }) => {
        setState({
          radios,
        });
      },
    setCategories:
      (categories) =>
      ({ setState }) => {
        setState({
          categories,
        });
      },
    setCategorySelect:
      (categorySelect) =>
      ({ setState }) => {
        setState({
          categorySelect,
        });
      },
    setFilterResult:
      (filterResult) =>
      ({ setState }) => {
        setState({
          filterResult,
        });
      },
    setRadiosLiked:
      (radiosLiked) =>
      ({ setState }) => {
        setState({
          radiosLiked,
        });
      },
  },
});

export default function useRadio() {
  const dataStore = createHook(Store);
  const [
    { radios, categories, categorySelect, filterResult, radiosLiked },
    { setRadios, setCategories, setCategorySelect, setFilterResult, setRadiosLiked },
  ] = dataStore();
  const { setFiles } = usePlayer();

  function filterByCategory(category) {
    const filterRadio = radios.filter((item) => item.categories === category);
    setCategorySelect(category);
    setFilterResult(filterRadio);
    setFiles(filterRadio);
  }

  async function initRadio() {
    const radios = await getRadios();
    const categories = radios.map((item) => item.categories);
    const categoriesUniques = [...new Set(categories)];
    setRadios(radios);
    setCategories(categoriesUniques);

    const currentLikes = await getDataOnStore("radio_liked");
    if (currentLikes) setRadiosLiked(JSON.parse(currentLikes));
  }

  async function toggleRadioLike(id) {
    const currentLikes = await getDataOnStore("radio_liked");
    if (currentLikes) {
      const likedArray = JSON.parse(currentLikes);
      const ifExist = likedArray.findIndex((obj) => obj === id);

      if (ifExist > -1) {
        likedArray.splice(ifExist, 1);
        await setDataOnStore("radio_liked", JSON.stringify(likedArray));
        setRadiosLiked(likedArray);
      } else {
        await setDataOnStore("radio_liked", JSON.stringify([...likedArray, id]));
        setRadiosLiked([...likedArray, id]);
      }
    } else {
      await setDataOnStore("radio_liked", JSON.stringify([id]));
      setRadiosLiked([id]);
    }
  }

  return {
    filterByCategory,
    toggleRadioLike,
    initRadio,
    radiosLiked,
    categories,
    filterResult,
    categorySelect,
    radios,
  };
}
