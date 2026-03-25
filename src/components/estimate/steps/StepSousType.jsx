// src/components/estimate/steps/StepSousType.jsx
import BubbleOption from "../BubbleOption.jsx";
import { useLocale } from "../../../hooks/useLocale.js";
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
  const { t } = useLocale();

  const options =
    type === "maison"
      ? [
          { key: "Individuelle", label: t("estimate_steps.house_detached"), Icon: IconDetached },
          { key: "Jumelée", label: t("estimate_steps.house_semi"), Icon: IconSemi },
          { key: "Contiguë", label: t("estimate_steps.house_row"), Icon: IconRow },
          { key: "Contiguë en pignon", label: t("estimate_steps.house_corner"), Icon: IconCorner },
          { key: "Autre", label: t("estimate_steps.other"), Icon: IconHouseOther },
        ]
      : [
          { key: "Attique", label: t("estimate_steps.apt_penthouse"), Icon: IconPenthouse },
          { key: "Comble", label: t("estimate_steps.apt_attic"), Icon: IconAttic },
          { key: "Duplex", label: t("estimate_steps.apt_duplex"), Icon: IconDuplex },
          { key: "Rez de Jardin", label: t("estimate_steps.apt_garden"), Icon: IconGardenLevel },
          { key: "Traversant", label: t("estimate_steps.apt_crossvent"), Icon: IconCrossVent },
          { key: "Autre", label: t("estimate_steps.other"), Icon: IconAptOther },
        ];

  return (
    <div className="text-center">
      <h3 className="font-serif text-2xl">
        {type === "maison" ? t("estimate_steps.house_type_title") : t("estimate_steps.apt_type_title")}
      </h3>
      <p className="text-black/60 mt-1">{t("estimate_steps.select_subtype")}</p>

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
