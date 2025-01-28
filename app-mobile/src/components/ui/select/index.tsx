import { Text, View } from "react-native";
import useStyles from "../../../hook/useStyle";
import { FC } from "react";
import RNPickerSelect from "react-native-picker-select";

interface SelectProps {
  title: string;
  value: string | number | undefined;
  placeholder: string;
  items: any;
  onValueChange: (value: string) => void;
}

const SelectField: FC<SelectProps> = ({ title, value, placeholder, items, onValueChange }) => {
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
};
export default SelectField;
