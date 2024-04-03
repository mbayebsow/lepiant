import moment from "moment/moment";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Image,
  StyleSheet,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import ImageComponent from "../components/ui/image";
import useStyles from "../hook/useStyle";
import ArticleShareButton from "../components/article/article-share-button";
import { Article, ArticleContent, Channel } from "../utils/interfaces";
import { getArticle } from "../services/articles-service";
import Divider from "../components/ui/devider";

type ParamArticle = {
  Article: {
    article: Article;
    channel: Channel;
  };
};

const ArticleActionFab: FC<{
  textZoom: number;
  setTextZoom: Dispatch<SetStateAction<number>>;
  article: Article;
  channel: Channel;
}> = ({ textZoom, setTextZoom, article, channel }) => {
  return (
    <View style={styles.container}>
      <View style={styles.fab}>
        <Pressable
          style={styles.fabButtons}
          onPress={() => textZoom > 1 && setTextZoom(textZoom - 0.5)}
        >
          <Text style={styles.fabButtonsTitle}>-A</Text>
        </Pressable>

        <Divider orientation="vertical" />

        <Pressable
          style={styles.fabButtons}
          onPress={() => textZoom < 2.5 && setTextZoom(textZoom + 0.5)}
        >
          <Text style={styles.fabButtonsTitle}>+A</Text>
        </Pressable>

        <Divider orientation="vertical" />

        <ArticleShareButton
          styles={styles.fabButtons}
          iconSize={18}
          article={article}
          channel={channel}
        />
      </View>
    </View>
  );
};

const HeaderCenter: FC<{ channel: Channel }> = ({ channel }) =>
  channel.fullLogo ? (
    <Image
      source={{ uri: channel.fullLogo }}
      style={{ width: 150, height: 30, resizeMode: "contain" }}
    />
  ) : (
    <Text style={{ fontSize: 20, fontWeight: "bold" }}>{channel.name}</Text>
  );

const ArticleScreen = () => {
  const [textZoom, setTextZoom] = useState<number>(1);
  const [articleContent, setArticleContent] = useState<ArticleContent | null>(null);
  const route = useRoute<RouteProp<ParamArticle, "Article">>();
  const navigation = useNavigation();
  const { backgroundColor, color, backgroundColorLight } = useStyles();
  const { article, channel } = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderCenter channel={channel} />,
    });
    getArticle(article.id).then((articleContent) => {
      if (articleContent) setArticleContent(articleContent);
    });
  }, [article]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor }}>
        {articleContent ? (
          <View>
            <Text
              style={{
                fontSize: 27,
                fontWeight: "bold",
                paddingHorizontal: 12,
                paddingTop: 12,
                color,
              }}
            >
              {article.title}
            </Text>

            <View
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                padding: 12,
              }}
            >
              {channel && (
                <View
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: 100,
                    overflow: "hidden",
                  }}
                >
                  <ImageComponent src={channel.logo} />
                </View>
              )}
              <View
                style={{
                  borderEndWidth: 2,
                  backgroundColor: backgroundColorLight,
                  paddingHorizontal: 0.5,
                  marginHorizontal: 10,
                  height: 10,
                }}
              />
              <View>
                <Text style={{ color }}>{articleContent.source}</Text>
              </View>
              <View
                style={{
                  borderEndWidth: 2,
                  backgroundColor: backgroundColorLight,
                  paddingHorizontal: 0.5,
                  marginHorizontal: 10,
                  height: 10,
                }}
              />
              <View>
                <Text style={{ color }}>{moment(article.published).fromNow()}</Text>
              </View>
            </View>

            <View style={{ width: "100%", aspectRatio: 16 / 9 }}>
              <ImageComponent src={article.image} />
            </View>

            <View pointerEvents="none" style={{ padding: 20, marginBottom: 50 }}>
              <Text
                style={{
                  fontSize: 20 * textZoom,
                  color,
                  // textAlign: "justify",
                }}
              >
                {articleContent.content}
              </Text>

              {/*articleContent.content && (
              <RenderHtml
                contentWidth={width}
                tagsStyles={tagsStyles}
                customHTMLElementModels={customHTMLElementModels}
                source={{
                  html: articleContent.content,
                }}
              />
              )*/}
            </View>
          </View>
        ) : (
          <ActivityIndicator size={100} />
        )}
      </ScrollView>
      <ArticleActionFab
        textZoom={textZoom}
        setTextZoom={setTextZoom}
        article={article}
        channel={channel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    right: 0,
    left: 0,
    zIndex: 100,
  },
  fab: {
    borderRadius: 100,
    paddingHorizontal: 5,
    padding: 5,
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabButtons: {
    padding: 7,
    paddingHorizontal: 20,
  },
  fabButtonsTitle: {
    fontSize: 18,
    color: "black",
  },
});

export default ArticleScreen;
