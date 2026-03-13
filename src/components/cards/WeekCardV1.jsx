// src/components/cards/WeekCardV1.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ---------------- utils ---------------- */
function formatCHF(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return "Sur demande";
  return "CHF " + v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}
function badgeFrom(item) {
  const s = String(item?.bandeau || "").toLowerCase();
  if (item?.vendu) return "vendu";
  if (s.includes("exclu")) return "exclusivité";
  if (s.includes("nouveau") || s.includes("nouveauté") || s.includes("new")) return "nouveau";
  if (s.includes("réserv") || s.includes("reserve")) return "réservé";
  return "";
}

/* --------------- sous-composants --------------- */
function Panel({ item }) {
  return (
    <aside className="w-[480px] max-w-full bg-white p-8 shadow-[0_16px_50px_rgba(0,0,0,0.10)] ring-1 ring-black/5">
      <div className="flex items-center gap-3">
        <span className="inline-block w-8 h-[2px] bg-[#FF4A3E]" />
        <p className="tracking-[0.16em] text-[12px] text-neutral-500">
          SÉLECTION DE LA SEMAINE
        </p>
      </div>

      <h2 className="mt-3 text-3xl md:text-[36px] leading-tight tracking-[0.005em] text-neutral-900">
        {item.titre}
      </h2>

      <p className="mt-2 text-neutral-600">
        {item.ville}{item.canton ? `, ${item.canton}` : ""}
      </p>

      <div className="mt-4 text-[15px] text-neutral-700">
        {item.pieces != null && <span>{item.pieces} pièces</span>}
        {item.pieces != null && item.surface_m2 != null && <span className="mx-2">·</span>}
        {item.surface_m2 != null && <span>{item.surface_m2} m²</span>}
        {item.sdb != null && (<><span className="mx-2">·</span><span>{item.sdb} sdb</span></>)}
      </div>

      <div className="mt-5">
        <div className="text-[11px] uppercase tracking-wide text-neutral-500">Prix</div>
        <div className="mt-1 text-2xl font-semibold text-neutral-900" style={{ fontVariantNumeric: "tabular-nums" }}>
          {formatCHF(item.prix)}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to={`/annonce/${item.id}`}
          className="inline-flex items-center px-5 py-3 bg-[#FF4A3E] text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4A3E]/50"
        >
          Découvrir le bien
        </Link>
        <Link
          to={`/contact?ref=weekly-${item.id}`}
          className="inline-flex items-center px-5 py-3 border border-neutral-200 text-neutral-900 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-300"
        >
          Planifier une visite
        </Link>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-neutral-500">
        Dossier complet sur demande. Visites privées possibles.
      </p>
    </aside>
  );
}
Panel.propTypes = { item: PropTypes.object.isRequired };

