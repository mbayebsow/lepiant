import { Pressable, Text, TextInput } from "react-native";
import useStyles from "../../hook/useStyle";
import { FC } from "react";
import { View } from "react-native";
import { Delete } from "lucide-react-native";
import { trigger } from "react-native-haptic-feedback";

interface InputProps {
  label?: string;
  value?: string;
  keyboardType?: string;
  InputModeOptions?: string;
  dataDetectorTypes?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  textContentType?: string;
  autoCompleteType?: string;
}

const Input: FC<InputProps> = ({
  label,
  value,
  keyboardType,
  dataDetectorTypes,
  placeholder,
  onChangeText,
  textContentType,
  autoCompleteType,
}) => {
  const { color, inputBackground, backgroundColorLight } = useStyles();

  return (
    <>
      {label && <Text style={{ marginBottom: 5, paddingLeft: 5 }}>{label}</Text>}
      <View
        style={{
          flex: 1,
          width: "100%",
          paddingHorizontal: 12,
          borderRadius: 10,
          backgroundColor: backgroundColorLight,
          marginBottom: 15,
          height: 40,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <TextInput
          value={value}
          style={{
            width: "90%",
            height: "100%",
            color,
            // backgroundColor: "red",
          }}
          keyboardType={keyboardType as any}
          dataDetectorTypes={dataDetectorTypes as any}
          placeholder={placeholder}
          onChangeText={onChangeText}
          textContentType={textContentType as any}
        />
        <Pressable
          onPress={() => {
            trigger("impactLight");
            onChangeText && onChangeText("");
          }}
          style={{
            // backgroundColor: "red",
            height: "100%",
            width: "10%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Delete size={20} color={color} />
        </Pressable>
      </View>
    </>
  );
};

export default Input;
