import { ImageBackground, Dimensions, View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "react-native-linear-gradient";
import Carousel from "react-native-reanimated-carousel";
import useData from "../hook/useData";
import useArticle from "../hook/useArticle";

function TopNewsCard({ title, description, image, link, source }) {
  const navigation = useNavigation();
  const { setOpenArticleViewerDetails } = useArticle();

  return (
    <Pressable
      onPress={() => {
        setOpenArticleViewerDetails({ title, description, image, link, source });
        navigation.navigate("Article");
      }}
    >
      <ImageBackground
        source={{
          uri: image,
        }}
        style={{
          backgroundSize: "cover",
          backgroundColor: "black",
          width: "100%",
          height: "100%",
          backgroundPosition: "center",
        }}
      >
        <LinearGradient
          colors={["transparent", "#171717"]}
          style={{
            height: "100%",
          }}
        >
          <View style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
            <Text style={{ color: "white", fontSize: 10, marginBottom: 5 }}>{source}</Text>
            <Text style={{ color: "white", fontSize: 20, fontWeight: 700 }}>{title}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}

export default function TopNews() {
  const width = Dimensions.get("window").width;
  const { topNews } = useData();

  return topNews ? (
    <Carousel
      loop
      width={width}
      height={width / 1.7}
      autoPlay={true}
      data={topNews.articles}
      autoPlayInterval={7000}
      scrollAnimationDuration={500}
      //onSnapToItem={(index) => console.log("current index:", index)}
      renderItem={({ index, item }) => (
        <TopNewsCard title={item.title} image={item.image} source={item.source} link={item.link} />
      )}
    />
  ) : null;
}
