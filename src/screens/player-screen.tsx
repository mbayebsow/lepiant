import { View } from "react-native";
import { CassetteTape, Cast, Shuffle, Timer } from "lucide-react-native";
import LinearGradient from "react-native-linear-gradient";
import PlayerControl from "../components/player/player-control";
import PlayerCover from "../components/player/player-cover";
import PlayerName from "../components/player/player-name";
import useStyles from "../hook/useStyle";
import RadioButtonLike from "../components/radios/radio-button-like";
import usePlayerStore from "../hook/usePlayer";

export default function PlayerScreen() {
  const currentSong = usePlayerStore((state) => state.currentSong);
  const averageColor = usePlayerStore((state) => state.averageColor);
  const { backgroundColorLight, backgroundColor, color } = useStyles();

  return (
    <View
      style={{
        height: "100%",
        backgroundColor: averageColor ? averageColor?.color?.hex : backgroundColor,
      }}
    >
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.3)", "transparent", "rgba(0, 0, 0, 0.2)"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{
          padding: 20,
          width: "100%",
          height: "100%",
        }}
      >
        <View
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginVertical: 5,
            marginBottom: 40,
          }}
        >
          <View
            style={{
              width: 100,
              height: 5,
              backgroundColor: averageColor
                ? averageColor.color?.isDark
                  ? "white"
                  : "black"
                : color,
              borderRadius: 100,
            }}
          />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <View
            style={{
              backgroundColor: backgroundColorLight,
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            <PlayerCover width={"100%"} />
          </View>

          <View style={{ paddingHorizontal: 10 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <PlayerName />
              {currentSong?.id && (
                <RadioButtonLike
                  id={currentSong.id}
                  color={averageColor ? (averageColor.color?.isDark ? "white" : "black") : color}
                />
              )}
            </View>

            <View
              style={{
                width: "100%",
                borderWidth: 1,
                borderRadius: 100,
                borderColor: averageColor
                  ? averageColor.color?.isDark
                    ? "white"
                    : "black"
                  : color,
                marginBottom: 50,
                marginTop: 20,
              }}
            />

            <View
              style={{
                marginBottom: 80,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PlayerControl style={2} />
              <View
                style={{
                  backgroundColor: averageColor ? averageColor.color?.hex : "rgba(0, 0, 0, 0.3)",
                  width: "100%",
                  height: 50,
                  borderRadius: 100,
                  marginTop: 20,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 50,
                }}
              >
                <Cast
                  size={20}
                  color={averageColor ? (averageColor.color?.isLight ? "black" : "white") : "white"}
                />
                <Timer
                  size={20}
                  color={averageColor ? (averageColor.color?.isLight ? "black" : "white") : "white"}
                />
                <Shuffle
                  size={20}
                  color={averageColor ? (averageColor.color?.isLight ? "black" : "white") : "white"}
                />
                <CassetteTape
                  size={20}
                  color={averageColor ? (averageColor.color?.isLight ? "black" : "white") : "white"}
                />
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
