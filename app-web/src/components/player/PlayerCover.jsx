import usePlayer from "../../hook/usePlayer";
import ImageComponent from "../Image.component.jsx";

export default function PlayerCover() {
  const { currentSong } = usePlayer();

  return (
    <ImageComponent
      className="w-auto h-full object-cover aspect-square rounded-lg"
      src={currentSong?.image}
      alt={currentSong?.name}
    />
  );
}
