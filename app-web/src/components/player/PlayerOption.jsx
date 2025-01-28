import { IonButton, IonIcon } from "@ionic/react";
import { heartOutline, timeOutline } from "ionicons/icons";

export default function PlayerOption() {
  return (
    <div className="w-fit flex items-center gap-3">
      <div size="auto" className="self-center">
        <IonButton fill="clear" size="small">
          <IonIcon className="w-5 h-5 text-black dark:text-white" icon={heartOutline} />
        </IonButton>
      </div>
      <div size="auto" className="self-center">
        <IonButton fill="clear" size="small">
          <IonIcon className="w-5 h-5 text-black dark:text-white" icon={timeOutline} />
        </IonButton>
      </div>
    </div>
  );
}
