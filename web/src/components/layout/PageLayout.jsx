import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons } from "@ionic/react";
import Profile from "../profile/ProfileIcon";

export default function PageLayout({
  children,
  title = "",
  buttons,
  colorContent = "",
  border = false,
  collapse = false,
}) {
  return (
    <>
      <IonHeader className={`${border ? null : "ion-no-border"}`}>
        <IonToolbar color={colorContent}>
          <Profile />
          <IonTitle>{title}</IonTitle>
          <IonButtons>{buttons}</IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen color={colorContent}>
        {collapse &&<IonHeader collapse="condense">
          <IonToolbar color={colorContent}>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>}
        {children}
      </IonContent>
    </>
  );
}
