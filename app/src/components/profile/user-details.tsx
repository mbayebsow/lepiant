import { StyleSheet, Text } from "react-native";
import React, { FC } from "react";
import useSessionStore from "../../hook/useSession";
import useStyles from "../../hook/useStyle";

export const UserName: FC = () => {
  const userData = useSessionStore((state) => state.userData);
  const { color } = useStyles();
  return (
    <Text style={[styles.nameText, { color }]}>
      {userData?.firstName} {userData?.lastName}
    </Text>
  );
};

export const UserMail: FC = () => {
  const userData = useSessionStore((state) => state.userData);
  const { colorLight } = useStyles();
  return <Text style={[styles.mailText, { color: colorLight }]}>{userData?.email}</Text>;
};

const styles = StyleSheet.create({
  nameText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  mailText: {
    textAlign: "center",
  },
});
