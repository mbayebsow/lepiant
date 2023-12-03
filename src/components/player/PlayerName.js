import { View, Text } from "react-native";
import usePlayer from "../../hook/usePlayer";
import useStyles from "../../hook/useStyle";

export default function PlayerName({ customColor }) {
  const { currentSong } = usePlayer();
  const { color } = useStyles();
  return (
    <View>
      <Text
        style={{
          fontSize: 17,
          fontWeight: 600,
          marginBottom: 2,
          color: customColor ? customColor : color,
        }}
      >
        {currentSong.name}
      </Text>
      <Text
        style={{
          fontSize: 12,
          marginBottom: 5,
          color: customColor ? customColor : color,
        }}
      >
        {currentSong.categories}
      </Text>
    </View>
  );
}
