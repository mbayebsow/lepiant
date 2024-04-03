import config from "../utils/constant/config";
import { fetcher } from "../utils/helpers/fetcher";
import { getDataOnStore, setDataOnStore } from "../utils/helpers/localStorage";
import { Radio, RadioLiked } from "../utils/interfaces";

const fetchRadios = async () => {
  const radios = await fetcher<Radio[]>(`${config.API_ENDPOINT}/radios`);
  if (radios) await setDataOnStore("radios", JSON.stringify(radios));
  return radios;
};

export async function toggleLikeRadio(radioId: number) {
  const radioLiked = await fetcher<{ create?: boolean; delete?: boolean; message: string }>(
    `${config.API_ENDPOINT}/radios/liked/${radioId}`,
    "POST"
  );
  return radioLiked;
}

export const getRadios = async (updateLocal?: boolean) => {
  if (updateLocal) return await fetchRadios();

  const dataOnStore = await getDataOnStore("radios");
  if (dataOnStore) {
    const parsedData: Radio[] = JSON.parse(dataOnStore);
    if (parsedData.length > 0) return parsedData;
  }

  return await fetchRadios();
};

export const getRadiosLiked = async () => {
  const radioLiked = await fetcher<RadioLiked[]>(`${config.API_ENDPOINT}/radios/liked`);
  return radioLiked;
};
