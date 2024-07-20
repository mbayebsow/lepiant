import { IonContent, IonPage } from "@ionic/react";

import usePlayer from "../../hook/usePlayer";
import PlayerCover from "./PlayerCover";
import PalyerTitle from "./PalyerTitle";
import PlayerControl from "./PlayerControl";
import PlayerOption from "./PlayerOption";

export default function FullscreenPlayer() {
  const { averageColor } = usePlayer();

  return (
    <IonPage>
      <IonContent
        fullscreen
        scrollY={false}
        className="ion-padding"
        style={{
          "--background": averageColor,
        }}
      >
        <div className="flex flex-col justify-between items-center w-full h-full">
          <div className="w-full flex flex-col h-[60%]">
            <div className="mx-auto w-fit ">
              <p>L'epiant</p>
            </div>
            <div className="rounded-xl shadow-lg overflow-hidden mx-auto w-full h-auto  object-cover aspect-square bg-white/40 dark:bg-black/40">
              <PlayerCover />
            </div>
          </div>
          <div className="w-full h-[40%] flex flex-col gap-5">
            <div className="w-full flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <PalyerTitle />
                <PlayerOption />
              </div>
              <div className="bg-black dark:bg-white h-0.5 w-full rounded-lg"></div>
            </div>
            <div className="w-fit h-full flex justify-center items-center mx-auto">
              <PlayerControl />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
