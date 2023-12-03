import moment from "moment/moment";
import { View, Text, ScrollView, Pressable } from "react-native";

import HeaderSection from "./HeaderSection";
import useData from "../hook/useData";
import ImageComponent from "./Image.component";
import usePlayer from "../hook/usePlayer";
import useStyles from "../hook/useStyle";

function RevueCard({ name, image }) {
  const { color, backgroundColorLight } = useStyles();

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 10,
        backgroundColor: backgroundColorLight,
        padding: 5,
        borderRadius: 10,
        width: 150,
        alignItems: "center",
      }}
    >
      <View style={{ height: 45, width: 45, borderRadius: 5, overflow: "hidden" }}>
        <ImageComponent image={image} />
      </View>
      <Text style={{ flex: 1, color }}>{name}</Text>
    </View>
  );
}

export default function Revues() {
  const { revues } = useData();
  const { playRevue } = usePlayer();
  // console.log(revues);

  return (
    <View>
      <HeaderSection title="Revue de pesse" span={moment(revues.createdTime).fromNow()} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            paddingHorizontal: 12,
          }}
        >
          {revues
            ? revues.audios.map((revue, i) => (
                <Pressable
                  key={i}
                  onPress={() => {
                    playRevue(revue);
                  }}
                >
                  <RevueCard name={revue.name} image={revue.image} />
                </Pressable>
              ))
            : null}
        </View>
      </ScrollView>
    </View>
  );
}
