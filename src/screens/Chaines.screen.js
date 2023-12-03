import { View, Text, ScrollView } from "react-native";
import Channels from "../components/Channels.component";

export default function ChainesScreen() {
  return (
    <ScrollView>
      <Channels viewType="list" />
    </ScrollView>
  );
}
