import moment from "moment/moment";
import { Text, View, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Eye, Bookmark } from "lucide-react-native";

import ArticleShareButton from "./article/ShareButton";
import HeaderSection from "./HeaderSection";
import useArticle from "../hook/useArticle";
import useChannel from "../hook/useChannel";
import ImageComponent from "./Image.component";
import useStyles from "../hook/useStyle";
import useSession from "../hook/useSession";

function ArticleCategories({ id, title, active, getArticlesByCategory }) {
  const navigation = useNavigation()
  const { isLogin } = useSession()
  const { backgroundColorLight, primaryColor, color } = useStyles();

  return (
    <Pressable
      onPress={() => isLogin ? getArticlesByCategory(id) : navigation.navigate("Login")}
      style={{
        backgroundColor: active ? primaryColor : backgroundColorLight,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 7,
      }}
    >
      <Text
        style={{
          color: active ? "white" : color,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}

function ArticleItem({ article }) {
  const navigation = useNavigation();
  const { getChannelsDetails } = useChannel();
  const { setOpenArticleViewerDetails } = useArticle();
  const { color, colorLight, backgroundColor } = useStyles();

  return (
    <View
      style={{
        paddingVertical: 15,
        backgroundColor,
      }}
    >
      <Pressable
        onPress={() => {
          setOpenArticleViewerDetails(article);
          navigation.navigate("Article");
        }}
      >
        <View style={{ paddingHorizontal: 12 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 100,
                overflow: "hidden",
              }}
            >
              <ImageComponent image={getChannelsDetails(article.channel)?.logo} />
            </View>
            <View>
              <Text style={{ color: color }}>{getChannelsDetails(article.channel)?.name}</Text>
              <Text style={{ color: color }}>{moment(article.published).fromNow()}</Text>
            </View>
          </View>
        </View>

        <Text
          style={{
            color: color,
            fontSize: 16,
            fontWeight: 600,
            paddingHorizontal: 12,
            paddingBottom: 12,
          }}
        >
          {article.title}
        </Text>

        {article.image !== "null" && (
          <View
            style={{
              width: "100%",
              aspectRatio: "16/9",
              overflow: "hidden",
              backgroundColor: "black",
            }}
          >
            <ImageComponent image={article.image} />
          </View>
        )}

        <View style={{ padding: 12 }}>
          <Text numberOfLines={4} style={{ color: colorLight }}>
            {article.description && article.description}
          </Text>
        </View>
      </Pressable>

      <View
        style={{
          paddingHorizontal: 25,
          paddingVertical: 10,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Eye size={20} color="red" />
          <Text style={{ color }}>374</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            borderTopRightRadius: 100,
            width: 35,
            height: 35,
          }}
        >
          <Bookmark size={20} color="red" />
        </View>
        <ArticleShareButton article={article} />
      </View>
    </View>
  );
}

export default function News() {
  const { backgroundColorLight, backgroundColor, color } = useStyles();
  const { loading, categories, categoryIndex, articles, getArticlesByCategory } = useArticle();

  return (
    <View>
      <HeaderSection title="Dernieres actualites" span="il ya 1mn" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            paddingHorizontal: 12,
            paddingBottom: 12,
            backgroundColor,
          }}
        >
          {categories &&
            categories.map((category, i) => (
              <ArticleCategories
                key={i}
                id={category.id}
                title={category.name}
                active={categoryIndex === category.id}
                getArticlesByCategory={getArticlesByCategory}
              />
            ))}
        </View>
      </ScrollView>

      {loading && <ActivityIndicator size={50} color={color} />}

      <View
        style={{
          minHeight: 500,
          backgroundColor: backgroundColorLight,
          display: "flex",
          gap: 10,
        }}
      >
        {articles && articles.map((article, i) => <ArticleItem key={i} article={article} />)}
      </View>
    </View>
  );
}
