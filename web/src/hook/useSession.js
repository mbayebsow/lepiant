import { createStore, createHook } from "react-sweet-state";
import { getDataOnStore, setDataOnStore } from "../lib";

const validateEmail = (email) => {
  return email.match(
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  );
};

const Store = createStore({
  initialState: { isLogin: false, userData: null, stepLogin: 1, loading: false, openLogin: false },
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

  const userVerifyMail = async (user) => {
    setLoading(true);
    if (user) {
      if (validateEmail(user)) {
        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ login: user }),
        };

        const login = await fetch("https://lepiant-login.deno.dev/login", options)
          .then((response) => response.json())
          .then((response) => response)
          .catch((err) => console.error(err));

        if (login?.success) {
          setStepLogin(2);
          setLoading(false);
        } else {
          setLoading(false);
          alert("Une erreur s'est produite. Réessayez plus tard.");
        }
      } else {
        alert("L'adresse email n'est pas valide!");
      }
    } else {
      alert("Entrer un adresse email svp");
    }
  };

  const userVerifyOTP = async (inputCode) => {
    setLoading(true);
    if (inputCode) {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inputCode }),
      };

      const user = await fetch("https://lepiant-login.deno.dev/verifyOTP", options)
        .then((response) => response.json())
        .catch((err) => console.error(err));

      if (user?.success) {
        setDataOnStore("user_session", JSON.stringify(user.user));
        setLoading(false);
        getUserSession();
      } else {
        alert("Code no valide!");
        setLoading(false);
      }
    } else {
    }
  };

  const getUserSession = async () => {
    const dataOnStore = await getDataOnStore("user_session");

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
      await setDataOnStore("user_session", JSON.stringify(user.user));
      setUserData(user.user);
    }
    setLoading(false);
  };

  return {
    isLogin,
    userData,
    stepLogin,
    loading,
    openLogin,
    setOpenLogin,
    userVerifyMail,
    userVerifyOTP,
    getUserSession,
    updateUserSession,
  };
}
