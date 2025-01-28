import useChannel from "../../hook/useChannel.js";
import HeaderSection from "../HeaderSection.jsx";
import ChannelCard from "./Channel-card.jsx";

export default function Channel() {
  const { channels, subscribedChannel } = useChannel();

  function sortChannel(channels) {
    const chainesAbonnees = channels.filter((chaine) =>
      subscribedChannel.map((c) => c.channel).includes(chaine.id)
    );
    const chainesNonAbonnees = channels.filter(
      (chaine) => !subscribedChannel.map((c) => c.channel).includes(chaine.id)
    );
    const sortedChannels = chainesAbonnees.concat(chainesNonAbonnees);

    return sortedChannels;
  }

  return (
    <>
      <HeaderSection title="Chaînes" textButton="Voir plus" size="md" disableButton={false} />
      <div className="flex overflow-x-scroll no-scrollbar p-[16px]">
        <div className="flex flex-nowrap gap-2">
          {channels
            ? sortChannel(channels).map((channel, i) => <ChannelCard key={i} channel={channel} />)
            : null}
        </div>
      </div>
    </>
  );
}
