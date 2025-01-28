import { IonButton, IonNote } from "@ionic/react";
import Channel from "./channels/Channel.jsx";

import useSession from "../hook/useSession";
import useChannel from "../hook/useChannel";

export default function BottomSuggestion() {
  const { isLogin, setOpenLogin } = useSession();
  const { subscribedChannel } = useChannel();

  return (
    <>
      {!isLogin && (
        <div className="ion-padding bg-[var(--ion-color-light)]">
          <IonNote className="mt-5">
            Pour accéder à plus d'articles et vidéos spéciaux, vous devrez vous connectez d'abord.
          </IonNote>
          <IonButton expand="block" onClick={() => setOpenLogin(true)} className="mt-5">
            Connexion
          </IonButton>
        </div>
      )}

      {isLogin
        ? subscribedChannel.length === 0 && (
            <div className="ion-padding bg-[var(--ion-color-light)] h-screen">
              <IonNote className="mt-5">
                Pour accéder à certains articles et vidéos spéciaux, vous devrez vous abonner à vos
                chaînes préférées.
              </IonNote>
              <div className="-mx-[16px] mt-5">
                <Channel />
              </div>
            </div>
          )
        : null}
    </>
  );
}
