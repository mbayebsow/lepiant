import { IonButton } from "@ionic/react";
import { useRouteError } from "react-router-dom";

export default function ErrorScreen() {
  const error = useRouteError();
  //console.error(error);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center w-1/2">
        <h1 className="mb-5 text-3xl">Oops!</h1>
        <p className="text-sm">Désolé, une erreur inattendue s'est produite.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
        <IonButton className="mt-10">Actualiser</IonButton>
      </div>
    </div>
  );
}
