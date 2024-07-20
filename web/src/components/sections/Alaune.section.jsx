import { createRef } from "react";
import { IonSpinner } from "@ionic/react";

import ArticleItem from "../Article/ArticleItem.jsx";
import HeadearSection from "../HeaderSection.jsx";

import useArticle from "../../hook/useArticle.js";
import ArticleCategories from "../Article/ArticleCategories.jsx";
import ArticleItemViewer from "../Article/ArticleItemViewer.jsx";
import BottomSuggestion from "../bottomSuggestion.jsx";

export default function AlauneSection() {
  const { articles, loading } = useArticle();
  const contentRef = createRef();

  return (
    <section className="min-h-screen">
      <ArticleItemViewer />
      <HeadearSection title="Dernières actualités" />
      <ArticleCategories articleslistRef={contentRef} />
      {loading ? <IonSpinner color="medium" className="h-6 w-full mx-auto mt-2" /> : null}
      <div
        ref={contentRef}
        className="w-full h-auto"
        style={{ scrollMarginTop: `${articles ? "100px" : ""}` }}
      >
        {articles ? articles.map((article, i) => <ArticleItem key={i} article={article} />) : null}
      </div>
      <BottomSuggestion />
    </section>
  );
}
