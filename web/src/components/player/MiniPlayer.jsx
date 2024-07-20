import { useRef } from "react";
import { IonButton, IonIcon, IonModal } from "@ionic/react";
import { play, pauseOutline } from "ionicons/icons";
import MediaSession from "@mebtte/react-media-session";

import usePlayer from "../../hook/usePlayer";
import FullscreenPlayer from "./FullscreenPlayer";
import PlayerCover from "./PlayerCover.jsx";
import PalyerTitle from "./PalyerTitle.jsx";

export default function MiniPlayer() {
  const modalRef = useRef(null);
  const {
    currentSong,
    isPlaying,
    openFullPlayer,
    handlePlay,
    handleStop,
    togglePlayPause,
    handleNext,
    handlePrev,
    averageColor,
    setOpenFullPlayer,
  } = usePlayer();

  return (
    <div className="relative">
      {currentSong && (
        <MediaSession
          title={currentSong?.name}
          artist={currentSong?.categories}
          album="l'epiant"
          artwork={[
            {
              src: currentSong?.image,
              type: "image/png",
            },
          ]}
          onPlay={handlePlay}
          onPause={handleStop}
          onPreviousTrack={handlePrev}
          onNextTrack={handleNext}
        />
      )}
      <IonModal
        ref={modalRef}
        isOpen={openFullPlayer}
        breakpoints={[0, 0.98]}
        initialBreakpoint={0.98}
        onDidDismiss={() => setOpenFullPlayer(false)}
      >
        <FullscreenPlayer />
      </IonModal>
      <div
        style={{
          background: averageColor ? averageColor : "var(--ion-color-light)",
          transition: "all 1s",
        }}
        className="m-2 flex gap-2 justify-between p-1.5 rounded-lg"
      >
        <div className="flex h-12 gap-2 w-auto" onClick={() => setOpenFullPlayer(true)}>
          <PlayerCover />
          <PalyerTitle />
        </div>

        <div className="self-center flex w-fit mr-2">
          <IonButton
            onClick={() => {
              togglePlayPause();
            }}
            size="small"
            fill="clear"
          >
            <IonIcon className="w-7 h-7" icon={isPlaying ? pauseOutline : play} />
          </IonButton>
        </div>
      </div>
    </div>
  );
}
