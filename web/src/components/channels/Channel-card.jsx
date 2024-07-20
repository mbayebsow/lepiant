import ImageComponent from "../Image.component.jsx";
import SubscribeButton from "./SubscribeButton.jsx";

export default function ChannelCard({ channel }) {
  return (
    <div className="border border-[var(--ion-background-color)] bg-[var(--ion-background-color)] flex flex-col items-center justify-between gap-2 w-[120px]  p-2 pt-3 rounded-2xl">
      <div className="w-full flex flex-col items-center gap-2">
        <ImageComponent
          className="w-16 h-16 rounded-lg aspect-square object-cover"
          alt={channel.name}
          src={channel.logo}
          placeholderSrc={`${channel.logo}?width=10&height=10`}
        />
        <p className="m-0 leading-4 text-center w-full line-clamp-1">{channel.name}</p>
      </div>
      <SubscribeButton channel={channel} />
    </div>
  );
}
