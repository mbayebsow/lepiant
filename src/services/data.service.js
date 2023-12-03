import { getDataOnStore, setDataOnStore } from "../lib";
import moment from "moment/moment";
import Radios from "../lib/radios.json";

let TOKEN =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IlVHQUVOblRBNGx2LVoweDk0M1VaZEEiLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiJsZXBpYW50OmxlcGlhbnQtYXBwLW1vYmlsZSIsIm9pX3Byc3QiOiJsZXBpYW50OmxlcGlhbnQtYXBwLW1vYmlsZSIsImNsaWVudF9pZCI6ImxlcGlhbnQ6bGVwaWFudC1hcHAtbW9iaWxlIiwib2lfdGtuX2lkIjoiYjdiOTgwMjQtYmNmNC00NmMzLWI5NzUtYTFjODIxOGNjZWM1IiwiYXVkIjoic2NwOnNxdWlkZXgtYXBpIiwic2NvcGUiOiJzcXVpZGV4LWFwaSIsImp0aSI6ImVhNjg1Yjg4LWU3NTUtNDJlNC04OTY4LWQyM2UzZjc0MmE4YyIsImV4cCI6MTcwMTg4ODE0MiwiaXNzIjoiaHR0cHM6Ly9jZG4udGVsZG9vLnNpdGUvIiwiaWF0IjoxNjk5Mjk2MTQyfQ.qi26a8jtraaq4I51ewgcI86sitoa7dkzy9JiKtEpX_4vCeffYlCkn2DJNwUmfO5q098kxAo7AL_xzUupok1YiyAllIRMVDQpuf7IM3VP-nL0S7O8W-4sp0-QyRHKGcIT8p1mRalTxmNSZ-cp-7cSN0GbH8xDBRK-11kb_DStIEwCA6NoNF8n38y2K-STJ3qKI5cJPdk0q9Q3wooesqZXeaJtaDvT12Qn92b9YW7D6QiVyk8W8t6QC5E9NAeZ5j2S-sLpqnHBG8HLja-n3H2tUVSNGmMk5pYw0UMMESNqR9JovbNI2Iy6pGG2gBBdMLGepjsoGah1UxT9d_pj8Cmu2Q";
const options = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
};

const fetchData = async (url) => {
  const data = await fetch(url, options)
    .then((response) => response.json())
    .catch((err) => console.error(err));

  if (!data) return null;
  return data;
};

export const getQuotidiens = async () => {
  // await removeDataOnStore('quotidiens');
  let response;
  let url = "https://cdn.teldoo.site/api/content/lepiant/quotidiens?$top=1";

  const dataOnStore = await getDataOnStore("quotidiens");

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
  if (!response) return null;

  const strucResponse = {
    addedTime: new Date(),
    createdTime: response.items[0].created,
    files: response.items[0].data.files.iv,
  };
  await setDataOnStore("quotidiens", JSON.stringify(strucResponse));
  return strucResponse;
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
  if (!response) return null;

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
  if (!response) return null;

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
