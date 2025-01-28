import { View, Text } from "react-native";
import useStyles from "../../hook/useStyle";
import usePlayerStore from "../../hook/usePlayer";

export default function PlayerName() {
  const currentSong = usePlayerStore(state => state.currentSong);
  const averageColor = usePlayerStore(state => state.averageColor);

  const { color } = useStyles();
  return (
    <View>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 2,
          color: averageColor ? (averageColor.color?.isDark ? "white" : "black") : color,
        }}>
        {currentSong?.title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          marginBottom: 5,
          color: averageColor ? (averageColor.color?.isDark ? "white" : "black") : color,
        }}>
        {currentSong?.artist}
      </Text>
    </View>
  );
}
