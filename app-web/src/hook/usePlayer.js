import { createStore, createHook } from "react-sweet-state";
import { NativeAudio } from "@capacitor-community/native-audio";
import { average } from "color.js";

const Store = createStore({
  initialState: {
    averageColor: "var(--ion-background-color)",
    songIndex: null,
    files: [],
    currentSong: null,
    isPlaying: false,
    openFullPlayer: false,
    openPlayer: false,
  },
  actions: {
    setSongIndex:
      (songIndex) =>
      ({ setState }) => {
        setState({
          songIndex,
        });
      },
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
    setIsPlaying:
      (isPlaying) =>
      ({ setState }) => {
        setState({
          isPlaying,
        });
      },
    setOpenFullPlayer:
      (openFullPlayer) =>
      ({ setState }) => {
        setState({
          openFullPlayer,
        });
      },
    setOpenPlayer:
      (openPlayer) =>
      ({ setState }) => {
        setState({
          openPlayer,
        });
      },
  },
});

const getAverageColor = async (currentSong) => {
  const file = currentSong.image;
  const color = await average(file)
    .then((color) => `rgba(${color.join(",")}, .3)`)
    .catch((e) => null);

  if (color) return color;
  return null;
};

export default function usePlayer() {
  const playerStore = createHook(Store);
  const [
    { songIndex, files, currentSong, isPlaying, openFullPlayer, openPlayer, averageColor },
    {
      setAverageColor,
      setSongIndex,
      setFiles,
      setCurrentSong,
      setIsPlaying,
      setOpenFullPlayer,
      setOpenPlayer,
    },
  ] = playerStore();

  const unloadAudio = async () => {
    await NativeAudio.unload({
      assetId: currentSong.id,
    });
  };

  const preloadAudio = async (song) => {
    if (currentSong) unloadAudio();

    await NativeAudio.preload({
      assetId: song.id.toString(),
      assetPath: song.source,
      audioChannelNum: songIndex,
      isUrl: true,
    });
    setTimeout(async () => {
      await NativeAudio.play(
        {
          assetId: song.id,
        },
        1000
      );
      setIsPlaying(true);
    });
    setCurrentSong(song);
    const color = await getAverageColor(song);
    setAverageColor(color);
  };

  const togglePlayPause = async (song) => {
    const isCurrentPlaying = await NativeAudio.isPlaying({
      assetId: song ? song.id : currentSong.id,
    }).then((result) => result.isPlaying);

    if (isCurrentPlaying) {
      NativeAudio.stop({
        assetId: song ? song.id : currentSong.id,
      });
      setIsPlaying(false);
    } else {
      NativeAudio.play({
        assetId: song ? song.id : currentSong.id,
      });
      setIsPlaying(true);
    }
  };

  const handlePlay = async () => {
    NativeAudio.play({
      assetId: currentSong.id,
    });
    setIsPlaying(true);
  };

  const handleStop = async () => {
    NativeAudio.stop({
      assetId: currentSong.id,
    });
    setIsPlaying(false);
  };

  const handleNext = async () => {
    setSongIndex(songIndex + 1);
    const song = files[songIndex + 1];
    preloadAudio(song);
  };

  const handlePrev = async () => {
    setSongIndex(songIndex - 1);
    const song = files[songIndex - 1];
    preloadAudio(song);
  };

  return {
    files,
    songIndex,
    currentSong,
    isPlaying,
    openFullPlayer,
    openPlayer,
    averageColor,
    setOpenPlayer,
    setFiles,
    setSongIndex,
    setCurrentSong,
    setIsPlaying,
    unloadAudio,
    preloadAudio,
    togglePlayPause,
    handleNext,
    handlePrev,
    handlePlay,
    handleStop,
    setOpenFullPlayer,
  };
}
