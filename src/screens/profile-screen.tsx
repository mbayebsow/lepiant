import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useSession from "../hook/useSession";
import useStyles from "../hook/useStyle";
import useArticle from "../hook/useArticle";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect } from "react";
import SelectField from "../components/ui/select";
import SwitchField from "../components/ui/switch";
import ProfileIcon from "../components/profile/profile-icon";

export default function ProfileScreen() {
  const { backgroundColor, backgroundColorLight, color, primaryColor, colorLight } = useStyles();
  const { userData, loading } = useSession();
  const { categories } = useArticle();
  const navigation = useNavigation<StackNavigationProp<any>>();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => navigation.navigate("ProfileEdit")}
          style={{ paddingHorizontal: 10 }}
        >
          <Text style={{ color: primaryColor, fontSize: 17 }}>Modifier</Text>
        </Pressable>
      ),
    });
  }, []);

  return (
    <ScrollView
      style={{
        backgroundColor: backgroundColorLight,
        height: "100%",
        padding: 12,
      }}
    >
      <View>
        {userData && (
          <>
            <View style={{ display: "flex", alignItems: "center", marginVertical: 25 }}>
              <ProfileIcon size={100} />
              <Text style={{ color, fontSize: 20, fontWeight: "600", textAlign: "center" }}>
                {userData.firstName} {userData.lastName}
              </Text>
              <Text style={{ textAlign: "center" }}>{userData.email}</Text>
            </View>

            <View
              style={{
                backgroundColor,
                padding: 12,
                borderRadius: 10,
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  backgroundColor: backgroundColorLight,
                  display: "flex",
                  gap: 1,
                }}
              >
                <SelectField
                  title="Langue"
                  value={userData.language}
                  placeholder="Choisir…"
                  items={[{ label: "Français", value: "fr", key: "fr" }]}
                  onValueChange={(value) => console.log(value)}
                />
                <SelectField
                  title="Zone geographique"
                  value={userData.country}
                  placeholder="Choisir…"
                  items={[{ label: "Sénégal", value: "sn", key: "sn" }]}
                  onValueChange={(value) => console.log(value)}
                />
                <SelectField
                  title="Page par default"
                  value={userData.defaultStartedPage}
                  placeholder="Choisir…"
                  onValueChange={(value) => console.log(value)}
                  items={[
                    { label: "Radios", value: "Radios", key: "Radios" },
                    { label: "News", value: "News", key: "News" },
                  ]}
                />
                <SelectField
                  title="Categorie par default"
                  value={userData?.categorie}
                  placeholder="Choisir…"
                  onValueChange={(value) => console.log(value)}
                  items={categories}
                />
              </View>
            </View>

            <View
              style={{
                backgroundColor,
                padding: 12,
                borderRadius: 10,
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  backgroundColor: backgroundColorLight,
                  display: "flex",
                  gap: 1,
                }}
              >
                <SwitchField
                  title="Recevoir des notifications"
                  placeholder="Vous pouvez vous désabonnez à tout moment"
                  value={userData.allowNotifications}
                  onValueChange={(value) => console.log(value)}
                />
              </View>
            </View>
          </>
        )}

        <View style={{ paddingVertical: 10 }}>
          <Pressable>
            <Text style={{ textAlign: "center", color: primaryColor }}>Se déconnecter</Text>
          </Pressable>
        </View>

        <View style={{ paddingVertical: 10 }}>
          <Text style={{ textAlign: "center", color: colorLight }}>V: 1.0.0</Text>
        </View>

        {loading && <ActivityIndicator />}
      </View>
    </ScrollView>
  );
}
