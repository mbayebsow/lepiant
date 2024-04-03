import moment from "moment/moment";
import { ActivityIndicator, Image, Pressable, ScrollView, View } from "react-native";
import { Plus } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { QuotidienNavigateParams } from "../utils/types";
import { Revues, TrackPlaylist } from "../utils/interfaces";
import config from "../utils/constant/config";
import useArticleStore from "../hook/useArticle";
import useStyles from "../hook/useStyle";
import useQuotidienStore from "../hook/useQuotidien";
import useRevueStore from "../hook/useRevue";
import usePlayerStore from "../hook/usePlayer";
import TopNews from "../components/top-news";
import TabLayout from "../components/layout/app-layout";
import HeaderSection from "../components/header-section";
import ArticleCategories from "../components/article/article-categories";
import ArticleItem from "../components/article/article-item";
import QuotidienThumbnail from "../components/quotidien/quotidien-thumbnail";
import RevueCard from "../components/revue/revue-card";

function LogoTitle() {
  return <Image style={{ width: 80, height: 35 }} source={require("../assets/icon-default.png")} />;
}

const QuotidienDaily = () => {
  const navigation = useNavigation<StackNavigationProp<QuotidienNavigateParams>>();
  const quotidiens = useQuotidienStore((state) => state.quotidiens);

  return (
    <View>
      <HeaderSection title="Une des journaux" span={moment(quotidiens?.createdTime).fromNow()} />
      {quotidiens ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              paddingHorizontal: 12,
            }}
          >
            {quotidiens.data.slice(0, 7).map((quotidien, i) => (
              <QuotidienThumbnail
                key={i}
                image={quotidien.thumbnailUrl}
                onPress={() =>
                  navigation.navigate("Quotidien", { quotidiens: quotidiens.data, activeIndex: i })
                }
              />
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
                onPress={() =>
                  navigation.navigate("Quotidien", { quotidiens: quotidiens.data, activeIndex: 7 })
                }
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
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
};

const RevuesDaily = () => {
  const revues = useRevueStore((state) => state.revues);
  const playlist = usePlayerStore((state) => state.playlist);
  const setPlaylist = usePlayerStore((state) => state.setPlaylist);
  const playAudio = usePlayerStore((state) => state.playAudio);

  function revueToPlaylist(revue: Revues): TrackPlaylist {
    return {
      id: revue.id,
      title: revue.name,
      artist: "L'epiant",
      artwork: config.DEFAULT_REVUE_IMAGE,
      url: revue.audio,
      isLiveStream: false,
    };
  }

  async function playRevue(revue: Revues) {
    if (playlist?.from !== "revue") {
      const revueParsed = revues?.data.map((revue) => revueToPlaylist(revue));
      if (revueParsed) await setPlaylist(revueParsed, "revue");
    }
    playAudio(revue.id, "revue");
  }
  return (
    <View>
      <HeaderSection
        title="Revue de pesse"
        span={revues ? moment(revues?.createdTime).fromNow() : ""}
      />
      {revues ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              paddingHorizontal: 12,
            }}
          >
            {revues.data.map((revue, i) => (
              <Pressable
                key={i}
                onPress={() => {
                  playRevue(revue);
                }}
              >
                <RevueCard name={revue.name} image={config.DEFAULT_REVUE_IMAGE} />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
};

const NewsScreen = () => {
  const { backgroundColorLight } = useStyles();
  const loading = useArticleStore((state) => state.loading);
  const articles = useArticleStore((state) => state.articles);
  return (
    <TabLayout
      headerCenter={<LogoTitle />}
      stickyHeaderIndices={[4]}
      hideLargeHeader
      showHeaderCenter
    >
      <TopNews />

      <RevuesDaily />
      <QuotidienDaily />

      <HeaderSection title="Dernieres actualites" span="il ya 1mn" />
      <ArticleCategories />

      <View>
        {loading && <ActivityIndicator />}
        <View
          style={{
            // minHeight: 500,
            backgroundColor: backgroundColorLight,
            display: "flex",
            gap: 10,
          }}
        >
          {articles && articles.map((article, i) => <ArticleItem key={i} article={article} />)}
        </View>
      </View>
    </TabLayout>
  );
};

export default NewsScreen;
