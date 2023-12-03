import { View, ActivityIndicator, Image } from "react-native";
import useStyles from "../hook/useStyle";

export default function LoadingScreen() {
  const { primaryColor } = useStyles();
  return (
    <View
      style={{
        backgroundColor: primaryColor,
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View>
        <Image source={require("../assets/icon.png")} style={{ width: 250, height: 150 }} />
        <ActivityIndicator color="white" />
      </View>
    </View>
  );
}
