import { Carousel } from "react-responsive-carousel";
import useData from "../../hook/useData";
import ImageComponent from "../Image.component.jsx";
import useArticle from "../../hook/useArticle.js";

export default function TopNewsSection() {
  const { topNews } = useData();
  const { setOpenArticleViewer, setOpenArticleViewerDetails } = useArticle();
  return (
    <>
      {topNews ? (
        <Carousel
          centerMode
          autoPlay
          infiniteLoop
          interval={5000}
          centerSlidePercentage={100}
          //onChange={(e) => setQIndex(e)}
          showArrows={false}
          showIndicators={false}
          showThumbs={false}
          className="h-fit w-full"
        >
          {topNews?.articles.map((article, i) => (
            <div
              key={i}
              className="text-left relative overflow-hidden shadow-lg aspect-[17/9] object-cover"
              onClick={() => {
                setOpenArticleViewer(true);
                setOpenArticleViewerDetails(article);
              }}
            >
              <ImageComponent src={article.image} alt={article.title} className="object-cover" />
              <div className="absolute bottom-0 left-0 right-0 p-3 h-full flex flex-col justify-end bg-gradient-to-t from-black">
                <p className="text-white m-0">{article.name}</p>
                <h1 className="line-clamp-3 m-0 text-white">{article.title}</h1>
              </div>
            </div>
          ))}
        </Carousel>
      ) : (
        <div role="status" className="animate-pulse ion-padding">
          <div className="bg-[var(--ion-color-light)] w-full aspect-[17/9] rounded-xl mb-4 shadow-lg" />
        </div>
      )}
    </>
  );
}
