// src/components/cards/ListingCardV1.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const GARY_ORANGE = "#FF4A3E";

function formatCHF(n) {
  if (typeof n !== "number" || isNaN(n)) return "Prix sur demande";
  return "CHF " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

function composeMeta(item) {
  const parts = [];
  if (item?.pieces) parts.push(`${item.pieces} pièces`);
  if (item?.surface_m2) parts.push(`${item.surface_m2} m²`);
  if (item?.chambres) parts.push(`${item.chambres} ch.`);
  if (item?.sdb) parts.push(`${item.sdb} sdb`);
  return parts.join(" • ");
}

function buildSrcSet(url) {
  if (!url || typeof url !== "string") return undefined;
  const resizable = /unsplash|pexels|picsum|\.webp$|\.jpe?g$|\.png$/i.test(url);
  if (!resizable) return undefined;
  const widths = [480, 768, 1024, 1440, 1920];
  const hasQ = url.includes("?");
  const withW = (w) => url + (hasQ ? `&w=${w}` : `?w=${w}`);
  return widths.map((w) => `${withW(w)} ${w}w`).join(", ");
}

export default function ListingCardV1({
  listing,
  item: legacyItem, // compat ancien code
  onClick,
}) {
  const item = listing ?? legacyItem ?? {};
  const imgs = Array.isArray(item.images) ? item.images : [];
  const [idx] = useState(0);

  const img = imgs[idx] || item.image || "";
  const srcSet = useMemo(() => buildSrcSet(img), [img]);
  const sizes =
    "(min-width:1280px) 420px, (min-width:1024px) 380px, (min-width:768px) 340px, 88vw";

  const atoutsText =
    Array.isArray(item.tags) && item.tags.length ? item.tags.join(" • ") : "";

  return (
    <Link
      to={`/annonce/${item.id}`}
      onClick={onClick}
      aria-label={item.titre || "Voir l’annonce"}
      className="group block overflow-hidden rounded-none border border-zinc-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition
                 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(255,74,62,0.18)]"
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* --- Image carré strict (plan de fond) --- */}
      <div
        className="relative z-0 overflow-hidden rounded-none"
        style={{ aspectRatio: "1 / 1" }}
      >
        <img
          src={img}
          alt={item.titre || "Annonce"}
          loading="lazy"
          decoding="async"
          srcSet={srcSet}
          sizes={sizes}
          className="w-full h-full object-cover select-none"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>

      {/* --- Zone bas (révélation) --- */}
      {/* Important: overflow-visible pour permettre à la description de chevaucher l'image */}
      <div className="relative overflow-visible border-t border-zinc-200 rounded-none bg-white">
        {/* Légende révélée tout en bas, sous la description */}
        <div className="absolute inset-x-0 bottom-0 h-12 flex items-center justify-center z-0 pointer-events-none">
          <span className="text-sm font-medium tracking-wide text-[#0F1115] opacity-0
                           group-hover:opacity-100 transition-opacity duration-300">
            Découvrir le bien →
          </span>
        </div>

        {/* Description qui MONTE et PASSE au-dessus de l'image */}
        <div
          className="relative z-20 bg-zinc-100 p-4 rounded-none -mt-px
                     transition-transform duration-300
                     group-hover:-translate-y-12
                     group-hover:shadow-[0_-10px_18px_rgba(0,0,0,0.08)]
                     border-t border-zinc-200 group-hover:border-transparent"
        >
          {/* Titre 2 lignes max */}
          <h3 className="text-[18px] leading-snug font-medium text-[#0F1115] line-clamp-2">
            {item.titre ?? "Propriété d’exception"}
          </h3>

          {/* Métadonnées compactes */}
          <p className="mt-1 text-[13px] text-[#61646B]">
            {composeMeta(item) || "Surface généreuse • Finitions haut de gamme"}
          </p>

          {/* Atouts en simple texte (pas de boîtes) */}
          {atoutsText && (
            <p className="mt-1 text-[12px] text-[#61646B]/90">{atoutsText}</p>
          )}

          {/* Prix en bas de la description — pavé carré noir -> orange au hover de la carte */}
          <div className="mt-4">
            <span
              className="inline-block px-3 py-2 text-[18px] font-semibold text-white bg-black rounded-none
                         transition-colors duration-300 group-hover:bg-[#FF4A3E]"
            >
              {formatCHF(item.prix)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
