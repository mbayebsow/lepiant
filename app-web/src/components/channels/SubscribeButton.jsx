import { IonButton } from "@ionic/react";

import useChannel from "../../hook/useChannel.js";
import useSession from "../../hook/useSession.js";

export default function SubscribeButton({ channel }) {
  const { toggleSubscribe, subscribedChannel } = useChannel();
  const { isLogin, setOpenLogin } = useSession();
  return (
    <IonButton
      style={{
        "--background": subscribedChannel.find((element) => element.channel == channel.id)
          ? "#f8ccd221"
          : "#eb445a21",
        "--background-hover": subscribedChannel.find((element) => element.channel == channel.id)
          ? "#f8ccd221"
          : "#eb445a21",
        "--color": subscribedChannel.find((element) => element.channel == channel.id)
          ? "#d4c9ca"
          : "#eb445a",
        margin: 0,
      }}
      onClick={() => {
        if (!isLogin) setOpenLogin(true);
        if (isLogin) toggleSubscribe(channel.id);
      }}
      shape="round"
      size="small"
      className="w-full"
    >
      {subscribedChannel.find((element) => element.channel == channel.id)
        ? "Désabonner"
        : "S'abonner"}
    </IonButton>
  );
}
