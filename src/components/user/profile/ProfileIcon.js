import { Image, Pressable, Buton } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ProfileIcon() {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => navigation.navigate("Profile")}
      style={{
        backgroundColor: "#ffc48c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
        marginRight: 12,
      }}
    >
      <Image
        style={{ width: 30, height: 30 }}
        source={{
          uri: "https://images.complex.com/complex/images/c_fill,dpr_auto,f_auto,q_auto,w_1400/fl_lossy,pg_1/ankj5upoh8uiolkihlsv/memoji-3?fimg-client-default",
        }}
      />
    </Pressable>
  );
}
