import { ScrollView, StyleSheet, View } from "react-native";
import useChannelStore from "../hook/useChannel";
import ChannelItem from "../components/channel/channel-item";
import Input from "../components/ui/Input";
import { useState } from "react";
import useStyles from "../hook/useStyle";
import ArticleCategories from "../components/article/article-categories";

export default function ChannelsScreen() {
  const channels = useChannelStore((state) => state.channels);
  const [searchChannels, setSearchChannels] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<number>(0);
  const { backgroundColor, backgroundColorLight } = useStyles();

  return (
    <ScrollView style={styles.container} stickyHeaderIndices={[0]}>
      <View style={[styles.searchContainer, { backgroundColor }]}>
        <Input
          value={searchChannels}
          onChangeText={(value) => setSearchChannels(value)}
          placeholder="Rechercher une chaîne"
        />
        <ArticleCategories activeIndex={filterCategory} onClick={setFilterCategory} />
      </View>

      <View style={styles.channelContainer}>
        <View
          style={[styles.channelSubContainer, { backgroundColor: backgroundColorLight + "70" }]}
        >
          {channels &&
            channels
              .filter((channel) =>
                channel.name.toLowerCase().includes(searchChannels.toLowerCase())
              )
              .filter((channel) =>
                channel.sources.find((e) =>
                  filterCategory === 0 ? e : e.categorieId === filterCategory
                )
              )
              .map((channel, i) => (
                <View key={i}>
                  <ChannelItem channel={channel} viewType="list" />
                </View>
              ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    width: "100%",
    paddingVertical: 6,
  },
  channelContainer: {
    paddingBottom: 30,
    padding: 12,
  },
  channelSubContainer: {
    paddingHorizontal: 12,
    borderRadius: 20,
  },
});
