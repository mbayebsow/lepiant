import { useState } from "react";
import { IonButton, IonModal, IonInput, IonItem, IonList, IonContent } from "@ionic/react";

import useSession from "../../hook/useSession";
import avatar from "../../lib/avatar.json";
import Avatar from "./Avatar";

export default function UserUpdateName({ openModal, setOpenModal }) {
  const { userData, updateUserSession } = useSession();

  const [firstName, setFirstName] = useState(userData?.firstName);
  const [lastName, setLastName] = useState(userData?.lastName);
  const [profile, setProfile] = useState(userData?.profile);

  async function updateFullName() {
    let user = {};
    if (firstName) user.firstName = { iv: firstName };
    if (lastName) user.lastName = { iv: lastName };
    if (profile) user.profile = { iv: profile.toString() };

    await updateUserSession(user);
  }

  return (
    <IonModal
      isOpen={openModal}
      breakpoints={[0, 0.5]}
      initialBreakpoint={0.5}
      onDidDismiss={() => setOpenModal(false)}
    >
      <IonContent color="light">
        {/*<Swiper
          effect={"coverflow"}
          initialSlide={profile ? `${profile}` : "0"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 40,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          modules={[EffectCoverflow]}
          className="avatar-selecterr mt-10 mb-5 items-center"
          onSlideChange={(swiper) => setProfile(swiper.activeIndex)}
        >
          {avatar.map((av, i) => (
            <SwiperSlide key={i} className="avatar-swiper px-1">
              <Avatar height={80} width={80} src={av.uri} />
            </SwiperSlide>
          ))}
        </Swiper>*/}

        <IonList inset={true}>
          <IonItem>
            <IonInput
              value={firstName}
              onIonInput={(ev) => setFirstName(ev.detail.value)}
              label="Prénom"
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonInput
              value={lastName}
              onIonInput={(ev) => setLastName(ev.detail.value)}
              label="Nom"
            ></IonInput>
          </IonItem>
        </IonList>

        <div className="ion-padding">
          <IonButton onClick={updateFullName} expand="block">
            Sauvegarder
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
}
