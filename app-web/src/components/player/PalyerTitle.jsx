import React from "react";
import usePlayer from "../../hook/usePlayer";

export default function PalyerTitle() {
  const { currentSong } = usePlayer();

  return (
    <div className="self-center mt-1">
      <h1 className="text-lg line-clamp-1">{currentSong?.name}</h1>
      <p className="m-0 -mt-1">{currentSong?.categories}</p>
    </div>
  );
}
