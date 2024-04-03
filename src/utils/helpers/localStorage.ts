import AsyncStorage from "@react-native-async-storage/async-storage";
// import ImageColors from "react-native-image-colors";

export const setDataOnStore = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getDataOnStore = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? value : null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const updateDataOnStore = async (key: string, value: string) => {
  try {
    await AsyncStorage.mergeItem(key, value);
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const removeDataOnStore = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
    return null;
  }
};
