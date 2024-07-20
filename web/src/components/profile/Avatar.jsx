import avatar from "../../lib/avatar.json";
import useSession from "../../hook/useSession";

export default function Avatar({ width = 30, height = 30, color, src }) {
  const { userData, isLogin } = useSession();

  return (
    <div className="rounded-full bg-orange-200">
      <img
        width={width}
        height={height}
        src={src ? src : isLogin ? avatar[Number(userData.profile)].uri : avatar[0].uri}
        alt=""
      />
    </div>
  );
}
