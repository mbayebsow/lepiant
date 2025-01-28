import {
  StyleSheet,
  View,
  FlatList,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  Modal,
} from "react-native";
import React, { FC, useCallback, useState } from "react";
import avatar from "../../utils/avatar.json";
import useStyles from "../../hook/useStyle";
import Input from "../ui/Input";
import Button from "../ui/button";
import { X } from "lucide-react-native";
import useSessionStore from "../../hook/useSession";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export const ModalContent: FC = () => {
  const userData = useSessionStore(state => state.userData);
  const loading = useSessionStore(state => state.loading);
  const [firstName, setFirstName] = useState(userData?.firstName);
  const [lastName, setLastName] = useState(userData?.lastName);
  const { backgroundColor, backgroundColorLight, primaryColor10 } =
    useStyles();

  const updateFullName = async () => {
    console.log(firstName, lastName);

    // let user = {};
    // if (firstName) user.firstName = { iv: firstName };
    // if (lastName) user.lastName = { iv: lastName };
    // if (profile) user.profile = { iv: profile.toString() };

    // await updateUserSession(user);
    // navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{}}>
      <View style={styles.modalContainer}>
        <View style={styles.avatarContainer}>
          <FlatList
            data={avatar}
            numColumns={3}
            renderItem={({ item, index }) => (
              <View
                style={{
                  padding: 5,
                  width: "33%",
                  height: "auto",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <View
                  key={index}
                  style={{
                    flex: 1,
                    width: 100,
                    height: 100,
                    backgroundColor: backgroundColor,
                    padding: 10,
                    borderRadius: 100,
                    aspectRatio: 1,
                  }}>
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={{ uri: item.uri }}
                  />
                </View>
              </View>
            )}
            // keyExtractor={this._keyExtractor}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            { backgroundColor: backgroundColor },
          ]}>
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
    </KeyboardAvoidingView>
  );
};

const UserEditButton: FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { primaryColor } = useStyles();

  const navigate = useCallback(() => {
    navigation.navigate("ProfileEdit");
  }, []);

  return (
    <>
      <Pressable onPress={navigate} style={{ padding: 10 }}>
        <Text style={{ color: primaryColor, fontSize: 17 }}>
          Modifier
        </Text>
      </Pressable>

      {/*<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={[styles.container, { backgroundColor: "#00000090" }]}>
          <Pressable style={[styles.closeButton, { backgroundColor }]} onPress={() => setModalVisible(!modalVisible)}>
            <X color={color} />
          </Pressable>
          <ModalContent />
        </View>
      </Modal>*/}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  closeButton: {
    padding: 5,
    borderRadius: 100,
    width: 35,
    height: 35,
    marginBottom: -45,
    zIndex: 1,
    right: 12,
    alignSelf: "flex-end",
  },
  modalArea: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalContainer: {
    padding: 6,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  avatarContainer: {
    // flex: 1,
    height: 300,
  },
  inputContainer: {
    width: "auto",
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
    margin: 6,
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

export default UserEditButton;
