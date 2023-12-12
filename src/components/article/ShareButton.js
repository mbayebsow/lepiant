import { Pressable } from "react-native";
import { ImageDown } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { trigger } from "react-native-haptic-feedback";

export default function ArticleShareButton({ article }) {
  const navigation = useNavigation();

  return (
    <>
      <Pressable
        onPress={() => {
          navigation.navigate("SharArticle", article);
          trigger("impactLight");
        }}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          borderTopRightRadius: 100,
          width: 35,
          height: 35,
        }}
      >
        <ImageDown size={20} color="red" />
      </Pressable>
    </>
  );
}
