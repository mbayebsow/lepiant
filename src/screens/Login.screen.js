import { Text, View, Pressable, TextInput, ScrollView } from "react-native";
import { LogIn } from "lucide-react-native";
import Input from "../components/ui/Input";
import PrimaryBouton from "../components/ui/PrimaryBouton";
import useStyles from "../hook/useStyle";
import useSession from "../hook/useSession";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

function LoginStep() {
  const { backgroundColorLight } = useStyles();
  const { loading, userVerifyMail } = useSession();
  let email;

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
          value={email}
          keyboardType="email-address"
          placeholder="Votre adresse email"
          onChangeText={(e) => (email = e)}
        />
      </View>

      <View style={{ padding: 12, width: "100%" }}>
        <PrimaryBouton
          text="Se connecter"
          icon={<LogIn color="white" size={20} />}
          onPress={() => userVerifyMail(email)}
          loading={loading}
        />
      </View>
    </View>
  );
}

function OtpStep() {
  const { backgroundColorLight, inputStyle, color, primaryColor, secondaryColor } =
    useStyles();
  const { loading, userVerifyOTP, setStepLogin } = useSession();
  let code;

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
          <TextInput
            style={{
              ...inputStyle,
              color,
            }}
            keyboardType="number-pad"
            placeholder="Code de verification"
            onChangeText={(e) => (code = e)}
          />
        </View>

        <View style={{ padding: 12, width: "100%" }}>
          <PrimaryBouton
            text="Verifier"
            icon={<LogIn color="white" size={20} />}
            onPress={() => userVerifyOTP(code)}
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
