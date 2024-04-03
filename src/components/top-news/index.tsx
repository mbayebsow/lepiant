import { FC, useMemo, useState } from "react";
import { ImageBackground, Dimensions, View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "react-native-linear-gradient";
import { StackNavigationProp } from "@react-navigation/stack";
import { ArticleNavigateParams } from "../../utils/types";
import { Article, ArticleCategory, Channel } from "../../utils/interfaces";
import Carousel from "react-native-reanimated-carousel";
import useArticleStore from "../../hook/useArticle";
import useChannelStore from "../../hook/useChannel";

interface TopNewsCardProps {
  article: Article;
}

const TopNewsCard: FC<TopNewsCardProps> = ({ article }) => {
  const { title, image, channelId, categorieId } = article;
  const [channel, setChannel] = useState<Channel | undefined>(undefined);
  const [category, setCategory] = useState<ArticleCategory | undefined>(undefined);
  const getCategory = useArticleStore((state) => state.getCategory);
  const getChannel = useChannelStore((state) => state.getChannel);
  const navigation = useNavigation<StackNavigationProp<ArticleNavigateParams>>();

  useMemo(() => {
    getChannel(channelId).then((res) => setChannel(res));
    getCategory(categorieId).then((category) => setCategory(category));
  }, [article]);

  return (
    <Pressable onPress={() => navigation.navigate("Article", { article, channel })}>
      <ImageBackground
        source={{
          uri: image,
        }}
        style={{
          backgroundColor: "black",
          width: "100%",
          height: "100%",
        }}
      >
        <LinearGradient
          colors={["transparent", "#171717"]}
          style={{
            height: "100%",
          }}
        >
          <View style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
            <Text style={{ color: "white", fontSize: 10, marginBottom: 5 }}>
              {channel?.name} | #{category?.name}
            </Text>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "700" }}>{title}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
};

const TopNews = () => {
  const width = Dimensions.get("window").width;
  const articles = useArticleStore((state) => state.articles);

  return (
    articles && (
      <Carousel
        loop
        width={width}
        height={width / 1.7}
        autoPlay={true}
        data={articles.slice(0, 5)}
        autoPlayInterval={7000}
        scrollAnimationDuration={500}
        //onSnapToItem={(index) => console.log("current index:", index)}
        renderItem={({ index, item }) => <TopNewsCard article={item} />}
      />
    )
  );
};

export default TopNews;
