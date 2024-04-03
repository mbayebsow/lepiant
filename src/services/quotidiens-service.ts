import { getDataOnStore, setDataOnStore } from "../utils/helpers/localStorage";
import config from "../utils/constant/config";
import { fetcher } from "../utils/helpers/fetcher";
import { Quotidien, StorageIterface } from "../utils/interfaces";

export const getQuotidiens = async (updateLocal?: boolean) => {
  const dataOnStore = await getDataOnStore("quotidiens");
  if (dataOnStore) {
    const parsedData: StorageIterface<Quotidien[]> = JSON.parse(dataOnStore);
    return parsedData;
  } else {
    const quotidien = await fetcher<Quotidien[]>(`${config.API_ENDPOINT}/quotidiens`);

    if (!quotidien) return;

    const structQuotidien: StorageIterface<Quotidien[]> = {
      addedTime: new Date(),
      createdTime: quotidien[0]?.createdAt,
      data: quotidien,
    };

    await setDataOnStore("quotidiens", JSON.stringify(structQuotidien));
    return structQuotidien;
  }
};
