import { View, Pressable, ActivityIndicator } from "react-native";
import { Play, Pause, AlertTriangle, SkipBack, SkipForward } from "lucide-react-native";
import useStyles from "../../hook/useStyle";
import usePlayerStore from "../../hook/usePlayer";
import { FC } from "react";

interface PlayerControlProps {
  style?: 1 | 2;
}

const PlayerControl: FC<PlayerControlProps> = ({ style = 1 }) => {
  const status = usePlayerStore((state) => state.status);
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);
  const handleNext = usePlayerStore((state) => state.handleNext);
  const handlePrev = usePlayerStore((state) => state.handlePrev);
  const averageColor = usePlayerStore((state) => state.averageColor);
  const { color } = useStyles();

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 50,
      }}
    >
      {style === 2 && (
        <Pressable onPress={handlePrev}>
          <SkipBack
            color={averageColor ? (averageColor.color?.isDark ? "white" : "black") : color}
            fill={averageColor ? (averageColor.color?.isDark ? "white" : "black") : color}
            size={40}
          />
        </Pressable>
      )}

      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: style === 1 ? 45 : 80,
          height: style === 1 ? 45 : 80,
          borderRadius: 100,
        }}
      >
        {status === 1 && (
          <ActivityIndicator
            size={50}
            color={averageColor ? (averageColor.color?.isDark ? "white" : "black") : color}
          />
        )}
        {status === 4 && (
          <AlertTriangle
            color={averageColor ? (averageColor.color?.isDark ? "white" : "black") : color}
            size={30}
          />
        )}
        {status === 3 && (
          <Pressable onPress={togglePlayPause}>
            <Pause
              color={averageColor ? (averageColor.color?.isDark ? "white" : "black") : color}
              fill={averageColor ? (averageColor.color?.isDark ? "white" : "black") : color}
              size={style === 1 ? 30 : 60}
            />
          </Pressable>
        )}
        {status === 2 && (
          <Pressable onPress={togglePlayPause}>
            <Play
              color={averageColor ? (averageColor.color?.isDark ? "white" : "black") : color}
              fill={averageColor ? (averageColor.color?.isDark ? "white" : "black") : color}
              size={style === 1 ? 30 : 60}
            />
          </Pressable>
        )}
      </View>

      {style === 2 && (
        <Pressable onPress={handleNext}>
          <SkipForward
            color={averageColor ? (averageColor.color?.isDark ? "white" : "black") : color}
            fill={averageColor ? (averageColor.color?.isDark ? "white" : "black") : color}
            size={40}
          />
        </Pressable>
      )}
    </View>
  );
};

export default PlayerControl;
