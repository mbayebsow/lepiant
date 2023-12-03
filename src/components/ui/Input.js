import { Text, TextInput } from "react-native";
import useStyles from "../../hook/useStyle";

export default function Input({
  label = "label",
  value,
  keyboardType,
  InputModeOptions,
  DataDetectorTypes,
  placeholder,
  onChangeText,
}) {
  const { inputStyle } = useStyles();
  return (
    <>
      <Text style={{ marginBottom: 5, paddingLeft: 5 }}>{label}</Text>
      <TextInput
        value={value}
        style={inputStyle}
        keyboardType={keyboardType}
        InputModeOptions={InputModeOptions}
        DataDetectorTypes={DataDetectorTypes}
        placeholder={placeholder}
        onChangeText={onChangeText}
      />
    </>
  );
}
