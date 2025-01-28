import { IonRefresher, IonRefresherContent } from "@ionic/react";

import PageLayout from "../components/layout/PageLayout.jsx";
import Channel from "../components/channels/Channel.jsx";
import RadiosLiked from "../components/radio/radiosLiked.jsx";
import useChannel from "../hook/useChannel.js";

export default function LibraryScreen() {
  const { setChannels, fetchSubscribedChannels } = useChannel();

  async function handleRefresh(event) {
    await fetchSubscribedChannels(true).finally(() =>
      setChannels().finally(() => event.detail.complete())
    );
  }

  return (
    <PageLayout colorContent="light" title="Bibliothèque" collapse>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>

      <Channel />
      <div className="bg-[var(--ion-background-color)]">
        <RadiosLiked />
      </div>
    </PageLayout>
  );
}
