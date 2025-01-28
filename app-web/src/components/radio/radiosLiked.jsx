import { useEffect, useState } from "react";
import { getDataOnStore } from "../../lib";
import RadioCard from "./RadioCard.jsx";
import HeaderSection from "../HeaderSection.jsx";

export default function RadiosLiked() {
  const [radios, setRadio] = useState();

  async function getLikedRadios() {
    const currentLikes = await getDataOnStore("radio_liked");
    setRadio(JSON.parse(currentLikes));
  }

  useEffect(() => {
    getLikedRadios();
  }, []);

  return radios ? (
    <>
      <HeaderSection title="Mes radios" textButton="Voir plus" size="md" disableButton={false} />
      <div className="p-[16px] w-fit max-w-full grid overflow-x-auto grid-rows-2 grid-flow-col gap-3 grid-cols-max">
        {radios.map((radio, i) => (
          <div key={i} className="w-36 h-auto">
            <RadioCard radio={radio} index={i} />
          </div>
        ))}
      </div>
    </>
  ) : null;
}
