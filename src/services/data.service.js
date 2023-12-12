import { getDataOnStore, setDataOnStore } from "../lib";
import moment from "moment/moment";
import Radios from "../lib/radios.json";
import { getToken } from "./token.service";

const options = async (method = "GET", data) => {
  const TOKEN = await getToken();
  return {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }
};

const fetchData = async (url) => {
  const data = await fetch(url, await options())
    .then((response) => response.json())
    .catch((err) => console.error(err));

  if (!data) return null;
  return data;
};

export const getQuotidiens = async () => {
  let url = "https://cdn.teldoo.site/api/content/lepiant/quotidiens?$top=1";
  const quotidien = await fetchData(url);
  //const dataOnStore = await getDataOnStore("quotidiens");

  if (!quotidien?.items) return [];

  const structQuotidien = {
    addedTime: new Date(),
    createdTime: quotidien.items[0].created,
    files: quotidien.items[0].data.files.iv,
  };

  await setDataOnStore("quotidiens", JSON.stringify(structQuotidien));
  return structQuotidien;
};

export const getRevues = async () => {
  let response;
  let url = "https://cdn.teldoo.site/api/content/lepiant/revues-de-presse?%24top=1";

  const dataOnStore = await getDataOnStore("revues");

  if (dataOnStore) {
    const parsedData = JSON.parse(dataOnStore);
    const diff = moment().diff(parsedData.addedTime, "minutes");

    if (diff >= 1440 || diff === 0) {
      response = await fetchData(url);
    } else {
      return parsedData;
    }
  } else {
    response = await fetchData(url);
  }
  if (!response?.items) return [];

  const strucResponse = {
    addedTime: new Date(),
    createdTime: response?.items[0].created,
    audios: response?.items[0].data.audios.iv.map((audio) => {
      return {
        ...audio,
        id: audio.name,
        categories: moment(response?.items[0].created).fromNow(),
        date: moment(response?.items[0].created),
        image:
          "https://ik.imagekit.io/7whoa8vo6/lepiant/rdp-cover_mpizrk_dGHe6M0fl.png?updatedAt=1701342682754",
      };
    }),
  };
  await setDataOnStore("revues", JSON.stringify(strucResponse));
  return strucResponse;
};

export const getTopNews = async () => {
  let response;
  let url = "https://cdn.teldoo.site/api/content/lepiant/top-news";

  const dataOnStore = await getDataOnStore("topnews");

  if (dataOnStore) {
    const parsedData = JSON.parse(dataOnStore);
    const diff = moment().diff(parsedData.addedTime, "minutes");

    if (diff >= 60 || diff === 0) {
      response = await fetchData(url);
    } else {
      return parsedData;
    }
  } else {
    response = await fetchData(url);
  }
  if (!response?.items) return [];

  const strucResponse = {
    addedTime: new Date(),
    lastModified: response?.items[0].lastModified,
    articles: response?.items[0].data.articles.iv.map((article) => {
      return {
        title: article.title,
        image: article.image,
        source: article.source.name,
        description: article.description,
        link: article.url,
        published: article.publishedAt,
      };
    }),
  };
  await setDataOnStore("topnews", JSON.stringify(strucResponse));
  return strucResponse;
};

export const getRadios = async () => {
  return Radios;
};
