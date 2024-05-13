import { View, StyleSheet } from "react-native";
import { useCallback, useState } from "react";
import useStyles from "../hook/useStyle";
import Input from "../components/ui/Input";
import useSessionStore from "../hook/useSession";
import Button from "../components/ui/button";
import ModalPageLayout from "../components/layout/modal-page-layout";
import Toast from "react-native-simple-toast";
import AvatarSelect from "../components/profile/avatar-select";

export default function ProfileEditScreen() {
  const { backgroundColor, backgroundColorLight } = useStyles();
  const userData = useSessionStore(state => state.userData);
  const updateUser = useSessionStore(state => state.updateUser);
  const [firstName, setFirstName] = useState(userData?.firstName);
  const [lastName, setLastName] = useState(userData?.lastName);
  const [avatar, setAvatar] = useState(userData?.avatar);
  const [loading, setLoading] = useState(false);

  const updateFullName = useCallback(async () => {
    setLoading(true);
    const update = await updateUser({
      firstName,
      lastName,
      avatar,
    });

    if (update) {
      Toast.show("Update success", Toast.SHORT);
    } else {
      Toast.show("Update failed", Toast.SHORT);
    }

    setLoading(false);
    // await updateUserSession(user);
    // navigation.goBack();
  }, [firstName, lastName, avatar]);

  return (
    <ModalPageLayout backgroundColor={backgroundColorLight}>
      <View style={styles.modalContainer}>
        <AvatarSelect avatar={avatar} setAvatar={setAvatar} />

        <View style={[styles.inputContainer, { backgroundColor: backgroundColor }]}>
          <Input
            label="Prenom"
            value={firstName}
            placeholder="Entrez votre prénom"
            keyboardType="default"
            InputModeOptions="text"
            onChangeText={value => setFirstName(value)}
          />
          <Input
            label="Prenom"
            value={lastName}
            placeholder="Entrez votre nom"
            keyboardType="default"
            InputModeOptions="text"
            onChangeText={value => setLastName(value)}
          />
        </View>

        <View>
          <Button loading={loading} onPress={updateFullName}>
            Enregistrer
          </Button>
        </View>
      </View>
    </ModalPageLayout>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  inputContainer: {
    width: "auto",
    borderRadius: 10,
    overflow: "hidden",
    padding: 5,
    margin: 10,
  },
  inputSubContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputText: {
    fontSize: 16,
  },
  input: {
    fontSize: 16,
    lineHeight: 20,
    padding: 12,
    width: "100%",
  },
});
