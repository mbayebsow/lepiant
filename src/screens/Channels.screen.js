import { ScrollView } from "react-native";
import Channels from "../components/Channels.component";
import HeaderSection from "../components/HeaderSection";

export default function ChannelsScreen() {
  return (
    <ScrollView>
      <HeaderSection title="Chaînes" />
      <Channels viewType="list" />
    </ScrollView>
  );
}
