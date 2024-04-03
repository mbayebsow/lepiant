import { Pressable, ScrollView, Text } from "react-native";
import useStyles from "../../hook/useStyle";
import useRadioStore from "../../hook/useRadio";
import { View } from "react-native";
import usePlayerStore from "../../hook/usePlayer";
import { useEffect } from "react";
import { radioToPlaylist } from "../../utils/helpers/playlist-mapping";

const RadioCategories = () => {
  const categories = useRadioStore((state) => state.categories);
  const setCategories = useRadioStore((state) => state.setCategories);
  const categorySelect = useRadioStore((state) => state.categorySelect);
  const radios = useRadioStore((state) => state.radios);
  const setPlaylist = usePlayerStore((state) => state.setPlaylist);
  const { color, backgroundColorLight, primaryColor, backgroundColor } = useStyles();

  async function handleSelectCategory(id: number) {
    const filterRadio = radios
      .filter((radio) => radio.categorie.id === id)
      .map((radio) => radioToPlaylist(radio));
    await setPlaylist(filterRadio, id);
    setCategories(id);
  }

  useEffect(() => {
    handleSelectCategory(categorySelect);
  }, []);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{
        backgroundColor,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
        }}
      >
        {categories &&
          categories.map((category, i) => (
            <Pressable
              key={i}
              onPress={() => handleSelectCategory(category.id)}
              style={{
                backgroundColor:
                  categorySelect === category.id ? primaryColor : backgroundColorLight,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 7,
              }}
            >
              <Text
                style={{
                  color: categorySelect === category.id ? "white" : color,
                }}
              >
                {category.name}
              </Text>
            </Pressable>
          ))}
      </View>
    </ScrollView>
  );
};

export default RadioCategories;
