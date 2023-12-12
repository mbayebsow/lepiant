import { useEffect } from "react";
import { View, ScrollView, TextInput, ActivityIndicator } from "react-native";

import TabLayout from "../components/layout/TabLayout";
import useStyles from "../hook/useStyle";
import RadioCard from "../components/radios/RadioCard";
import RadioCategories from "../components/radios/RadioCategories";
import useRadio from "../hook/useRadio";

export default function RadioScreen() {
  const { backgroundColorLight } = useStyles();
  const { filterResult, categories, filterByCategory } = useRadio();

  useEffect(() => {
    filterByCategory("Senegal");
    console.log("render radio screen");
  }, []);

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
            placeholder="Recherche"
            keyboardType="numeric"
          />
        </View>

        <View>
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
                ? categories.map((category, i) => <RadioCategories key={i} title={category} />)
                : null}
            </View>
          </ScrollView>
        </View>

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
          {filterResult.length > 0 ? (
            filterResult.map((radio, i) => (
              <View key={i} style={{ width: "48%" }}>
                <RadioCard
                  index={i}
                  id={radio.id}
                  name={radio.name}
                  category={radio.categories}
                  image={radio.image}
                />
              </View>
            ))
          ) : (
            <View
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <ActivityIndicator />
            </View>
          )}
        </View>
      </View>
    </TabLayout>
  );
}
