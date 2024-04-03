import { Radio, TrackPlaylist } from "../interfaces";

export function radioToPlaylist(radio: Radio): TrackPlaylist {
  return {
    id: radio.id,
    title: radio.name,
    artist: radio.categorie.name,
    artwork: radio.image,
    url: radio.source,
    isLiveStream: true,
  };
}
