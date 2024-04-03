import { useNavigation } from "@react-navigation/native";
import useStyles from "../../hook/useStyle";
import useSession from "../../hook/useSession";
import { StackNavigationProp } from "@react-navigation/stack";
import { Pressable, Text } from "react-native";
import { FC } from "react";
import useArticleStore from "../../hook/useArticle";
import { ScrollView } from "react-native";
import { View } from "react-native";
import { trigger } from "react-native-haptic-feedback";

// interface ArticleCategoriesProps {
//   id: number;
//   title: string;
// }

const ArticleCategories: FC = () => {
  const categoryActiveIndex = useArticleStore((state) => state.categoryActiveIndex);
  const getArticlesByCategory = useArticleStore((state) => state.getArticlesByCategory);
  const categories = useArticleStore((state) => state.categories);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { isLogin } = useSession();
  const { backgroundColorLight, backgroundColor, primaryColor, color } = useStyles();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      >
        {categories &&
          categories.map((category, i) => (
            <Pressable
              key={i}
              onPress={() => {
                isLogin ? getArticlesByCategory(category.id) : navigation.navigate("Login");
                trigger("impactLight");
              }}
              style={{
                backgroundColor:
                  categoryActiveIndex === category.id ? primaryColor : backgroundColorLight,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 7,
              }}
            >
              <Text
                style={{
                  color: categoryActiveIndex === category.id ? "white" : color,
                  fontSize: 15,
                }}
              >
                {category.name}
              </Text>
            </Pressable>
          ))}
      </View>
    </ScrollView>
  );
};

export default ArticleCategories;
