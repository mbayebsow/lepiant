import { CachedImage } from "@georstat/react-native-image-cache";

let placeholder = "https://via.placeholder.com/150x150";

export default function ImageComponent({ resizeMode = "cover", image }) {
  return (
    <CachedImage
      resizeMode={resizeMode}
      source={image}
      sourceAnimationDuration={100}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
