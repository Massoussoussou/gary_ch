// src/components/cards/ListingCardSoldV2.jsx
import { Link } from "react-router-dom";

const ORANGE = "#FF4A3E";
const AMBRE  = "#F59E0B";

function formatCHF(n) {
  if (typeof n !== "number" || isNaN(n) || n <= 0) return null;
  return "CHF " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

/**
 * Carte statut "overlay luxe" (N&B → couleur au hover).
 * Modes : "sold" (VENDU), "coming" (COMING SOON), "offer" (SOUS OFFRE).
 */
export default function ListingCardSold({
  listing,
  mode = "sold",          // "sold" | "coming" | "offer"
  to,                      // override du href si besoin
}) {
  const it = listing || {};
  const img = (Array.isArray(it.images) && it.images[0]) || it.image || "";
  const href = to || it.href || `/annonce/${it.id ?? ""}`;

  const city = it.ville || it.commune || it.quartier || "";
  const subtitle =
    it.type || it.titre_secondaire || it.category || "Bien d’exception";

  const labelMap = {
    sold:   { text: "VENDU",        color: ORANGE },
    coming: { text: "COMING SOON",  color: ORANGE },
    offer:  { text: "SOUS OFFRE",   color: AMBRE  },
  };
  const TAG = labelMap[mode] || labelMap.sold;

  const finalPrice = it.prix_final ?? it.prixFinal;
  const priceLabel =
    formatCHF(finalPrice) || (mode === "coming" ? "Prix sur demande" : "Prix confidentiel");

  return (
    <Link
      to={href}
      className="group card-hover-sold block rounded-none overflow-hidden border border-zinc-200 bg-white shadow-sm"
      aria-label={(it.titre || `${city} — ${subtitle}`) + " (détails)"}
    >
      {/* IMAGE avec filtre N&B → couleur au hover */}
      <div className="relative" style={{ aspectRatio: "4 / 3" }}>
        <img
          src={img}
          alt={it.titre || city || "Bien immobilier"}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover select-none
                     filter grayscale contrast-[1.05] brightness-[0.98]
                     card-sold-img"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        />

        {/* LÉGER voile */}
        <div className="absolute inset-0 bg-black/10 card-sold-overlay" />

        {/* TAG haut gauche */}
        <div className="absolute top-5 md:top-6 left-0">
          <span
            className="inline-block px-3.5 py-1.5 text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
            style={{ background: TAG.color }}
          >
            {TAG.text}
          </span>
        </div>

        {/* Texte centre (ville + type) */}
        <div className="absolute inset-0 grid place-items-center px-4 text-center pointer-events-none">
          <div className="drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
            <div className="text-white font-serif uppercase tracking-[0.18em] text-[22px] md:text-[26px]">
              {city || it.titre || "Localisation confidentielle"}
            </div>
            <div className="mt-1 text-white/90 text-[13px] md:text-[14px] tracking-wide">
              {subtitle}
            </div>
          </div>
        </div>

        {/* Badge prix en bas gauche (masqué pour les biens vendus) */}
        {mode !== "sold" && (
          <div className="absolute left-3 bottom-3">
            <span
              className="inline-flex items-center px-3.5 py-1.5 text-[12px] md:text-[13px] font-medium text-white rounded-none shadow-sm"
              style={{ background: mode === "coming" ? ORANGE : "#111827" }}
            >
              {priceLabel}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
