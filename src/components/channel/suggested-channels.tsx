import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import HeaderSection from "../header-section";
import ChannelItem from "./channel-item";
import useChannelStore from "../../hook/useChannel";
import useStyles from "../../hook/useStyle";
import { useCallback } from "react";

const SuggestedChannels = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const channels = useChannelStore((state) => state.channels);
  const subscribedChannels = useChannelStore((state) => state.subscribedChannels);
  const { backgroundColor } = useStyles();

  const filterNonSubscribedChannels = useCallback(() => {
    const subscribedChannelIds = subscribedChannels.map(
      (subscribedChannel) => subscribedChannel.channelId
    );
    const nonSubscribedChannels = channels.filter(
      (channel) => !subscribedChannelIds.includes(channel.id)
    );
    const shuffledChannels = nonSubscribedChannels.sort(() => Math.random() - 0.5);
    return shuffledChannels.slice(0, 6);
  }, [channels, subscribedChannels]);

  return (
    <View style={{ backgroundColor }}>
      <HeaderSection
        title="Plus de chaînes à découvrir"
        onPress={() => navigation.navigate("Chaines" as never)}
      />

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
          {filterNonSubscribedChannels().map((channel, i) => (
            <View key={i}>
              <ChannelItem channel={channel} viewType="card" />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default SuggestedChannels;
