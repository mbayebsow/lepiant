import { Text, View, ScrollView } from "react-native";
import { LogIn } from "lucide-react-native";
import Input from "../components/ui/Input";
import Button from "../components/ui/button";
import useStyles from "../hook/useStyle";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import useSessionStore from "../hook/useSession";
import { StackNavigationProp } from "@react-navigation/stack";

export default function LoginScreen() {
  // const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [otpCode, setOtpCode] = useState<string>("");
  const navigation = useNavigation<StackNavigationProp<any>>();
  const isLogin = useSessionStore((state) => state.isLogin);
  const stepLogin = useSessionStore((state) => state.stepLogin);
  const handleLogin = useSessionStore((state) => state.handleLogin);
  const loading = useSessionStore((state) => state.loading);
  const { color, backgroundColor } = useStyles();

  useEffect(() => {
    if (isLogin) {
      navigation.goBack();
      navigation.navigate("Profile");
    }
  }, [isLogin]);

  return (
    <ScrollView
      style={{
        width: "100%",
        height: "100%",
        padding: 20,
        paddingHorizontal: 20,
        backgroundColor,
      }}
    >
      <View style={{ width: "100%", alignItems: "center" }}>
        <View style={{ width: "100%", marginVertical: 25 }}>
          <Text style={{ fontSize: 35, fontWeight: "800", color }}>
            Hello! connectez-vous pour continuer
          </Text>
        </View>

        <View style={{ width: "100%" }}>
          <Input
            value={email}
            keyboardType="email-address"
            placeholder="Votre adresse email"
            textContentType="emailAddress"
            autoCompleteType="email"
            // autoCorrect={true}
            onChangeText={(e) => setEmail(e)}
          />
        </View>

        {stepLogin === 2 && (
          <View style={{ width: "100%" }}>
            <Input
              value={otpCode}
              keyboardType="number-pad"
              placeholder="Code de verification envoyer par mail"
              textContentType="oneTimeCode"
              // autoComplete="sms-otp"
              onChangeText={(e) => setOtpCode(e)}
            />
          </View>
        )}

        <View style={{ width: "100%", marginTop: 20 }}>
          <Button
            text="Continuer"
            icon={<LogIn color="white" size={20} />}
            onPress={() => handleLogin(email, otpCode)}
            loading={loading}
          />
        </View>
      </View>
    </ScrollView>
  );
}
