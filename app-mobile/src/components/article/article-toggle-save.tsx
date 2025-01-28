import { View, Text, Pressable } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { Bookmark } from "lucide-react-native";
import useStyles from "../../hook/useStyle";
import { Article } from "../../utils/interfaces";
import useArticleStore from "../../hook/useArticle";
import { trigger } from "react-native-haptic-feedback";

interface ArticleToggleSaveProps {
  article: Article;
}

const ArticleToggleSave: FC<ArticleToggleSaveProps> = ({ article }) => {
  const { colorLight, primaryColor } = useStyles();
  const { id } = article;
  const toggleSaveArticle = useArticleStore((state) => state.toggleSaveArticle);
  const savedArticles = useArticleStore((state) => state.savedArticles);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (savedArticles.find((a) => a.article.id === id)) {
      setIsSaved(true);
    } else {
      setIsSaved(false);
    }
  }, [article]);

  return (
    <>
      <Pressable
        onPress={() => {
          toggleSaveArticle(id);
          setIsSaved(!isSaved);
          trigger("impactLight");
        }}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Bookmark size={16} color={primaryColor} fill={isSaved ? primaryColor : "transparent"} />
        <Text style={{ color: colorLight }}>Enregister</Text>
      </Pressable>
    </>
  );
};

export default ArticleToggleSave;