function CompactCard({ item }) {
  const imgs = Array.isArray(item.images) ? item.images : [];
  const startIdx = Number.isInteger(item.heroIdx) && item.heroIdx >= 0 && item.heroIdx < imgs.length ? item.heroIdx : 0;
  const [idx, setIdx] = useState(startIdx);
  const badge = badgeFrom(item);
  const touchRef = useRef({ startX: 0, startY: 0 });

  const onTouchStart = (e) => { touchRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY }; };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchRef.current.startX;
    const dy = e.changedTouches[0].clientY - touchRef.current.startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0 && idx < imgs.length - 1) setIdx((p) => p + 1);
      else if (dx > 0 && idx > 0) setIdx((p) => p - 1);
    }
  };

  const nearby = new Set([idx]);
  if (idx > 0) nearby.add(idx - 1);
  if (idx < imgs.length - 1) nearby.add(idx + 1);

  return (
    <article className="relative isolate bg-white border border-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden">
      <div
        className="relative aspect-[4/3] md:aspect-[5/4] overflow-hidden"
        onTouchStart={imgs.length > 1 ? onTouchStart : undefined}
        onTouchEnd={imgs.length > 1 ? onTouchEnd : undefined}
      >
        {imgs.length > 0 ? [...nearby].map((i) => (
          <img
            key={i}
            src={imgs[i]}
            alt={i === idx ? (item.titre || "Bien en vedette") : ""}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-out ${i === idx ? "" : "opacity-0"} ${item.vendu ? "grayscale" : ""}`}
            loading="lazy"
          />
        )) : <div className="w-full h-full bg-neutral-200" />}
        {imgs.length > 1 && (
          <div className="absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-2 pointer-events-none md:hidden">
            <div className={`rounded-full bg-black/20 p-1 transition-opacity ${idx === 0 ? 'opacity-0' : 'opacity-60'}`}>
              <ChevronLeft className="w-4 h-4 text-white" />
            </div>
            <div className={`rounded-full bg-black/20 p-1 transition-opacity ${idx === imgs.length - 1 ? 'opacity-0' : 'opacity-60'}`}>
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
        {badge && (
          <div className="absolute top-5 md:top-6 left-0 z-20 pointer-events-none">
            <span className="inline-block px-3.5 py-1.5 uppercase tracking-[0.20em] text-[11px] md:text-[12px] font-semibold text-white shadow" style={{ backgroundColor: "#FF4A3E" }}>
              {badge.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <p className="tracking-[0.16em] text-[11px] text-neutral-500">SÉLECTION DE LA SEMAINE</p>
        <h3 className="mt-2 text-xl md:text-2xl leading-tight text-neutral-950">{item.titre}</h3>
        <p className="mt-1 text-neutral-600">{item.ville}{item.canton ? `, ${item.canton}` : ""}</p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[15px] text-neutral-700">
          {item.pieces != null && <span>{item.pieces} pièces</span>}
          {item.surface_m2 != null && <span>{item.surface_m2} m²</span>}
          {item.sdb != null && <span>{item.sdb} sdb</span>}
        </div>

        <div className="mt-4">
          <div className="text-[11px] uppercase tracking-wide text-neutral-500">Prix</div>
          <div className="mt-1 text-lg md:text-xl font-semibold text-neutral-900" style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatCHF(item.prix)}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link to={`/annonce/${item.id}`} className="inline-flex items-center px-5 py-3 bg-[#FF4A3E] text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4A3E]/50">Découvrir le bien</Link>
          <Link to={`/contact?ref=weekly-${item.id}`} className="inline-flex items-center px-5 py-3 border border-neutral-200 text-neutral-900 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-300">Planifier une visite</Link>
        </div>
      </div>
    </article>
  );
}
CompactCard.propTypes = { item: PropTypes.object.isRequired };

/* --------------- composant principal --------------- */
/**
 * @param {{ item: object, mode?: 'split'|'card',
 * bg?: 'none'|'blur'|'slideshow',
 * bgOpacity?: number, bgBlur?: number, overlay?: 'light'|'none',
 * bgIntervalMs?: number }}
 */
export default function WeekCardV1({
  item,
  mode = "split",
  bg = "slideshow",
  bgOpacity = 0.6,   // << plus visible
  bgBlur = 6,        // << moins flou
  overlay = "light", // 'none' pour zéro voile
  bgIntervalMs = 9000,
}) {
  if (!item) return null;

  const imgs = useMemo(
    () => (Array.isArray(item.images) ? item.images.filter(Boolean) : []),
    [item.images]
  );
  const startIdx = Number.isInteger(item.heroIdx) && item.heroIdx >= 0 && item.heroIdx < imgs.length ? item.heroIdx : 0;
  const [imgIdx, setImgIdx] = useState(startIdx);
  const hero = imgs[imgIdx];
  const badge = badgeFrom(item);
  const splitTouchRef = useRef({ startX: 0, startY: 0 });

  const onSplitTouchStart = (e) => { splitTouchRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY }; };
  const onSplitTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - splitTouchRef.current.startX;
    const dy = e.changedTouches[0].clientY - splitTouchRef.current.startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0 && imgIdx < imgs.length - 1) setImgIdx((p) => p + 1);
      else if (dx > 0 && imgIdx > 0) setImgIdx((p) => p - 1);
    }
  };

  const splitNearby = new Set([imgIdx]);
  if (imgIdx > 0) splitNearby.add(imgIdx - 1);
  if (imgIdx < imgs.length - 1) splitNearby.add(imgIdx + 1);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return false; }
  }, []);

  const [bgIdx, setBgIdx] = useState(0);
  useEffect(() => {
    if (bg === "slideshow" && !reduceMotion && imgs.length > 1) {
      const id = setInterval(() => setBgIdx(i => (i + 1) % imgs.length), Math.max(4000, bgIntervalMs));
      return () => clearInterval(id);
    }
  }, [bg, imgs.length, bgIntervalMs, reduceMotion]);

  if (mode === "card") {
    return (
      <section className="relative py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="max-w-[880px]">
            <CompactCard item={item} />
          </div>
        </div>
      </section>
    );
  }

  // mode === 'split'
  return (
    <section className="relative py-24 overflow-hidden">
      {/* FOND visible et au-dessus (z-0) */}
      {bg !== "none" && (
        <div aria-hidden className="absolute inset-0 z-0 pointer-events-none hidden md:block">
          <div className="absolute inset-0">
            {bg === "blur" && hero && (
              <img
                src={hero}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: bgOpacity, filter: `blur(${bgBlur}px)`, transform: "scale(1.06)" }}
                loading="eager"
              />
            )}

            {bg === "slideshow" && imgs.map((src, i) => (
              <img
                key={src + i}
                src={src}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ opacity: i === bgIdx ? bgOpacity : 0, filter: `blur(${bgBlur}px)`, transform: "scale(1.06)" }}
                loading={i === 0 ? "eager" : "lazy"}
              />
            ))}
          </div>

          {/* overlay allégé pour garder la lisibilité sans étouffer l’image */}
          {overlay === "light" && (
            <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/10 to-transparent" />
          )}
        </div>
      )}

      {/* CONTENU au-dessus du fond */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* image élargie à gauche */}
          <div className="col-span-12 md:col-span-8">
            <div
              className="relative aspect-[16/9] md:aspect-[5/4] overflow-hidden"
              onTouchStart={imgs.length > 1 ? onSplitTouchStart : undefined}
              onTouchEnd={imgs.length > 1 ? onSplitTouchEnd : undefined}
            >
              {imgs.length > 0 ? [...splitNearby].map((i) => (
                <img
                  key={i}
                  src={imgs[i]}
                  alt={i === imgIdx ? (item.titre || "Bien de la semaine") : ""}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-out ${i === imgIdx ? "" : "opacity-0"}`}
                  loading="lazy"
                />
              )) : <div className="w-full h-full bg-neutral-200" />}
              {imgs.length > 1 && (
                <div className="absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-2 pointer-events-none md:hidden">
                  <div className={`rounded-full bg-black/20 p-1 transition-opacity ${imgIdx === 0 ? 'opacity-0' : 'opacity-60'}`}>
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </div>
                  <div className={`rounded-full bg-black/20 p-1 transition-opacity ${imgIdx === imgs.length - 1 ? 'opacity-0' : 'opacity-60'}`}>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              {badge && (
                <div className="absolute top-5 md:top-6 left-0 z-20 pointer-events-none">
                  <span className="inline-block px-3.5 py-1.5 uppercase tracking-[0.20em] text-[11px] md:text-[12px] font-semibold text-white shadow" style={{ backgroundColor: "#FF4A3E" }}>
                    {badge.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* panel (chevauche léger) */}
          <div className="col-span-12 md:col-span-4 relative md:-ml-6">
            <Panel item={item} />
          </div>
        </div>
      </div>
    </section>
  );
}

WeekCardV1.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    heroIdx: PropTypes.number,
    titre: PropTypes.string,
    ville: PropTypes.string,
    canton: PropTypes.string,
    pieces: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    surface_m2: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sdb: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    prix: PropTypes.number,
    bandeau: PropTypes.string,
    vendu: PropTypes.bool,
  }).isRequired,
  mode: PropTypes.oneOf(["split", "card"]),
  bg: PropTypes.oneOf(["none", "blur", "slideshow"]),
  bgOpacity: PropTypes.number,
  bgBlur: PropTypes.number,
  overlay: PropTypes.oneOf(["light", "none"]),
  bgIntervalMs: PropTypes.number,
};
