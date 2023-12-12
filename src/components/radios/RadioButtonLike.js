import { Heart } from "lucide-react-native";
import { Pressable } from "react-native";
import useStyles from "../../hook/useStyle";
import useRadio from "../../hook/useRadio";
import { useMemo } from "react";
import { trigger } from "react-native-haptic-feedback";

export default function RadioButtonLike({ id, color }) {
  const { primaryColor } = useStyles();
  const { radiosLiked, toggleRadioLike } = useRadio();

  const isLiked = useMemo(
    () => radiosLiked.find((radiosLikedId) => radiosLikedId === id),
    [radiosLiked, id]
  );

  return (
    <Pressable
      onPress={() => {
        toggleRadioLike(id);
        trigger("impactMedium");
      }}
      style={{ padding: 7 }}
    >
      <Heart
        size={18}
        color={color ? color : primaryColor}
        fill={isLiked ? (color ? color : primaryColor) : "transparent"}
      />
    </Pressable>
  );
}
