// src/components/estimate/steps/StepSousType.jsx
import BubbleOption from "../BubbleOption.jsx";
import {
  IconDetached,
  IconSemi,
  IconRow,
  IconCorner,
  IconHouseOther,
  IconPenthouse,
  IconAttic,
  IconDuplex,
  IconGardenLevel,
  IconCrossVent,
  IconAptOther,
} from "../../icons/estimate.jsx";

export default function StepSousType({ type, value, onChange }) {
  const options =
    type === "maison"
      ? [
          { key: "Individuelle", Icon: IconDetached },
          { key: "Jumelée", Icon: IconSemi },
          { key: "Contiguë", Icon: IconRow },
          { key: "Contiguë en pignon", Icon: IconCorner },
          { key: "Autre", Icon: IconHouseOther },
        ]
      : [
          { key: "Attique", Icon: IconPenthouse },
          { key: "Comble", Icon: IconAttic },
          { key: "Duplex", Icon: IconDuplex },
          { key: "Rez de Jardin", Icon: IconGardenLevel },
          { key: "Traversant", Icon: IconCrossVent },
          { key: "Autre", Icon: IconAptOther },
        ];

  return (
    <div className="text-center">
      <h3 className="font-serif text-2xl">
        {type === "maison" ? "Type de maison" : "Type d'appartement"}
      </h3>
      <p className="text-black/60 mt-1">Sélectionnez un sous-type.</p>

      <div className="mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 place-items-center">
          {options.map(({ key, Icon }) => (
            <div key={key} className="justify-self-center">
              <BubbleOption
                icon={Icon}
                label={key}
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
