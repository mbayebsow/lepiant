import moment from "moment/moment";
import { useMemo, useState } from "react";
import { View, Dimensions, SafeAreaView, ScrollView, Pressable } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import Carousel from "react-native-reanimated-carousel";

import Image from "../components/ui/image";
import { QuotidienNavigateParams } from "../utils/types";
import { getColorAverage } from "../utils/helpers/colorAverage";
import { AverageColor } from "../utils/interfaces";
import useStyles from "../hook/useStyle";
import { StackNavigationProp } from "@react-navigation/stack";

export default function QuotidienScreen() {
  const route = useRoute<RouteProp<QuotidienNavigateParams, "Quotidien">>();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { backgroundColor } = useStyles();
  const { quotidiens, activeIndex } = route.params;
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [index, setIndex] = useState(activeIndex);
  const [averageColor, setAverageColor] = useState<AverageColor | false>(false);

  const getColor = async (image: string) => {
    const color = await getColorAverage(image);
    setAverageColor(color);
    if (color) {
      navigation.setOptions({
        headerStyle: { backgroundColor: color.success ? color.color?.hex : backgroundColor },
      });
    }
  };

  useMemo(() => {
    const image = quotidiens[index];
    getColor(image.images);
  }, [index]);

  return (
    <SafeAreaView style={{ flex: 1, display: "flex", justifyContent: "space-between" }}>
      <View
        style={{
          height: "auto",
          backgroundColor: averageColor ? averageColor.color?.hex : backgroundColor,
        }}
      >
        <Carousel
          defaultIndex={index}
          width={screenWidth}
          height={screenHeight - 245}
          data={quotidiens}
          onSnapToItem={(index) => setIndex(index)}
          renderItem={({ item }) => (
            <View style={{ width: "100%", height: "100%", padding: 12 }}>
              <Image resizeMode="contain" src={item.images} />
            </View>
          )}
        />
      </View>

      <View style={{ height: 150 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              padding: 7,
              paddingBottom: 20,
            }}
          >
            {quotidiens.map((quotidien, i) => (
              <Pressable
                onPress={() => setIndex(i)}
                key={i}
                style={{
                  height: "100%",
                  width: "auto",
                  aspectRatio: 3 / 4.5,
                  borderWidth: index === i ? 2 : 0,
                  borderColor: "red",
                }}
              >
                <Image src={quotidien.thumbnailUrl} />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
