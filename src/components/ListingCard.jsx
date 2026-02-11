// src/components/ListingCard.jsx
import { useState,useEffect  } from "react";
import { Link } from "react-router-dom";
import { Home, BedDouble, Ruler, Bath, ChevronLeft, ChevronRight } from "lucide-react";

/* =========================
   PRESETS STYLE "LUXE CARRÉ"
   ========================= */
const LUXE_SQUARE = true;                // true => coins carrés (luxe). false => arrondis (rounded-2xl)
const MAKE_S_TILE_1_1 = false;           // true => la taille S devient une tuile carrée (aspect-square)

const radiusCls = LUXE_SQUARE ? "rounded-none" : "rounded-2xl"; // appliqué à la carte + clipper
const tileRadiusCls = LUXE_SQUARE ? "rounded-none" : "rounded-md";


/* =========================
   HELPERS
   ========================= */
function formatCHF(n) {
  if (typeof n !== "number" || isNaN(n) || n <= 0) return null;
  return "CHF " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}
function isRecent(d, days = 21) {
  if (!d) return false;
  const dt = new Date(d);
  if (isNaN(dt)) return false;
  return Date.now() - dt.getTime() <= days * 86400 * 1000;
}
function composeMeta(item) {
  const parts = [];
  if (item?.pieces) parts.push(`${item.pieces} pièces`);
  if (item?.surface_m2) parts.push(`${item.surface_m2} m²`);
  if (item?.chambres) parts.push(`${item.chambres} ch.`);
  return parts.join(" • ");
}
function normalizeBanner(b) {
  if (!b) return "";
  const s = String(b).toLowerCase().replace(/\s+/g, "-");
  if (s.includes("vendu")) return "vendu";
  if (s.includes("réserv") || s.includes("reserve")) return "reserve";
  if (s.includes("coming")) return "coming-soon";
  if (s.includes("exclu")) return "exclu";
  return s;
}

/* =========================
   NOUVEAU BANDEAU (Carré + rectangle blanc, centré haut)
   ========================= */
function TopStatusTag({ kind }) {
  if (!kind) return null;

  const ORANGE = "#FF4A3E";
  const map = {
    vendu: "VENDU",
    reserve: "RÉSERVÉ",
    exclu: "EXCLUSIF",
    "coming-soon": "COMING SOON",
  };
  const label = map[kind];
  if (!label) return null;

  return (
    <div className="absolute top-3 md:top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <span
        className={`inline-block ${tileRadiusCls} px-3.5 py-1.5 uppercase tracking-[0.20em]
                  text-[11px] md:text-[12px] font-semibold text-white shadow
                  border border-white/90`}
        style={{ backgroundColor: ORANGE }}
      >
        {label}
      </span>

    </div>
  );
}



/* =========================
   LISTING CARD
   ========================= */
