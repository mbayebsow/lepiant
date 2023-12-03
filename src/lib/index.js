import AsyncStorage from "@react-native-async-storage/async-storage";
// import ImageColors from "react-native-image-colors";

export const setDataOnStore = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};

export const getDataOnStore = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? value : null;
  } catch (e) {
    return null;
  }
};

export const updateDataOnStore = async (key, value) => {
  try {
    await AsyncStorage.mergeItem(key, value);
  } catch (e) {
    // saving error
  }
};

export const removeDataOnStore = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // remove error
  }

  console.log("Done.");
};

export const ColorExtractor = async (imageUrl) => {
  try {
    const options = { method: "GET" };

    const color = await fetch(
      `https://656260d9ceba4e83c951.appwrite.global/?image=${imageUrl}`,
      options
    ).then((response) => response.json());

    return color;
  } catch (error) {
    return null;
    console.error(error);
  }
};
