import { Pressable } from "react-native";
import { ImageDown } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

export default function ArticleShareButton({ article }) {
  const navigation = useNavigation();

  return (
    <>
      <Pressable
        onPress={() => navigation.navigate("SharArticle", article)}
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
