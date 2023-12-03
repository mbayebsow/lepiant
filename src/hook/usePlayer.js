import { createStore, createHook } from "react-sweet-state";
import TrackPlayer, { useTrackPlayerEvents, Capability } from "react-native-track-player";
import { ColorExtractor } from "../lib";

let fromState = null;
let playIndex = 0;

const Store = createStore({
  initialState: {
    files: [],
    currentSong: null,
    status: "none",
    averageColor: null,
    isTrackPlayerInit: false,
  },
  actions: {
    setFiles:
      (files) =>
      ({ setState }) => {
        setState({
          files,
        });
      },
    setCurrentSong:
      (currentSong) =>
      ({ setState }) => {
        setState({
          currentSong,
        });
      },
    setAverageColor:
      (averageColor) =>
      ({ setState }) => {
        setState({
          averageColor,
        });
      },
    setStatus:
      (status) =>
      ({ setState }) => {
        setState({
          status,
        });
      },
    setIsTrackPlayerInit:
      (isTrackPlayerInit) =>
      ({ setState }) => {
        setState({
          isTrackPlayerInit,
        });
      },
  },
});

export default function usePlayer() {
  const playerStore = createHook(Store);
  const [
    { files, currentSong, status, averageColor, isTrackPlayerInit },
    { setAverageColor, setFiles, setCurrentSong, setStatus, setIsTrackPlayerInit },
  ] = playerStore();

  const getColor = async (track) => {
    const color = await ColorExtractor(track.image);
    if (color?.success) setAverageColor(color.color);
  };

  const initializeTrackPlayer = async () => {
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
    setIsTrackPlayerInit(true);
  };

  const preloadAudio = async (index, from) => {
    playIndex = index;

    const track = files[index];
    setCurrentSong(track);
    getColor(track);

    if (fromState !== from) {
      fromState = from;
      const queue = await TrackPlayer.getQueue();
      if (queue.length > 0) await TrackPlayer.reset();

      const tracks = files.map((track) => {
        return {
          id: track.id,
          title: track.name,
          artist: `${from} - L'épiant`,
          artwork: track.image,
          url: track.source,
          isLiveStream: from !== "Revue",
        };
      });

      await TrackPlayer.add(tracks);
    }

    await TrackPlayer.skip(index);
    await TrackPlayer.play();
  };

  const playRevue = async (revue) => {
    setCurrentSong(revue);
    getColor(revue);
    fromState = "Revue";

    await TrackPlayer.reset();

    await TrackPlayer.add({
      id: revue.id,
      title: revue.name,
      artist: `Du ${revue.date} - L'épiant`,
      artwork: revue.image,
      url: revue.source,
      isLiveStream: false,
    });
    await TrackPlayer.play();
  };

  const togglePlayPause = async (song) => {
    if (status === 3) {
      await TrackPlayer.stop();
    } else {
      await TrackPlayer.play();
    }
  };

  const handleNext = async () => {
    await TrackPlayer.skipToNext();
    const index = await TrackPlayer.getActiveTrackIndex();
    const track = files[index];
    if (fromState !== "Revue") setCurrentSong(track);
    getColor(track);
  };

  const handlePrev = async () => {
    await TrackPlayer.skipToPrevious();
    const index = await TrackPlayer.getActiveTrackIndex();
    const track = files[index];
    if (fromState !== "Revue") setCurrentSong(track);
    getColor(track);
  };

  useTrackPlayerEvents(
    ["playback-queue-ended", "playback-track-changed", "playback-state"],
    async (event) => {
      if (event.type === "playback-state") {
        if (event.state === "loading" || event.state === "buffering") setStatus(1);
        if (
          event.state === "ready" ||
          event.state === "paused" ||
          event.state === "stopped" ||
          event.state === "ended"
        )
          setStatus(2);
        if (event.state === "playing") setStatus(3);
        if (event.state === "none" || event.state === "error") setStatus(4);
      }
    }
  );

  return {
    files,
    currentSong,
    status,
    averageColor,
    isTrackPlayerInit,
    setFiles,
    preloadAudio,
    togglePlayPause,
    handleNext,
    handlePrev,
    playRevue,
    initializeTrackPlayer,
  };
}
