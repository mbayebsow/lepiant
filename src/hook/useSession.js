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

        const login = await fetch("https://lepiant-login.deno.dev/login", options)
          .then((response) => response.json())
          .catch((err) => console.error(err));

        if (login?.success) {
          setStepLogin(2);
          setLoading(false);
          alert("Un code de vérification a été envoyé. Vérifiez vos mails.");
        } else {
          setLoading(false);
          alert("Une erreur a eu lieu. Veuillez réessayer plus tard.");
        }
      } else {
        setLoading(false);
        alert("L'adresse e-mail n'est pas valide !");
      }
    } else {
      setLoading(false);
      alert("Veuillez entrer une adresse e-mail, s'il vous plaît.");
    }
  };

  const userVerifyOTP = async (inputCode) => {
    if (inputCode.length !== 6) {
      alert("Le code doit comporter 6 chiffres.");
      return;
    }

    setLoading(true);
    if (inputCode) {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inputCode }),
      };

      const user = await fetch("https://lepiant-login.deno.dev/verifyOTP", options).then(
        (response) => response.json()
      );

      if (!user) {
        alert("Une erreur s'est produite");
        setLoading(false);
        return;
      }

      if (user?.success) {
        await setDataOnStore("userSession", JSON.stringify(user.user));
        setLoading(false);
        getUserSession();
      } else {
        alert("Code non valide!");
        setLoading(false);
      }
    } else {
      alert("Entrez un code valide.");
      setLoading(false);
    }
  };

  const getUserSession = async () => {
    const dataOnStore = await getDataOnStore("userSession");

    if (!dataOnStore) return;
    const user = JSON.parse(dataOnStore);
    if (!user.id) return;

    setUserData(user);
    setLogin(true);
  };

  const updateUserSession = async (data) => {
    setLoading(true);

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    const user = await fetch(`https://lepiant-login.deno.dev/updateUser/${userData.id}`, options)
      .then((response) => response.json())
      .then((response) => response)
      .catch((err) => console.error(err));

    if (user?.success) {
      setUserData(user.user);
      await updateDataOnStore("userSession", JSON.stringify(user.user));
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
