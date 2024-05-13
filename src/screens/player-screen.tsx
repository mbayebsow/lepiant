import { SafeAreaView, View } from "react-native";
import { CassetteTape, Cast, Shuffle, Timer } from "lucide-react-native";
import LinearGradient from "react-native-linear-gradient";
import PlayerControl from "../components/player/player-control";
import PlayerCover from "../components/player/player-cover";
import PlayerName from "../components/player/player-name";
import useStyles from "../hook/useStyle";
import RadioButtonLike from "../components/radios/radio-button-like";
import usePlayerStore from "../hook/usePlayer";
import ModalPageLayout from "../components/layout/modal-page-layout";

const BackgroundComponent = () => {
  const averageColor = usePlayerStore(state => state.averageColor);
  const { backgroundColor } = useStyles();
  return (
    <LinearGradient
      colors={["transparent", "rgba(0, 0, 0, 0.4)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1.5 }}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: averageColor ? averageColor.color?.hex : backgroundColor,
      }}
    />
  );
};

export default function PlayerScreen() {
  const currentSong = usePlayerStore(state => state.currentSong);
  const averageColor = usePlayerStore(state => state.averageColor);
  const playlistFrom = usePlayerStore(state => state.playlistFrom);
  const { backgroundColorLight, color } = useStyles();

  return (
    <ModalPageLayout height="100%" backgroundComponent={<BackgroundComponent />}>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "97%",
          padding: 20,
        }}>
        <View
          style={{
            backgroundColor: backgroundColorLight,
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 20,
          }}>
          <PlayerCover width={"100%"} />
        </View>

        <View
          style={{
            paddingHorizontal: 20,
            justifyContent: "center",
            alignItems: "center",
          }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}>
            <PlayerName />
            {currentSong?.id && playlistFrom !== "revue" && (
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
              borderColor: averageColor ? (averageColor.color?.isDark ? "white" : "black") : color,
              marginBottom: 30,
              marginTop: 20,
              opacity: 0.5,
            }}
          />

          <PlayerControl style={2} />
        </View>

        <View
          style={{
            paddingHorizontal: 40,
            width: "100%",
            marginTop: 50,
          }}>
          <View
            style={{
              backgroundColor: averageColor ? averageColor.color?.hex : "rgba(0, 0, 0, 0.3)",
              width: "100%",
              height: 50,
              borderRadius: 100,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 30,
            }}>
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
    </ModalPageLayout>
  );
}
