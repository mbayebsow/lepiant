import { Pressable, Text } from "react-native";
import useStyles from "../../hook/useStyle";
import useRadio from "../../hook/useRadio";

export default function RadioCategories({ title = "-" }) {
  const { filterByCategory, categorySelect } = useRadio();
  const { color, backgroundColorLight, primaryColor } = useStyles();

  return (
    <Pressable
      onPress={() => filterByCategory(title)}
      style={{
        backgroundColor: categorySelect === title ? primaryColor : backgroundColorLight,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 7,
      }}
    >
      <Text
        style={{
          color: categorySelect === title ? "white" : color,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
