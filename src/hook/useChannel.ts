import { toggleSubscribeChannel, getChannels } from "../services/channels-services";
import { create } from "zustand";
import { Channel } from "../utils/interfaces";

interface ChannelStore {
  channels: Channel[];
  initChannels: (updateLocal?: boolean) => Promise<void>;
  toggleSubscribe: (channelId: number) => Promise<void>;
  getChannel: (channelId: number) => Promise<Channel | undefined>;
}

const useChannelStore = create<ChannelStore>()((set, get) => ({
  channels: [],
  initChannels: async (updateLocal?: boolean) => {
    const channels = await getChannels(updateLocal);
    set(() => ({
      channels,
    }));
  },
  toggleSubscribe: async (channelId: number) => {
    const channelSubscribed = await toggleSubscribeChannel(channelId);
    await get().initChannels();
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