export default function ListingCard({ item, size = "md" }) {
  const imgs = Array.isArray(item.images) ? item.images : [];
  const start =
    Number.isInteger(item.heroIdx) && item.heroIdx >= 0 && item.heroIdx < imgs.length
      ? item.heroIdx
      : 0;
  const [idx, setIdx] = useState(start);

  const [paused, setPaused] = useState(false);

  // mapping des tailles de carte
  const isS = size === "md";   // S
  const isM = size === "lg";   // M
  const isL = size === "xl";   // L
  const isXL = size === "xxl"; // XL

  const enableCarousel = (isM || isL || isXL) && imgs.length > 1;

  // bornes du carrousel (pour les flèches)
const isFirst = idx === 0;
const isLast  = imgs.length > 0 ? idx === imgs.length - 1 : true;

// handlers flèches (sans wrap)
const handlePrev = (e) => {
  e.preventDefault(); e.stopPropagation();
  setIdx((p) => Math.max(p - 1, 0));
  // évite l'état focus qui maintient l'affichage
  if (e.currentTarget && e.currentTarget.blur) e.currentTarget.blur();
};
const handleNext = (e) => {
  e.preventDefault(); e.stopPropagation();
  setIdx((p) => Math.min(p + 1, imgs.length - 1));
  if (e.currentTarget && e.currentTarget.blur) e.currentTarget.blur();
};


useEffect(() => {
  if (!enableCarousel || paused) return;
  const id = setInterval(() => {
    setIdx((p) => (p + 1) % imgs.length);
  }, 6000);
  return () => clearInterval(id);
}, [enableCarousel, paused, imgs.length]);


  const hasExclu = (item.tags || []).some((t) => /exclu/i.test(String(t)));
  const recent = isRecent(item.createdAt);
  const status = normalizeBanner(item.bandeau || (item.vendu ? "vendu" : ""));
  const ribbonKind = status || (hasExclu ? "exclu" : "");
  const badgeLabel = ribbonKind
    ? null
    : item.badge || (hasExclu ? "EXCLUSIVITÉ" : null);
  const isSold = status === "vendu";

  
  const goPrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((p) => (p - 1 + imgs.length) % imgs.length);
  };
  const goNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((p) => (p + 1) % imgs.length);
  };

  const cardCls =
    `group card-hover relative block ${radiusCls} border border-zinc-200/70 bg-white shadow-sm ` +
    `focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20`;

  return (
    <Link to={`/annonce/${item.id}`} className={cardCls} aria-label={item.titre}>
      {/* CLIPPER */}
      <div
        className={`relative aspect-[4/3] ${radiusCls} overflow-hidden`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* IMAGE */}
        <img
          src={imgs[idx] || ""}
          alt={item.titre || "Annonce"}
          loading="lazy"
          decoding="async"
          sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className={`absolute inset-0 w-full h-full object-cover card-img ${isSold ? "grayscale" : ""}`}
          style={{ imageRendering: "auto" }}
          draggable="false"
        />
        {["vendu", "exclu"].includes(ribbonKind) && (
          <div
            className="absolute inset-3 md:inset-4 z-20 pointer-events-none"
            style={{ border: "1px solid rgba(255,255,255,0.85)", borderRadius: "inherit" }}
          />
        )}

        {/* NOUVEAU BANDEAU (carré + rectangle blanc, centré haut) */}
        <TopStatusTag kind={ribbonKind} />

        {/* (Optionnel) petit badge si pas de statut */}
        {badgeLabel && (
          <span className="z-20 absolute top-3 left-3 rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow bg-emerald-600">
            {badgeLabel}
          </span>
        )}


        {/* Carousel (M/L/XL) */}
        {(isM || isL || isXL) && enableCarousel && (
  <div
    className="
      absolute left-3 bottom-16
      z-50 hidden md:flex items-center gap-2
      card-reveal opacity-0 translate-y-1 pointer-events-none
    "
    role="group"
    aria-label="Contrôles du carrousel"
  >
    <button
      onClick={handlePrev}
      disabled={isFirst}
      aria-disabled={isFirst}
      className="
        rounded-full p-2.5 shadow ring-1 ring-black/10
        bg-white/70 text-zinc-900/90 opacity-80
        card-ctrl-btn
        disabled:bg-white/40 disabled:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30
      "
      aria-label="Image précédente"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>

    <button
      onClick={handleNext}
      disabled={isLast}
      aria-disabled={isLast}
      className="
        rounded-full p-2.5 shadow ring-1 ring-black/10
        bg-white/70 text-zinc-900/90 opacity-80
        card-ctrl-btn
        disabled:bg-white/40 disabled:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30
      "
      aria-label="Image suivante"
    >
      <ChevronRight className="w-5 h-5" />
    </button>
  </div>
)}




        {/* =========================
            VARIANTS PAR TAILLE
           ========================= */}

        {/* S (md) */}
        {isS && (
          <>
            {/* Fallback mobile : petites chips "glass" en bas-droite */}
            <div className="absolute bottom-2 right-2 z-30 flex items-center gap-1.5 md:hidden">
              {(() => {
                const Chip = ({ children }) => (
                  <span
                    className="inline-flex items-center gap-1 rounded-full
                               backdrop-blur-md bg-black/35 text-white/95
                               border border-white/20 px-2 py-1
                               text-[10px] leading-none shadow-sm"
                  >
                    {children}
                  </span>
                );
                return (
                  <>
                    {Number.isFinite(item.pieces) && (
                      <Chip>
                        <Home className="w-3.5 h-3.5" />
                        {item.pieces} p.
                      </Chip>
                    )}
                    {Number.isFinite(item.surface_m2) && (
                      <Chip>
                        <Ruler className="w-3.5 h-3.5" />
                        {item.surface_m2} m²
                      </Chip>
                    )}
                    {Number.isFinite(item.chambres) && (
                      <span className="hidden xs:inline-flex">
                        <Chip>
                          <BedDouble className="w-3.5 h-3.5" />
                          {item.chambres} ch.
                        </Chip>
                      </span>
                    )}
                  </>
                );
              })()}
            </div>


            {/* Gradient discret sous le prix */}
            <div
              className="absolute inset-x-0 bottom-0 z-20
                         bg-gradient-to-t from-black/20 to-transparent
                         h-[22%] pointer-events-none"
            />
          </>
        )}

        {/* M (lg) */}
        {isM && (
          <>
            {/* Gradient très léger pour le prix */}
            <div className="absolute inset-x-0 bottom-0 z-20 hidden md:block pointer-events-none">
              <div className="h-[14%] bg-gradient-to-t from-black/16 via-black/5 to-transparent" />
            </div>

            {/* Panneau à droite (hover) */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 z-50 hidden md:block" aria-hidden="true">
              <div
                className="
                  pointer-events-none inline-flex
                  w-auto min-w-[260px] max-w-[360px]
                  rounded-2xl bg-[#FF5544]/55 backdrop-blur-sm backdrop-saturate-150
                  ring-1 ring-[#FF5544]/50 shadow-[0_8px_24px_rgba(255,85,68,.25)]
                  px-5 py-4 text-white
                  card-reveal card-panel-m opacity-0 translate-x-2
                "
                style={{ textShadow: "0 1px 1px rgba(0,0,0,.35)" }}
              >
                <div className="w-full">
                  <div className="truncate text-[15px] font-semibold leading-tight">
                    {item.ville}
                    {item.canton && <span className="opacity-95"> · {item.canton}</span>}
                  </div>

                  <div className="mt-2 space-y-1.5 text-[14px]">
                    <div className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-white" />
                      <span className="tabular-nums">{item.pieces ?? "-"} p.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-5 h-5 text-white" />
                      <span className="tabular-nums">{item.chambres ?? "-"} ch.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ruler className="w-5 h-5 text-white" />
                      <span className="tabular-nums">{item.surface_m2 ?? "-"} m²</span>
                    </div>
                  </div>

                  {Array.isArray(item.tags) && item.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="pointer-events-none rounded-full bg-white text-[#FF5544]
                                     px-3 py-1 text-[12px] shadow ring-1 ring-[#FF5544]/30"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fallback mobile */}
            <div className="absolute inset-x-0 bottom-0 z-20 md:hidden pointer-events-none">
              <div className="bg-gradient-to-t from-black/24 via-black/8 to-transparent pt-12 pb-3 px-3 text-white">
                <div className="text-[13px] font-semibold">
                  {item.ville}
                  {item.canton && <span className="opacity-80"> · {item.canton}</span>}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] opacity-95">
                  <span className="inline-flex items-center gap-1.5">
                    <Home className="w-4 h-4" />
                    {item.pieces ?? "-"} p.
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <BedDouble className="w-4 h-4" />
                    {item.chambres ?? "-"} ch.
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Ruler className="w-4 h-4" />
                    {item.surface_m2 ?? "-"} m²
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* L/XL */}
        {(isL || isXL) && (
          <>
            {/* Fallback mobile : bandeau bas */}
            <div className="absolute inset-x-0 bottom-0 z-20 md:hidden pointer-events-none">
              <div className="bg-gradient-to-t from-black/26 via-black/8 to-transparent pt-16 pb-4 px-4 text-white">
                <div className="text-[13px] font-semibold">
                  {item.ville}
                  {item.canton && <span className="opacity-80"> · {item.canton}</span>}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] opacity-95">
                  <span className="inline-flex items-center gap-1.5">
                    <Home className="w-4 h-4" />
                    {item.pieces ?? "-"} p.
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <BedDouble className="w-4 h-4" />
                    {item.chambres ?? "-"} ch.
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Ruler className="w-4 h-4" />
                    {item.surface_m2 ?? "-"} m²
                  </span>
                  {typeof item.sdb !== "undefined" && (
                    <span className="inline-flex items-center gap-1.5">
                      <Bath className="w-4 h-4" />
                      {item.sdb ?? "-"} s.d’eau
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop : panneau à droite */}
            <div
  className="hidden md:block absolute bottom-6 right-6 z-40"
  aria-hidden="true"
>
  {(() => {
    const panelW = isXL ? "w-[460px] max-w-[40vw]" : "w-[380px] max-w-[44vw]";
    return (
      <div className={`pointer-events-none ${panelW}`}>
        <div
          className="
            rounded-2xl
            bg-white/55 text-black
            ring-1 ring-white/60
            shadow-[0_12px_28px_rgba(0,0,0,0.22)]
            backdrop-blur-sm backdrop-saturate-150
            px-6 py-5
            card-reveal card-panel-lxl opacity-0 translate-x-2
          "
        >
          {/* Localisation */}
          <div className="text-[12px] font-semibold tracking-wide uppercase opacity-90">
            {item.ville}
            {item.canton && <span className="opacity-80"> · {item.canton}</span>}
          </div>

          {/* Titre (2 lignes max) */}
          {item.titre && (
            <div className="mt-1 text-2xl font-semibold leading-snug line-clamp-2">
              {item.titre}
            </div>
          )}

          {/* Specs */}
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-[14px]">
            <span className="inline-flex items-center gap-2">
              <Home className="w-5 h-5" />
              {item.pieces ?? "-"} pièces
            </span>
            <span className="inline-flex items-center gap-2">
              <BedDouble className="w-5 h-5" />
              {item.chambres ?? "-"} ch.
            </span>
            <span className="inline-flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              {item.surface_m2 ?? "-"} m²
            </span>
            {typeof item.sdb !== "undefined" && (
              <span className="inline-flex items-center gap-2">
                <Bath className="w-5 h-5" />
                {item.sdb ?? "-"} s.d’eau
              </span>
            )}
          </div>

          {/* Tags */}
          {item.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="pointer-events-none rounded-full bg-white text-[#FF5544]
                             px-3 py-1 text-[12px] shadow ring-1 ring-[#FF5544]/30"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  })()}
</div>

          </>
        )}
      </div>

      {/* --- Zone texte sous l'image --- */}
      <div className="p-4">
        <h3 className="text-[16px] leading-snug font-medium text-[#0F1115] line-clamp-2">
          {item.titre ?? "Propriété"}
        </h3>
        <p className="mt-1 text-[13px] text-[#61646B]">
          {composeMeta(item)}
        </p>
        <div className="mt-3">
          <span
            className={`inline-block ${tileRadiusCls} bg-[#0F1115] text-white card-price px-3 py-1.5 text-[15px] font-semibold shadow-md min-w-[96px] text-center`}
          >
            {item.prix ? formatCHF(item.prix) : "Prix sur demande"}
          </span>
        </div>
      </div>
    </Link>
  );
}
