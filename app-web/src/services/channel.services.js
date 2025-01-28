import { getDataOnStore, setDataOnStore } from "../lib";
import moment from "moment/moment.js";

const options = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
  },
};

const fetchChannel = async () => {
  const data = await fetch("https://cdn.teldoo.site/api/content/lepiant/channels", options)
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => console.error(err));

  const parseData = data.items.map((channels) => {
    return {
      id: channels.id,
      name: channels.data.name.iv,
      logo: `https://cdn.teldoo.site/api/assets/lepiant/${channels.data.logo.iv[0]}`,
      fullLogo: channels.data.fullLogo?.iv
        ? `https://cdn.teldoo.site/api/assets/lepiant/${channels.data.fullLogo.iv[0]}`
        : null,
      url: channels.data.url.iv,
      country: channels.data.country.iv,
      language: channels.data.language.iv,
      sources: channels.data.sources.iv,
    };
  });
  const channels = { addedAt: new Date(), data: parseData };
  await setDataOnStore("channels", JSON.stringify(channels));
  return channels;
};

export const getChannels = async () => {
  const dataOnStore = await getDataOnStore("channels");

  if (dataOnStore) {
    const localChannels = JSON.parse(dataOnStore);
    const diff = moment().diff(localChannels.addedAt, "minutes");

    if (diff >= 1440 || diff === 0) {
      return await fetchChannel();
    }
    return localChannels;
  }
  return await fetchChannel();
};

export const getSuscribedChannels = async (user, update = false) => {
  if (!update) {
    const dataOnStore = JSON.parse(await getDataOnStore("subscribed_channel"));
    if (dataOnStore?.length > 0) return dataOnStore;
  }

  const subscribedChannels = await fetch(
    `https://cdn.teldoo.site/api/content/lepiant/following-channel?$filter=data/user/iv eq '${user}'`,
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));

  if (subscribedChannels.items) {
    const parsed = subscribedChannels.items.map((data) => {
      return {
        id: data.id,
        channel: data.data.channel.iv,
      };
    });

    await setDataOnStore("subscribed_channel", JSON.stringify(parsed));
    return parsed;
  }
};

export const addSubscribedChannels = async (user, channel) => {
  const data = {
    user: {
      iv: user,
    },
    channel: {
      iv: channel,
    },
  };

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const subscribedChannels = await fetch(
    "https://cdn.teldoo.site/api/content/lepiant/following-channel?publish=true",
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));

  if (subscribedChannels.id) {
    const dataOnStore = await getDataOnStore("subscribed_channel");
    const localChannel = JSON.parse(dataOnStore);
    localChannel.push({
      id: subscribedChannels.id,
      channel: channel,
    });
    await setDataOnStore("subscribed_channel", JSON.stringify(localChannel));
  }
};

export const deleteSubscribedChannels = async (channel) => {
  const dataOnStore = JSON.parse(await getDataOnStore("subscribed_channel"));
  const localChannel = await dataOnStore.find((obj) => obj.channel === channel);
  const indexLocalChannel = await dataOnStore.findIndex((obj) => obj.channel === channel);

  const options = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
    },
  };

  await fetch(
    `https://cdn.teldoo.site/api/content/lepiant/following-channel/${localChannel.id}?permanent=true`,
    options
  )
    .then((response) => response.json())
    .catch((err) => null);

  dataOnStore.splice(indexLocalChannel, 1);
  await setDataOnStore("subscribed_channel", JSON.stringify(dataOnStore));
};
