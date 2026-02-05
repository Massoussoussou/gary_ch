// src/components/estimate/steps/StepEtat.jsx
import BubbleOption from "../BubbleOption.jsx";
import {
  IconSparkle,
  IconRoller,
  IconWrench,
  IconHardHat,
} from "../../icons/estimate.jsx";

export default function StepEtat({ value, onChange }) {
  const options = [
    { key: "neuf", label: "Neuf / Rénové", Icon: IconSparkle },
    { key: "rafraichir", label: "À rafraîchir", Icon: IconRoller },
    { key: "renover", label: "À rénover", Icon: IconWrench },
    { key: "lourd", label: "Rénovation lourde", Icon: IconHardHat },
  ];

  return (
    <div className="text-center">
      <h3 className="font-serif text-2xl">État du bien</h3>
      <p className="text-black/60 mt-1">Choisissez l'état général.</p>

      <div className="mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 place-items-center">
          {options.map(({ key, label, Icon }) => (
            <div key={key} className="justify-self-center">
              <BubbleOption
                icon={Icon}
                label={label}
                active={value === key}
                onClick={() => onChange(key)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
