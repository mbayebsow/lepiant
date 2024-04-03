import React from "react";
import useRadioStore from "../../hook/useRadio";
import RadiosGrid from "./radio-grid";

const RadioLiked = () => {
  const radiosLiked = useRadioStore((state) => state.radiosLiked);
  return (
    <>
      <RadiosGrid radios={radiosLiked} from="liked" />
    </>
  );
};

export default RadioLiked;
