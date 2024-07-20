import RevueSkeleton from "../skeleton/Revue.skeleton";
import moment from "moment/moment";

import useData from "../../hook/useData";
import HeadearSection from "../HeaderSection.jsx";
import ImageComponent from "../Image.component.jsx";
import usePlayer from "../../hook/usePlayer.js";

export default function RevueSection() {
  const { setFiles, setSongIndex, setOpenPlayer, preloadAudio } = usePlayer();
  const { revues } = useData();

  return (
    <>
      <HeadearSection
        title={"Revue de presse"}
        textButton={revues ? moment(revues?.createdTime).fromNow() : null}
      />

      <div className="flex overflow-x-scroll no-scrollbar p-[16px]">
        <div className="flex flex-nowrap gap-2">
          {revues ? (
            revues.audios.map((file, i) => (
              <div
                key={i}
                className="bg-[var(--ion-color-light)] flex items-center gap-2 w-36 h-fit p-1 rounded-lg"
                onClick={async () => {
                  setFiles(revues.audios);
                  const song = revues.audios.find((obj) => obj.name === file.name);
                  setSongIndex(i);
                  setOpenPlayer(true);
                  preloadAudio(song);
                }}
              >
                <ImageComponent
                  className="w-12 h-12 rounded-lg aspect-square object-cover"
                  alt={file.name}
                  src={file.image}
                />
                <p className="m-0 leading-4">{file.name}</p>
              </div>
            ))
          ) : (
            <RevueSkeleton />
          )}
        </div>
      </div>
    </>
  );
}
