import { useEffect, useState } from "react";
import moment from "moment/moment";
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  IonIcon,
  IonSpinner,
  IonFooter,
  IonModal,
  IonRange,
} from "@ionic/react";
import { addCircleOutline, chevronBackOutline, removeCircleOutline } from "ionicons/icons";
import DOMPurify from "dompurify";

import useArticle from "../../hook/useArticle";
import { articleExtract } from "../../services/article.extractor";

import ImageComponent from "../Image.component";

export default function ArticleItemViewer() {
  const [article, setArticle] = useState(null);
  const { openArticleViewer, openArticleViewerDetails, setOpenArticleViewer } = useArticle();
  const [textSize, setTextSize] = useState(1);

  const getHtml = async () => {
    const data = await articleExtract(openArticleViewerDetails?.link);
    if (!data) return;
    setArticle(data);
  };

  useEffect(() => {
    if (openArticleViewerDetails) getHtml();
  }, [openArticleViewerDetails]);

  return (
    <IonModal isOpen={openArticleViewer}>
      <style jsx="true">{`
        .blog-content p {
          font-size: ${4 + textSize}vw;
        }
        .blog-content h2 {
          font-size: ${6 + textSize}vw;
        }
      `}</style>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              color="dark"
              onClick={() => {
                setOpenArticleViewer(false);
                setArticle(null);
              }}
            >
              <IonIcon icon={chevronBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>
            {openArticleViewerDetails?.logo ? (
              <img
                className="h-6 mx-auto w-autoo"
                src={
                  openArticleViewerDetails?.fullLogo
                    ? openArticleViewerDetails?.fullLogo
                    : openArticleViewerDetails?.logo
                }
                alt={openArticleViewerDetails?.name}
              />
            ) : (
              openArticleViewerDetails?.name
            )}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {article ? (
          <div>
            <div>
              <h1 className="text-xl ion-padding">{article?.title}</h1>
              <ImageComponent
                className="w-full aspect-video object-cover shadow-xl"
                src={article?.image}
                alt={article?.title}
              />
            </div>

            <div className="flex flex-1 items-center text-xs w-full divide-x ion-padding">
              <div className="px-2 line-clamp-1">@{openArticleViewerDetails?.name}</div>
              <div className="px-2 line-clamp-1">
                {moment(openArticleViewerDetails?.published).fromNow()}
              </div>
              <div className="px-2 line-clamp-1">{article?.ttr}</div>
            </div>

            <div
              className="blog-content font-normal ion-padding"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article?.content) }}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <IonSpinner />
          </div>
        )}
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <div className="p-2">
            <IonRange
              ticks={true}
              snaps={true}
              value={textSize}
              min={1}
              max={5}
              onIonChange={({ detail }) => setTextSize(detail.value)}
            >
              <IonIcon slot="start" icon={removeCircleOutline}></IonIcon>
              <IonIcon slot="end" icon={addCircleOutline}></IonIcon>
            </IonRange>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
}
