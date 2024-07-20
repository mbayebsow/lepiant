import moment from "moment/moment";
import { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { ShareIcon } from "lucide-react-native";
import ViewShot from "react-native-view-shot";
import Share from "react-native-share";
import { useRoute, RouteProp } from "@react-navigation/native";
import useStyles from "../hook/useStyle";
import { getColorAverage } from "../utils/helpers/colorAverage";
import { Article, AverageColor, Channel } from "../utils/interfaces";
import ModalPageLayout from "../components/layout/modal-page-layout";

type ParamArticle = {
  SharArticle: {
    article: Article;
    channel: Channel;
  };
};

const ShareArticleScreen = () => {
  const viewShotRef = useRef<ViewShot>(null);
  const route = useRoute<RouteProp<ParamArticle, "SharArticle">>();
  const [averageColor, setAverageColor] = useState<
    AverageColor | false | "loading"
  >("loading");
  const { backgroundColorLight, backgroundColor, color } =
    useStyles();
  const { article, channel } = route.params;

  const captureArticle = () => {
    viewShotRef.current?.capture().then(uri => {
      const shareOptions = {
        title: "Share via",
        message: `${article.title} - ${channel.name}`,
        url: uri,
        social: Share.Social.SMS,
        filename: article.title,
        isNewTask: true,
        type: "image/jpeg",
      };

      Share.open(shareOptions)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
    });
  };

  const getColor = async () => {
    const color = await getColorAverage(article.image);
    if (color && color.success) {
      setAverageColor(color);
    } else {
      setAverageColor(false);
    }
  };

  useEffect(() => {
    getColor();
  }, []);

  return (
    <ModalPageLayout backgroundColor={backgroundColorLight}>
      <View
        style={{
          gap: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: 500,
          padding: 12,
        }}>
        <ViewShot
          ref={viewShotRef}
          // onCapture={onCapture} captureMode="mount"
          options={{
            fileName: "Your-File-Name",
            format: "jpg",
            quality: 0.9,
          }}
          style={{ width: "100%" }}>
          {averageColor !== "loading" ? (
            <View
              style={{
                // aspectRatio: 1,
                backgroundColor: averageColor
                  ? averageColor.color?.hex
                  : backgroundColor,
                overflow: "hidden",
                width: "100%",
                padding: 20,
                borderRadius: 25,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    color: averageColor
                      ? averageColor.color?.isDark
                        ? "white"
                        : "black"
                      : color,
                  }}>
                  {article.title}
                </Text>
              </View>

              <View>
                <View
                  style={{
                    backgroundColor: "#8c8c95",
                    marginVertical: 20,
                    borderRadius: 10,
                    overflow: "hidden",
                  }}>
                  <Image
                    style={{ width: "100%", aspectRatio: 16 / 9 }}
                    source={{
                      uri: article.image,
                    }}
                  />
                </View>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                  }}>
                  <Image
                    style={{
                      width: 25,
                      height: 25,
                      borderRadius: 100,
                    }}
                    source={{
                      uri: channel.logo,
                    }}
                  />

                  <Text
                    style={{
                      color: averageColor
                        ? averageColor.color?.isDark
                          ? "white"
                          : "black"
                        : color,
                    }}>
                    {channel.name}
                  </Text>
                  <Text
                    style={{
                      color: averageColor
                        ? averageColor.color?.isDark
                          ? "white"
                          : "black"
                        : color,
                    }}>
                    {moment(article.published).fromNow()}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <ActivityIndicator />
          )}
        </ViewShot>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 0,
          }}>
          <Pressable
            style={{
              backgroundColor: "black",
              padding: 10,
              paddingHorizontal: 15,
              borderRadius: 20,
              display: "flex",
              gap: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => captureArticle()}>
            <ShareIcon size={20} color="white" />
            <Text style={{ color: "white" }}>Partager</Text>
          </Pressable>
        </View>
      </View>
    </ModalPageLayout>
  );
};

export default ShareArticleScreen;
