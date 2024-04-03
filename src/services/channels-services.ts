import { enableScreens } from "react-native-screens";
import config from "../utils/constant/config";
import { fetcher } from "../utils/helpers/fetcher";
import { getDataOnStore, setDataOnStore } from "../utils/helpers/localStorage";
import { Channel, SubscribedChannel } from "../utils/interfaces";

export async function getChannels(updateLocal?: boolean) {
  let channels: Channel[] = [];
  const dataOnStore = await getDataOnStore("channels");

  if (dataOnStore) {
    const parsedChannels: Channel[] = JSON.parse(dataOnStore);
    channels = parsedChannels;
  } else {
    const channelEntry = await fetcher<Channel[]>(`${config.API_ENDPOINT}/channels`);
    const subscribedChannels = await fetcher<SubscribedChannel[]>(
      `${config.API_ENDPOINT}/channels/subscribed`
    );

    if (channelEntry && subscribedChannels) {
      channels = channelEntry.map((channel) => {
        const isSubscribed = subscribedChannels.find(
          (subscribedChannel) => subscribedChannel.channelId === channel.id
        );
        if (isSubscribed) channel.isSubscribed = true;
        return channel;
      });
      await setDataOnStore("channels", JSON.stringify(channels));
    }
  }
  return channels;
}

export async function getSubscribedChannels() {
  const subscribedChannels = await fetcher<SubscribedChannel[]>(
    `${config.API_ENDPOINT}/channels/subscribed`
  );

  return subscribedChannels;
}

export const toggleSubscribeChannel = async (channelId: number) => {
  const response = await fetcher<{ create?: boolean; delete?: boolean; message: string }>(
    `${config.API_ENDPOINT}/channels/subscribed/${channelId}`,
    "POST"
  );
  if (response && response.create) {
    const channels = await getChannels();
    const updatedChannels = channels.map((channel) => {
      if (channel.id === channelId) channel.isSubscribed = true;
      return channel;
    });
    await setDataOnStore("channels", JSON.stringify(updatedChannels));
  }

  if (response && response.delete) {
    const channels = await getChannels();
    const updatedChannels = channels.map((channel) => {
      if (channel.id === channelId) channel.isSubscribed = false;
      return channel;
    });
    await setDataOnStore("channels", JSON.stringify(updatedChannels));
  }

  return response;
};

// export async function getChannelsDetails(id: number) {
//   const details = (await getChannels()).find((obj) => obj.id === id); //channels.find((obj) => obj.id === id);
//   return details;
// }
