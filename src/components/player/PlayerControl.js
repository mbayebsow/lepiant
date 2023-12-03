import { View, Pressable, ActivityIndicator } from "react-native";
import {
  Play,
  Pause,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  SkipBack,
  SkipForward,
} from "lucide-react-native";
import usePlayer from "../../hook/usePlayer";
import useStyles from "../../hook/useStyle";

export default function PlayerControl({ style = 1, customColor }) {
  const { status, togglePlayPause, handleNext, handlePrev } = usePlayer();
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
            color={customColor ? customColor : color}
            fill={customColor ? customColor : color}
            size={style === 1 ? 30 : 40}
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
        {status === 1 && <ActivityIndicator size={50} color={customColor ? customColor : color} />}
        {status === 4 && <AlertTriangle color={customColor ? customColor : color} size={30} />}
        {status === 3 && (
          <Pressable onPress={togglePlayPause}>
            <Pause
              color={customColor ? customColor : color}
              fill={customColor ? customColor : color}
              size={style === 1 ? 30 : 60}
            />
          </Pressable>
        )}
        {status === 2 && (
          <Pressable onPress={togglePlayPause}>
            <Play
              color={customColor ? customColor : color}
              fill={customColor ? customColor : color}
              size={style === 1 ? 30 : 60}
            />
          </Pressable>
        )}
      </View>

      {style === 2 && (
        <Pressable onPress={handleNext}>
          <SkipForward
            color={customColor ? customColor : color}
            fill={customColor ? customColor : color}
            size={style === 1 ? 30 : 40}
          />
        </Pressable>
      )}
    </View>
  );
}
