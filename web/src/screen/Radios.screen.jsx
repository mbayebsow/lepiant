import { useEffect, useState } from "react";
import { IonButton, IonItemDivider } from "@ionic/react";

import PageLayout from "../components/layout/PageLayout.jsx";
import usePlayer from "../hook/usePlayer";
import RadiosSkeleton from "../components/skeleton/Radios.skeleton";
import RadioSection from "../components/sections/Radio.section.jsx";
import { Preferences } from "@capacitor/preferences";
import useData from "../hook/useData.js";

export default function RadioScreen() {
  const { setFiles } = usePlayer();
  const { radios } = useData();

  const [searchRadio, setSearchRadio] = useState();
  const [filterRadio, setFilterRadio] = useState();
  const [categories, setCategories] = useState();

  async function filtrerParCategories() {
    if (!radios) return;
    const resul = radios.filter((item) => item.categories === searchRadio);
    setFilterRadio(resul);
    if (searchRadio)
      await Preferences.set({
        key: "last_categorie_radio",
        value: searchRadio,
      });
  }

  async function extraireCategoriesUniques() {
    if (!radios) return;
    const categories = radios.map((item) => item.categories);
    const categoriesUniques = [...new Set(categories)];
    setCategories(categoriesUniques);
    const { value } = await Preferences.get({
      key: "last_categorie_radio",
    });
    if (value) {
      setSearchRadio(value);
    } else {
      setSearchRadio("Senegal");
    }
  }

  useEffect(() => {
    filtrerParCategories();
  }, [radios, searchRadio]);

  useEffect(() => {
    setFiles(filterRadio);
  }, [radios, filterRadio]);

  useEffect(() => {
    extraireCategoriesUniques();
  }, [radios]);

  return (
    <PageLayout title="Radio" collapse>
      <IonItemDivider sticky={true} className="p-0 m-0">
        <div className="flex overflow-x-scroll hide-scroll-bar mt-3 no-scrollbar">
          <div className="flex flex-nowrap px-5 pb-5 gap-3 ">
            {categories
              ? categories.map((categorie, i) => (
                  <IonButton
                    key={i}
                    onClick={() => {
                      setSearchRadio(categorie);
                    }}
                    size="small"
                    color={searchRadio === categorie ? "primary" : "light"}
                  >
                    {categorie}
                  </IonButton>
                ))
              : null}
          </div>
        </div>
      </IonItemDivider>
      {filterRadio ? <RadioSection radios={filterRadio} /> : <RadiosSkeleton />}
    </PageLayout>
  );
}
