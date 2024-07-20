import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useSession from "../../hook/useSession";
import { StackNavigationProp } from "@react-navigation/stack";
import Image from "../ui/image";
import config from "../../utils/constant/config";
import { View } from "react-native";
import { FC } from "react";

interface ProfileIconProps {
  size?: number;
}

const ProfileIcon: FC<ProfileIconProps> = ({ size = 30 }) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { isLogin, userData } = useSession();

  return (
    <Pressable
      onPress={() => navigation.navigate(isLogin ? "Profile" : "Login")}
      style={{
        backgroundColor: "#ffc48c",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
        marginRight: 12,
      }}
    >
      <View style={{ width: size, height: size }}>
        <Image src={isLogin ? userData?.avatar : config.DEFAULT_USER_AVATAR} />
      </View>
    </Pressable>
  );
};

export default ProfileIcon;
