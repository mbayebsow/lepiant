import { useEffect, useState } from "react";
import { View, Dimensions, SafeAreaView, ScrollView, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Carousel from "react-native-reanimated-carousel";
import { AnimatedBackgroundColorView } from "react-native-animated-background-color-view";

import { ColorExtractor } from "../lib";
import useQuotidien from "../hook/useQuotidien";
import ImageComponent from "../components/Image.component";

export default function QuotidienScreen() {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const { quotidiens, qIndex, setQIndex } = useQuotidien();
  const [averageColor, setAverageColor] = useState(null);

  const getColor = async (image) => {
    const color = await ColorExtractor(image);
    if (color?.success) setAverageColor(color.color);
  };

  useEffect(() => {
    navigation.setOptions({ title: "CPQ de 11/11/2023" });
  }, []);

  useEffect(() => {
    if (!quotidiens) return;
    const image = quotidiens.files[qIndex];
    getColor(image.imageUrl);
  }, [qIndex]);

  return (
    <SafeAreaView style={{ flex: 1, display: "flex", justifyContent: "space-between" }}>
      <AnimatedBackgroundColorView
        color={averageColor ? averageColor.hex : "black"}
        initialColor="black"
        style={{ height: "auto" }}
      >
        <Carousel
          defaultIndex={qIndex}
          width={screenWidth}
          height={screenHeight - 235}
          data={quotidiens.files}
          onSnapToItem={(index) => setQIndex(index)}
          renderItem={({ item }) => (
            <View style={{ width: "100%", height: "100%", padding: 12 }}>
              <ImageComponent resizeMode="contain" image={item.imageUrl} />
            </View>
          )}
        />
      </AnimatedBackgroundColorView>

      <View style={{ height: 110 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {quotidiens.files.map((quotidien, i) => (
              <Pressable
                onPress={() => setQIndex(i)}
                key={i}
                style={{
                  height: "100%",
                  width: "auto",
                  aspectRatio: 3 / 4,
                  borderWidth: qIndex === i ? 5 : 0,
                  borderColor: "red",
                }}
              >
                <ImageComponent image={quotidien.thumbnailUrl} />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
