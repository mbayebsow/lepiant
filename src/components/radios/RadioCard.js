import { Pressable, Text, View } from "react-native";
import useStyles from "../../hook/useStyle";
import ImageComponent from "../Image.component";
import usePlayer from "../../hook/usePlayer";
import RadioButtonLike from "./RadioButtonLike";

export default function RadioCard({ index, id, name, category, image }) {
  const { color, backgroundColorLight } = useStyles();
  const { preloadAudio } = usePlayer();

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
          <Text style={{ fontSize: 15, fontWeight: "bold", color }}>{name}</Text>
          <Text style={{ opacity: 0.5, color }}>{category}</Text>
        </View>
        <RadioButtonLike id={id} />
      </View>
    </View>
  );
}
