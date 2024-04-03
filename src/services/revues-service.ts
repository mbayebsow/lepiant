import config from "../utils/constant/config";
import { Revues, StorageIterface } from "../utils/interfaces";
import { fetcher } from "../utils/helpers/fetcher";
import { getDataOnStore, setDataOnStore } from "../utils/helpers/localStorage";
import moment from "moment/moment";

export const getRevues = async (updateLocal?: boolean) => {
  let response: Revues[] = [];

  const dataOnStore = await getDataOnStore("revues");

  if (dataOnStore) {
    const parsedData: StorageIterface<Revues[]> = JSON.parse(dataOnStore);
    const diff = moment().diff(parsedData.addedTime, "minutes");

    if (diff >= 1440 || diff === 0) {
      const entry = await fetcher<Revues[]>(`${config.API_ENDPOINT}/revues`);
      if (entry) response = entry;
    } else {
      return parsedData;
    }
  } else {
    const entry = await fetcher<Revues[]>(`${config.API_ENDPOINT}/revues`);

    if (entry) response = entry;
  }

  if (response.length === 0) return null;

  const strucResponse: StorageIterface<Revues[]> = {
    addedTime: new Date(),
    createdTime: response[0].createdAt,
    data: response,
  };

  await setDataOnStore("revues", JSON.stringify(strucResponse));
  return strucResponse;
};
