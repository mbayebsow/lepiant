import config from "../constant/config";
import { AverageColor } from "../interfaces";
import { fetcher } from "./fetcher";

export const getColorAverage = async (imageUrl: string): Promise<AverageColor | false> => {
  try {
    const color = await fetcher<AverageColor>(
      `${config.API_ENDPOINT}/functions/averageColor?imageUrl=${imageUrl}`,
      null,
      null,
      5000
    );

    return color;
  } catch (e) {
    console.log(e);
    return false;
  }
};
