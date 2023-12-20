import { Text, View, Pressable, TextInput, ScrollView } from "react-native";
import { LogIn } from "lucide-react-native";
import Input from "../components/ui/Input";
import PrimaryBouton from "../components/ui/PrimaryBouton";
import useStyles from "../hook/useStyle";
import useSession from "../hook/useSession";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

function LoginStep() {
  const { backgroundColorLight } = useStyles();
  const { loading, userVerifyMail } = useSession();
  const [loginMail, setLoginMail] = useState()

  return (
    <View
      style={{
        width: "100%",
        padding: 12,
        marginTop: 100,
        backgroundColor: backgroundColorLight,
        borderRadius: 12,
        borderColor: backgroundColorLight,
        borderWidth: 1
      }}
    >
      <View style={{ padding: 12, width: "100%", marginVertical: 10 }}>
        <Text style={{ textAlign: "center", fontSize: 25, fontWeight: 800 }}>CONNEXION</Text>
      </View>
      <View style={{ padding: 12, width: "100%" }}>
        <Input
          //value={loginMail}
          label="E-mail"
          keyboardType="email-address"
          placeholder="Votre adresse email"
          textContentType="emailAddress"
          autoCompleteType="email"
          autoCorrect={true}
          onChangeText={(e) => setLoginMail(e)}
        />
      </View>

      <View style={{ padding: 12, width: "100%" }}>
        <PrimaryBouton
          text="Se connecter"
          icon={<LogIn color="white" size={20} />}
          onPress={() => userVerifyMail(loginMail)}
          loading={loading}
        />
      </View>
    </View>
  );
}

function OtpStep() {
  const navigation = useNavigation()
  const { backgroundColorLight, primaryColor } = useStyles();
  const { loading, userVerifyOTP, setStepLogin } = useSession();
  const [otpCode, setOtpCode] = useState()


  return (
    <>
      <View
        style={{
          width: "100%",
          padding: 12,
          marginTop: 100,
          backgroundColor: backgroundColorLight,
          borderRadius: 12,
        }}
      >
        <View style={{ padding: 12, width: "100%", marginVertical: 10 }}>
          <Text style={{ textAlign: "center", fontSize: 25, fontWeight: 800 }}>
            CODE VERIFICATION
          </Text>
        </View>
        <View style={{ padding: 12, width: "100%" }}>

          <Input
            //value={loginMail}
            label="Code"
            keyboardType="number-pad"
            placeholder="Code de verification"
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            onChangeText={(e) => setOtpCode(e)}
          />
        </View>

        <View style={{ padding: 12, width: "100%" }}>
          <PrimaryBouton
            text="Verifier"
            icon={<LogIn color="white" size={20} />}
            onPress={async () => {
              await userVerifyOTP(otpCode)
              navigation.goBack()
            }}
            loading={loading}
          />
        </View>
      </View>
      <Pressable onPress={() => setStepLogin(1)} style={{ padding: 20 }}>
        <Text style={{ color: primaryColor, textAlign: "center" }}>Modifier l'adresse mail</Text>
      </Pressable>
    </>
  );
}

export default function LoginScreen() {
  const navigation = useNavigation()
  const { isLogin, stepLogin } = useSession();

  useEffect(() => {
    if (isLogin) navigation.navigate("Profile")

  }, [isLogin])

  return (
    <ScrollView
      style={{
        height: "100%",
        padding: 25,
      }}
    >
      {stepLogin === 1 ? <LoginStep /> : <OtpStep />}
    </ScrollView>
  );
}
