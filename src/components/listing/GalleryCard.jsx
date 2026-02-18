import React, { useMemo, useState, useEffect } from "react";

function Arrow({ dir = "left", ...props }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden {...props}>
      {dir === "left"
        ? <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.7" />
        : <path d="M9 5l7 7-7 7"   fill="none" stroke="currentColor" strokeWidth="1.7" />}
    </svg>
  );
}

export default function GalleryCard({ images = [], widthPx, onImageLoad, item }) {
  const pics = useMemo(() => images.filter(Boolean), [images]);
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);

  if (!pics.length) return null;

  const go = (d) => setI((v) => Math.min(Math.max(v + d, 0), pics.length - 1));
  const wrapStyle = widthPx ? { width: `${Math.round(widthPx)}px` } : undefined;

  const ville = [item?.ville, item?.canton].filter(Boolean).join(", ");
  const spec  = [
    item?.pieces ? `${item.pieces} pièces` : null,
    item?.surface_m2 ? `${item.surface_m2} m²` : null,
    item?.sdb ? `${item.sdb} sdb` : null,
  ].filter(Boolean).join(" • ");
  const prix  = typeof item?.prix === "number"
    ? "CHF " + item.prix.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'")
    : "Prix sur demande";

  // Keyboard + scroll lock quand le popup est ouvert
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    const prevPadRight = document.body.style.paddingRight;
    const sb = window.innerWidth - document.documentElement.clientWidth; // largeur scrollbar
    document.body.style.overflow = "hidden";
    if (sb > 0) document.body.style.paddingRight = `${sb}px`; // évite le “saut”
    
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadRight;
    };
  }, [open]);

  return (
    <>
      <div className="group relative rounded-none" style={wrapStyle}>
        {/* CADRE BLANC */}
        <div className="bg-white pt-4 md:pt-5 pb-3 md:pb-3 px-4 md:px-5 ring-1 ring-black/10 shadow-xl rounded-none">
          {/* Ratio 4/3 */}
          <div className="relative aspect-[4/3] rounded-none overflow-hidden">
            {/* IMAGE + BARRE BAS */}
            <div className="absolute inset-0 grid grid-rows-[7fr_auto]">
              {/* IMAGE (cliquable => popup) */}
              {/* IMAGE (cliquable => popup) */}
<button
  type="button"
  onClick={() => setOpen(true)}
  className="group relative overflow-hidden cursor-zoom-in"
  aria-label="Agrandir la galerie"
>
  <img
    src={pics[i]}
    alt={item?.titre || ""}
    className="
      absolute inset-0 w-full h-full object-cover
      transform-gpu will-change-transform origin-center
      transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)]
      group-hover:scale-[1.18] md:group-hover:scale-[1.22]
    "
    onLoad={onImageLoad}
  />

  {/* Compteur DANS l'image (bas droite) */}
  <div className="absolute bottom-2 right-2 text-[12px] tracking-[0.08em] bg-white/85 px-2 py-0.5 rounded-none ring-1 ring-black/10">
    {i + 1}/{pics.length}
  </div>
</button>


              {/* BARRE BAS : prix + infos */}
              <div className="px-3 md:px-4 py-2 md:py-3 border-t border-black/10 flex items-center justify-between gap-3">
                <div className="px-4 py-1.5 bg-neutral-100/90 rounded-none ring-1 ring-black/10 text-neutral-900 font-semibold text-[20px] md:text-[26px]">
                  {prix}
                </div>
                <div className="px-3 py-1.5 bg-neutral-100/85 rounded-none ring-1 ring-black/10 text-neutral-800 text-[12px] md:text-[13px] tracking-[0.06em] uppercase">
                  {ville}{spec ? " • " + spec : ""}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FLÈCHES SUR LA CARTE */}
        <button
          onClick={() => go(-1)}
          disabled={i === 0}
          className="absolute top-[45%] -translate-y-1/2 left-2 md:left-3 h-9 w-9 grid place-items-center
                     bg-white/85 hover:bg-white text-neutral-900 ring-1 ring-black/10 shadow-md
                     rounded-none transition disabled:opacity-30"
          aria-label="Image précédente"
        >
          <Arrow dir="left" />
        </button>
        <button
          onClick={() => go(1)}
          disabled={i === pics.length - 1}
          className="absolute top-[45%] -translate-y-1/2 right-2 md:right-3 h-9 w-9 grid place-items-center
                     bg-white/85 hover:bg-white text-neutral-900 ring-1 ring-black/10 shadow-md
                     rounded-none transition disabled:opacity-30"
          aria-label="Image suivante"
        >
          <Arrow dir="right" />
        </button>
      </div>

      {/* POPUP PLEIN ÉCRAN */}
      {open && (
        <div
          className="fixed inset-x-0 bottom-0 z-[30] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          style={{ top: 'var(--header-h,64px)' }}
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}  // clic hors contenu => ferme
        >
          {/* Conteneur image 3:2, centré, prend toute la largeur dispo */}
          <div
            className="relative w-[94vw] max-w-[1400px] aspect-[3/2]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={pics[i]}
              alt={item?.titre || ""}
              className="absolute inset-0 w-full h-full object-contain rounded-sm"
            />

            {/* Croix de fermeture */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              className="absolute top-4 right-4 h-10 w-10 grid place-items-center
                         rounded-full bg-white/90 hover:bg-white text-neutral-900
                         ring-1 ring-black/10 shadow"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </button>

            {/* Flèches dans le popup */}
            <button
              onClick={() => go(-1)}
              disabled={i === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 grid place-items-center
                         bg-white/90 hover:bg-white text-neutral-900 ring-1 ring-black/10 shadow
                         rounded-full transition disabled:opacity-30"
              aria-label="Image précédente"
            >
              <Arrow dir="left" />
            </button>
            <button
              onClick={() => go(1)}
              disabled={i === pics.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 grid place-items-center
                         bg-white/90 hover:bg-white text-neutral-900 ring-1 ring-black/10 shadow
                         rounded-full transition disabled:opacity-30"
              aria-label="Image suivante"
            >
              <Arrow dir="right" />
            </button>

            {/* Compteur en bas centre du popup */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[13px] tracking-[0.08em]
                            bg-white/90 px-3 py-1 rounded-full ring-1 ring-black/10 shadow">
              {i + 1}/{pics.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
