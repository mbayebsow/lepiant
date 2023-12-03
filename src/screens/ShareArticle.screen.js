import moment from "moment/moment";
import { useEffect, useRef, useState } from "react";
import { Text, View, Pressable, ActivityIndicator, Image, SafeAreaView } from "react-native";
import { ShareIcon, X } from "lucide-react-native";
import ViewShot from "react-native-view-shot";
import Share from "react-native-share";
import { useRoute, useNavigation } from "@react-navigation/native";

import { ColorExtractor } from "../lib";
import useChannel from "../hook/useChannel";
import useStyles from "../hook/useStyle";

export default function ShareArticleScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const ref = useRef();
  const { title, published, image, channel, source } = route.params;
  const [averageColor, setAverageColor] = useState(null);
  const { getChannelsDetails } = useChannel();
  const { backgroundColorLight } = useStyles();

  const getColor = async () => {
    const color = await ColorExtractor(image);

    if (color?.success) setAverageColor(color.color);
    if (!color) setAverageColor({ hex: backgroundColorLight, isDark: false });
  };

  const captureArticle = () => {
    ref.current.capture().then((uri) => {
      const shareOptions = {
        title: "Share via",
        message: `${title} - ${channel ? getChannelsDetails(channel)?.name : source}`,
        url: uri,
        social: Share.Social.SMS,
        filename: title, // only for base64 file in Android
        isNewTask: true,
        type: "image/jpeg",
      };

      Share.open(shareOptions)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          err && console.log(err);
        });
    });
  };

  useEffect(() => {
    getColor();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
      }}
    >
      {averageColor ? (
        <SafeAreaView
          style={{
            backgroundColor: backgroundColorLight,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}
        >
          <View style={{ padding: 12, width: "100%" }}>
            <View>
              <ViewShot
                ref={ref}
                options={{ fileName: "Your-File-Name", format: "jpg", quality: 0.9 }}
                style={{ width: "100%" }}
              >
                <View
                  style={{
                    aspectRatio: 1,
                    backgroundColor: averageColor.hex,
                    borderRadius: 20,
                    borderColor: averageColor.hex,
                    borderWidth: 2,
                    overflow: "hidden",
                    width: "100%",
                    padding: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: averageColor.isDark ? "white" : "black",
                    }}
                  >
                    {title}
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#8c8c95",
                      marginVertical: 20,
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      style={{ width: "100%", aspectRatio: 16 / 9 }}
                      source={{
                        uri: image,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    {channel && (
                      <Image
                        style={{ width: 25, height: 25, borderRadius: 100 }}
                        source={{
                          uri: getChannelsDetails(channel)?.logo,
                        }}
                      />
                    )}

                    <Text style={{ color: averageColor.isDark ? "white" : "black" }}>
                      {channel ? getChannelsDetails(channel)?.name : source}
                    </Text>
                    <Text style={{ color: averageColor.isDark ? "white" : "black" }}>
                      {moment(published).fromNow()}
                    </Text>
                  </View>
                </View>
              </ViewShot>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginVertical: 20,
                  gap: 20,
                }}
              >
                <Pressable
                  style={{
                    backgroundColor: "black",
                    padding: 10,
                    paddingHorizontal: 15,
                    height: 40,
                    borderRadius: 20,
                    display: "flex",
                    gap: 7,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onPress={() => captureArticle()}
                >
                  <ShareIcon size={20} color="white" />
                  <Text style={{ color: "white" }}>Partager</Text>
                </Pressable>

                <Pressable
                  style={{
                    backgroundColor: averageColor ? averageColor.hex : "white",
                    padding: 10,
                    borderRadius: 100,
                    width: 40,
                    height: 40,
                  }}
                  onPress={() => navigation.goBack()}
                >
                  <X color={averageColor.isDark ? "white" : "black"} size={20} />
                </Pressable>
              </View>
            </View>
          </View>
        </SafeAreaView>
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size={100} color="white" />
        </View>
      )}
    </View>
  );
}
