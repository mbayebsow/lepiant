import { View } from "react-native";
import usePlayer from "../../hook/usePlayer";
import ImageComponent from "../Image.component";

export default function PlayerCover({ width = 45, borderRadius = 5 }) {
  const { currentSong } = usePlayer();

  return (
    <View
      style={{
        width: width,
        height: "auto",
        borderRadius: borderRadius,
        aspectRatio: 1 / 1,
        resizeMode: "stretch",
        overflow: "hidden",
      }}
    >
      <ImageComponent image={currentSong.image} />
    </View>
  );
}
