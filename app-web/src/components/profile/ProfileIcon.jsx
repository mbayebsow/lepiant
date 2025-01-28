import { IonButtons, IonButton } from "@ionic/react";

import ProfilePage from "./ProfileModal";
import Avatar from "./Avatar";
import useSession from "../../hook/useSession";

export default function Profile() {
  const { setOpenLogin } = useSession();

  return (
    <>
      <ProfilePage />

      <IonButtons slot="end" className="mr-3" onClick={() => setOpenLogin(true)}>
        <IonButton>
          <Avatar />
        </IonButton>
      </IonButtons>
    </>
  );
}
