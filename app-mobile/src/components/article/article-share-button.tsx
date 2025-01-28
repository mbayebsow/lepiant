import { Pressable } from "react-native";
import { ImageDown, Share } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { trigger } from "react-native-haptic-feedback";
import { Article, Channel } from "../../utils/interfaces";
import { FC } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import useStyles from "../../hook/useStyle";
import { Text } from "react-native";

interface ArticleShareButtonProps {
  article: Article;
  channel: Channel | undefined;
  iconColor?: string;
  iconSize?: number;
  styles?: any;
}

const ArticleShareButton: FC<ArticleShareButtonProps> = ({
  article,
  channel,
  iconColor,
  iconSize,
  styles,
}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { colorLight, primaryColor } = useStyles();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate("SharArticle", { article, channel });
        trigger("impactLight");
      }}
      style={[
        styles,
        {
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 10,
        },
      ]}
    >
      <Share size={iconSize || 16} color={primaryColor} />
      <Text style={{ color: colorLight }}>Partager</Text>
    </Pressable>
  );
};

export default ArticleShareButton;
