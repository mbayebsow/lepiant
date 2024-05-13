import { StyleSheet, Text, View } from "react-native";
import React from "react";
import useStyles from "../../hook/useStyle";

const AppVersion = () => {
  const { colorLight } = useStyles();
  return (
    <View style={{ padding: 6 }}>
      <Text style={{ textAlign: "center", color: colorLight }}>V: 1.0.0</Text>
    </View>
  );
};

export default AppVersion;

const styles = StyleSheet.create({});
