import { Pressable, ScrollView, View } from "react-native";
import TabLayout from "../components/layout/app-layout";
import HeaderSection from "../components/header-section";
import useStyles from "../hook/useStyle";
import useChannelStore from "../hook/useChannel";
import ChannelItem from "../components/channel/channel-item";
import { Plus } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import ArtilcesSaved from "../components/article/artilces-saved";
import RadioLiked from "../components/radios/radio-liked";

export default function LibraryScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { backgroundColor, backgroundColorLight } = useStyles();
  const channels = useChannelStore((state) => state.channels);

  return (
    <TabLayout>
      <View style={{ backgroundColor }}>
        <HeaderSection title="Chaînes" span="" />
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              paddingHorizontal: 12,
              paddingBottom: 12,
            }}
          >
            {channels &&
              channels.slice(0, 6).map((channel, i) => (
                <View key={i}>
                  <ChannelItem channel={channel} viewType="card" />
                </View>
              ))}

            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 20,
              }}
            >
              <Pressable
                onPress={() => navigation.navigate("Chaines" as never)}
                style={{
                  backgroundColor: "#eb445a21",
                  borderRadius: 100,
                  padding: 5,
                }}
              >
                <Plus size={30} color="#eb445a" />
              </Pressable>
            </View>
          </View>
        </ScrollView>
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
