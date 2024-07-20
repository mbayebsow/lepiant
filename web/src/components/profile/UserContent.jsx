import { useState } from "react";
import { IonButton } from "@ionic/react";

import useSession from "../../hook/useSession";
import UserUpdateName from "./UserUpdateName";
import Avatar from "./Avatar";

export default function UserContent() {
  const [openModal, setOpenModal] = useState(false);
  const { userData } = useSession();

  return (
    <>
      <UserUpdateName openModal={openModal} setOpenModal={setOpenModal} />
      <div className="text-center flex flex-col items-center my-10">
        <Avatar height={80} width={80} />
        <div>
          <h1>{`
            ${userData?.firstName ? userData?.firstName : null}
            ${userData?.lastName ? userData?.lastName : null}
          `}</h1>
          <p className="mb-0">{userData?.login}</p>
        </div>
        <IonButton size="small" fill="clear" onClick={() => setOpenModal(true)}>
          Modifier
        </IonButton>
      </div>
    </>
  );
}
