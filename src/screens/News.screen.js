import TopNews from "../components/TopNews.component";
import Revues from "../components/Revues.component";
import Quotidien from "../components/Quotidien.component";
import TabLayout from "../components/layout/TabLayout";
import News from "../components/News.component";
import useStyles from "../hook/useStyle";

export default function NewsScreen() {
  const { backgroundColor } = useStyles();
  return (
    <TabLayout backgroundColor={backgroundColor}>
      <TopNews />
      <Revues />
      <Quotidien />
      <News />
    </TabLayout>
  );
}
