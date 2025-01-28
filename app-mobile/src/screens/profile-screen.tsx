import { FC, useCallback, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import useStyles from "../hook/useStyle";
import SelectField from "../components/ui/select";
import SwitchField from "../components/ui/switch";
import ProfileIcon from "../components/profile/profile-icon";
import useArticleStore from "../hook/useArticle";
import { UserMail, UserName } from "../components/profile/user-details";
import UserLogout from "../components/profile/user-logout";
import AppVersion from "../components/app-version";
import useSessionStore from "../hook/useSession";
import UserEditButton from "../components/profile/user-edit-button";
import { User } from "../utils/interfaces";
import Toast from "react-native-simple-toast";

const ProfileScreen: FC = () => {
  const { backgroundColor, backgroundColorLight } = useStyles();
  const userData = useSessionStore(state => state.userData);
  const updateUser = useSessionStore(state => state.updateUser);
  const [loading, setLoading] = useState(false);
  const categories = useArticleStore(state => state.categories);

  const categorieItems = useMemo(() => {
    return categories.map(categorie => {
      return {
        label: categorie.name,
        value: categorie.id,
        key: categorie.id,
      };
    });
  }, [categories]);

  const updateEntry = useCallback(async (user: Partial<User>) => {
    setLoading(true);
    const update = await updateUser(user);
    if (update) {
      Toast.show("Update success", Toast.SHORT);
    } else {
      Toast.show("Update failed", Toast.SHORT);
    }
    setLoading(false);
  }, []);

  return (
    <ScrollView
      style={{
        backgroundColor: backgroundColorLight,
        height: "100%",
        padding: 20,
        paddingTop: 50,
      }}>
      <View>
        {userData && (
          <>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                marginVertical: 25,
              }}>
              <ProfileIcon size={100} />
              <UserName />
              <UserMail />
              <UserEditButton />
            </View>

            <View
              style={{
                backgroundColor,
                padding: 12,
                borderRadius: 10,
                marginBottom: 20,
              }}>
              <View
                style={{
                  backgroundColor: backgroundColorLight,
                  display: "flex",
                  gap: 1,
                }}>
                <SelectField
                  title="Langue"
                  value={userData.language}
                  placeholder="Choisir…"
                  items={[{ label: "Français", value: "fr", key: "fr" }]}
                  onValueChange={value => updateEntry({ language: value })}
                />
                <SelectField
                  title="Zone geographique"
                  value={userData.country}
                  placeholder="Choisir…"
                  items={[{ label: "Sénégal", value: "sn", key: "sn" }]}
                  onValueChange={value => updateEntry({ country: value })}
                />
                <SelectField
                  title="Page par default"
                  value={userData.defaultStartedPage}
                  placeholder="Choisir…"
                  onValueChange={value => updateEntry({ defaultStartedPage: value })}
                  items={[
                    {
                      label: "Radios",
                      value: "Radios",
                      key: "Radios",
                    },
                    { label: "News", value: "News", key: "News" },
                  ]}
                />
                <SelectField
                  title="Categorie par default"
                  value={userData?.categorie.id}
                  placeholder="Choisir…"
                  onValueChange={value => updateEntry({ defaultArticleCategorie: +value })}
                  items={categorieItems}
                />
              </View>
            </View>

            <View
              style={{
                backgroundColor,
                padding: 12,
                borderRadius: 10,
                marginBottom: 20,
              }}>
              <View
                style={{
                  backgroundColor: backgroundColorLight,
                  display: "flex",
                  gap: 1,
                }}>
                <SwitchField
                  title="Recevoir des notifications"
                  placeholder="Vous pouvez vous désabonnez à tout moment"
                  value={userData.allowNotifications}
                  onValueChange={value => updateEntry({ allowNotifications: value })}
                />
              </View>
            </View>
          </>
        )}

        <UserLogout />
        <AppVersion />
        {loading && <ActivityIndicator />}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    paddingBottom: 30,
  },
});

export default ProfileScreen;
