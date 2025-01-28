import { View, Text } from "react-native";
import React, { FC } from "react";
import useArticleStore from "../../hook/useArticle";
import ArticleItem from "./article-item";

const ArtilcesSaved: FC = () => {
  const savedArticles = useArticleStore((state) => state.savedArticles);

  return (
    <View>
      {savedArticles &&
        savedArticles.map((article, i) => <ArticleItem key={i} article={article.article} />)}
    </View>
  );
};

export default ArtilcesSaved;
