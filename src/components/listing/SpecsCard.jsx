import React from "react";
import { useLocale } from "../../hooks/useLocale.js";

function fmtInt(n) {
  if (typeof n !== "number") return null;
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}
function fmtDate(d, locale) {
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return null;
    return dt.toLocaleDateString(locale === "en" ? "en-CH" : "fr-CH", { year: "numeric", month: "long" });
  } catch { return null; }
}

export default function SpecsCard({ item = {} }) {
  const { t, lang } = useLocale();
  const ville = [item.ville, item.canton].filter(Boolean).join(", ");

  // PILLs dynamiques (rendent uniquement si valeur présente)
  const main = [
    item.type        && { k: "type",      label: t("listing.spec_type"),            v: item.type },
    Number.isFinite(item.pieces)   && { k: "pieces",    label: t("listing.spec_rooms"),          v: item.pieces },
    Number.isFinite(item.chambres) && { k: "chambres",  label: t("listing.spec_bedrooms"),        v: item.chambres },
    Number.isFinite(item.sdb)      && { k: "sdb",       label: t("listing.spec_bathrooms"),    v: item.sdb },
    Number.isFinite(item.surface_m2)         && { k: "surf",      label: t("listing.spec_living_area"), v: `${fmtInt(item.surface_m2)} m²` },
    Number.isFinite(item.surface_utile_m2)   && { k: "utile",     label: t("listing.spec_useful_surface"), v: `${fmtInt(item.surface_utile_m2)} m²` },
    Number.isFinite(item.parcelle_m2)        && { k: "parcelle",  label: t("listing.spec_land"),      v: `${fmtInt(item.parcelle_m2)} m²` },
  ].filter(Boolean);

  const extra = [
    ville        && { k: "ville",     label: t("listing.spec_location"), v: ville },
    item.pays    && { k: "pays",      label: t("listing.spec_country"),         v: item.pays },
    item.meuble !== undefined && { k: "meuble", label: t("listing.spec_furnished"), v: item.meuble ? t("listing.spec_yes") : t("listing.spec_no") },
    fmtDate(item.dispo, lang) && { k: "dispo", label: t("listing.spec_availability"), v: fmtDate(item.dispo, lang) },
    item.orientation && { k: "orient", label: t("listing.spec_orientation"), v: item.orientation },
    item.vue         && { k: "vue",    label: t("listing.spec_view"),         v: item.vue },
    item.etage !== undefined && { k: "etage", label: t("listing.spec_floor"), v: String(item.etage) },
    Number.isFinite(item.parkings) && { k: "pk", label: t("listing.spec_parking"), v: item.parkings },
    Number.isFinite(item.box)      && { k: "box", label: t("listing.spec_box"), v: item.box },
    item.classeEnergetique && { k: "dpe", label: t("listing.spec_energy"), v: item.classeEnergetique },
    item.chauffage && { k: "heat", label: t("listing.spec_heating"), v: item.chauffage },
    item.id && { k: "ref", label: t("listing.spec_reference"), v: item.id },
  ].filter(Boolean);

  const equipements = Array.isArray(item.equipements) ? item.equipements.filter(Boolean) : [];

  return (
    <aside
      className="
        rounded-none bg-white/85 supports-backdrop-blur:bg-white/60 backdrop-blur-xl
        ring-1 ring-black/10 shadow-[0_10px_28px_rgba(0,0,0,.12)]
        px-5 py-5 md:px-6 md:py-6
      "
    >
      <div className="text-[11px] tracking-[0.18em] uppercase text-neutral-500">
        {t("listing.key_info")}
      </div>

      {/* PILLs principales */}
      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
        {main.map(({ k, label, v }) => (
          <div
            key={k}
            className="rounded-none ring-1 ring-black/10 bg-neutral-100 px-3 py-2 text-[13px] leading-tight"
          >
            <div className="text-neutral-500">{label}</div>
            <div className="font-medium text-neutral-900">{v}</div>
          </div>
        ))}
      </div>

      {/* PILLs complémentaires */}
      {extra.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          {extra.map(({ k, label, v }) => (
            <div key={k} className="rounded-none ring-1 ring-black/10 bg-neutral-100 px-3 py-2 text-[13px] leading-tight">
              <div className="text-neutral-500">{label}</div>
              <div className="font-medium text-neutral-900">{v}</div>
            </div>
          ))}
        </div>
      )}

      {/* Équipements */}
      {equipements.length > 0 && (
        <>
          <div className="mt-5 h-px bg-neutral-200/70" />
          <div className="mt-4">
            <div className="text-[11px] tracking-[0.18em] uppercase text-neutral-500">{t("listing.equipment")}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {equipements.map((e, i) => (
                <span key={i} className="px-3 py-1.5 text-[13px] rounded-none ring-1 ring-black/10 bg-neutral-100">
                  {e}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
