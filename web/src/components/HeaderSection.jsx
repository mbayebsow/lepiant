import { IonListHeader, IonLabel, IonButton } from "@ionic/react";

export default function HeaderSection({
  title,
  titleColor = "",
  textButton,
  disableButton = true,
  size = "xs",
}) {
  return (
    <>
      <IonListHeader className="-mb-3 items-center">
        <IonLabel style={{ color: titleColor, fontSize: 17 }} className="m-0">
          {title}
        </IonLabel>
        <IonButton color={disableButton ? "medium" : ""} className={`text-${size} m-0`}>
          {textButton}
        </IonButton>
      </IonListHeader>
    </>
  );
}
