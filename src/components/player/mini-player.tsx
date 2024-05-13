import { View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PlayerControl from "./player-control";
import PlayerCover from "./player-cover";
import PlayerName from "./player-name";
import useStyles from "../../hook/useStyle";
import usePlayerStore from "../../hook/usePlayer";
import { Event, useTrackPlayerEvents } from "react-native-track-player";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMemo } from "react";

const MiniPlayer = () => {
  const currentSong = usePlayerStore(state => state.currentSong);
  const averageColor = usePlayerStore(state => state.averageColor);
  const setCurrentSong = usePlayerStore(state => state.setCurrentSong);
  const updateAverageColor = usePlayerStore(state => state.updateAverageColor);
  const setStatus = usePlayerStore(state => state.setStatus);
  const handleNext = usePlayerStore(state => state.handleNext);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { backgroundColorLight } = useStyles();

  useTrackPlayerEvents(
    [Event.PlaybackQueueEnded, Event.PlaybackActiveTrackChanged, Event.PlaybackState],
    async event => {
      if (event.type === "playback-state") {
        if (event.state === "error") handleNext();
        if (event.state === "playing") setStatus(3);
        if (event.state === "none") setStatus(4);

        if (event.state === "loading" || event.state === "buffering") setStatus(1);
        if (
          event.state === "ready" ||
          event.state === "paused" ||
          event.state === "stopped" ||
          event.state === "ended"
        )
          setStatus(2);
      }
      if (event.type === "playback-active-track-changed") {
        if (event.track) {
          setCurrentSong(event.track);
        }
      }
    },
  );

  return (
    currentSong && (
      <View
        style={{
          backgroundColor: averageColor ? averageColor.color?.hex : backgroundColorLight,
          padding: 8,
          paddingRight: 10,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}>
        <Pressable
          onPress={() => navigation.navigate("Player")}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            width: "80%",
          }}>
          <PlayerCover />
          <PlayerName />
        </Pressable>

        <PlayerControl />
      </View>
    )
  );
};

export default MiniPlayer;
