// src/components/estimate/steps/StepLocalisation.jsx
import { useLocale } from "../../../hooks/useLocale.js";

export default function StepLocalisation({ value, onChange }) {
  const { t } = useLocale();
  const update = (k, v) => onChange({ ...value, [k]: v });
  const villes = [
    "Genève",
    "Cologny",
    "Chêne-Bourg",
    "Neuchâtel",
    "Lausanne",
    "Montreux",
  ];
  const cantons = ["GE", "VD", "VS", "NE", "FR", "TI"];

  return (
    <div>
      <h3 className="font-serif text-2xl text-center">{t("estimate_steps.location_title")}</h3>
      <p className="text-black/60 mt-1 text-center">
        {t("estimate_steps.location_subtitle")}
      </p>

      <div className="mt-6 grid md:grid-cols-3 gap-5">
        <div>
          <label className="text-sm text-black/70">{t("estimate_steps.location_city")}</label>
          <input
            list="villes"
            placeholder={t("estimate_steps.location_city_placeholder")}
            className="w-full rounded-xl border border-black/15 bg-white/90 pl-3 pr-3 py-2 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
            value={value.ville}
            onChange={(e) => update("ville", e.target.value)}
          />
          <datalist id="villes">
            {villes.map((v) => (
              <option key={v} value={v} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="text-sm text-black/70">{t("estimate_steps.location_canton")}</label>
          <input
            list="cantons"
            placeholder={t("estimate_steps.location_canton_placeholder")}
            className="w-full rounded-xl border border-black/15 bg-white/90 pl-3 pr-3 py-2 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
            value={value.canton}
            onChange={(e) => update("canton", e.target.value.toUpperCase())}
          />
          <datalist id="cantons">
            {cantons.map((v) => (
              <option key={v} value={v} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="text-sm text-black/70">{t("estimate_steps.location_year")}</label>
          <input
            type="number"
            placeholder={t("estimate_steps.location_year_placeholder")}
            className="w-full rounded-xl border border-black/15 bg-white/90 pl-3 pr-3 py-2 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
            value={value.annee}
            onChange={(e) => update("annee", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
