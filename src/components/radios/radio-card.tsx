import { FC } from "react";
import { Text, View } from "react-native";
import { Radio } from "../../utils/interfaces";
import { Play } from "lucide-react-native";
import useStyles from "../../hook/useStyle";
import RadioButtonLike from "./radio-button-like";
import usePlayerStore from "../../hook/usePlayer";
import Image from "../ui/image";

interface RadioCardProps {
  index?: number;
  radio: Radio;
}

const RadioCard: FC<RadioCardProps> = ({ radio }) => {
  const { id, name, categorie, image } = radio;
  const { color, colorLight, backgroundColorLight } = useStyles();
  const currentSong = usePlayerStore((state) => state.currentSong);

  return (
    <View
      style={{
        width: "100%",
      }}
    >
      <View
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: 1 / 1,
          borderRadius: 10,
          overflow: "hidden",
          backgroundColor: backgroundColorLight,
        }}
      >
        <Image src={image} />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: 5,
          marginTop: 2,
          gap: 5,
        }}
      >
        <View style={{ width: "70%" }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", color }} numberOfLines={1}>
            {name}
          </Text>
          <Text style={{ opacity: 0.5, color }}>{categorie.name}</Text>
        </View>

        <View
          style={{
            width: "30%",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <View>
            {currentSong?.id === id && <Play size={18} fill={colorLight} color={colorLight} />}
          </View>
          <RadioButtonLike id={id} />
        </View>
      </View>
    </View>
  );
};

export default RadioCard;
