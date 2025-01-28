import { AnimatableNumericValue, DimensionValue, View } from "react-native";
import Image from "../ui/image";
import usePlayerStore from "../../hook/usePlayer";
import { FC } from "react";

interface PlayerCoverProps {
  width?: DimensionValue;
  borderRadius?: AnimatableNumericValue;
}

const PlayerCover: FC<PlayerCoverProps> = ({ width = 45, borderRadius = 5 }) => {
  const currentSong = usePlayerStore((state) => state.currentSong);

  return (
    <View
      style={{
        width: width,
        height: "auto",
        borderRadius: borderRadius,
        aspectRatio: 1 / 1,
        overflow: "hidden",
      }}
    >
      <Image src={currentSong?.artwork} />
    </View>
  );
};

export default PlayerCover;
