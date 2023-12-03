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

let TOKEN =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IlVHQUVOblRBNGx2LVoweDk0M1VaZEEiLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiJsZXBpYW50OmxlcGlhbnQtYXBwLW1vYmlsZSIsIm9pX3Byc3QiOiJsZXBpYW50OmxlcGlhbnQtYXBwLW1vYmlsZSIsImNsaWVudF9pZCI6ImxlcGlhbnQ6bGVwaWFudC1hcHAtbW9iaWxlIiwib2lfdGtuX2lkIjoiYjdiOTgwMjQtYmNmNC00NmMzLWI5NzUtYTFjODIxOGNjZWM1IiwiYXVkIjoic2NwOnNxdWlkZXgtYXBpIiwic2NvcGUiOiJzcXVpZGV4LWFwaSIsImp0aSI6ImVhNjg1Yjg4LWU3NTUtNDJlNC04OTY4LWQyM2UzZjc0MmE4YyIsImV4cCI6MTcwMTg4ODE0MiwiaXNzIjoiaHR0cHM6Ly9jZG4udGVsZG9vLnNpdGUvIiwiaWF0IjoxNjk5Mjk2MTQyfQ.qi26a8jtraaq4I51ewgcI86sitoa7dkzy9JiKtEpX_4vCeffYlCkn2DJNwUmfO5q098kxAo7AL_xzUupok1YiyAllIRMVDQpuf7IM3VP-nL0S7O8W-4sp0-QyRHKGcIT8p1mRalTxmNSZ-cp-7cSN0GbH8xDBRK-11kb_DStIEwCA6NoNF8n38y2K-STJ3qKI5cJPdk0q9Q3wooesqZXeaJtaDvT12Qn92b9YW7D6QiVyk8W8t6QC5E9NAeZ5j2S-sLpqnHBG8HLja-n3H2tUVSNGmMk5pYw0UMMESNqR9JovbNI2Iy6pGG2gBBdMLGepjsoGah1UxT9d_pj8Cmu2Q";

const options = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
};

export const getChannels = async (): Promise<CHANNEL_RESPONSE_TYPE> => {
  const data = await fetch("https://cdn.teldoo.site/api/content/lepiant/channels", options)
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

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  await fetch("https://cdn.teldoo.site/api/content/lepiant/following-channel?publish=true", options)
    .then((response) => response.json())
    .catch((err) => console.error(err));
};

export const deleteSubscribedChannels = async (id: string): Promise<void> => {
  const options = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  };

  await fetch(
    `https://cdn.teldoo.site/api/content/lepiant/following-channel/${id}?permanent=true`,
    options
  )
    .then((response) => response.json())
    .catch((err) => null);
};
