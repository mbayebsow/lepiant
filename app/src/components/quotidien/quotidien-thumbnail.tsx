import { View } from "lucide-react-native";
import useStyles from "../../hook/useStyle";
import Image from "../ui/image";
import { Pressable } from "react-native";

interface QuotidienItemProps {
  image: string;
  onPress: () => void;
}

const QuotidienThumbnail = ({ image, onPress }: QuotidienItemProps) => {
  const { backgroundColorLight } = useStyles();
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: backgroundColorLight,
        borderColor: backgroundColorLight,
        borderWidth: 2,
        borderRadius: 7,
        aspectRatio: 3 / 4.4,
        width: 90,
        overflow: "hidden",
      }}
    >
      <Image src={image} resizeMode="cover" />
    </Pressable>
  );
};
export default QuotidienThumbnail;
