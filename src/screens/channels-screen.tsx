import { ScrollView, StyleSheet, View } from "react-native";
import useChannelStore from "../hook/useChannel";
import ChannelItem from "../components/channel/channel-item";
import Input from "../components/ui/Input";
import { useEffect, useState } from "react";
import { Channel } from "../utils/interfaces";

export default function ChannelsScreen() {
  const channels = useChannelStore((state) => state.channels);
  const [searchChannels, setSearchChannels] = useState<string>("");

  useEffect(() => {
    console.log(searchChannels);
  }, [searchChannels]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <Input
          value={searchChannels}
          onChangeText={(value) => setSearchChannels(value)}
          placeholder="Rechercher une chaîne"
        />
      </View>

      <View style={styles.channelContainer}>
        {channels &&
          channels
            .filter((channel) => channel.name.toLowerCase().includes(searchChannels.toLowerCase()))
            .map((channel, i) => (
              <View key={i}>
                <ChannelItem channel={channel} viewType="list" />
              </View>
            ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 12,
  },
  searchContainer: {
    width: "100%",
  },
  channelContainer: {
    paddingBottom: 60,
  },
});
