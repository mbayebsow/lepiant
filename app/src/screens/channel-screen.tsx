import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Header, LargeHeader, ScrollViewWithHeaders } from "@codeherence/react-native-header";
import useStyles from "../hook/useStyle";
import { Article, Channel } from "../utils/interfaces";
import { SharedValue } from "react-native-reanimated";
import { FC, useEffect, useState } from "react";
import { fetchArticles } from "../services/articles-service";
import ArticleItem from "../components/article/article-item";
import Image from "../components/ui/image";
import Divider from "../components/ui/devider";
import { ChevronLeft, Globe } from "lucide-react-native";
import ChannelSubscribButton from "../components/channel/channel-subscrib-button";
import useChannelStore from "../hook/useChannel";
import countryFlag from "../utils/constant/country-flag";
import { StackNavigationProp } from "@react-navigation/stack";
import useArticleStore from "../hook/useArticle";

type ParamChannel = {
  Chaine: {
    channel: Channel;
  };
};

const HeaderCenter: FC<{ channel: Channel }> = ({ channel }) => {
  const { color } = useStyles();
  return channel.fullLogo ? (
    <View style={{ width: 150, height: 30 }}>
      <Image src={channel.fullLogo} resizeMode="contain" />
    </View>
  ) : (
    <Text style={{ fontSize: 20, fontWeight: "bold", color }}>{channel.name}</Text>
  );
};

const HeaderComponent = ({ showNavBar }: { showNavBar: SharedValue<number> }) => {
  const route = useRoute<RouteProp<ParamChannel, "Chaine">>();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { channel } = route.params;
  const { color } = useStyles();

  return (
    <Header
      borderWidth={0}
      showNavBar={showNavBar}
      headerStyle={{ height: 85 }}
      headerLeft={
        <Pressable onPress={() => navigation.goBack()}>
          <ChevronLeft color={color} />
        </Pressable>
      }
      headerCenter={<HeaderCenter channel={channel} />}
    />
  );
};

const LargeHeaderComponent = () => {
  const route = useRoute<RouteProp<ParamChannel, "Chaine">>();
  const { channel } = route.params;
  const { color, colorLight, backgroundColorLight } = useStyles();
  const ch = useChannelStore((state) => state.channels.find((c) => c.id === channel.id) || channel);
  const categories = useArticleStore((state) => state.categories);

  return (
    <LargeHeader
      headerStyle={{
        borderBottomWidth: 1,
        borderBottomColor: backgroundColorLight,
      }}
    >
      <View
        style={{
          alignItems: "center",
          width: "100%",
          display: "flex",
          gap: 10,
          paddingBottom: 5,
        }}
      >
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 15,
          }}
        >
          <View style={{ width: 80, height: 80, borderRadius: 100, overflow: "hidden" }}>
            <Image src={ch.logo} />
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Text style={{ fontSize: 25, fontWeight: "bold", color }}>{ch.name}</Text>
            <Text style={{ fontSize: 12, fontWeight: "bold", color: colorLight, marginBottom: 2 }}>
              {ch.webSite}
            </Text>

            <View style={{ display: "flex", flexDirection: "row", gap: 5, paddingVertical: 2 }}>
              <Text style={{ fontSize: 12, fontWeight: "bold", color: colorLight }}>
                140 Suivie
              </Text>

              <Divider orientation="vertical" />

              <Text style={{ fontSize: 12, fontWeight: "bold", color: colorLight }}>
                Region: {countryFlag.find((c) => c.code === ch.country.toUpperCase())?.emoji}
              </Text>

              <Divider orientation="vertical" />

              <Text style={{ fontSize: 12, fontWeight: "bold", color: colorLight }}>
                Langue: {countryFlag.find((c) => c.code === ch.language.toUpperCase())?.emoji}
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 5, paddingVertical: 2 }}>
              {channel.sources.map((source, i) => (
                <Text key={i} style={{ fontSize: 12, fontWeight: "bold", color: colorLight }}>
                  #{categories.find((c) => c.id === source.categorieId)?.name}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <View style={{ width: "100%", marginTop: 10 }}>
          <ChannelSubscribButton channel={ch} />
        </View>
      </View>
    </LargeHeader>
  );
};

const ChannelScreen = () => {
  const [articles, setArticles] = useState<Article[] | false>(false);
  const route = useRoute<RouteProp<ParamChannel, "Chaine">>();
  const { backgroundColorLight } = useStyles();
  const { channel } = route.params;

  const fetchChannelArticles = async () => {
    const entry = await fetchArticles(null, channel.id);
    setArticles(entry);
  };

  useEffect(() => {
    fetchChannelArticles();
  }, [channel]);

  return (
    <ScrollViewWithHeaders
      HeaderComponent={HeaderComponent}
      LargeHeaderComponent={LargeHeaderComponent}
    >
      <View style={{ padding: 0 }}>
        {articles ? (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              backgroundColor: backgroundColorLight,
            }}
          >
            {articles.map((article, i) => (
              <ArticleItem key={i} article={article} />
            ))}
          </View>
        ) : (
          <ActivityIndicator />
        )}
      </View>
    </ScrollViewWithHeaders>
  );
};

export default ChannelScreen;
