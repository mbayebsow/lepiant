import { getUserSession, userVerifyMail, userVerifyOTP } from "../services/session-service";
import { create } from "zustand";
import { User } from "../utils/interfaces";
import { Alert } from "react-native";
// import Toast from "react-native-simple-toast";

interface SessionStore {
  isLogin: boolean;
  userData: User | null;
  stepLogin: 1 | 2;
  loading: boolean;
  handleLogin: (email: string, code?: string) => void;
  initSession: () => Promise<void>;
}

const useSessionStore = create<SessionStore>()((set) => ({
  isLogin: false,
  userData: null,
  stepLogin: 1,
  loading: false,
  handleLogin: async (email: string, code?: string) => {
    set({ loading: true });

    if (email && !code) {
      try {
        const sendOtp = await userVerifyMail(email);
        if (sendOtp.success) {
          set({ stepLogin: 2, loading: false });
        }
        console.log(sendOtp);
      } catch (error) {
        console.log(error);
        Alert.alert("Erreur", "Une erreur est survenue, veuillez réessayer");
      }
    }

    if (email && code) {
      try {
        const verifyOtp = await userVerifyOTP(email, code);
        if (verifyOtp.success) {
          const user = await getUserSession();
          if (user.success) {
            set({
              isLogin: true,
              userData: user.user,
              loading: false,
            });
          }

          console.log(user);
        }
      } catch (error) {
        console.log(error);
        Alert.alert("Erreur", "Une erreur est survenue, veuillez réessayer");
      }
    }
  },
  initSession: async () => {
    const user = await getUserSession();
    if (user.success) {
      set({
        isLogin: true,
        userData: user.user,
      });
    }
  },
}));

export default useSessionStore;

// const Store = createStore({
//   initialState: {
//     isLogin: false,
//     userData: null,
//     stepLogin: 1,
//     loading: false,
//     openLogin: false,
//   },
//   actions: {
//     setLogin:
//       (isLogin) =>
//       ({ setState }) => {
//         setState({
//           isLogin,
//         });
//       },
//     setUserData:
//       (userData) =>
//       ({ setState }) => {
//         setState({
//           userData,
//         });
//       },
//   },
// });

// export default function useSession() {
//   const sessionStore = createHook(Store);

//   const [{ isLogin, userData }, { setLogin, setUserData }] = sessionStore();

//   const initSession = async () => {
//     const user = await getUserSession();
//     if (user.success) {
//       setUserData(user);
//       setLogin(true);
//     } else {
//       setUserData(null);
//       setLogin(false);
//     }
//   };

//   return {
//     isLogin,
//     userData,
//     initSession,
//   };
// }
