import { Preferences } from "@capacitor/preferences";
import { average } from "color.js";

export const setDataOnStore = async (key, value) => {
  await Preferences.set({
    key,
    value,
  });
};

export const getDataOnStore = async (key) => {
  const { value } = await Preferences.get({ key });
  //console.log(value);
  return value;
};

export const removeDataOnStore = async (key) => {
  const rv = await Preferences.remove({ key });
  console.log(rv);
};

// Avarage color
export const getAverageColor = async (image) => {
  const color = await average(image)
    .then((color) => `rgba(${color.join(",")})`)
    .catch((e) => null);

  if (color) return color;
  return null;
};
