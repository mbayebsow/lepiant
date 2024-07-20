import { create } from "zustand";
import TrackPlayer, { Capability, Track } from "react-native-track-player";
import { AverageColor } from "../utils/interfaces";
import { getColorAverage } from "../utils/helpers/colorAverage";

interface PlayerStore {
  playlist: Track[] | null;
  playlistFrom: number | string | null;
  currentSong: Track | null;
  status: number;
  averageColor: AverageColor | null;
  isTrackPlayerInit: boolean;
  initializeTrackPlayer: () => Promise<void>;
  setPlaylist: (playlist: Track[], from: string | number) => Promise<void>;
  playAudio: (id: number, from: string | number) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  handleNext: () => Promise<void>;
  handlePrev: () => Promise<void>;
  setStatus: (status: number) => void;
  updateAverageColor: () => void;
  setCurrentSong: (track: Track) => void;
}

const usePlayerStore = create<PlayerStore>()((set, get) => ({
  playlist: null,
  playlistFrom: null,
  currentSong: null,
  status: 0,
  averageColor: null,
  isTrackPlayerInit: false,
  initializeTrackPlayer: async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
    });
    set(() => ({ isTrackPlayerInit: true }));
  },
  setCurrentSong: async (track: Track) => {
    const currentSong = get().currentSong;
    if (currentSong?.id !== track.id) {
      set(() => ({ currentSong: track }));

      if (track.artwork) {
        const color = await getColorAverage(track.artwork);
        if (color) set(() => ({ averageColor: color }));
      }
    }
  },
  setPlaylist: async (playlist: Track[], from: string | number) => {
    const playlistFrom = get().playlistFrom;

    if (playlistFrom !== from) {
      const queue = await TrackPlayer.getQueue();
      if (queue.length > 0) null;
    }

    set(() => ({ playlist: playlist }));
    // set(() => ({ playlistFrom: from }));
  },
  playAudio: async (id: number, from: string | number) => {
    const playlist = get().playlist;
    const playlistFrom = get().playlistFrom;

    if (playlist) {
      const trackIndex = playlist.findIndex(track => track.id === id);

      if (trackIndex !== -1) {
        // const currentSong = playlist[trackIndex];

        if (playlistFrom !== from) {
          await TrackPlayer.reset();
          await TrackPlayer.add(playlist);
          set(() => ({ playlistFrom: from }));
          // set(() => ({ currentSong }));
        }

        await TrackPlayer.skip(trackIndex);
        await TrackPlayer.play();
      }
    }
  },
  togglePlayPause: async () => {
    if (get().status === 3) {
      await TrackPlayer.stop();
    } else {
      await TrackPlayer.play();
    }
  },
  handleNext: async () => {
    await TrackPlayer.skipToNext();
    // const index = await TrackPlayer.getActiveTrackIndex();
    // if (index) {
    //   const track = get().playlist?.data[index];
    //   if (track) set(() => ({ currentSong: track }));
    //   get().updateAverageColor();
    // }
  },
  handlePrev: async () => {
    await TrackPlayer.skipToPrevious();
    // const index = await TrackPlayer.getActiveTrackIndex();
    // if (index) {
    //   const track = get().playlist?.data[index];
    //   if (track) set(() => ({ currentSong: track }));
    //   get().updateAverageColor();
    // }
  },
  setStatus: (status: number) => {
    set(() => ({ status }));
  },
  updateAverageColor: async () => {
    const image = get().currentSong?.artwork;
    if (image) {
      const color = await getColorAverage(image);
      if (color) set(() => ({ averageColor: color }));
    }
  },
}));

export default usePlayerStore;
