import { createStore, createHook } from "react-sweet-state";
import {
  getChannels,
  getSubscribedChannels,
  addSubscribedChannels,
  deleteSubscribedChannels,
} from "../services/channel.services";
import useSession from "./useSession";

const Store = createStore({
  initialState: { channels: [], subscribedChannel: [], loading: null },
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
      (user) =>
      async ({ setState }) => {
        const subscribedChannel = await getSubscribedChannels(user);
        setState({
          subscribedChannel,
        });
      },
    setLoading:
      (loading) =>
      ({ setState }) => {
        setState({
          loading,
        });
      },
  },
});

export default function useChannel() {
  const { userData } = useSession();
  const dataStore = createHook(Store);
  const [
    { channels, subscribedChannel, loading },
    { setChannels, setSubscribedChannel, setLoading },
  ] = dataStore();

  async function toggleSubscribe(channel) {
    setLoading(channel);
    const ifExist = subscribedChannel.find((obj) => obj.channel === channel);

    if (ifExist) {
      await deleteSubscribedChannels(ifExist.id);
      await setSubscribedChannel(userData.id);
    } else {
      await addSubscribedChannels(userData.id, channel);
      await setSubscribedChannel(userData.id);
    }
    setLoading(null);
  }

  function getChannelsDetails(id) {
    const details = channels.find((obj) => obj.id === id);
    return details;
  }
  return {
    channels,
    subscribedChannel,
    loading,
    setChannels,
    setSubscribedChannel,
    toggleSubscribe,
    getChannelsDetails,
  };
}
