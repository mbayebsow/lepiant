import { useMemo, useState } from "react";
import { View, TextInput } from "react-native";
import { Radio } from "../utils/interfaces";
import TabLayout from "../components/layout/app-layout";
import useStyles from "../hook/useStyle";
import RadioCategories from "../components/radios/radio-categories";
import useRadioStore from "../hook/useRadio";
import RadiosGrid from "../components/radios/radio-grid";

export default function RadioScreen() {
  const { backgroundColorLight, backgroundColor } = useStyles();
  const categorySelect = useRadioStore((state) => state.categorySelect);
  const radios = useRadioStore((state) => state.radios);
  const [filterRadios, setFilterRadios] = useState<Radio[]>([]);

  useMemo(() => {
    const filter = radios.filter((radio) => radio.categorie.id === categorySelect);
    setFilterRadios(filter);
  }, [categorySelect, radios]);

  return (
    <TabLayout stickyHeaderIndices={[1]}>
      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 10,
          backgroundColor,
        }}
      >
        <TextInput
          style={{
            backgroundColor: backgroundColorLight,
            padding: 10,
            borderRadius: 10,
            height: 45,
            marginBottom: 10,
          }}
          placeholder="Recherche"
          keyboardType="default"
        />

        <RadioCategories />
      </View>
      <RadiosGrid radios={filterRadios} from={categorySelect} />
    </TabLayout>
  );
}
