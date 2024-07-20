import useQuotidien from "../../hook/useQuotidien.js";
import ImageComponent from "../Image.component.jsx";

export default function QCard({ file, index }) {
  const { setQIndex, setOpenQModal } = useQuotidien();

  return (
    <div
      onClick={() => {
        setQIndex(index);
        setOpenQModal(true);
      }}
      className="m-0 inline-block w-24 h-32 border-2 bg-[var(--ion-color-light)] border-[var(--ion-color-light)] overflow-hidden  rounded-lg"
    >
      <ImageComponent
        className="w-full h-full"
        src={`https://cdn.teldoo.site/api/assets/lepiant/${file}`}
      />
    </div>
  );
}
