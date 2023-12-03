import useStyles from "../../hook/useStyle";
import { Pressable, Text } from "react-native";

export default function RadioCategories({ title = "-", active = false, setSearchRadio }) {
  const { color, backgroundColorLight, primaryColor } = useStyles();
  return (
    <Pressable
      onPress={() => setSearchRadio(title)}
      style={{
        backgroundColor: active ? primaryColor : backgroundColorLight,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 7,
      }}
    >
      <Text
        style={{
          color: active ? "white" : color,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
