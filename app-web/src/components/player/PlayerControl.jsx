import { IonButton, IonIcon, IonRow, IonCol } from "@ionic/react";
import { play, pauseOutline, playSkipBack, playSkipForward } from "ionicons/icons";

import usePlayer from "../../hook/usePlayer";

export default function PlayerControl() {
  const { isPlaying, togglePlayPause, handleNext, handlePrev } = usePlayer();

  return (
    <IonRow>
      <IonCol size="auto" class=" self-center">
        <IonButton
          onClick={() => {
            handlePrev();
          }}
          fill="clear"
        >
          <IonIcon className="w-10 h-10 text-black dark:text-white" icon={playSkipBack} />
        </IonButton>
      </IonCol>

      <IonCol size="auto">
        <IonButton
          className="bg-black dark:bg-white rounded-full py-1"
          onClick={() => {
            togglePlayPause();
          }}
          fill="clear"
        >
          <IonIcon className="w-10 h-10 text-white dark:text-black" icon={isPlaying ? pauseOutline : play} />
        </IonButton>
      </IonCol>

      <IonCol size="auto" class=" self-center">
        <IonButton
          onClick={() => {
            handleNext();
          }}
          fill="clear"
        >
          <IonIcon className="w-10 h-10 text-black dark:text-white" icon={playSkipForward} />
        </IonButton>
      </IonCol>
    </IonRow>
  );
}
