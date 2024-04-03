import config from "../utils/constant/config";
import { fetcher } from "../utils/helpers/fetcher";
import { setDataOnStore, getDataOnStore, updateDataOnStore } from "../utils/helpers/localStorage";
import { SuccessLogin, SuccessVerify, User } from "../utils/interfaces";

const validateEmail = (email: string) => {
  return email.match(
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  );
};

export async function userVerifyMail(email: string) {
  if (email) {
    if (validateEmail(email)) {
      const body = { email: email };

      const login = await fetcher<SuccessLogin>(`${config.API_ENDPOINT}/auth/login`, "POST", body);

      if (login && login.success) {
        return {
          success: true,
          message: "Un code de vérification a été envoyé. Vérifiez vos mails",
        };
      } else {
        return {
          success: false,
          message: "Une erreur a eu lieu. Veuillez réessayer plus tard.",
        };
      }
    } else {
      return {
        success: false,
        message: "L'adresse e-mail n'est pas valide !",
      };
    }
  } else {
    return {
      success: false,
      message: "Veuillez entrer une adresse e-mail, s'il vous plaît.",
    };
  }
}

export async function userVerifyOTP(email: string, inputCode: string) {
  if (inputCode?.length !== 6) {
    return {
      success: true,
      message: "Le code doit comporter 6 chiffres.",
    };
  }

  if (inputCode) {
    const body = {
      email,
      code: inputCode,
    };

    const user = await fetcher<SuccessVerify>(`${config.API_ENDPOINT}/auth/verify`, "POST", body);

    if (!user || !user.success) {
      return {
        success: false,
        message: "Une erreur s'est produite",
      };
    }

    await setDataOnStore("userToken", JSON.stringify(`Bearer ${user.session}`));
    return {
      success: true,
      message: "Votre compte a été activé avec succès",
    };
  } else {
    return {
      success: false,
      message: "Veuillez entrer un code.",
    };
  }
}

export async function getUserSession(): Promise<{
  success: boolean;
  user?: User;
  message?: string;
}> {
  const Token = await getDataOnStore("userToken");

  if (!Token) return { success: false, message: "Pas de session" };

  const user = await fetcher<User>(`${config.API_ENDPOINT}/auth/me`);

  if (!user)
    return { success: false, message: "Impossible de récupérer les informations de l'utilisateur" };

  await setDataOnStore("userSession", JSON.stringify(user));
  return { success: true, user: user };
}

export async function updateUserSession(data: Partial<User>) {
  const user = await fetcher(`${config.API_ENDPOINT}/auth/updateMe`, "POST", data);

  if (user) await getUserSession();
}
