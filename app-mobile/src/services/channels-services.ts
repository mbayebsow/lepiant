import config from "../utils/constant/config";
import { fetcher } from "../utils/helpers/fetcher";
import { Channel, SubscribedChannel } from "../utils/interfaces";

export async function getChannels(updateLocal?: boolean) {
  // let channels: Channel[] = [];
  const channels = await fetcher<Channel[]>(`${config.API_ENDPOINT}/channels`, "GET");
  return channels;
}

export async function getSubscribedChannels() {
  const subscribedChannels = await fetcher<SubscribedChannel[]>(
    `${config.API_ENDPOINT}/channels/subscribed`,
    "GET"
  );

  return subscribedChannels;
}

export const toggleSubscribeChannel = async (channelId: number) => {
  const response = await fetcher<{ create?: boolean; delete?: boolean; message: string }>(
    `${config.API_ENDPOINT}/channels/subscribed/${channelId}`,
    "POST"
  );
  return response;
};

// export async function getChannelsDetails(id: number) {
//   const details = (await getChannels()).find((obj) => obj.id === id); //channels.find((obj) => obj.id === id);
//   return details;
// }
