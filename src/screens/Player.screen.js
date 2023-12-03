import { View } from "react-native";
import PlayerControl from "../components/player/PlayerControl";
import PlayerCover from "../components/player/PlayerCover";
import PlayerName from "../components/player/PlayerName";
import useStyles from "../hook/useStyle";
import usePlayer from "../hook/usePlayer";
import LinearGradient from "react-native-linear-gradient";
import { Airplay, CassetteTape, Cast, Heart, Shuffle, Timer } from "lucide-react-native";

export default function PlayerScreen() {
  const { averageColor } = usePlayer();
  const { backgroundColorLight, backgroundColor } = useStyles();

  return (
    <View
      style={{
        height: "100%",
        backgroundColor: averageColor ? averageColor.hex : backgroundColor,
      }}
    >
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.7)", "transparent", "rgba(0, 0, 0, 0.5)"]}
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
              backgroundColor: "white",
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
              <PlayerName customColor="white" />
              <Heart size={20} color="white" fill="white" />
            </View>

            <View
              style={{
                width: "100%",
                borderWidth: 1,
                borderRadius: 100,
                borderColor: "white",
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
              <PlayerControl style={2} customColor="white" />
              <View
                style={{
                  backgroundColor: averageColor ? averageColor.hex : "rgba(0, 0, 0, 0.3)",
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
                  color={averageColor ? (averageColor.isLight ? "black" : "white") : "white"}
                />
                <Timer
                  size={20}
                  color={averageColor ? (averageColor.isLight ? "black" : "white") : "white"}
                />
                <Shuffle
                  size={20}
                  color={averageColor ? (averageColor.isLight ? "black" : "white") : "white"}
                />
                <CassetteTape
                  size={20}
                  color={averageColor ? (averageColor.isLight ? "black" : "white") : "white"}
                />
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
