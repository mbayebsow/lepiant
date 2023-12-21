import moment from "moment/moment";
import { Pressable, View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Plus } from "lucide-react-native";

import HeaderSection from "./HeaderSection";
import useQuotidien from "../hook/useQuotidien";
import ImageComponent from "./Image.component";
import useStyles from "../hook/useStyle";

function QuotidienCard({ image }) {
  const { backgroundColorLight } = useStyles();
  return (
    <View
      style={{
        backgroundColor: backgroundColorLight,
        borderColor: backgroundColorLight,
        borderWidth: 2,
        borderRadius: 7,
        aspectRatio: 3 / 4.3,
        width: 80,
        overflow: "hidden",
      }}
    >
      <ImageComponent image={image} />
    </View>
  );
}

export default function Quotidien() {
  const navigation = useNavigation();
  const { quotidiens, setQIndex } = useQuotidien();

  return (
    <View>
      <HeaderSection title="Une des journaux" span={moment(quotidiens.createdTime).fromNow()} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 7,
            paddingHorizontal: 12,
          }}
        >
          {quotidiens
            ? quotidiens.files.slice(0, 7).map((quotidien, i) => (
              <Pressable
                key={i}
                onPress={() => {
                  setQIndex(i);
                  navigation.navigate("Quotidien");
                }}
              >
                <QuotidienCard image={quotidien.imageUrl} />
              </Pressable>
            ))
            : null}
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 20,
            }}
          >
            <Pressable
              onPress={() => {
                setQIndex(7);
                navigation.navigate("Quotidien");
              }}
              style={{
                backgroundColor: "#eb445a21",
                borderRadius: 100,
                padding: 5,
              }}
            >
              <Plus size={30} color="#eb445a" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
