import config from "../utils/constant/config";
import { Revues, StorageIterface } from "../utils/interfaces";
import { fetcher } from "../utils/helpers/fetcher";

export const getRevues = async (updateLocal?: boolean) => {
  let response: Revues[] = [];

  const entry = await fetcher<Revues[]>(`${config.API_ENDPOINT}/revues`);
  if (entry) response = entry;

  if (response.length === 0) return null;

  const strucResponse: StorageIterface<Revues[]> = {
    addedTime: new Date(),
    createdTime: response[0].createdAt,
    data: response,
  };

  return strucResponse;
};
