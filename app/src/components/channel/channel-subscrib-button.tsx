import { Text, Pressable, ActivityIndicator } from "react-native";
import React, { FC, useMemo, useState } from "react";
import { Channel } from "../../utils/interfaces";
import useChannelStore from "../../hook/useChannel";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import useSessionStore from "../../hook/useSession";
import useStyles from "../../hook/useStyle";
import { trigger } from "react-native-haptic-feedback";

interface ChannelSubscribButtonProps {
  channel: Channel;
  variant?: "button" | "icon";
}

const ChannelSubscribButton: FC<ChannelSubscribButtonProps> = ({ channel }) => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const isLogin = useSessionStore((state) => state.isLogin);
  const subscribedChannels = useChannelStore((state) => state.subscribedChannels);
  const toggleSubscribe = useChannelStore((state) => state.toggleSubscribe);

  const { backgroundColorLight, color, primaryColor } = useStyles();

  const handleSubscribe = async () => {
    trigger("impactLight");
    setLoading(true);
    if (!isLogin) {
      navigation.navigate("Login");
      setLoading(false);
    } else {
      await toggleSubscribe(channel.id);
      setLoading(false);
    }
  };

  const isSubscribed = useMemo(
    () => (subscribedChannels.find((e) => e.channelId === channel.id) ? true : false),
    [subscribedChannels, channel]
  );

  return (
    <Pressable
      onPress={handleSubscribe}
      style={{
        backgroundColor: isSubscribed ? backgroundColorLight : primaryColor,
        width: "100%",
        height: 35,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading ? (
        <ActivityIndicator size={20} color={color} />
      ) : (
        <Text
          style={{
            color: isSubscribed ? color : "white",
          }}
        >
          {isSubscribed ? "Suivie" : "Suivre"}
        </Text>
      )}
    </Pressable>
  );
};

export default ChannelSubscribButton;
