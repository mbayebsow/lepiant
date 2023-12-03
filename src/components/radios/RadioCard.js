import useStyles from "../../hook/useStyle";
import { Pressable, Text, View } from "react-native";
import ImageComponent from "../Image.component";
import { Heart } from "lucide-react-native";

export default function RadioCard({ index, id, name, category, image, preloadAudio }) {
  const { color, backgroundColorLight, primaryColor } = useStyles();

  return (
    <View
      style={{
        width: "100%",
      }}
    >
      <Pressable onPress={() => preloadAudio(index, category)}>
        <View
          style={{
            width: "100%",
            height: "auto",
            aspectRatio: 1 / 1,
            resizeMode: "stretch",
            borderRadius: 10,
            overflow: "hidden",
            backgroundColor: backgroundColorLight,
          }}
        >
          <ImageComponent image={image} />
        </View>
      </Pressable>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 5,
          marginTop: 2,
        }}
      >
        <View>
          <Text style={{ fontSize: 15, fontWeight: 500, color }}>{name}</Text>
          <Text style={{ opacity: 0.5, color }}>{category}</Text>
        </View>
        <Pressable>
          <Heart size={20} color={primaryColor} />
        </Pressable>
      </View>
    </View>
  );
}
