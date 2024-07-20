import { useEffect } from "react";
import { getAverageColor } from "../../lib";
import { chevronBackOutline } from "ionicons/icons";
import {
  IonIcon,
  IonModal,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
} from "@ionic/react";
import useQuotidien from "../../hook/useQuotidien";
import { Carousel } from "react-responsive-carousel";

export default function QViewer() {
  const {
    quotidiens,
    qIndex,
    openQModal,
    avarageColor,
    setQIndex,
    setAvarageColor,
    setOpenQModal,
  } = useQuotidien();

  async function avarageFunc() {
    if (!quotidiens) return;
    const q = quotidiens?.files[qIndex];
    const color = await getAverageColor(`https://cdn.teldoo.site/api/assets/lepiant/${q}`);
    if (color) setAvarageColor(color);
  }

  useEffect(() => {
    avarageFunc();
  }, [qIndex]);

  return (
    <IonModal isOpen={openQModal} onDidDismiss={() => setOpenQModal(false)}>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="dark" onClick={() => setOpenQModal(false)}>
              <IonIcon icon={chevronBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>CPQ du 17/03/2024</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen scrollY={false}>
        <Carousel
          centerMode
          centerSlidePercentage={100}
          onChange={(e) => setQIndex(e)}
          selectedItem={qIndex}
          showArrows={false}
          showIndicators={false}
        >
          {quotidiens ? (
            quotidiens?.files.map((file, i) => (
              <div
                key={i}
                style={{
                  background: avarageColor,
                  transition: "all 1s",
                  width: "100%",
                  height: "100%",
                }}
                className="flex justify-center items-center ion-padding"
              >
                <img
                  src={`https://cdn.teldoo.site/api/assets/lepiant/${file}`}
                  alt=""
                  className="w-full"
                />
              </div>
            ))
          ) : (
            <div>hello</div>
          )}
        </Carousel>
      </IonContent>
    </IonModal>
  );
}
