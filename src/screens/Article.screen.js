import moment from "moment/moment";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Pressable,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import RenderHtml, { HTMLElementModel, HTMLContentModel } from "react-native-render-html";
import useArticle from "../hook/useArticle";
import ImageComponent from "../components/Image.component";
import useStyles from "../hook/useStyle";
import ArticleShareButton from "../components/article/ShareButton";
import useChannel from "../hook/useChannel";

const customHTMLElementModels = {
  label: HTMLElementModel.fromCustomModel({
    tagName: "label",
    mixedUAStyles: {
      display: "none",
    },
    contentModel: HTMLContentModel.block,
  }),
  source: HTMLElementModel.fromCustomModel({
    tagName: "source",
    mixedUAStyles: {
      display: "none",
    },
    contentModel: HTMLContentModel.block,
  }),
  iframe: HTMLElementModel.fromCustomModel({
    tagName: "iframe",
    mixedUAStyles: {
      display: "none",
    },
    contentModel: HTMLContentModel.block,
  }),
  a: HTMLElementModel.fromCustomModel({
    tagName: "a",
    mixedUAStyles: {
      color: "black",
    },
    contentModel: HTMLContentModel.block,
  }),
  svg: HTMLElementModel.fromCustomModel({
    tagName: "svg",
    mixedUAStyles: {
      display: "none",
    },
    contentModel: HTMLContentModel.block,
  }),
};

function TextZoom({ textZoom, setTextZoom }) {
  const { backgroundColorLight, color } = useStyles();

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
      }}
    >
      <Pressable
        style={{
          backgroundColor: backgroundColorLight,
          borderRadius: 100,
          width: 35,
          height: 35,
          padding: 8,
        }}
        onPress={() => textZoom > 1 && setTextZoom(textZoom - 0.5)}
      >
        <Text
          style={{
            fontSize: 13,
            textAlign: "center",
            color,
          }}
        >
          -A
        </Text>
      </Pressable>
      <Pressable
        style={{
          backgroundColor: backgroundColorLight,
          padding: 8,
          borderRadius: 100,
          width: 35,
          height: 35,
        }}
        onPress={() => textZoom < 2.5 && setTextZoom(textZoom + 0.5)}
      >
        <Text
          style={{
            fontSize: 13,
            textAlign: "center",
            color,
          }}
        >
          +A
        </Text>
      </Pressable>
    </View>
  );
}

function ChannelLogo({ image }) {
  return (
    <Image
      style={{ width: 150, height: 30, resizeMode: "contain" }}
      source={{
        uri: image,
      }}
    />
  );
}

export default function ArticleScreen() {
  const navigation = useNavigation();
  const [article, setArticle] = useState(null);
  const [textZoom, setTextZoom] = useState(1);
  const { openArticleViewerDetails } = useArticle();
  const { getChannelsDetails } = useChannel();
  const { width } = useWindowDimensions();
  const { backgroundColor, color, primaryColor10, backgroundColorLight } = useStyles();

  const tagsStyles = {
    p: {
      fontSize: 20 * textZoom,
      margin: 0,
      marginBottom: 10,
      padding: 0,
      textAlign: "left",
      color,
    },
    h1: {
      fontSize: 23 * textZoom,
      color,
    },
    h2: {
      fontSize: 22 * textZoom,
      color,
    },
    h3: {
      fontSize: 21 * textZoom,
      color,
    },
    img: {
      display: "none",
    },
    section: {
      margin: 0,
      padding: 0,
    },
    figcaption: {
      margin: 0,
      padding: 0,
    },
    figure: {
      margin: 0,
      padding: 0,
    },
    span: {
      display: "none",
      color,
    },
    picture: {
      display: "none",
    },
    li: {
      display: "none",
      color,
    },
    ul: {
      display: "none",
      color,
    },
  };

  const getChannelDetail = async () => {
    const channel = getChannelsDetails(openArticleViewerDetails.channel);

    navigation.setOptions({
      headerTitle: () => <ChannelLogo image={channel.fullLogo} />,
    });
  };

  const getHtml = async (link) => {
    setArticle(null);
    try {
      const data = await fetch(`https://extractor-lepiant.deno.dev?url=${link}`).then((response) =>
        response.json()
      );
      setArticle(data);
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            marginRight: 12,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <TextZoom setTextZoom={setTextZoom} textZoom={textZoom} />

          <View
            style={{
              backgroundColor: primaryColor10,
              borderRadius: 100,
              width: 35,
              height: 35,
            }}
          >
            <ArticleShareButton article={openArticleViewerDetails} />
          </View>
        </View>
      ),
    });
  }, [textZoom]);

  useEffect(() => {
    getHtml(openArticleViewerDetails?.link);
    getChannelDetail();
  }, [openArticleViewerDetails]);

  return (
    <ScrollView style={{ backgroundColor }}>
      {article ? (
        <View>
          <Text style={{ fontSize: 23, fontWeight: "bold", padding: 12, color }}>
            {article?.title}
          </Text>

          <View style={{ width: "100%", aspectRatio: 16 / 9 }}>
            <ImageComponent image={article?.image} />
          </View>
          <View
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          >
            {openArticleViewerDetails.channel && (
              <View
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 100,
                  overflow: "hidden",
                }}
              >
                <ImageComponent image={getChannelsDetails(openArticleViewerDetails.channel).logo} />
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
              <Text style={{ color }}>{article.source}</Text>
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
          <View pointerEvents="none" style={{ padding: 12 }}>
            {article?.content && (
              <RenderHtml
                contentWidth={width}
                tagsStyles={tagsStyles}
                customHTMLElementModels={customHTMLElementModels}
                source={{
                  html: article.content,
                }}
              />
            )}
          </View>
        </View>
      ) : (
        <ActivityIndicator size={100} />
      )}
    </ScrollView>
  );
}
