// src/components/estimate/steps/StepSurface.jsx
import FieldNum from "../../forms/FieldNum.jsx";
import { useLocale } from "../../../hooks/useLocale.js";

export default function StepSurface({ value, onChange }) {
  const { t } = useLocale();
  const update = (k, v) => onChange({ ...value, [k]: v });

  return (
    <div>
      <h3 className="font-serif text-2xl text-center">{t("estimate_steps.surface_title")}</h3>
      <p className="text-black/60 mt-1 text-center">
        {t("estimate_steps.surface_subtitle")}
      </p>

      <div className="mt-6 grid md:grid-cols-3 gap-5">
        <FieldNum
          label={t("estimate_steps.living_area")}
          value={value.surface}
          onChange={(v) => update("surface", v)}
        />
        <FieldNum
          label={t("estimate_steps.land_area")}
          value={value.terrain}
          onChange={(v) => update("terrain", v)}
        />
        <FieldNum
          label={t("estimate_steps.rooms")}
          value={value.pieces}
          onChange={(v) => update("pieces", v)}
        />
        <FieldNum
          label={t("estimate_steps.bedrooms")}
          value={value.chambres}
          onChange={(v) => update("chambres", v)}
        />
        <FieldNum
          label={t("estimate_steps.bathrooms")}
          value={value.sallesEau}
          onChange={(v) => update("sallesEau", v)}
        />
      </div>
    </div>
  );
}
