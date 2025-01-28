import { View } from "react-native";
import TabLayout from "../components/layout/app-layout";
import HeaderSection from "../components/header-section";
import useStyles from "../hook/useStyle";
import ArtilcesSaved from "../components/article/artilces-saved";
import RadioLiked from "../components/radios/radio-liked";
import SuggestedChannels from "../components/channel/suggested-channels";

export default function LibraryScreen() {
  const { backgroundColor, backgroundColorLight } = useStyles();

  return (
    <TabLayout>
      <View style={{ backgroundColor }}>
        <SuggestedChannels />
      </View>

      <View
        style={{
          backgroundColor,
          height: "auto",
          marginTop: 10,
        }}
      >
        <HeaderSection title="Mes radios" span="" />
        <RadioLiked />
      </View>

      <View
        style={{
          backgroundColor,
          height: "auto",
          marginTop: 10,
        }}
      >
        <HeaderSection title="Mes articles" span="" />
        <ArtilcesSaved />
      </View>
    </TabLayout>
  );
}
