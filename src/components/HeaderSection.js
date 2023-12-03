import { View, Text } from "react-native";
import useStyles from "../hook/useStyle";

export default function HeaderSection({ title, span }) {
  const { color, colorLight } = useStyles();
  return (
    <View
      style={{
        width: "100%",
        paddingHorizontal: 12,
        marginTop: 15,
        marginBottom: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: 700, color }}>{title}</Text>
      <Text style={{ fontSize: 12, fontWeight: 400, color: colorLight }}>{span}</Text>
    </View>
  );
}
