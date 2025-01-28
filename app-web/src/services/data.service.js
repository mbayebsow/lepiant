import moment from "moment/moment";
import { getDataOnStore, setDataOnStore } from "../lib";
import Radios from "../lib/radios.json";

const options = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
  },
};

export const getQuotidiens = async () => {
  const dataOnStore = await getDataOnStore("quotidiens");

  if (dataOnStore) {
    const addedTime = JSON.parse(dataOnStore).addedTime;
    const diff = moment().diff(addedTime, "minutes");

    if (diff >= 1440 || diff === 0) {
      return fetchData();
    } else {
      return JSON.parse(dataOnStore);
    }
  } else {
    return fetchData();
  }

  async function fetchData() {
    const data = await fetch(
      "https://cdn.teldoo.site/api/content/lepiant/quotidiens?%24top=1",
      options
    )
      .then((response) => response.json())
      .then((response) => response)
      .catch((err) => console.error(err));

    const parseData = {
      addedTime: new Date(),
      createdTime: data?.items[0].created,
      files: data?.items[0].data.files.iv,
    };

    await setDataOnStore("quotidiens", JSON.stringify(parseData));
    return parseData;
  }
};

export const getRevues = async () => {
  const dataOnStore = await getDataOnStore("revues");

  if (dataOnStore) {
    const addedTime = JSON.parse(dataOnStore).addedTime;
    const diff = moment().diff(addedTime, "minutes");

    if (diff >= 1440 || diff === 0) {
      return fetchData();
    } else {
      return JSON.parse(dataOnStore);
    }
  } else {
    return fetchData();
  }

  async function fetchData() {
    const data = await fetch(
      "https://cdn.teldoo.site/api/content/lepiant/revues-de-presse?%24top=1",
      options
    )
      .then((response) => response.json())
      .then((response) => response)
      .catch((err) => console.error(err));

    const parseData = {
      addedTime: new Date(),
      createdTime: data?.items[0].created,
      audios: data?.items[0].data.audios.iv.map((audio) => {
        return {
          ...audio,
          id: audio.name,
          categories: moment(data?.items[0].created).fromNow(),
          image:
            "https://cdn.teldoo.site/api/assets/lepiant/6964787f-9270-4e47-a1ae-50679a1e65a7/rdp-cover.png?width=100&height=100",
        };
      }),
    };

    await setDataOnStore("revues", JSON.stringify(parseData));
    return parseData;
  }
};

export const getTopNews = async () => {
  const data = await fetch("https://cdn.teldoo.site/api/content/lepiant/top-news", options)
    .then((response) => response.json())
    .catch(async (err) => null);

  if (data) {
    const articles = data?.items[0].data.articles.iv.map((article) => {
      return {
        title: article.title,
        image: article.image,
        name: article.source.name,
        description: article.description,
        link: article.url,
        published: article.publishedAt,
      };
    });

    const parseData = {
      addedTime: new Date(),
      lastModified: data?.items[0].lastModified,
      articles,
    };

    await setDataOnStore("topNews", JSON.stringify(parseData));
    return parseData;
  } else {
    const data = await getDataOnStore("topNews");
    return JSON.parse(data);
  }
};

export const getRadios = async () => {
  const dataOnStore = await getDataOnStore("radios");
  if (dataOnStore) return JSON.parse(dataOnStore);
  await setDataOnStore("radios", JSON.stringify(Radios));
  return Radios;
};
