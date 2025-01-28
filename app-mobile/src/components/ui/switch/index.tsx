import { View, Text, Switch } from "react-native";
import useStyles from "../../../hook/useStyle";
import { FC } from "react";

interface SwitchProps {
  title: string;
  value: boolean;
  placeholder: string;
  onValueChange: (value: boolean) => void;
}

const SwitchField: FC<SwitchProps> = ({ title, value, placeholder, onValueChange }) => {
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
        <Text style={{ color: colorLight, fontSize: 11 }}>{placeholder}</Text>
      </View>
      <Switch
        trackColor={{ false: colorLight, true: primaryColor }}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
};
export default SwitchField;
