import { IonItem, IonLabel, IonList, IonNote, IonToggle, IonSelect, IonSelectOption } from "@ionic/react";

import useSession from "../../hook/useSession";
import useArticle from "../../hook/useArticle";

export default function UserSettings() {
  const { userData, updateUserSession } = useSession();
  const { categiries } = useArticle();

  return (
    <>
      <IonList inset={true}>
        <IonItem>
          <IonSelect label="Langue" value={userData?.language}>
            <IonSelectOption value={userData?.language}>Français</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonSelect label="Zone geographique" value={userData?.country}>
            <IonSelectOption value={userData?.country}>Sénégal</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonSelect label="Page par default" value={userData?.defaultStartedPage} onIonChange={(ev) => updateUserSession({ defaultStartedPage: { iv: ev.detail.value } })}>
            <IonSelectOption value="radios">Radios</IonSelectOption>
            <IonSelectOption value="news">News</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonSelect label="Categorie par default" value={userData?.defaultArticleCategorie} onIonChange={(ev) => updateUserSession({ defaultArticleCategorie: { iv: ev.detail.value } })}>
            {categiries
              ? categiries.map((categirie) => (
                  <IonSelectOption key={categirie.id} value={categirie.id}>
                    {categirie.name}
                  </IonSelectOption>
                ))
              : null}
          </IonSelect>
        </IonItem>
      </IonList>

      <IonList inset={true}>
        <IonItem>
          <IonToggle checked={userData?.allowNotifications} onIonChange={(ev) => updateUserSession({ allowNotifications: { iv: ev.detail.checked } })}>
            <IonLabel>Recevoir des notifications</IonLabel>
            <IonNote color="medium">Vous pouvez vous désabonnez à tout moment</IonNote>
          </IonToggle>
        </IonItem>
      </IonList>
    </>
  );
}
