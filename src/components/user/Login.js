import { Text, View, Pressable, TextInput } from "react-native";
import useStyles from "../../hook/useStyle";
import { LogIn } from "lucide-react-native";
import useSession from "../../hook/useSession";
import Input from "../ui/Input";
import PrimaryBouton from "../ui/PrimaryBouton";

function LoginStep() {
  const { backgroundColor } = useStyles();
  const { loading, userVerifyMail } = useSession();
  let email;

  return (
    <View
      style={{
        width: "100%",
        padding: 12,
        marginTop: 100,
        backgroundColor,
        borderRadius: 12,
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
  const { backgroundColor, backgroundColorLight, inputStyle, color, primaryColor, secondaryColor } =
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
          backgroundColor,
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
              backgroundColor: backgroundColorLight,
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

export default function Login() {
  const { stepLogin } = useSession();
  return stepLogin === 1 ? <LoginStep /> : <OtpStep />;
}
