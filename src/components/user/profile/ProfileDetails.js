import { useEffect } from "react";
import { View, Text, Image, Pressable, Switch, ActivityIndicator } from "react-native";
import { ChevronsUpDown } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";

import avatar from "../../../lib/avatar.json";
import useSession from "../../../hook/useSession";
import useStyles from "../../../hook/useStyle";
import useArticle from "../../../hook/useArticle";

function ItemSelect({ title, value, placeholder, items, onValueChange }) {
  const { backgroundColor, color, colorLight, isDarkMode } = useStyles();
  return (
    <View
      style={{
        backgroundColor,
        paddingVertical: 12,
        paddingHorizontal: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ color, fontSize: 15 }}>{title}</Text>
      <RNPickerSelect
        value={value}
        darkTheme={isDarkMode}
        items={items}
        Icon={() => <ChevronsUpDown size={15} color={color} />}
        onValueChange={onValueChange}
        placeholder={{
          label: placeholder,
          value: null,
          color: colorLight,
        }}
        style={{
          inputIOS: { marginRight: 20, color },
          inputAndroid: { marginRight: 20, color },
          placeholder: { marginRight: 20, color: colorLight },
        }}
      />
    </View>
  );
}

function ItemSwitch({ title, value, placeholder, onValueChange }) {
  const { backgroundColor, color, colorLight, primaryColor } = useStyles();

  return (
    <View
      style={{
        backgroundColor,
        paddingVertical: 12,
        paddingHorizontal: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View>
        <Text style={{ color, fontSize: 15 }}>{title}</Text>
        <Text style={{ color, fontSize: 11, color: colorLight }}>{placeholder}</Text>
      </View>
      <Switch
        trackColor={{ false: colorLight, true: primaryColor }}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
}

export default function ProfileDetails() {
  const { backgroundColor, backgroundColorLight, color, primaryColor, primaryColor50, colorLight } =
    useStyles();
  const { isLogin, userData, loading, updateUserSession } = useSession();
  const { categories } = useArticle();
  const navigation = useNavigation();

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
    <>
      <View style={{ display: "flex", alignItems: "center", marginVertical: 25 }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 100,
            backgroundColor: primaryColor50,
            marginBottom: 10,
          }}
        >
          <Image
            source={{ uri: isLogin ? avatar[Number(userData.profile)].uri : avatar[0].uri }}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <Text style={{ color, fontSize: 20, fontWeight: 600, textAlign: "center" }}>
          {userData?.firstName} {userData?.lastName}
        </Text>
        <Text style={{ textAlign: "center" }}>{userData?.login}</Text>
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
          <ItemSelect
            title="Langue"
            value={userData?.language}
            placeholder="Choisir…"
            items={[{ label: "Français", value: "fr" }]}
            onValueChange={(value) => console.log(value)}
          />
          <ItemSelect
            title="Zone geographique"
            value={userData?.country}
            placeholder="Choisir…"
            items={[{ label: "Sénégal", value: "sn" }]}
            onValueChange={(value) => console.log(value)}
          />
          <ItemSelect
            title="Page par default"
            value={userData?.defaultStartedPage}
            placeholder="Choisir…"
            onValueChange={(value) => updateUserSession({ defaultStartedPage: { iv: value } })}
            items={[
              { label: "Radios", value: "radios" },
              { label: "News", value: "news" },
            ]}
          />
          <ItemSelect
            title="Categorie par default"
            value={userData?.defaultArticleCategorie}
            placeholder="Choisir…"
            onValueChange={(value) => updateUserSession({ defaultArticleCategorie: { iv: value } })}
            items={
              categories
                ? categories.map((categirie) => ({ label: categirie.name, value: categirie.id }))
                : []
            }
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
          <ItemSwitch
            title="Recevoir des notifications"
            placeholder="Vous pouvez vous désabonnez à tout moment"
            value={userData?.allowNotifications}
            onValueChange={(value) => updateUserSession({ allowNotifications: { iv: value } })}
          />
        </View>
      </View>

      <View style={{ paddingVertical: 10 }}>
        <Pressable>
          <Text style={{ textAlign: "center", color: primaryColor }}>Se déconnecter</Text>
        </Pressable>
      </View>

      <View style={{ paddingVertical: 10 }}>
        <Text style={{ textAlign: "center", color: colorLight }}>V: 1.0.0</Text>
      </View>

      {loading && <ActivityIndicator />}
    </>
  );
}
