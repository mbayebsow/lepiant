import { create } from "zustand";
import TrackPlayer, { useTrackPlayerEvents, Capability, Event } from "react-native-track-player";
import { AverageColor, TrackPlaylist } from "../utils/interfaces";
import { getColorAverage } from "../utils/helpers/colorAverage";

interface PlayerStore {
  playlist: { from: string | number; data: TrackPlaylist[] } | null;
  currentSong: TrackPlaylist | null;
  status: number;
  averageColor: AverageColor | null;
  isTrackPlayerInit: boolean;
  initializeTrackPlayer: () => Promise<void>;
  setPlaylist: (playlist: TrackPlaylist[], from: string | number) => Promise<void>;
  playAudio: (id: number, from: string | number) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  handleNext: () => Promise<void>;
  handlePrev: () => Promise<void>;
  setStatus: (status: number) => void;
  updateAverageColor: () => void;
}

const usePlayerStore = create<PlayerStore>()((set, get) => ({
  playlist: null,
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
  setPlaylist: async (playlist: TrackPlaylist[], from: string | number) => {
    const playlistFrom = get().playlist?.from;

    if (playlistFrom !== from) {
      const queue = await TrackPlayer.getQueue();
      if (queue.length > 0) null;
    }

    set(() => ({ playlist: { from, data: playlist } }));
  },
  playAudio: async (id: number, from: string | number) => {
    const playlist = get().playlist?.data;

    if (playlist) {
      const trackIndex = playlist.findIndex((track) => track.id === id);

      if (trackIndex !== -1) {
        const currentSong = playlist[trackIndex];

        set(() => ({ currentSong }));
        get().updateAverageColor();

        const queue = await TrackPlayer.getQueue();
        if (queue.length > 0) await TrackPlayer.reset();

        await TrackPlayer.add(playlist);

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
    const index = await TrackPlayer.getActiveTrackIndex();
    if (index) {
      const track = get().playlist?.data[index];
      if (track) set(() => ({ currentSong: track }));
      get().updateAverageColor();
    }
  },
  handlePrev: async () => {
    await TrackPlayer.skipToPrevious();
    const index = await TrackPlayer.getActiveTrackIndex();
    if (index) {
      const track = get().playlist?.data[index];
      if (track) set(() => ({ currentSong: track }));
      get().updateAverageColor();
    }
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
