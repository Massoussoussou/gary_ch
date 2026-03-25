// src/pages/BuyIntro.jsx
import { useMemo, useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

/* i18n */
import { useLocale } from "../hooks/useLocale.js";

/* Données & composants */
import useProperties from "../hooks/useProperties.js";

import FiltersBar from "../components/FiltersBar.jsx";
import ListingGrid from "../components/ListingGrid.jsx";
import SortMenu from "../components/SortMenu.jsx";
import ProcessSteps from "../components/ProcessSteps.jsx";
import ToolsBudgetCalc from "../components/ToolsBudgetCalc.jsx";
import ToolsAlerts from "../components/ToolsAlerts.jsx";
import AlreadyOwner from "../components/AlreadyOwner.jsx";
import WeekCardV1 from "../components/cards/WeekCardV1.jsx";
import BandCarousel from "../components/BandCarousel.jsx";
import ListingCardSold from "../components/cards/ListingCardSold.jsx";

import CTAFuturaGlow from "../components/cta/CTAFuturaGlow.jsx";
import CTAWhiteSweep from "../components/cta/CTAWhiteSweep.jsx";

/* Hooks et utils partagés */
import { useRevealOnce } from "../hooks/useRevealOnce.js";
import {
  hasTag,
  deriveFacets,
  normalizeListingData,
  coerceNum,
} from "../utils/data.js";
import { pickVideoSrcSimple } from "../utils/video.js";

/* ---------- Fonctions de filtrage / tri (issues de Listings.jsx) ---------- */

function matchesAtouts(equipements = [], atouts = {}) {
  const has = (needle) =>
    equipements.some((x) => x?.toString().toLowerCase().includes(needle));
  let ok = true;
  if (atouts.jardin) ok = ok && has("jardin");
  if (atouts.piscine) ok = ok && has("piscine");
  if (atouts.vue) ok = ok && has("vue");
  if (atouts.garage) ok = ok && has("garage");
  if (atouts.parkingInterieur) ok = ok && (has("parking") || has("garage"));
  if (atouts.parkingExterieur) ok = ok && has("parking");
  if (atouts.cave) ok = ok && has("cave");
  if (atouts.balconTerrasse) ok = ok && (has("balcon") || has("terrasse"));
  return ok;
}

function applyFilters(items, f) {
  let res = items;
  if (f.city) res = res.filter((i) => i.ville === f.city);
  if (f.canton) res = res.filter((i) => i.canton === f.canton);
  if (f.type) res = res.filter((i) => i.type === f.type);

  const min = parseInt(f.priceMin || "0", 10);
  const max = parseInt(f.priceMax || "0", 10);
  if (min) res = res.filter((i) => i.prix >= min);
  if (max) res = res.filter((i) => i.prix <= max);

  const piecesMin = parseInt(f.piecesMin || "0", 10);
  if (piecesMin) res = res.filter((i) => i.pieces >= piecesMin);

  const chMin = parseInt(f.chambresMin || "0", 10);
  if (chMin) res = res.filter((i) => i.chambres >= chMin);

  const sdbMin = parseInt(f.sdbMin || "0", 10);
  if (sdbMin) res = res.filter((i) => i.sdb >= sdbMin);

  const sMin = parseInt(f.surfaceMin || "0", 10);
  const sMax = parseInt(f.surfaceMax || "0", 10);
  if (sMin) res = res.filter((i) => i.surface_m2 >= sMin);
  if (sMax) res = res.filter((i) => i.surface_m2 <= sMax);

  const tMin = parseInt(f.terrainMin || "0", 10);
  if (tMin)
    res = res.filter((i) => (i.terrain_m2 ? i.terrain_m2 >= tMin : true));

  if (f.meuble) res = res.filter((i) => i.meuble);

  if (f.dispoBefore) {
    const d = f.dispoBefore;
    res = res.filter((i) => !i.dispo || i.dispo <= d);
  }

  if (f.atouts) res = res.filter((i) => matchesAtouts(i.equipements, f.atouts));

  if (Array.isArray(f.extraFeatures) && f.extraFeatures.length) {
    const want = f.extraFeatures.map((s) => s.toLowerCase());
    res = res.filter((i) => {
      const eq = (i.equipements || []).map((s) => s.toLowerCase());
      return want.every((w) => eq.some((e) => e.includes(w)));
    });
  }
  return res;
}

function sortItems(items, mode) {
  const arr = [...items];
  if (mode === "prix-asc") arr.sort((a, b) => a.prix - b.prix);
  else if (mode === "prix-desc") arr.sort((a, b) => b.prix - a.prix);
  else if (mode === "surface")
    arr.sort((a, b) => b.surface_m2 - a.surface_m2);
  else if (mode === "recent")
    arr.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  return arr;
}

function hasActiveFilters(f) {
  if (!f) return false;
  return Object.entries(f).some(([k, v]) => {
    if (v == null) return false;
    if (typeof v === "string") return v.trim() !== "";
    if (typeof v === "number") return !Number.isNaN(v) && v !== 0;
    if (typeof v === "boolean") return v;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "object") return hasActiveFilters(v);
    return false;
  });
}

