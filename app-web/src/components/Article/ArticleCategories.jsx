import { IonButton, IonItemDivider } from "@ionic/react";
import useArticle from "../../hook/useArticle";

export default function ArticleCategories({ articleslistRef }) {
  const { categiries, categorieIndex, getArticlesByCategorie } = useArticle();

  return (
    <IonItemDivider sticky={true} className="p-0 m-0">
      <div className="flex overflow-x-scroll hide-scroll-bar mt-3  no-scrollbar">
        <div className="flex flex-nowrap px-3 pb-3 gap-3 ">
          {categiries
            ? categiries.map((categirie, i) => (
                <IonButton
                  disabled={categirie.disabled}
                  key={categirie.id}
                  onClick={() => {
                    getArticlesByCategorie(categirie.id);
                    articleslistRef.current.scrollIntoView({ behavior: "smooth" });
                  }}
                  size="small"
                  color={categorieIndex === categirie.id ? "primary" : "light"}
                >
                  {categirie.name}
                </IonButton>
              ))
            : null}
        </div>
      </div>
    </IonItemDivider>
  );
}
