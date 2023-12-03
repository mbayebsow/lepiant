import { ScrollView } from "react-native";
import useStyles from "../hook/useStyle";
import Login from "../components/user/Login";
import ProfileDetails from "../components/user/profile/ProfileDetails";
import useSession from "../hook/useSession";

export default function ProfileScreen() {
  const { backgroundColorLight } = useStyles();
  const { isLogin } = useSession();
  return (
    <ScrollView
      style={{
        backgroundColor: backgroundColorLight,
        height: "100%",
        padding: 12,
      }}
    >
      {isLogin ? <ProfileDetails /> : <Login />}
    </ScrollView>
  );
}
