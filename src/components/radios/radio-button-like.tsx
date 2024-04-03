import { Heart } from "lucide-react-native";
import { Pressable } from "react-native";
import { FC, useMemo } from "react";
import { trigger } from "react-native-haptic-feedback";
import useRadioStore from "../../hook/useRadio";
import useStyles from "../../hook/useStyle";

interface RadioButtonLikeProps {
  id: number;
  color?: string;
}

const RadioButtonLike: FC<RadioButtonLikeProps> = ({ id, color }) => {
  const { primaryColor } = useStyles();
  const radiosLiked = useRadioStore((state) => state.radiosLiked);
  const toggleLike = useRadioStore((state) => state.toggleLike);

  const isLiked = useMemo(
    () => (radiosLiked.find((radio) => radio.id === id) ? true : false),
    [radiosLiked, id]
  );

  return (
    <Pressable
      onPress={() => {
        toggleLike(id);
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
};

export default RadioButtonLike;
