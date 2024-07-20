import { Text, View } from "react-native";
import Image from "../ui/image";
import useStyles from "../../hook/useStyle";
import { FC } from "react";

interface RevueCardProps {
  name: string;
  image: string;
}

const RevueCard: FC<RevueCardProps> = ({ name, image }) => {
  const { color, backgroundColorLight } = useStyles();

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 10,
        backgroundColor: backgroundColorLight,
        padding: 5,
        borderRadius: 10,
        width: 150,
        alignItems: "center",
      }}
    >
      <View style={{ height: 45, width: 45, borderRadius: 5, overflow: "hidden" }}>
        <Image src={image} />
      </View>
      <Text style={{ flex: 1, color }}>{name}</Text>
    </View>
  );
};
export default RevueCard;
