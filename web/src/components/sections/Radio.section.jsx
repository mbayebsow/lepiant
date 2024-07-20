import RadioCard from "../radio/RadioCard.jsx";

export default function RadioSection({ radios }) {
  return (
    <div className="grid grid-cols-2 gap-3 ion-padding">
      {radios.map((radio, i) => (
        <RadioCard key={i} index={i} radio={radio} />
      ))}
    </div>
  );
}
