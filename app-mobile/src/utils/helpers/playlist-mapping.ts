import { Track } from "react-native-track-player";
import { Radio, Revues } from "../interfaces";
import config from "../constant/config";

export function radioToPlaylist(radio: Radio): Track {
  return {
    id: radio.id,
    title: radio.name,
    artist: radio.categorie.name,
    artwork: radio.image,
    url: radio.source,
    isLiveStream: true,
  };
}
export function revueToPlaylist(revue: Revues): Track {
  return {
    id: revue.id,
    title: revue.name,
    artist: "L'epiant",
    artwork: config.DEFAULT_REVUE_IMAGE,
    url: revue.audio,
    isLiveStream: false,
  };
}
