import { View, ActivityIndicator, Pressable } from "react-native";
import React, { FC } from "react";
import RadioCard from "./radio-card";
import { Radio } from "../../utils/interfaces";
import usePlayerStore from "../../hook/usePlayer";
import { radioToPlaylist } from "../../utils/helpers/playlist-mapping";

interface RadiosGridProps {
  radios: Radio[];
  from: string | number;
}

const RadiosGrid: FC<RadiosGridProps> = ({ radios, from }) => {
  const playAudio = usePlayerStore((state) => state.playAudio);
  const playlist = usePlayerStore((state) => state.playlist);
  const setPlaylist = usePlayerStore((state) => state.setPlaylist);

  const handlePlay = (radio: Radio) => {
    if (playlist?.from !== from) {
      const playlistMapping = radios.map((radio) => radioToPlaylist(radio));
      setPlaylist(playlistMapping, from).then(() => playAudio(radio.id, from));
    }
    playAudio(radio.id, from);
  };

  return radios.length > 0 ? (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        gap: 12,
        padding: 12,
        marginTop: 5,
      }}
    >
      {radios.map((radio, i) => (
        <Pressable key={i} onPress={() => handlePlay(radio)} style={{ width: "48%" }}>
          <RadioCard index={i} radio={radio} />
        </Pressable>
      ))}
    </View>
  ) : (
    <View
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <ActivityIndicator />
    </View>
  );
};

export default RadiosGrid;
