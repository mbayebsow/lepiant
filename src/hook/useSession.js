import { createStore, createHook } from "react-sweet-state";
import { setDataOnStore, getDataOnStore, updateDataOnStore } from "../lib";
import Toast from "react-native-simple-toast";

const validateEmail = (email) => {
  return email.match(
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  );
};

const Store = createStore({
  initialState: {
    isLogin: false,
    userData: null,
    stepLogin: 1,
    loading: false,
    openLogin: false,
  },
  actions: {
    setLogin:
      (isLogin) =>
        ({ setState }) => {
          setState({
            isLogin,
          });
        },
    setUserData:
      (userData) =>
        ({ setState }) => {
          setState({
            userData,
          });
        },
    setStepLogin:
      (step) =>
        ({ setState }) => {
          setState({
            stepLogin: step,
          });
        },
    setLoading:
      (loading) =>
        ({ setState }) => {
          setState({
            loading,
          });
        },
    setOpenLogin:
      (openLogin) =>
        ({ setState }) => {
          setState({
            openLogin,
          });
        },
  },
});

export default function useSession() {
  const loginStore = createHook(Store);

  const [
    { isLogin, userData, stepLogin, loading, openLogin },
    { setLoading, setLogin, setUserData, setStepLogin, setOpenLogin },
  ] = loginStore();

  const userVerifyMail = async (email) => {
    setLoading(true);
    if (email) {
      if (validateEmail(email)) {
        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ login: email }),
        };

        const login = await fetch("https://lepiant-api.cyclic.app/session/login", options)
          .then((response) => response.json())
          .catch((err) => console.error(err));

        if (login?.success) {
          setStepLogin(2);
          setLoading(false);
          Toast.show("Un code de vérification a été envoyé. Vérifiez vos mails.");
        } else {
          setLoading(false);
          Toast.show("Une erreur a eu lieu. Veuillez réessayer plus tard.");
        }
      } else {
        setLoading(false);
        Toast.show("L'adresse e-mail n'est pas valide !");
      }
    } else {
      setLoading(false);
      Toast.show("Veuillez entrer une adresse e-mail, s'il vous plaît.");
    }
  };

  const userVerifyOTP = async (inputCode) => {

    if (inputCode?.length !== 6) {
      Toast.show("Le code doit comporter 6 chiffres.");
      return;
    }

    setLoading(true);
    if (inputCode) {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inputCode }),
      };

      const user = await fetch("https://lepiant-api.cyclic.app/session/verify", options).then(
        (response) => response.json()
      );

      if (!user) {
        Toast.show("Une erreur s'est produite");
        setLoading(false);
        return;
      }

      if (user?.success) {
        await setDataOnStore("userToken", JSON.stringify(user.token));
        setLoading(false);
        getUserSession();
      } else {
        Toast.show("Code non valide!");
        setLoading(false);
      }
    } else {
      Toast.show("Entrez un code valide.");
      setLoading(false);
    }
  };

  const getUserSession = async () => {
    const Token = await getDataOnStore("userToken");

    if (!Token) return;

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${JSON.parse(Token)}`
      }
    };

    const user = await fetch('https://lepiant-api.cyclic.app/content/user/me', options)
      .then(response => response.json())
      .catch(err => {
        console.log(err);
        return null
      });

    if (!user?.success) return;

    setUserData(user.user);
    setLogin(true);
  };

  const updateUserSession = async (data) => {
    console.log(data);
    setLoading(true);

    const Token = await getDataOnStore("userToken");


    if (!Token) return;


    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${JSON.parse(Token)}` },
      body: JSON.stringify(data),
    };

    const user = await fetch("https://lepiant-api.cyclic.app/content/user/update", options)
      .then((response) => response.json())
      .catch((err) => null);


    console.log(user);

    if (user?.success) {
      await setDataOnStore("userToken", JSON.stringify(user.token));
      await getUserSession()
    }
    Toast.show("Données mises à jour avec succès.");
    setLoading(false);
  };

  return {
    isLogin,
    userData,
    stepLogin,
    loading,
    openLogin,
    setOpenLogin,
    setStepLogin,
    userVerifyMail,
    userVerifyOTP,
    getUserSession,
    updateUserSession,
  };
}
