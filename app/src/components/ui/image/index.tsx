import { CachedImage } from "@georstat/react-native-image-cache";
import { FC, memo } from "react";
import { ImageStyle, StyleProp } from "react-native";

interface ImageProps {
  resizeMode?: "cover" | "contain" | "stretch";
  src: string | undefined;
  style?: StyleProp<ImageStyle>;
}

let placeholder = "https://via.placeholder.com/150x150";

const Image: FC<ImageProps> = memo(({ resizeMode = "cover", src, style }) => {
  return (
    <CachedImage
      resizeMode={resizeMode}
      source={src || placeholder}
      sourceAnimationDuration={100}
      style={[style, { width: "100%", height: "100%" }]}
    />
  );
});

export default Image;
