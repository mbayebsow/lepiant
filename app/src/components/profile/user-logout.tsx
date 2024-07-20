import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import useStyles from "../../hook/useStyle";

const UserLogout = () => {
  const { primaryColor } = useStyles();
  return (
    <View style={styles.container}>
      <Pressable>
        <Text style={[styles.text, { color: primaryColor }]}>Se déconnecter</Text>
      </Pressable>
    </View>
  );
};

export default UserLogout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 6,
  },
  text: {
    textAlign: "center",
    fontSize: 17,
  },
});
