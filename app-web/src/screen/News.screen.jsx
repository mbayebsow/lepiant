import PageLayout from "../components/layout/PageLayout.jsx";
import RevueSection from "../components/sections/Revue.section";
import QuotidientSection from "../components/quotidiens/QSection.jsx";
import AlauneSection from "../components/sections/Alaune.section";
import TopNewsSection from "../components/sections/TopNews.section";
import logo from "../assets/icon.svg";

export default function NewsScreen() {
  return (
    <PageLayout title={<img className="h-8 mx-auto" src={logo} />} border={true}>
      <TopNewsSection />
      <RevueSection />
      <QuotidientSection />
      <AlauneSection />
    </PageLayout>
  );
}
