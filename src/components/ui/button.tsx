import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
} from "react-native";
import useStyles from "../../hook/useStyle";
import { FC } from "react";

interface ButtonProps {
  loading?: boolean;
  onPress?: () => void;
  icon?: any;
  text?: string;
  children?: string;
  variant?: "primary" | "secondary";
}

const Button: FC<ButtonProps> = ({
  loading,
  onPress,
  icon,
  text,
  children,
  variant = "primary",
}) => {
  const { primaryColor, secondaryColor } = useStyles();

  return (
    <Pressable onPress={onPress} style={{ margin: 6 }}>
      <View
        style={{
          paddingHorizontal: 20,
          height: 50,
          borderRadius: 10,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: primaryColor,
        }}>
        {loading ? (
          <ActivityIndicator color="white" size={20} />
        ) : (
          icon && icon
        )}
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: icon ? -20 : 0,
          }}>
          <Text style={{ color: "white", fontSize: 16 }}>
            {children || text}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default Button;
