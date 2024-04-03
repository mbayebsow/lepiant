import { View, Text, ActivityIndicator, Pressable } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import useStyles from "../../hook/useStyle";
import { FC, ReactNode } from "react";

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
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={[secondaryColor, primaryColor]}
        start={{ x: 0, y: 7 }}
        end={{ x: 1, y: 0 }}
        locations={[0.1, 0.9]}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 15,
          borderRadius: 10,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {loading ? <ActivityIndicator color="white" size={20} /> : icon && icon}
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: -20,
          }}
        >
          <Text style={{ color: "white" }}>{children || text}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

export default Button;
