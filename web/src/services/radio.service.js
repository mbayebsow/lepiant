import { setDataOnStore, getDataOnStore } from "../lib";

export async function ifLikedRadio(id) {
  const currentLikes = await getDataOnStore("radio_liked");
  if (currentLikes) {
    const likedArray = JSON.parse(currentLikes);
    const objWithIdIndex = likedArray.findIndex((obj) => obj.id === id);
    return objWithIdIndex > -1;
  }
  return false;
}

export async function toggleLikeRadio(radio, callBack) {
  const currentLikes = await getDataOnStore("radio_liked");
  if (currentLikes) {
    const likedArray = JSON.parse(currentLikes);

    const ifExist = likedArray.findIndex((obj) => obj.id === radio.id);

    if (ifExist > -1) {
      likedArray.splice(ifExist, 1);
      await setDataOnStore("radio_liked", JSON.stringify(likedArray));
    } else {
      await setDataOnStore("radio_liked", JSON.stringify([...likedArray, radio]));
    }
  } else {
    await setDataOnStore("radio_liked", JSON.stringify([radio]));
  }
  callBack();
}
