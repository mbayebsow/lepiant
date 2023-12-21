import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useChannel from "../hook/useChannel";
import { Plus } from "lucide-react-native";
import ImageComponent from "./Image.component";
import useStyles from "../hook/useStyle";
import useSession from "../hook/useSession";

function ChannelItem({ channel, viewType }) {
  const { id, name, logo } = channel
  const { isLogin } = useSession()
  const navigation = useNavigation();
  const { backgroundColor, backgroundColorLight, color } = useStyles();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { subscribedChannel, toggleSubscribe, loading } = useChannel();

  useEffect(() => {
    const subscribed = subscribedChannel.find((subscribed) => subscribed.channel === id);
    setIsSubscribed(subscribed ? true : false);
  }, [subscribedChannel]);

  return (
    <View
      style={{
        backgroundColor,
        borderRadius: viewType === "card" ? 17 : 0,
        paddingHorizontal: viewType === "card" ? 7 : 0,
        paddingVertical: viewType === "card" ? 7 : 12,
        paddingRight: viewType === "list" ? 12 : 7,
        width: viewType === "card" ? 115 : "100%",
        display: "flex",
        flexDirection: viewType === "card" ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: viewType === "card" ? 0 : 1,
        borderColor: backgroundColorLight,
        gap: 7,
        shadowColor: backgroundColorLight,
        shadowOffset: {
          width: 2,
          height: 5,
        },
        shadowOpacity: viewType === "card" ? 0.3 : 0,
        shadowRadius: 5.62,
      }}
    >
      <Pressable
        onPress={() => navigation.navigate("Chaine", channel)}
        style={{
          display: "flex",
          flexDirection: viewType === "card" ? "column" : "row",
          alignItems: "center",
          width: "auto",
          gap: 7,
          height: null
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
          <ImageComponent image={logo} />
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

      <Pressable
        onPress={() => isLogin ? toggleSubscribe(id) : navigation.navigate("Login")}
        style={{
          backgroundColor: isSubscribed ? "#f8ccd221" : "#eb445a21",
          width: viewType === "card" ? "100%" : 100,
          height: 30,
          borderRadius: 100,
          paddingVertical: 5,
          paddingHorizontal: 5,
          marginTop: 5,
        }}
      >
        {loading === id ? (
          <ActivityIndicator size={20} />
        ) : (
          <Text
            style={{
              flex: 1,
              textAlign: "center",
              color: isSubscribed ? "#d4c9ca" : "#eb445a",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isSubscribed ? "Suivie" : "Suivre"}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

export default function Channels({ items = null, viewType = "card" | "list" }) {
  const { channels, subscribedChannel } = useChannel();
  const navigation = useNavigation();

  function sortChannel(channels) {
    const chainesAbonnees = channels.filter((chaine) =>
      subscribedChannel.map((c) => c.channel).includes(chaine.id)
    );
    const chainesNonAbonnees = channels.filter(
      (chaine) => !subscribedChannel.map((c) => c.channel).includes(chaine.id)
    );
    const sortedChannels = chainesAbonnees.concat(chainesNonAbonnees);

    return sortedChannels;
  }

  return (
    <View>
      <ScrollView horizontal={viewType === "card"} showsHorizontalScrollIndicator={false}>
        <View
          style={{
            display: "flex",
            flexDirection: viewType === "card" ? "row" : "column",
            gap: viewType === "card" ? 10 : 0,
            paddingHorizontal: 12,
            paddingBottom: 12,
          }}
        >
          {channels &&
            sortChannel(channels)
              .slice(0, items ? items : channels.length)
              .map((channel, i) => (
                <View key={i}>
                  <ChannelItem
                    channel={channel}
                    viewType={viewType}
                  />
                </View>
              ))}
          {items && (
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 20,
              }}
            >
              <Pressable
                onPress={() => navigation.navigate("Chaines")}
                style={{
                  backgroundColor: "#eb445a21",
                  borderRadius: 100,
                  padding: 5,
                }}
              >
                <Plus size={30} color="#eb445a" />
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
