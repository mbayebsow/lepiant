import { IonAvatar, IonItem, IonLabel, IonRow, IonCol, IonText, IonImg } from "@ionic/react";
import moment from "moment/moment";

import useArticle from "../../hook/useArticle";
import ArticleCover from "./ArticleCover";
import useChannel from "../../hook/useChannel";
import { useEffect, useState } from "react";
import ImageComponent from "../Image.component";

export default function ArticleItem({ article }) {
  const [channelDetails, setChannelDetails] = useState(null);
  const { setOpenArticleViewer, setOpenArticleViewerDetails, loading } = useArticle();
  const { channels } = useChannel();

  useEffect(() => {
    const details = channels.find((obj) => obj.id === article.channel);
    setChannelDetails(details);
  }, [article]);

  return (
    <>
      <div
        className={`m-0 origin-top border-b dark:border-b-gray-700 py-[16px] ${
          loading ? "animate-pulse " : ""
        }`}
        onClick={() => {
          setOpenArticleViewer(true);
          setOpenArticleViewerDetails({ ...channelDetails, link: article?.link });
        }}
      >
        <div className="mb-2 px-[16px]">
          <IonRow>
            <IonCol size="auto">
              <IonAvatar className="border dark:border-gray-700">
                <img
                  className="w-full object-contain aspect-square"
                  alt={channelDetails?.name}
                  src={channelDetails?.logo}
                />
              </IonAvatar>
            </IonCol>

            <IonCol>
              <IonText color="medium">{channelDetails?.name}</IonText>
              <IonText color="medium">
                <p className="m-0">{moment(article.published).fromNow()}</p>
              </IonText>
            </IonCol>
          </IonRow>
        </div>

        <IonText className="ion-text-wrap">
          <h3 className="px-[16px]">{article.title}</h3>
        </IonText>

        <ImageComponent className="w-full aspect-video object-cover my-5" src={article.image} />

        <IonText color="medium" className="ion-text-wrap">
          <div className="px-[16px] text-sm article-item-description relative">
            {article.description}
          </div>
        </IonText>

        {/*<IonButtons className="justify-between w-full mt-3">
            <IonButton fill="clear">
              <IonIcon size="small" slot="start" icon={heartOutline}></IonIcon>
            </IonButton>
            <IonButton fill="clear">
              <IonIcon size="small" slot="start" icon={bookmarkOutline}></IonIcon>
            </IonButton>
            <IonButton fill="clear">
              <IonIcon size="small" slot="start" icon={shareOutline}></IonIcon>
            </IonButton>
            <IonButton fill="clear">
              <IonIcon size="small" slot="start" icon={logoTwitter}></IonIcon>
            </IonButton>
          </IonButtons>*/}
      </div>
    </>
  );
}
