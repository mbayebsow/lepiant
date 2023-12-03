import React, { useState } from "react";
import { useEffect } from "react";
import { Platform, LogBox } from "react-native";
import Navigations from "./src/components/Navigations";
import SplashScreen from "react-native-splash-screen";

import { CacheManager } from "@georstat/react-native-image-cache";
import { Dirs } from "react-native-file-access";

//HOOKS
import useData from "./src/hook/useData";
import useRadio from "./src/hook/useRadio";
import useQuotidien from "./src/hook/useQuotidien";
import usePlayer from "./src/hook/usePlayer";
import useSession from "./src/hook/useSession";
import useArticle from "./src/hook/useArticle";
import useChannel from "./src/hook/useChannel";
import LoadingScreen from "./src/screens/Loading.screen";

LogBox.ignoreLogs(["Sending"]);

CacheManager.config = {
  baseDir: `${Dirs.CacheDir}/images_cache/`,
  blurRadius: 15,
  cacheLimit: 0,
  sourceAnimationDuration: 10,
  thumbnailAnimationDuration: 10,
};

function App() {
  const [ready, setReady] = useState(false);
  const [finish, setFinish] = useState(false);
  const { getUserSession, userData } = useSession();
  const { setRevues, setTopNews } = useData();
  const { setRadios } = useRadio();
  const { setQuotidiens } = useQuotidien();
  const { isTrackPlayerInit, initializeTrackPlayer } = usePlayer();
  const { getArticlesByCategory, getRandomArticles, setCategories } = useArticle();
  const { setChannels, setSubscribedChannel } = useChannel();

  const start = async () => {
    await getUserSession();
    await setChannels();
    await setCategories();
    await setTopNews();
    await setRevues();
    await setRadios();
    await setQuotidiens();
    setReady(true);
  };
  const getArticles = async () => {
    if (userData) {
      await getArticlesByCategory(userData.defaultArticleCategorie);
      await setSubscribedChannel(userData.id);
    } else {
      await getRandomArticles();
    }
    setFinish(true);
  };

  useEffect(() => {
    if (!isTrackPlayerInit) initializeTrackPlayer();
    if (Platform.OS === "android") SplashScreen.hide();
    start();
  }, []);

  useEffect(() => {
    if (!ready) return;
    getArticles();
  }, [ready]);

  return finish ? <Navigations /> : <LoadingScreen />;
}

export default App;
