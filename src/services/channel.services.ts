import { getToken } from "./token.service";

type CHANNEL_API_TYPE = {
  id: string;
  data: {
    name: { iv: string };
    logoUrl: { iv: string };
    fullLogoUrl: { iv: string };
    url: { iv: string };
    country: { iv: string };
    language: { iv: string };
    sources: {
      iv: [
        {
          categorie: [];
          url: string;
        }
      ];
    };
  };
};
type CHANNEL_PARSE_TYPE = {
  id: string;
  name: string;
  logo: string;
  fullLogo: string;
  url: string;
  country: string;
  language: string;
  sources: [
    {
      categorie: string[];
      url: string;
    }
  ];
};
type CHANNEL_RESPONSE_TYPE = { addedAt: Date; data: Array<CHANNEL_PARSE_TYPE> };
type SUBSCRIBED_CHANNEL_RESPONSE_TYPE = Array<{ id: string; channel: string }> | undefined;
type SUBSCRIBED_CHANNEL_TYPE = { items: { id: string; data: { channel: { iv: string } } }[] };


const options = async (method:string = "GET", data?: {}) => {
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

export const getChannels = async (): Promise<CHANNEL_RESPONSE_TYPE> => {
  const data = await fetch("https://cdn.teldoo.site/api/content/lepiant/channels", await options())
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => console.error(err));

  const parseData: Array<CHANNEL_PARSE_TYPE> = data.items.map((channels: CHANNEL_API_TYPE) => {
    return {
      id: channels.id,
      name: channels.data.name.iv,
      logo: channels.data.logoUrl.iv,
      fullLogo: channels.data.fullLogoUrl.iv,
      url: channels.data.url.iv,
      country: channels.data.country.iv,
      language: channels.data.language.iv,
      sources: channels.data.sources.iv,
    };
  });
  const channels = { addedAt: new Date(), data: parseData };
  return channels;
};

export const getSubscribedChannels = async (
  user: string
): Promise<SUBSCRIBED_CHANNEL_RESPONSE_TYPE> => {
  const subscribedChannels: SUBSCRIBED_CHANNEL_TYPE = await fetch(
    `https://cdn.teldoo.site/api/content/lepiant/following-channel?$filter=data/user/iv eq '${user}'`,
    await options()
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
    return parsed;
  }
};

export const addSubscribedChannels = async (user: string, channel: string): Promise<void> => {
  const data = {
    user: {
      iv: user,
    },
    channel: {
      iv: channel,
    },
  };

  await fetch("https://cdn.teldoo.site/api/content/lepiant/following-channel?publish=true", await options("POST", data))
    .then((response) => response.json())
    .catch((err) => console.error(err));
};

export const deleteSubscribedChannels = async (id: string): Promise<void> => {


  await fetch(
    `https://cdn.teldoo.site/api/content/lepiant/following-channel/${id}?permanent=true`,
    await options("DELETE")
  )
    .then((response) => response.json())
    .catch((err) => null);
};
