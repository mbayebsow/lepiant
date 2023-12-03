import { View } from "react-native";
import TabLayout from "../components/layout/TabLayout";
import Channels from "../components/Channels.component";
import HeaderSection from "../components/HeaderSection";
import useStyles from "../hook/useStyle";

export default function LibraryScreen() {
  const { backgroundColor, backgroundColorLight } = useStyles();
  return (
    <TabLayout backgroundColor={backgroundColorLight}>
      <Channels items={5} viewType="card" />
      <View
        style={{
          backgroundColor,
          height: "100%",
          marginTop: 20,
        }}
      >
        <HeaderSection title="Mes radios" />
      </View>
      <View
        style={{
          backgroundColor,
          height: "100%",
          marginTop: 20,
        }}
      >
        <HeaderSection title="Mes articles" />
      </View>
    </TabLayout>
  );
}
