import { useState, useEffect } from "react";
import { Platform, LogBox } from "react-native";
import { CacheManager } from "@georstat/react-native-image-cache";
import { Dirs } from "react-native-file-access";
import SplashScreen from "react-native-splash-screen";
import Routes from "./Routes";
import useQuotidienStore from "./hook/useQuotidien";
import useSessionStore from "./hook/useSession";
import useChannelStore from "./hook/useChannel";
import useArticleStore from "./hook/useArticle";
import LoadingScreen from "./screens/loading-screen";
import useRevueStore from "./hook/useRevue";
import useRadioStore from "./hook/useRadio";
import usePlayerStore from "./hook/usePlayer";

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
  const initQuotidiens = useQuotidienStore((state) => state.initQuotidiens);
  const initChannels = useChannelStore((state) => state.initChannels);
  const initArticles = useArticleStore((state) => state.initArticles);
  const initSession = useSessionStore((state) => state.initSession);
  const initRevues = useRevueStore((state) => state.initRevues);
  const initRadios = useRadioStore((state) => state.initRadios);
  const initializeTrackPlayer = usePlayerStore((state) => state.initializeTrackPlayer);
  const isTrackPlayerInit = usePlayerStore((state) => state.isTrackPlayerInit);

  const start = async () => {
    console.log("initSession");
    await initSession();

    console.log("initChannels");
    await initChannels();

    console.log("initRevues");
    await initRevues();

    console.log("initRadios");
    await initRadios();

    console.log("initQuotidiens");
    await initQuotidiens();

    console.log("initArticles");
    await initArticles();

    setReady(true);
  };

  useEffect(() => {
    if (!isTrackPlayerInit) initializeTrackPlayer();
    if (Platform.OS === "android") SplashScreen.hide();
    start();
  }, []);

  return ready ? <Routes /> : <LoadingScreen />;
}

export default App;
