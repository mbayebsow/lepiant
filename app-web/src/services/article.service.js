import { setDataOnStore, getDataOnStore } from "../lib";
import { getChannels, getSuscribedChannels } from "./channel.services";

const options = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
  },
};

const subscribedChannels = async () => {
  const subscribed = await getSuscribedChannels();
  const allChannels = await getChannels();
  return allChannels.data.filter((chaine) => subscribed.map((c) => c.channel).includes(chaine.id));
};

const refactCategirie = async () => {
  let newArr = [];
  const groupedData = {};

  const chainesAbonnees = await subscribedChannels();
  chainesAbonnees.map((chaine) =>
    chaine.sources.map((source) => newArr.push({ cat: source.categorie[0], chaine: chaine.id }))
  );

  newArr.forEach((item) => {
    const cat = item.cat;
    if (!groupedData[cat]) {
      groupedData[cat] = [];
    }
    groupedData[cat].push(item.chaine);
  });

  return groupedData;
};

const sortCategories = async (categories) => {
  const subscribed = Object.keys(await refactCategirie());

  const categoriesAbonnees = categories
    .filter((categorie) => subscribed.includes(categorie.id))
    .map((categorie) => {
      return { ...categorie, disabled: false };
    });

  const categoriesNonAbonnees = categories
    .filter((categorie) => !subscribed.includes(categorie.id))
    .map((categorie) => {
      return { ...categorie, disabled: true };
    });

  const sortedCategories = categoriesAbonnees.concat(categoriesNonAbonnees);

  return sortedCategories;
};

export const getCategories = async () => {
  const categories = async () => {
    const dataOnStore = await getDataOnStore("categories_articles");
    if (dataOnStore) return JSON.parse(dataOnStore);

    const data = await fetch(
      "https://cdn.teldoo.site/api/content/lepiant/articles-categories",
      options
    )
      .then((response) => response.json())
      .then((response) => response)
      .catch((err) => console.error(err));

    return data.items.map((cat) => {
      return {
        id: cat.id,
        name: cat.data.name.iv,
      };
    });
  };

  const SortedCategories = await sortCategories(await categories());
  await setDataOnStore("categories_articles", JSON.stringify(SortedCategories));
  return SortedCategories;
};

export const getArticles = async (categorie) => {
  let articles = [];
  const refactCat = await refactCategirie();
  const channels = refactCat[categorie];
  if (!channels) return null;

  const extractedDataPromises = channels.map(async (channel) => {
    const data = await fetch(
      `https://cdn.teldoo.site/api/content/lepiant/articles?$top=20&$filter=data/channel/iv eq '${channel}' and data/categorie/iv eq '${categorie}'&$orderby=data/published/iv desc`,
      options
    )
      .then((response) => response.json())
      .catch((err) => console.error(err));

    if (!data.items) return;
    if (data) articles = articles.concat(data.items);
  });

  await Promise.all(extractedDataPromises);

  const articlesParsed = articles.map((article) => {
    return {
      id: article.id,
      categorie: article.data.categorie.iv,
      channel: article.data.channel.iv,
      title: article.data.title.iv,
      image: article.data.image.iv,
      description: article.data.description.iv,
      link: article.data.link.iv,
      published: article.data.published.iv,
    };
  });

  articlesParsed.sort(function (a, b) {
    return new Date(b.published) - new Date(a.published);
  });

  return articlesParsed;
};

export const getRandomArticles = async () => {
  const data = await fetch(`https://cdn.teldoo.site/api/content/lepiant/articles?$top=10`, options)
    .then((response) => response.json())
    .catch((err) => console.error(err));

  if (!data.items) return;

  const articlesParsed = data.items.map((article) => {
    return {
      id: article.id,
      categorie: article.data.categorie.iv,
      channel: article.data.channel.iv,
      title: article.data.title.iv,
      image: article.data.image.iv,
      description: article.data.description.iv,
      link: article.data.link.iv,
      published: article.data.published.iv,
    };
  });

  articlesParsed.sort(function (a, b) {
    return new Date(b.published) - new Date(a.published);
  });

  return articlesParsed;
};
