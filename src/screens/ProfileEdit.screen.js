import { View, Dimensions, Image, ScrollView } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { interpolate } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { Save } from "lucide-react-native";
import Carousel from "react-native-reanimated-carousel";

import avatar from "../utils/avatar.json";
import useSession from "../hook/useSession";
import useStyles from "../hook/useStyle";
import Input from "../components/ui/Input";
import PrimaryBouton from "../components/ui/button";

export default function ProfileEditScreen() {
  const navigation = useNavigation();
  const { primaryColor10, primaryColor50, backgroundColorLight, backgroundColor } = useStyles();
  const { userData, loading, updateUserSession } = useSession();
  const [profile, setProfile] = useState(userData ? Number(userData.profile) : 0);
  const [firstName, setFirstName] = useState(userData ? userData.firstName : null);
  const [lastName, setLastName] = useState(userData ? userData.lastName : null);

  let itemSize = 100;
  const screenWidth = Dimensions.get("window").width;
  const centerOffset = screenWidth / 2 - itemSize / 2;

  const updateFullName = async () => {
    let user = {};
    if (firstName) user.firstName = { iv: firstName };
    if (lastName) user.lastName = { iv: lastName };
    if (profile) user.profile = { iv: profile.toString() };

    await updateUserSession(user);
    navigation.goBack();
  };

  const animationStyle = useCallback(
    (value) => {
      "worklet";

      const itemGap = interpolate(value, [-3, -2, -1, 0, 1, 2, 3], [-30, -15, 8, 0, -8, 15, 30]);

      const translateX =
        interpolate(value, [-1, 0, 1], [-itemSize, 0, itemSize]) + centerOffset - itemGap;

      const translateY = interpolate(value, [2, 2, 2, 2, 2], [20, 20, 20, 20, 20]);

      const scale = interpolate(value, [-1, -0.5, 0, 0.5, 1], [0.8, 0.9, 1.2, 0.9, 0.8]);

      return {
        transform: [
          {
            translateX,
          },
          {
            translateY,
          },
          { scale },
        ],
      };
    },
    [centerOffset]
  );

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: backgroundColorLight,
      },
      headerShadowVisible: false,
    });
  }, [backgroundColorLight]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: backgroundColorLight, paddingTop: 30 }}>
      <Carousel
        defaultIndex={profile}
        width={itemSize}
        height={itemSize}
        data={avatar}
        style={{
          width: screenWidth,
          height: screenWidth / 3,
        }}
        onSnapToItem={(index) => setProfile(index)}
        renderItem={({ item, index }) => (
          <View
            style={{
              flex: 1,
              width: itemSize,
              height: itemSize,
              backgroundColor: profile === index ? primaryColor50 : primaryColor10,
              padding: 5,
              borderRadius: 100,
            }}
          >
            <Image style={{ width: "100%", height: "100%" }} source={{ uri: item.uri }} />
          </View>
        )}
        customAnimation={animationStyle}
      />

      <View style={{ padding: 20 }}>
        <View
          style={{
            padding: 20,
            backgroundColor,
            borderRadius: 20,
          }}
        >
          <View style={{ marginBottom: 10 }}>
            <Input
              label="Prénom"
              value={firstName}
              placeholder="Entrez votre prénom"
              keyboardType="default"
              InputModeOptions="text"
              onChangeText={(value) => setFirstName(value)}
            />
            <Input
              label="Nom"
              value={lastName}
              placeholder="Entrez votre nom"
              keyboardType="default"
              InputModeOptions="text"
              onChangeText={(value) => setLastName(value)}
            />
          </View>
          <PrimaryBouton
            loading={loading}
            onPress={updateFullName}
            text="Enregistrer"
            icon={<Save color="white" size={20} />}
          />
        </View>
      </View>
    </ScrollView>
  );
}
