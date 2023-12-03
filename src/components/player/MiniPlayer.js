import { View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import usePlayer from "../../hook/usePlayer";
import PlayerControl from "./PlayerControl";
import PlayerCover from "./PlayerCover";
import PlayerName from "./PlayerName";
import useStyles from "../../hook/useStyle";
import LinearGradient from "react-native-linear-gradient";

export default function MiniPlayer() {
  const { currentSong, averageColor } = usePlayer();
  const navigation = useNavigation();
  const { backgroundColor, color } = useStyles();

  return (
    currentSong && (
      <View
        style={{
          backgroundColor: averageColor ? averageColor.hex : backgroundColor,
          width: "100%",
        }}
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.7)", averageColor ? averageColor.hex : backgroundColor]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={{
            padding: 8,
            paddingRight: 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Pressable
            onPress={() => navigation.navigate("Player")}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <PlayerCover />
            <PlayerName customColor="white" />
          </Pressable>
          <PlayerControl customColor="white" />
        </LinearGradient>
      </View>
    )
  );
}
