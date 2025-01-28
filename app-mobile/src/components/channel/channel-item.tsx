import { FC } from "react";
import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Channel } from "../../utils/interfaces";
import Image from "../ui/image";
import useStyles from "../../hook/useStyle";
import ChannelSubscribButton from "./channel-subscrib-button";
import { ChannelNavigateParams } from "../../utils/types";
import useArticleStore from "../../hook/useArticle";

interface ChannelItemProps {
  channel: Channel;
  viewType: "card" | "list";
  variant?: "large" | "small";
}

const ChannelItem: FC<ChannelItemProps> = ({ channel, viewType }) => {
  const navigation = useNavigation<StackNavigationProp<ChannelNavigateParams>>();
  const { name, logo } = channel;
  const { backgroundColorLight, color, colorLight } = useStyles();
  const categories = useArticleStore((state) => state.categories);

  return (
    <View
      style={{
        padding: 5,
        width: viewType === "card" ? 230 : "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderWidth: viewType === "card" ? 1 : 0,
        borderColor: backgroundColorLight,
        borderRadius: 20,
        gap: 0,
      }}
    >
      <Pressable
        onPress={() => navigation.navigate("Chaine", { channel })}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "40%",
          gap: 7,
          height: null,
        }}
      >
        <View
          style={{
            width: 50,
            height: "auto",
            borderRadius: 100,
            aspectRatio: 1 / 1,
            overflow: "hidden",
          }}
        >
          <Image src={logo} />
        </View>

        <View style={{ width: 85, overflow: "hidden" }}>
          <Text
            style={{
              textAlign: "left",
              color,
            }}
            numberOfLines={1}
          >
            {name}
          </Text>

          <View style={{ flexDirection: "row", gap: 5, paddingVertical: 2 }}>
            {channel.sources.map((source, i) => (
              <Text
                key={i}
                numberOfLines={1}
                style={{ fontSize: 9, fontWeight: "bold", color: colorLight }}
              >
                #{categories.find((c) => c.id === source.categorieId)?.name}
              </Text>
            ))}
          </View>
        </View>
      </Pressable>

      <View style={{ width: 70 }}>
        <ChannelSubscribButton channel={channel} />
      </View>
    </View>
  );
};

export default ChannelItem;
