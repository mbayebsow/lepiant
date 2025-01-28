import { createStore, createHook } from "react-sweet-state";
import {
  getChannels,
  getSuscribedChannels,
  addSubscribedChannels,
  deleteSubscribedChannels,
} from "../services/channel.services";
import useArticle from "./useArticle";
import useSession from "./useSession";

const Store = createStore({
  initialState: { channels: [], subscribedChannel: [] },
  actions: {
    setChannels:
      () =>
      async ({ setState }) => {
        const channels = await getChannels();
        setState({
          channels: channels.data,
        });
      },
    setSubscribedChannel:
      (subscribedChannel) =>
      async ({ setState }) => {
        setState({
          subscribedChannel,
        });
      },
  },
});

export default function useChannel() {
  const { setCategiries, getArticlesByCategorie } = useArticle();
  const { isLogin, userData } = useSession();
  const dataStore = createHook(Store);
  const [{ channels, subscribedChannel }, { setChannels, setSubscribedChannel }] = dataStore();

  async function fetchSubscribedChannels(update) {
    if (isLogin){
      const subscribedChannel = await getSuscribedChannels(userData.id, update);
      await setSubscribedChannel(subscribedChannel);
    };
    await setCategiries();
    await getArticlesByCategorie()
  }
 
  async function toggleSubscribe(channel) {
    const ifExist = subscribedChannel.findIndex((obj) => obj.channel === channel);

    if (ifExist > -1) {
      await deleteSubscribedChannels(channel);
      await fetchSubscribedChannels();
    } else {
      await addSubscribedChannels(userData.id, channel);
      await fetchSubscribedChannels();
    }
  }

  return {
    channels,
    subscribedChannel,
    setChannels,
    setSubscribedChannel,
    toggleSubscribe,
    fetchSubscribedChannels,
  };
}
