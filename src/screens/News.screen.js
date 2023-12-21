import { Image } from "react-native";
import TopNews from "../components/TopNews.component";
import Revues from "../components/Revues.component";
import Quotidien from "../components/Quotidien.component";
import TabLayout from "../components/layout/TabLayout";
import News from "../components/News.component";
import useStyles from "../hook/useStyle";


function LogoTitle() {
  return (
    <Image
      style={{ width: 80, height: 35 }}
      source={{
        uri: "https://cdn.teldoo.site/api/assets/lepiant/74ab464b-5a37-4c68-a933-fefc957ee75a/l-e-piant.png?version=0",
      }}
    />
  );
}

export default function NewsScreen() {
  const { backgroundColor } = useStyles();
  return (
    <TabLayout backgroundColor={backgroundColor} headerCenter={<LogoTitle />} hideLargeHeader>
      <TopNews />
      <Revues />
      <Quotidien />
      <News />
    </TabLayout>
  );
}
