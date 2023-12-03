import { CacheManager } from "@georstat/react-native-image-cache";
import { getChannels, getSubscribedChannels } from "./channel.services";

type ARTICLE_API_TYPE = {
  id: string;
  data: {
    categorie: { iv: string };
    channel: { iv: string };
    title: { iv: string };
    image: { iv: string };
    description: { iv: string };
    link: { iv: string };
    published: { iv: Date };
  };
};
type ARTICLE_RESPONSE_TYPE = {
  id: string;
  categorie: string;
  channel: string;
  title: string;
  image: string;
  description: string;
  link: string;
  published: Date;
};

let TOKEN =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IlVHQUVOblRBNGx2LVoweDk0M1VaZEEiLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiJsZXBpYW50OmxlcGlhbnQtYXBwLW1vYmlsZSIsIm9pX3Byc3QiOiJsZXBpYW50OmxlcGlhbnQtYXBwLW1vYmlsZSIsImNsaWVudF9pZCI6ImxlcGlhbnQ6bGVwaWFudC1hcHAtbW9iaWxlIiwib2lfdGtuX2lkIjoiYjdiOTgwMjQtYmNmNC00NmMzLWI5NzUtYTFjODIxOGNjZWM1IiwiYXVkIjoic2NwOnNxdWlkZXgtYXBpIiwic2NvcGUiOiJzcXVpZGV4LWFwaSIsImp0aSI6ImVhNjg1Yjg4LWU3NTUtNDJlNC04OTY4LWQyM2UzZjc0MmE4YyIsImV4cCI6MTcwMTg4ODE0MiwiaXNzIjoiaHR0cHM6Ly9jZG4udGVsZG9vLnNpdGUvIiwiaWF0IjoxNjk5Mjk2MTQyfQ.qi26a8jtraaq4I51ewgcI86sitoa7dkzy9JiKtEpX_4vCeffYlCkn2DJNwUmfO5q098kxAo7AL_xzUupok1YiyAllIRMVDQpuf7IM3VP-nL0S7O8W-4sp0-QyRHKGcIT8p1mRalTxmNSZ-cp-7cSN0GbH8xDBRK-11kb_DStIEwCA6NoNF8n38y2K-STJ3qKI5cJPdk0q9Q3wooesqZXeaJtaDvT12Qn92b9YW7D6QiVyk8W8t6QC5E9NAeZ5j2S-sLpqnHBG8HLja-n3H2tUVSNGmMk5pYw0UMMESNqR9JovbNI2Iy6pGG2gBBdMLGepjsoGah1UxT9d_pj8Cmu2Q";

const options = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
};

const subscribedChannels = async (user: string) => {
  const subscribed = await getSubscribedChannels(user);
  const allChannels = await getChannels();
  return allChannels.data.filter((channel) =>
    subscribed?.map((c) => c.channel).includes(channel.id)
  );
};

const refactorCategorise = async (user: string) => {
  let newArr: Array<{ cat: string; channel: string }> = [];
  const groupedData = {};

  const subscribedChannel = await subscribedChannels(user);
  subscribedChannel.map((channel) =>
    channel.sources.map((source) => newArr.push({ cat: source.categorie[0], channel: channel.id }))
  );

  newArr.forEach((item) => {
    const cat: string = item.cat;
    // @ts-ignore
    if (!groupedData[cat]) {
      // @ts-ignore
      groupedData[cat] = [];
    }
    // @ts-ignore
    groupedData[cat].push(item.channel);
  });

  return groupedData;
};

const sortCategories = async (categories: string) => {
  // @ts-ignore
  const subscribed = Object.keys(await refactorCategorise());

  const categoriesAbonnees = categories
    // @ts-ignore
    .filter((categorie) => subscribed.includes(categorie.id))
    // @ts-ignore
    .map((categorie) => {
      return { ...categorie, disabled: false };
    });

  const categoriesNonAbonnees = categories
    // @ts-ignore
    .filter((categorie) => !subscribed.includes(categorie.id))
    // @ts-ignore
    .map((categorie) => {
      return { ...categorie, disabled: true };
    });

  const sortedCategories = categoriesAbonnees.concat(categoriesNonAbonnees);

  return sortedCategories;
};

export const fetchCategories = async (): Promise<Array<{ id: string; name: string }>> => {
  const categories: { items: Array<{ id: string; data: { name: { iv: string } } }> } = await fetch(
    "https://cdn.teldoo.site/api/content/lepiant/articles-categories",
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));

  return categories.items.map((cat) => {
    return {
      id: cat.id,
      name: cat.data.name.iv,
    };
  });
};

export const fetchArticles = async (
  user: string,
  category: string
): Promise<Array<ARTICLE_RESPONSE_TYPE> | null> => {
  let articles: Array<ARTICLE_API_TYPE> = [];
  const refactorCat = await refactorCategorise(user);
  // @ts-ignore
  const channels = refactorCat[category];
  if (!channels) return null;

  const extractedDataPromises = channels.map(async (channel: string) => {
    const data: { items: Array<ARTICLE_API_TYPE> } = await fetch(
      `https://cdn.teldoo.site/api/content/lepiant/articles?$top=10&$filter=data/channel/iv eq '${channel}' and data/categorie/iv eq '${category}'&$orderby=data/published/iv desc`,
      options
    )
      .then((response) => response.json())
      .catch((err) => console.error(err));

    if (!data.items) return;
    articles = articles.concat(data.items);
  });

  await Promise.all(extractedDataPromises);

  const articlesParsed = articles.map((article) => {
    CacheManager.prefetch(article.data.image.iv);
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

  articlesParsed.sort((a, b) => new Date(b.published).valueOf() - new Date(a.published).valueOf());
  return articlesParsed;
};

export const fetchRandomArticles = async (): Promise<Array<ARTICLE_RESPONSE_TYPE>> => {
  const data: { items: Array<ARTICLE_API_TYPE> } = await fetch(
    `https://cdn.teldoo.site/api/content/lepiant/articles?$top=10`,
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));

  const articlesParsed = data.items.map((article) => {
    CacheManager.prefetch(article.data.image.iv);
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
    return new Date(b.published).valueOf() - new Date(a.published).valueOf();
  });

  return articlesParsed;
};
