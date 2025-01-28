import { IonModal, IonContent, IonLoading, IonNote } from "@ionic/react";
import useSession from "../../hook/useSession";

import UserSettings from "./UserSettings";
import LoginContent from "./LoginContent";
import UserContent from "./UserContent";

export default function ProfilePage() {
  const { isLogin, loading, openLogin, setOpenLogin } = useSession();
  return (
    <IonModal
      isOpen={openLogin}
      breakpoints={[0, 0.85]}
      initialBreakpoint={0.85}
      onDidDismiss={() => setOpenLogin(false)}
    >
      <IonContent scrollY={false} color="light">
        <IonLoading isOpen={loading} />
        {isLogin ? (
          <div>
            <UserContent />
            <UserSettings />
            <div className="flex flex-col items-center text-center ion-padding">
              <IonNote color="medium">V 0.6</IonNote>
              <IonNote color="medium">Teldoo Group</IonNote>
            </div>
          </div>
        ) : (
          <LoginContent />
        )}
      </IonContent>
    </IonModal>
  );
}
