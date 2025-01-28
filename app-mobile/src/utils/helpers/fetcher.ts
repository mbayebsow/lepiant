import config from "../constant/config";
import { getDataOnStore, setDataOnStore } from "./localStorage";

interface ErrorResponse {
  message: string;
  statusCode: number;
}

export async function fetcher<T>(
  endPoint: string,
  method?: "GET" | "POST" | "DELETE",
  body: {} | undefined = {},
  timeout: number = 30000,
) {
  //const userToken = await getDataOnStore("userToken");
  // console.log("fetcher-userToken", userToken);

  const options = () => {
    return {
      method: method || "GET",
      headers: {
        Authorization: config.API_TOKEN,
        "Content-Type": "application/json",
      },
      body: method === "POST" ? JSON.stringify(body) : null,
    };
  };

  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(endPoint, { ...options(), signal: controller.signal });
    const entry: T = await response.json();
    clearTimeout(id);

    if (entry.statusCode) return false;

    await setDataOnStore(endPoint, JSON.stringify(entry));
    return entry;
  } catch (error: any) {
    console.log("fetcher", endPoint, error.message);
    const cache = await getDataOnStore(endPoint);
    if (cache) {
      const data: T = JSON.parse(cache);
      return data;
    }
    return false;
  }
}