function parseFiltersFromQS(search) {
  const p = new URLSearchParams(search);
  const f = {};
  const pick = (k) => {
    const v = p.get(k);
    if (v !== null && v !== "") f[k] = v;
  };
  [
    "city",
    "canton",
    "type",
    "priceMin",
    "priceMax",
    "piecesMin",
    "chambresMin",
    "sdbMin",
    "surfaceMin",
    "surfaceMax",
    "terrainMin",
    "dispoBefore",
  ].forEach(pick);

  if (p.get("meuble") === "1") f.meuble = true;

  for (const [k, v] of p.entries()) {
    if (k.startsWith("atouts.") && v === "1") {
      f.atouts ??= {};
      f.atouts[k.slice(7)] = true;
    }
  }

  const extras = p.getAll("extraFeatures");
  if (extras.length) f.extraFeatures = extras;

  return f;
}

function parseSortFromQS(search) {
  const v = new URLSearchParams(search).get("sort");
  return v || "recent";
}

/* ---------- Hero content avec parallax (scroll plus lent) ---------- */
function HeroContent({ scrollToListings }) {
  const { t, link } = useLocale();
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      // Le carré monte à 60% de la vitesse du scroll normal
      setOffset(window.scrollY * 0.4);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-8 py-14 sm:py-16 md:py-28"
      style={{ transform: `translateY(${offset}px)` }}
    >
      <div className="relative flex justify-center">
        <div className="relative w-full max-w-[92vw] sm:max-w-[min(900px,84vw)] mx-auto">
          <div className="absolute -inset-y-5 -inset-x-4 sm:-inset-y-6 sm:-inset-x-6 md:-inset-y-6 md:-left-6 md:-right-6 bg-white/55 backdrop-blur-sm rounded-none shadow-[0_22px_70px_-45px_rgba(0,0,0,0.45)] md:shadow-none" />

          <div className="relative text-center px-3 sm:px-0 py-5 sm:py-0">
            <p className="text-[12px] md:text-[13px] uppercase tracking-[0.2em] text-neutral-600 mb-3">
              {t("nav.buy")}
            </p>

            <h1 className="font-serif tracking-[-0.03em] leading-[0.95] md:leading-[0.9] text-[clamp(2.6rem,11vw,4.2rem)] md:text-[clamp(4.2rem,10vw,7.6rem)]">
              {t("buy.hero_title_line1")}
              <br />
              <span className="block">{t("buy.hero_title_line2")}<span className="text-[#FF4A3E]">.</span></span>
            </h1>

            <p className="mt-5 text-[clamp(1.05rem,2.1vw,1.4rem)] text-neutral-900/90 max-w-[52ch] mx-auto">
              {t("buy.hero_subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <CTAFuturaGlow
                label={t("buy.cta_see_listings")}
                onClick={scrollToListings}
                minWidth={260}
              />
              <CTAWhiteSweep to={link("contact")} label={t("cta.contact_gary")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Chiffres clés (mêmes que page Qui est GARY) ---------- */
const BUY_KEY_FIGURES = [
  { value: 100, suffix: "+", labelKey: "buy.fig_sales", icon: "sales" },
  { value: 90, suffix: "+", labelKey: "buy.fig_reviews", icon: "star", link: "https://www.google.com/maps/place/GARY+Real+Estate", linkTextKey: "buy.fig_reviews_link" },
  { value: 6.6, suffix: "M", labelKey: "buy.fig_views", icon: "eye", decimals: 1 },
  { value: 40, suffix: "k+", labelKey: "buy.fig_followers", icon: "followers" },
];

function BuyFigureIcon({ type }) {
  const cls = "w-8 h-8 md:w-10 md:h-10 text-[#FF4A3E]/70";
  switch (type) {
    case "sales":
      return (<svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>);
    case "star":
      return (<svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>);
    case "eye":
      return (<svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
    case "followers":
      return (<svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>);
    default: return null;
  }
}

function useCountUp(target, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) { setValue(0); return; }
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(eased * target);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return value;
}

function BuyFigureItem({ fig, index, active }) {
  const { t } = useLocale();
  const delay = index * 0.15;
  const count = useCountUp(fig.value, 2200, active);
  const display = fig.decimals
    ? count.toFixed(count >= fig.value * 0.99 ? fig.decimals : 1)
    : Math.round(count);

  return (
    <div className="flex flex-col items-center text-center" style={{ opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(30px)", transition: `opacity 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s` }}>
      <div className="mb-4 md:mb-5" style={{ opacity: active ? 1 : 0, transition: `opacity 0.6s ease-out ${delay + 0.1}s` }}>
        <BuyFigureIcon type={fig.icon} />
      </div>
      <span className="font-sans font-bold text-[52px] md:text-[72px] lg:text-[88px] leading-none tracking-tight text-[#FF4A3E]" style={{ fontVariantNumeric: "tabular-nums" }}>
        {display}{fig.suffix}
      </span>
      <p className="mt-3 text-[14px] md:text-[17px] uppercase tracking-[0.12em] text-gray-600 leading-relaxed max-w-[260px]" style={{ opacity: active ? 1 : 0, transition: `opacity 0.6s ease-out ${delay + 0.4}s` }}>
        {t(fig.labelKey)}
      </p>
      {fig.link && (
        <a href={fig.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[12px] uppercase tracking-[0.12em] text-[#FF4A3E]/80 hover:text-[#FF4A3E] transition-colors duration-300" style={{ opacity: active ? 1 : 0, transition: `opacity 0.6s ease-out ${delay + 0.6}s` }}>
          {t(fig.linkTextKey)}
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </a>
      )}
    </div>
  );
}

function KeyFiguresSection() {
  const { t } = useLocale();
  const sectionRef = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || seen) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setSeen(true);
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [seen]);

  return (
    <section ref={sectionRef} className="w-full bg-[#FAF6F0] py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex justify-center mb-6">
          <div className="h-[2px] bg-[#FF4A3E]" style={{ width: seen ? "60px" : "0px", transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)" }} />
        </div>
        <h2 className="text-center font-serif text-3xl md:text-5xl tracking-wide mb-16 md:mb-20 text-gray-900" style={{ opacity: seen ? 1 : 0, transform: seen ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.8s ease-out, transform 0.8s ease-out" }}>
          {t("buy.figures_title_prefix")} <span className="text-[#FF4A3E]">2025</span>
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-14 md:gap-y-16 gap-x-8 md:gap-x-12 lg:gap-x-16">
          {BUY_KEY_FIGURES.map((fig, i) => (
            <BuyFigureItem key={i} fig={fig} index={i} active={seen} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Compteur avec rectangle animé ---------- */
function CounterBanner({ count }) {
  const { t } = useLocale();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

  return (
    <div ref={ref} className="w-full max-w-[1500px] 2xl:max-w-[1600px] mx-auto px-4 lg:px-6 pt-10 pb-2 flex justify-center">
      <div className="relative inline-flex items-baseline justify-center gap-3 md:gap-6 lg:gap-10 px-8 md:px-14 lg:px-20 py-5 md:py-8">

        {/* L haut-gauche : grandit depuis le coin */}
        <span
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width: "33%",
            height: "40%",
            borderTop: "1px solid #FF4A3E",
            borderLeft: "1px solid #FF4A3E",
            transformOrigin: "top left",
            transform: visible ? "scale(1)" : "scale(0)",
            transition: `transform 1.2s ${ease}`,
          }}
        />
        {/* L haut-droit : grandit depuis le coin */}
        <span
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: "33%",
            height: "40%",
            borderTop: "1px solid #FF4A3E",
            borderRight: "1px solid #FF4A3E",
            transformOrigin: "top right",
            transform: visible ? "scale(1)" : "scale(0)",
            transition: `transform 1.2s ${ease} 0.15s`,
          }}
        />
        {/* Trait bas centre : s'étend depuis le centre */}
        <span
          className="absolute bottom-0 left-1/2 pointer-events-none"
          style={{
            width: "50%",
            height: 0,
            borderBottom: "1px solid #FF4A3E",
            transformOrigin: "center",
            transform: visible ? "translateX(-50%) scaleX(1)" : "translateX(-50%) scaleX(0)",
            transition: `transform 1s ${ease} 0.3s`,
          }}
        />

        <span className="relative text-3xl md:text-4xl lg:text-5xl uppercase leading-none tracking-wide text-[#FF4A3E] font-medium">
          {count}
        </span>
        <span className="relative text-3xl md:text-4xl lg:text-5xl uppercase leading-none tracking-wide text-neutral-900 font-serif font-light">
          {count > 1 ? t("buy.counter_properties_other") : t("buy.counter_properties_one")}
        </span>
        <span className="relative text-3xl md:text-4xl lg:text-5xl uppercase leading-none tracking-wide text-neutral-900 font-serif font-light">
          {count > 1 ? t("buy.counter_available_other") : t("buy.counter_available_one")}
        </span>
      </div>
    </div>
  );
}

/* ---------- composant principal ---------- */
export default function BuyIntro() {
  const { t, link } = useLocale();
  const location = useLocation();
  const { data, loading } = useProperties();
  // Filtrage par statut : on exclut les vendus et suspendus de la grille principale
  const available = useMemo(() => data.filter(d =>
    !d.vendu && !hasTag(d, /vendu|suspendu|archiv/i)
  ), [data]);
  const vendus = useMemo(() => data.filter(d => d.vendu || hasTag(d, /vendu/i)), [data]);
  const facets = useMemo(() => deriveFacets(available), [available]);

  /* ---- Filtres & tri (système complet issu de Listings) ---- */
  const [filters, setFilters] = useState(() =>
    parseFiltersFromQS(location.search)
  );
  const [sort, setSort] = useState(() => parseSortFromQS(location.search));

  // Re-sync si l'URL change (back/forward)
  useEffect(() => {
    setFilters(parseFiltersFromQS(location.search));
    setSort(parseSortFromQS(location.search));
  }, [location.search]);

  const filtered = useMemo(
    () => sortItems(applyFilters(available, filters), sort),
    [available, filters, sort]
  );
  const isFiltered = hasActiveFilters(filters);

  // Split listings en deux moitiés pour intercaler la Maison de la semaine
  const splitIdx = Math.ceil(filtered.length / 2);
  const firstHalf = filtered.slice(0, splitIdx);
  const secondHalf = filtered.slice(splitIdx);

  /* ---- Scroll vers la grille ---- */
  const listingsRef = useRef(null);
  const scrollToListings = () => {
    listingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* sections data */
  const weekItem = useMemo(() => {
    const bySpotlight = available.find(
      (d) => String(d.spotlight || "").toLowerCase() === "xxl"
    );
    if (bySpotlight) return bySpotlight;
    const byTag = available.find((d) => hasTag(d, /feature|semaine|week/i));
    if (byTag) return byTag;
    return (
      [...available].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      )[0] || available[0]
    );
  }, [available]);

  /* reveals */
  const [weekRef, weekShown] = useRevealOnce({ threshold: 0.12 });
  const [procRef, procShown] = useRevealOnce();
  const [calcRef, calcShown] = useRevealOnce();
  const [alertsRef, alertsShown] = useRevealOnce();

  const [ready, setReady] = useState(false);
  const src = useMemo(() => {
    try {
      return pickVideoSrcSimple() || "/media/buy/hero24.mp4";
    } catch {
      return "/media/buy/hero24.mp4";
    }
  }, []);

  /* actions */
  const handleCreateAlert = async (payload) => {
    await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  return (
    <main className="min-h-screen text-[#0F1115] overflow-x-clip">
      {/* Vidéo de fond FIXÉE — ne scroll pas */}
      <div className="fixed inset-0" style={{ zIndex: 0 }}>
        <img
          src="/media/hero-poster.webp"
          alt=""
          width="1920"
          height="1080"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
          fetchpriority="high"
          decoding="async"
        />

        <video
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/hero-poster.webp"
          onLoadedData={() => setReady(true)}
          onCanPlay={() => setReady(true)}
          onError={(e) => console.warn("Video error", e)}
          aria-hidden="true"
        >
          <source
            src={src}
            type={src.endsWith(".webm") ? "video/webm" : "video/mp4"}
          />
          <source
            src={
              src.endsWith(".webm")
                ? src.replace(".webm", ".mp4")
                : src.replace(".mp4", ".webm")
            }
            type={src.endsWith(".webm") ? "video/mp4" : "video/webm"}
          />
        </video>

        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-transparent md:from-white/55 md:via-white/25 md:to-transparent" />
          <div className="absolute inset-0 md:bg-gradient-to-r md:from-white/55 md:via-white/25 md:to-transparent" />
        </div>
      </div>

      {/* 1) HERO — carré opaque avec parallax (scroll plus lent) */}
      <section className="relative min-h-[100svh] flex items-center overflow-x-clip" style={{ zIndex: 1 }}>
        <HeroContent scrollToListings={scrollToListings} />
      </section>

      {/* 2) FiltersBar + SortMenu + ListingGrid — passe par-dessus */}
      <section ref={listingsRef} className="relative bg-white pt-10 md:pt-14" style={{ zIndex: 2 }}>
        <div className="relative">
          <FiltersBar
            cities={facets.cities}
            cantons={facets.cantons}
            types={facets.types}
            features={facets.features}
            resultCount={filtered.length}
            onChange={setFilters}
            initialFilters={filters}
            sortValue={sort}
            onSortChange={setSort}
          />
        </div>

        {/* Compteur de biens disponibles */}
        <CounterBanner count={filtered.length} />

        {/* Première moitié des annonces */}
        <ListingGrid items={firstHalf} isFiltered={isFiltered} />
      </section>

      {/* 3) Maison de la semaine — au milieu des annonces */}
      <div
        className="relative bg-white"
        style={{ zIndex: 2 }}
      >
        <div
          ref={weekRef}
          className={`transition-all duration-[1000ms] ${
            weekShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
        <WeekCardV1
          item={weekItem}
          mode="split"
          bg="slideshow"
          bgOpacity={0.65}
          bgBlur={4}
          overlay="light"
          bgIntervalMs={9000}
        />
        </div>
      </div>

      {/* Seconde moitié des annonces */}
      {secondHalf.length > 0 && (
        <section className="relative bg-white" style={{ zIndex: 2 }}>
          <ListingGrid items={secondHalf} isFiltered={isFiltered} />
        </section>
      )}



      {/* 7) Process */}
      {/*
      <section
        ref={procRef}
        className={`relative py-24 bg-[#FAF6F0] transition-all duration-700 ${procShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <BeigeOrnament />
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <ProcessSteps
            steps={[
              {
                title: "Définir le besoin",
                desc: "Critères, zone, budget, priorités.",
              },
              {
                title: "Visiter",
                desc: "Créneaux en 48h, compte-rendu clair.",
              },
              { title: "Offrir", desc: "Comparables & analyse de prix." },
              { title: "Financer", desc: "Pré-accord indicatif 24/48h." },
              {
                title: "Signer",
                desc: "Accompagnement jusqu'à la remise des clés.",
              },
            ]}
            imageUrl="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600"
            onCallClick={() => {}}
          />
        </div>
      </section> */}

      {/* 8) Calculette */}
      {/*
      <section
        ref={calcRef}
        aria-label={t("buy.aria_tools_calc")}
        className={`relative py-24 bg-white transition-all duration-700 ${calcShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <ToolsBudgetCalc
            currency="CHF"
            defaultIncomeMonthly={9000}
            defaultDownPayment={200000}
            defaultRate={2.5}
            defaultYears={25}
            onSearch={(budgetMax) => {
              setFilters((prev) => ({
                ...prev,
                priceMax: String(Math.round(budgetMax)),
              }));
              scrollToListings();
            }}
          />
        </div>
      </section>
      */}

      {/* 9) Newsletter / Alertes */}

      {/*
      <section
        ref={alertsRef}
        className={`relative py-24 bg-white transition-all duration-700 ${alertsShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <ToolsAlerts
            zonesOptions={["Genève", "Coppet", "Nyon", "Lausanne", "Montreux"]}
            typeOptions={["Appartement", "Maison", "Villa", "Attique", "Loft"]}
            onCreateAlert={handleCreateAlert}
            defaultCollapsed={true}
          />
        </div>
      </section>
      */}

      {/* 10) Carousel biens vendus */}
      {vendus.length > 0 && (
        <section className="relative bg-white pt-16 md:pt-24" style={{ zIndex: 2 }}>
          <BandCarousel
            title={t("buy.already_sold")}
            items={vendus}
            renderItem={ListingCardSold}
          />
        </section>
      )}

      {/* 11) Chiffres clés (mêmes que page Qui est GARY) */}
      <div id="chiffres-cle" className="relative bg-white" style={{ zIndex: 2 }}>
        <KeyFiguresSection />
      </div>

      {/* 12) Pont vers VENTE */}
      <div className="relative" style={{ zIndex: 2 }}>
        <AlreadyOwner toEstimate={link("estimate")} toSell={link("sell")} />
      </div>
    </main>
  );
}
