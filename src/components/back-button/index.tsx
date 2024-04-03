import { View } from "react-native";
import React from "react";
import { ChevronLeft } from "lucide-react-native";
import useStyles from "../../hook/useStyle";

const BackButton = () => {
  const { color } = useStyles();
  return (
    <View style={{ padding: 5 }}>
      <ChevronLeft color={color} size={30} />
    </View>
  );
};

export default BackButton;
