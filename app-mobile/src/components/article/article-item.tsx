import moment from "moment/moment";
import { FC, useMemo, useState } from "react";
import { Article, Channel } from "../../utils/interfaces";
import { Text, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BarChart2 } from "lucide-react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import ArticleShareButton from "./article-share-button";
import ImageComponent from "../ui/image";
import useStyles from "../../hook/useStyle";
import { ArticleNavigateParams, ChannelNavigateParams } from "../../utils/types";
import ArticleToggleSave from "./article-toggle-save";
import useChannelStore from "../../hook/useChannel";

interface ArticleItemProps {
  article: Article;
}

interface ChannelDetailsProps {
  channel: Channel | undefined;
  published: Date;
}

interface ArticleItemActionsProps {
  article: Article;
  channel: Channel | undefined;
}

const ArticleItemHeader: FC<ChannelDetailsProps> = ({ channel, published }) => {
  const { color } = useStyles();
  const navigation = useNavigation<StackNavigationProp<ChannelNavigateParams>>();

  return (
    <Pressable
      onPress={() => (channel ? navigation.navigate("Chaine", { channel }) : null)}
      style={{ paddingHorizontal: 12 }}
    >
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
          <ImageComponent src={channel?.logo} />
        </View>
        <View>
          <Text style={{ color: color }}>{channel?.name}</Text>
          <Text style={{ color: color }}>{moment(published).fromNow()}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const ArticleItemActions: FC<ArticleItemActionsProps> = ({ article, channel }) => {
  const { colorLight } = useStyles();
  return (
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
        <BarChart2 size={16} color="red" />
        <Text style={{ color: colorLight }}>374</Text>
      </View>
      <ArticleToggleSave article={article} />
      <ArticleShareButton article={article} channel={channel} />
    </View>
  );
};

const ArticleItem: FC<ArticleItemProps> = ({ article }) => {
  const [channel, setChannel] = useState<Channel | undefined>(undefined);
  const navigation = useNavigation<StackNavigationProp<ArticleNavigateParams>>();
  const getChannel = useChannelStore((state) => state.getChannel);
  const { color, backgroundColor } = useStyles();

  useMemo(() => {
    getChannel(article.channelId).then((res) => setChannel(res));
  }, [article]);

  return (
    <View
      style={{
        paddingVertical: 15,
        backgroundColor,
      }}
    >
      <ArticleItemHeader channel={channel} published={article.published} />
      <Pressable onPress={() => navigation.navigate("Article", { article, channel })}>
        <Text
          style={{
            color: color,
            fontSize: 16,
            fontWeight: "600",
            paddingHorizontal: 12,
            paddingBottom: 12,
          }}
        >
          {article.title}
        </Text>

        <View
          style={{
            width: "100%",
            aspectRatio: "16/9",
            overflow: "hidden",
            backgroundColor: "black",
          }}
        >
          <ImageComponent src={article.image} />
        </View>

        <View style={{ padding: 12 }}>
          <Text numberOfLines={4} style={{ color }}>
            {article.description && article.description}
          </Text>
        </View>
      </Pressable>

      <ArticleItemActions article={article} channel={channel} />
    </View>
  );
};

export default ArticleItem;
