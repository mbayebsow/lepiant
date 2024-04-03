import { FC } from "react";
import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Channel } from "../../utils/interfaces";
import Image from "../ui/image";
import useStyles from "../../hook/useStyle";
import ChannelSubscribButton from "./channel-subscrib-button";
import { ChannelNavigateParams } from "../../utils/types";

interface ChannelItemProps {
  channel: Channel;
  viewType: "card" | "list";
}

const ChannelItem: FC<ChannelItemProps> = ({ channel, viewType }) => {
  const navigation = useNavigation<StackNavigationProp<ChannelNavigateParams>>();
  const { name, logo } = channel;
  const { backgroundColor, backgroundColorLight, color } = useStyles();

  return (
    <View
      style={{
        backgroundColor,
        borderRadius: viewType === "card" ? 17 : 0,
        paddingHorizontal: viewType === "card" ? 7 : 0,
        paddingVertical: viewType === "card" ? 7 : 12,
        paddingRight: viewType === "list" ? 12 : 0,
        width: viewType === "card" ? 115 : "100%",
        display: "flex",
        flexDirection: viewType === "card" ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderWidth: viewType === "card" ? 1 : 0,
        borderColor: backgroundColorLight,
        gap: 7,
      }}
    >
      <Pressable
        onPress={() => navigation.navigate("Chaine", { channel })}
        style={{
          display: "flex",
          flexDirection: viewType === "card" ? "column" : "row",
          alignItems: "center",
          width: "auto",
          gap: 7,
          height: null,
        }}
      >
        <View
          style={{
            width: viewType === "card" ? 70 : 50,
            height: "auto",
            borderRadius: 100,
            aspectRatio: 1 / 1,
            overflow: "hidden",
          }}
        >
          <Image src={logo} />
        </View>
        <Text
          style={{
            textAlign: viewType === "card" ? "center" : "left",
            color,
          }}
          numberOfLines={1}
        >
          {name}
        </Text>
      </Pressable>

      <View style={{ width: 100 }}>
        <ChannelSubscribButton channel={channel} />
      </View>
    </View>
  );
};

export default ChannelItem;
