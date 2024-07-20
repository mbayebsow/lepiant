import { IonButton, IonInput, IonItem, IonList } from "@ionic/react";
import { useState } from "react";
import useSession from "../../hook/useSession";

function LoginStep({ onClick, onIonInput }) {
  return (
    <div className="flex flex-col items-center w-full h-full ion-padding">
      <h1 className="text-3xl my-10">Connexion</h1>
      <IonList inset={true} className="w-full py-2">
        <IonItem>
          <IonInput
            type="email"
            onIonInput={(e) => onIonInput(e.target.value)}
            label="Adresse mail"
            fill="outline"
            clearInput={true}
            labelPlacement="floating"
            placeholder="Entrer votre adresse mail pour vous connectez"
          ></IonInput>
        </IonItem>
      </IonList>
      <IonButton onClick={onClick} className="w-full" expand="block">
        se connecter
      </IonButton>
    </div>
  );
}

function ValidationStep({ onClick, onIonInput }) {
  return (
    <div className="flex flex-col items-center w-full h-full ion-padding">
      <h1 className="text-3xl my-10">Validation</h1>
      <IonList inset={true} className="w-full py-2">
        <IonItem>
          <IonInput
            type="number"
            onIonInput={(e) => onIonInput(e.target.value)}
            label="Code de validation"
            fill="outline"
            clearInput={true}
            labelPlacement="floating"
            placeholder="Entrer le code de validation envoyer par mail"
          ></IonInput>
        </IonItem>
      </IonList>
      <IonButton onClick={onClick} className="w-full" expand="block">
        Valider
      </IonButton>
    </div>
  );
}

export default function LoginContent() {
  const { userVerifyMail, userVerifyOTP, stepLogin } = useSession();

  const [email, setEmail] = useState();
  const [otp, setOtp] = useState();

  return (
    <>
      {stepLogin === 1 && <LoginStep onClick={() => userVerifyMail(email)} onIonInput={setEmail} />}
      {stepLogin === 2 && <ValidationStep onClick={() => userVerifyOTP(otp)} onIonInput={setOtp} />}
    </>
  );
}
