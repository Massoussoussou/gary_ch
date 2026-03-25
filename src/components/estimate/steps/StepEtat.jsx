// src/components/estimate/steps/StepEtat.jsx
import BubbleOption from "../BubbleOption.jsx";
import { useLocale } from "../../../hooks/useLocale.js";
import {
  IconSparkle,
  IconRoller,
  IconWrench,
  IconHardHat,
} from "../../icons/estimate.jsx";

export default function StepEtat({ value, onChange }) {
  const { t } = useLocale();

  const options = [
    { key: "neuf", label: t("estimate_steps.condition_new"), Icon: IconSparkle },
    { key: "rafraichir", label: t("estimate_steps.condition_refresh"), Icon: IconRoller },
    { key: "renover", label: t("estimate_steps.condition_renovate"), Icon: IconWrench },
    { key: "lourd", label: t("estimate_steps.condition_heavy"), Icon: IconHardHat },
  ];

  return (
    <div className="text-center">
      <h3 className="font-serif text-2xl">{t("estimate_steps.condition_title")}</h3>
      <p className="text-black/60 mt-1">{t("estimate_steps.condition_subtitle")}</p>

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
