import { useEffect, useState } from "react";

import { articleExtract } from "../../services/article.extractor";
import ImageComponent from "../Image.component";

export default function ArticleCover({ link }) {
  const [cover, setCover] = useState();

  const getCover = async () => {
    setCover(null);
    const cover = await articleExtract(link);
    if (cover) {
      if (cover?.image) setCover(cover.image);
    }
  };

  useEffect(() => {
    getCover();
  }, [link]);

  return (
    cover && (
      <ImageComponent
        src={cover}
        className={`w-full aspect-video object-cover my-3 ${!cover ? "animate-pulse" : null}`}
      />
    )
  );
}
