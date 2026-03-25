// src/components/cards/WeekCardV1.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "../../hooks/useLocale.js";

/* ---------------- utils ---------------- */
function formatCHF(n, onRequestLabel = "Sur demande") {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return onRequestLabel;
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

/* ---------------- hook swipe tactile ---------------- */
function useSwipeGallery(imgs, startIdx = 0) {
  const [idx, setIdx] = useState(startIdx);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const ref = useRef(null);
  const touchState = useRef({ startX: 0, startY: 0, locked: null });
  const idxRef = useRef(startIdx);
  const offsetRef = useRef(0);

  useEffect(() => { idxRef.current = idx; }, [idx]);

  useEffect(() => {
    const el = ref.current;
    if (!el || imgs.length <= 1) return;

    const onStart = (e) => {
      touchState.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, locked: null };
      setIsSwiping(true);
    };
    const onMove = (e) => {
      const ts = touchState.current;
      const dx = e.touches[0].clientX - ts.startX;
      const dy = e.touches[0].clientY - ts.startY;
      if (ts.locked === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
        ts.locked = Math.abs(dx) >= Math.abs(dy) ? "h" : "v";
      }
      if (ts.locked !== "h") return;
      e.preventDefault();
      const ci = idxRef.current;
      let off = dx;
      if ((ci === 0 && dx > 0) || (ci === imgs.length - 1 && dx < 0)) off = dx * 0.25;
      offsetRef.current = off;
      setSwipeOffset(off);
    };
    const onEnd = () => {
      const off = offsetRef.current;
      const ci = idxRef.current;
      if (touchState.current.locked === "h") {
        if (off < -50 && ci < imgs.length - 1) setIdx((p) => p + 1);
        else if (off > 50 && ci > 0) setIdx((p) => p - 1);
      }
      offsetRef.current = 0;
      setSwipeOffset(0);
      setIsSwiping(false);
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, [imgs.length]);

  const trackStyle = {
    transform: `translateX(calc(${-idx * 100}% + ${swipeOffset}px))`,
    transition: isSwiping ? "none" : "transform 300ms cubic-bezier(0.25, 1, 0.5, 1)",
  };

  return { idx, setIdx, ref, trackStyle, isSwiping };
}

/* --------------- sous-composants --------------- */
function Panel({ item }) {
  const { t, link } = useLocale();
  return (
    <aside className="w-[480px] max-w-full bg-white p-8 shadow-[0_16px_50px_rgba(0,0,0,0.10)] ring-1 ring-black/5">
      <div className="flex items-center gap-3">
        <span className="inline-block w-8 h-[2px] bg-[#FF4A3E]" />
        <p className="tracking-[0.16em] text-[12px] text-neutral-500">
          {t("listing.weekly_pick")}
        </p>
      </div>

      <h2 className="mt-3 text-3xl md:text-[36px] leading-tight tracking-[0.005em] text-neutral-900">
        {item.titre}
      </h2>

      <p className="mt-2 text-neutral-600">
        {item.ville}{item.canton ? `, ${item.canton}` : ""}
      </p>

      <div className="mt-4 text-[15px] text-neutral-700">
        {item.pieces != null && <span>{item.pieces} {t("listing.spec_rooms").toLowerCase()}</span>}
        {item.pieces != null && item.surface_m2 != null && <span className="mx-2">·</span>}
        {item.surface_m2 != null && <span>{item.surface_m2} m²</span>}
        {item.sdb != null && (<><span className="mx-2">·</span><span>{item.sdb} sdb</span></>)}
      </div>

      <div className="mt-5">
        <div className="text-[11px] uppercase tracking-wide text-neutral-500">{t("listing.spec_price")}</div>
        <div className="mt-1 text-2xl font-semibold text-neutral-900" style={{ fontVariantNumeric: "tabular-nums" }}>
          {formatCHF(item.prix, t("listing.price_on_request"))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to={link("listing", { id: item.id })}
          className="inline-flex items-center px-5 py-3 bg-[#FF4A3E] text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4A3E]/50"
        >
          {t("cta.discover_property")}
        </Link>
        <Link
          to={`${link("contact")}?ref=weekly-${item.id}`}
          className="inline-flex items-center px-5 py-3 border border-neutral-200 text-neutral-900 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-300"
        >
          {t("cta.schedule_visit")}
        </Link>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-neutral-500">
        {t("listing.full_file_on_request")}
      </p>
    </aside>
  );
}
Panel.propTypes = { item: PropTypes.object.isRequired };

function SwipeArrows({ idx, total }) {
  if (total <= 1) return null;
  return (
    <div className="absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-2 pointer-events-none md:hidden">
      <ChevronLeft strokeWidth={1.5} className={`w-14 h-20 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] transition-opacity animate-[nudge-left_1.5s_ease-in-out_infinite] ${idx === 0 ? 'opacity-0' : 'opacity-100'}`} />
      <ChevronRight strokeWidth={1.5} className={`w-14 h-20 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] transition-opacity animate-[nudge-right_1.5s_ease-in-out_infinite] ${idx === total - 1 ? 'opacity-0' : 'opacity-100'}`} />
    </div>
  );
}

function CompactCard({ item }) {
  const { t, link } = useLocale();
  const imgs = Array.isArray(item.images) ? item.images : [];
  const startIdx = Number.isInteger(item.heroIdx) && item.heroIdx >= 0 && item.heroIdx < imgs.length ? item.heroIdx : 0;
  const { idx, ref, trackStyle } = useSwipeGallery(imgs, startIdx);
  const badge = badgeFrom(item);

  return (
    <article className="relative isolate bg-white border border-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden">
      <div ref={ref} className="relative aspect-[4/3] md:aspect-[5/4] overflow-hidden">
        {imgs.length > 0 ? (
          <div className="absolute inset-0" style={trackStyle}>
            {imgs.map((src, i) => {
              if (Math.abs(i - idx) > 2) return null;
              return (
                <img
                  key={i}
                  src={src}
                  alt={i === idx ? (item.titre || t("listing.featured_property")) : ""}
                  className={`absolute top-0 h-full w-full object-cover ${item.vendu ? "grayscale" : ""}`}
                  style={{ left: `${i * 100}%` }}
                  loading="lazy"
                  draggable="false"
                />
              );
            })}
          </div>
        ) : <div className="w-full h-full bg-neutral-200" />}
        <SwipeArrows idx={idx} total={imgs.length} />
        {badge && (
          <div className="absolute top-5 md:top-6 left-0 z-20 pointer-events-none">
            <span className="inline-block px-3.5 py-1.5 uppercase tracking-[0.20em] text-[11px] md:text-[12px] font-semibold text-white shadow" style={{ backgroundColor: "#FF4A3E" }}>
              {badge.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <p className="tracking-[0.16em] text-[11px] text-neutral-500">{t("listing.weekly_pick")}</p>
        <h3 className="mt-2 text-xl md:text-2xl leading-tight text-neutral-950">{item.titre}</h3>
        <p className="mt-1 text-neutral-600">{item.ville}{item.canton ? `, ${item.canton}` : ""}</p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[15px] text-neutral-700">
          {item.pieces != null && <span>{item.pieces} {t("listing.spec_rooms").toLowerCase()}</span>}
          {item.surface_m2 != null && <span>{item.surface_m2} m²</span>}
          {item.sdb != null && <span>{item.sdb} sdb</span>}
        </div>

        <div className="mt-4">
          <div className="text-[11px] uppercase tracking-wide text-neutral-500">{t("listing.spec_price")}</div>
          <div className="mt-1 text-lg md:text-xl font-semibold text-neutral-900" style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatCHF(item.prix, t("listing.price_on_request"))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link to={link("listing", { id: item.id })} className="inline-flex items-center px-5 py-3 bg-[#FF4A3E] text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4A3E]/50">{t("cta.discover_property")}</Link>
          <Link to={`${link("contact")}?ref=weekly-${item.id}`} className="inline-flex items-center px-5 py-3 border border-neutral-200 text-neutral-900 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-300">{t("cta.schedule_visit")}</Link>
        </div>
      </div>
    </article>
  );
}
CompactCard.propTypes = { item: PropTypes.object.isRequired };

/* --------------- composant principal --------------- */
export default function WeekCardV1({
  item,
  mode = "split",
  bg = "slideshow",
  bgOpacity = 0.6,
  bgBlur = 6,
  overlay = "light",
  bgIntervalMs = 9000,
}) {
  const { t } = useLocale();

  const imgs = useMemo(
    () => (Array.isArray(item?.images) ? item.images.filter(Boolean) : []),
    [item?.images]
  );
  const startIdx = Number.isInteger(item?.heroIdx) && item.heroIdx >= 0 && item.heroIdx < imgs.length ? item.heroIdx : 0;
  const { idx: imgIdx, ref: splitRef, trackStyle: splitTrackStyle } = useSwipeGallery(imgs, startIdx);
  const hero = imgs[imgIdx];
  const badge = item ? badgeFrom(item) : null;

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

  if (!item) return null;

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
            <div ref={splitRef} className="relative aspect-[16/9] md:aspect-[5/4] overflow-hidden">
              {imgs.length > 0 ? (
                <div className="absolute inset-0" style={splitTrackStyle}>
                  {imgs.map((src, i) => {
                    if (Math.abs(i - imgIdx) > 2) return null;
                    return (
                      <img
                        key={i}
                        src={src}
                        alt={i === imgIdx ? (item.titre || t("listing.weekly_property")) : ""}
                        className="absolute top-0 h-full w-full object-cover"
                        style={{ left: `${i * 100}%` }}
                        loading="lazy"
                        draggable="false"
                      />
                    );
                  })}
                </div>
              ) : <div className="w-full h-full bg-neutral-200" />}
              <SwipeArrows idx={imgIdx} total={imgs.length} />
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
