import { useState, useEffect } from "react";
import { Text, View, Pressable, ScrollView, TextInput } from "react-native";

import usePlayer from "../hook/usePlayer";
import TabLayout from "../components/layout/TabLayout";
import useStyles from "../hook/useStyle";
import RadioCard from "../components/radios/RadioCard";
import RadioCategories from "../components/radios/RadioCategories";
import useRadio from "../hook/useRadio";

export default function RadioScreen() {
  const { backgroundColorLight } = useStyles();
  const { setFiles, preloadAudio } = usePlayer();
  const { radios } = useRadio();

  const [searchRadio, setSearchRadio] = useState();
  const [filterRadio, setFilterRadio] = useState();
  const [categories, setCategories] = useState();

  async function filtrerParCategories() {
    if (!radios) return;
    const resul = radios.filter((item) => item.categories === searchRadio);
    setFilterRadio(resul);
  }

  async function extraireCategoriesUniques() {
    if (!radios) return;
    const categories = radios.map((item) => item.categories);
    const categoriesUniques = [...new Set(categories)];
    setCategories(categoriesUniques);
    setSearchRadio("Senegal");
  }

  useEffect(() => {
    filtrerParCategories();
  }, [radios, searchRadio]);

  useEffect(() => {
    setFiles(filterRadio);
  }, [radios, filterRadio]);

  useEffect(() => {
    extraireCategoriesUniques();
  }, [radios]);

  return (
    <TabLayout>
      <View style={{ paddingVertical: 12 }}>
        <View style={{ padding: 12, marginBottom: 20 }}>
          <TextInput
            style={{
              backgroundColor: backgroundColorLight,
              padding: 10,
              borderRadius: 10,
              height: 45,
            }}
            //value={"dddd"}
            placeholder="Recherche"
            keyboardType="numeric"
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              paddingHorizontal: 12,
            }}
          >
            {categories
              ? categories.map((categorie, i) => (
                  <RadioCategories
                    key={i}
                    title={categorie}
                    active={searchRadio === categorie}
                    setSearchRadio={setSearchRadio}
                  />
                ))
              : null}
          </View>
        </ScrollView>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "flex-start",
            gap: 12,
            padding: 12,
            marginTop: 5,
          }}
        >
          {filterRadio &&
            filterRadio.map((radio, i) => (
              <View key={i} style={{ width: "48%" }}>
                <RadioCard
                  index={i}
                  id={radio.id}
                  name={radio.name}
                  category={radio.categories}
                  image={radio.image}
                  preloadAudio={preloadAudio}
                />
              </View>
            ))}
        </View>
      </View>
    </TabLayout>
  );
}
