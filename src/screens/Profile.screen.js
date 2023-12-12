import { ScrollView } from "react-native";
import useStyles from "../hook/useStyle";
import ProfileDetails from "../components/user/profile/ProfileDetails";

export default function ProfileScreen() {
  const { backgroundColorLight } = useStyles();

  return (
    <ScrollView
      style={{
        backgroundColor: backgroundColorLight,
        height: "100%",
        padding: 12,
      }}
    >
      <ProfileDetails />
    </ScrollView>
  );
}
