import AsyncStorage from "@react-native-async-storage/async-storage";
// import ImageColors from "react-native-image-colors";

export const setDataOnStore = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getDataOnStore = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? value : null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const updateDataOnStore = async (key, value) => {
  try {
    await AsyncStorage.mergeItem(key, value);
  } catch (e) {
    console.log(e);
    return null
  }
};

export const removeDataOnStore = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
    return null
  }

};

export const ColorExtractor = async (imageUrl) => {
  try {

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "image": imageUrl })
    };

    const color = await fetch('https://lepiant-api.cyclic.app/events/averageColor', options)
      .then(response => response.json())

    return color;
  } catch (e) {
    console.log(e);
    return null;
  }
};
