import { useEffect } from "react";
import { Outlet, useLocation, NavLink, useNavigate } from "react-router-dom";
import { IonToolbar, IonFooter, IonButtons, IonIcon, IonLabel, IonPage } from "@ionic/react";
import { radioOutline, newspaper, albumsOutline } from "ionicons/icons";

import usePlayer from "../../hook/usePlayer";
import Player from "../player/MiniPlayer.jsx";
//import useDeviceInfo from "../../hook/useDeviceInfo";

export default function TabsLayout() {
  const { openPlayer } = usePlayer();
  //const { device } = useDeviceInfo();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      return navigate("/news", { remplace: true });
    }
  }, [location]);

  return (
    <IonPage>
      <Outlet />
      <IonFooter>
        <IonToolbar>
          {openPlayer ? <Player /> : null}
          <IonButtons className="pt-3">
            <NavLink
              to="news"
              className={({ isActive }) =>
                `w-full bg-transparent flex flex-col gap-1 items-center ${
                  isActive ? "text-[var(--ion-color-primary)]" : "text-gray-500"
                }`
              }
            >
              <IonIcon className="w-[25px] h-[25px]" aria-hidden="true" icon={newspaper} />
              <IonLabel className="text-[10px]">News</IonLabel>
            </NavLink>

            <NavLink
              to="radios"
              className={({ isActive }) =>
                `w-full bg-transparent flex flex-col gap-1 items-center ${
                  isActive ? "text-[var(--ion-color-primary)]" : "text-gray-500"
                }`
              }
            >
              <IonIcon className="w-[25px] h-[25px]" aria-hidden="true" icon={radioOutline} />
              <IonLabel className="text-[10px]">Radios</IonLabel>
            </NavLink>

            <NavLink
              to="saved"
              className={({ isActive }) =>
                `w-full bg-transparent flex flex-col gap-1 items-center ${
                  isActive ? "text-[var(--ion-color-primary)]" : "text-gray-500"
                }`
              }
            >
              <IonIcon className="w-[25px] h-[25px]" aria-hidden="true" icon={albumsOutline} />
              <IonLabel className="text-[10px]">Bibliotheque</IonLabel>
            </NavLink>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
}
