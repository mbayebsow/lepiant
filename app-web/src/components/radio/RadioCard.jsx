import { IonButton, IonIcon, IonLabel } from "@ionic/react";
import { heartOutline, heart } from "ionicons/icons";

import ImageComponent from "../Image.component.jsx";
import usePlayer from "../../hook/usePlayer.js";
import { toggleLikeRadio, ifLikedRadio } from "../../services/radio.service.js";
import { useEffect, useState } from "react";

export default function RadioCard({ index, radio }) {
  const { files, currentSong, setOpenPlayer, setSongIndex, preloadAudio } = usePlayer();
  const [isLiked, setIsLiked] = useState(false);

  async function checkLike() {
    const liked = await ifLikedRadio(radio.id);
    setIsLiked(liked);
  }

  useEffect(() => {
    checkLike();
  }, [radio.id]);

  return (
    <div className="flex flex-col items-center" color={currentSong?.id === radio.id ? "light" : ""}>
      <ImageComponent
        className="h-auto w-full object-cover aspect-square bg-white shadow-md rounded-lg"
        src={`https://teldoogroup.sirv.com/lepiant/radio-cover/${radio.name}?format=png&w=100&h=100&scale.option=ignore`}
        alt={radio.name}
        onClick={() => {
          const song = files.find((obj) => obj.id === radio.id);
          setSongIndex(index);
          setOpenPlayer(true);
          preloadAudio(song);
        }}
      />

      <div className="w-full flex justify-between items-center mt-2">
        <IonLabel>
          <h3>{radio.name}</h3>
          <p>{radio.categories}</p>
        </IonLabel>
        <IonButton
          slot="end"
          size="small"
          fill="clear"
          onClick={() => toggleLikeRadio(radio, checkLike)}
        >
          <IonIcon aria-hidden="true" icon={isLiked ? heart : heartOutline} />
        </IonButton>
      </div>
    </div>
  );
}
