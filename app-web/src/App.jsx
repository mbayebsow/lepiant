import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { IonApp, setupIonicReact } from "@ionic/react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

/* hooks */
import useData from "./hook/useData";
import useQuotidien from "./hook/useQuotidien.js";
import useChannel from "./hook/useChannel";
import useSession from "./hook/useSession";

/* screens */
import TabsLayout from "./components/layout/TabsLayout.jsx";
import ErrorScreen from "./screen/Error.screen.jsx";
import NewsScreen from "./screen/News.screen.jsx";
import RadioScreen from "./screen/Radios.screen.jsx";
import LibraryScreen from "./screen/Library.screen.jsx";

setupIonicReact({
  rippleEffect: false,
  mode: "ios",
  backButtonText: "Retour",
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <TabsLayout />,
    errorElement: <ErrorScreen />,
    children: [
      {
        path: "news",
        element: <NewsScreen />,
      },
      {
        path: "radios",
        element: <RadioScreen />,
      },
      {
        path: "saved",
        element: <LibraryScreen />,
      },
    ],
  },
]);

export default function App() {
  const { setRevues, setRadios, setTopNews } = useData();
  const { setQuotidiens } = useQuotidien();
  const { fetchSubscribedChannels, setChannels } = useChannel();
  const { userData, getUserSession } = useSession();

  useEffect(() => {
    getUserSession();
    setChannels();
    setTopNews().finally(() =>
      setRevues().finally(() => setQuotidiens().finally(() => setRadios()))
    );
  }, []);

  useEffect(() => {
    fetchSubscribedChannels();
  }, [userData]);

  return (
    <IonApp>
      <RouterProvider router={router} />
    </IonApp>
  );
}
