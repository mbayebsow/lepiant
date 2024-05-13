import {
  toggleSubscribeChannel,
  getChannels,
  getSubscribedChannels,
} from "../services/channels-services";
import { create } from "zustand";
import { Channel, SubscribedChannel } from "../utils/interfaces";

interface ChannelStore {
  channels: Channel[];
  subscribedChannels: SubscribedChannel[];
  initChannels: (updateLocal?: boolean) => Promise<void>;
  toggleSubscribe: (channelId: number) => Promise<void>;
  getChannel: (channelId: number) => Promise<Channel | undefined>;
}

const useChannelStore = create<ChannelStore>()((set, get) => ({
  channels: [],
  subscribedChannels: [],
  initChannels: async (updateLocal?: boolean) => {
    const channels = await getChannels();
    const subscribedChannels = await getSubscribedChannels();

    if (channels) set(() => ({ channels }));
    if (subscribedChannels) set(() => ({ subscribedChannels }));
  },
  toggleSubscribe: async (channelId: number) => {
    const channelSubscribed = await toggleSubscribeChannel(channelId);
    const subscribedChannels = await getSubscribedChannels();
    if (subscribedChannels) set(() => ({ subscribedChannels }));
  },
  getChannel: async (id: number) => {
    const details = get().channels.find((obj) => obj.id === id);
    return details;
  },
}));

export default useChannelStore;

// const Store = createStore({
//   initialState: { channels: [], loading: null },
//   actions: {
//     setChannels:
//       (channels) =>
//       async ({ setState }) => {
//         setState({
//           channels,
//         });
//       },
//     // setSubscribedChannel:
//     //   (subscribedChannel) =>
//     //   async ({ setState }) => {
//     //     setState({
//     //       subscribedChannel,
//     //     });
//     //   },
//     setLoading:
//       (loading) =>
//       ({ setState }) => {
//         setState({
//           loading,
//         });
//       },
//   },
// });

// export default function useChannel() {
//   const dataStore = createHook(Store);
//   const [{ channels, loading }, { setChannels, setLoading }] = dataStore();

//   const initChannels = async () => {
//     const channels = await getChannels();
//     setChannels(channels);
//   };

//   return {
//     channels,
//     loading,
//     initChannels,
//   };
// }
