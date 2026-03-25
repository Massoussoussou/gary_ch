// src/components/FiltersBar.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Filter, X, ChevronDown, RotateCcw, Search, Plus, Minus, SlidersHorizontal } from "lucide-react";
import { useLocale } from "../hooks/useLocale";

/* ---------------------------- Constantes & utils --------------------------- */

const ATOUTS_KEYS = [
  "jardin",
  "piscine",
  "vue",
  "garage",
  "parkingInterieur",
  "parkingExterieur",
  "cave",
  "balconTerrasse",
];

function norm(s = "") {
  return s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/* ----------------------------- Hooks utilitaires --------------------------- */

function useClickOutside(ref, handler) {
  useEffect(() => {
    const onDown = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) handler?.();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [ref, handler]);
}

/* ----------------------------- Composants UI ------------------------------ */

function Chip({ children, onClear, clearTitle }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="group inline-flex items-center gap-1 rounded-full border border-line/60 bg-bgAlt px-3 py-1 text-xs text-text hover:bg-white"
      title={clearTitle}
    >
      <span>{children}</span>
      <X className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100" />
    </button>
  );
}

function TinyButton({ active, children, className = "", ...rest }) {
  return (
    <button
      type="button"
      {...rest}
      className={`relative inline-flex h-16 md:h-[4.5rem] items-center justify-center gap-2 border px-5 md:px-7 text-[15px] md:text-base ${
        active
          ? "border-[#FF4A3E]/50 bg-[#FF4A3E]/5 text-[#FF4A3E] shadow-[0_0_0_1px_rgba(0,0,0,0.02)]"
          : "border-line/70 bg-white text-text"
      } hover:bg-bgAlt/80 transition-colors ${className}`}
    >
      <span className="truncate font-medium tracking-[0.01em]">{children}</span>
      <ChevronDown
        className={`h-4 w-4 opacity-70 transition-transform ${
          active ? "-rotate-180" : ""
        }`}
      />
    </button>
  );
}

function Stepper({ value = 0, onChange, min = 0, max = 10, className = "", size = "md", label, decreaseLabel, increaseLabel }) {
  const h = size === "sm" ? "h-10" : "h-12";
  const text = size === "sm" ? "text-sm" : "text-base";
  const v = Number.isFinite(+value) ? +value : 0;
  const set = (v2) => onChange?.(Math.max(min, Math.min(max, v2)));

  return (
    <div className={`space-y-3 ${className}`}>
      {label && <label className="text-sm font-medium text-text/80 block">{label}</label>}
      <div className={`inline-flex items-center border border-line/70 bg-white ${h}`}>
        <button
          type="button"
          onClick={() => set(v - 1)}
          disabled={v <= min}
          className="h-full aspect-square inline-grid place-items-center border-r border-line/60 disabled:opacity-40"
          aria-label={decreaseLabel || label || ""}
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className={`px-4 grow ${text} text-center select-none tabular-nums`}>{v}</div>
        <button
          type="button"
          onClick={() => set(v + 1)}
          disabled={v >= max}
          className="h-full aspect-square inline-grid place-items-center border-l border-line/60 disabled:opacity-40"
          aria-label={increaseLabel || label || ""}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Popover({ open, onClose, children, className = "" }) {
  const popRef = useRef(null);
  useClickOutside(popRef, onClose);
  if (!open) return null;
  return (
    <div
      ref={popRef}
      className={`absolute left-0 top-full z-30 mt-2 w-[min(92vw,36rem)] border border-line/70 bg-white p-3 shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}

function CityAutosuggest({ options = [], value, onChange, placeholder, noCityLabel, clearTitle, searchLabel }) {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const list = useMemo(() => {
    const q = norm(query);
    if (!q) return options;
    return options.filter((v) => norm(v).includes(q));
  }, [options, query]);

  useClickOutside(wrapRef, () => setOpen(false));

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  const selectCity = (v) => {
    onChange?.(v);
    setQuery(v);
    setOpen(false);
  };

  const noResult = norm(query) && list.length === 0;

  return (
    <div className="relative" ref={wrapRef}>
      <div className="h-12 md:h-14 flex items-center gap-2 border border-line/70 bg-white px-4 md:px-5">
        <Search className="h-4 w-4 opacity-60" />
        <input
          className="w-full outline-none text-[15px] md:text-[16px]"
          value={query}
          placeholder={placeholder}
          aria-label={searchLabel}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              onChange?.("");
              setOpen(false);
            }}
            className="text-xs text-text/60 hover:text-text"
            title={clearTitle}
          >
            ×
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-30 mt-1 w-full border border-line/70 bg-white shadow-md">
          {noResult ? (
            <div className="px-3 py-2 text-sm text-red-600">{noCityLabel}</div>
          ) : (
            <ul className="max-h-56 overflow-auto text-sm">
              {list.map((v) => (
                <li key={v}>
                  <button
                    type="button"
                    onClick={() => selectCity(v)}
                    className={`w-full text-left px-3 py-2 hover:bg-bgAlt ${
                      v === value ? "bg-bgAlt" : ""
                    }`}
                  >
                    {v}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------------- Modal pour les filtres avancés --------------------- */

function AdvancedModal({ open, onClose, children, activeCount = 0, onReset, labels = {} }) {
  const panelRef = useRef(null);
  useClickOutside(panelRef, onClose);

  // Lock body scroll + pause Lenis when modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (window.__lenis) window.__lenis.stop();
    return () => {
      document.body.style.overflow = prev;
      if (window.__lenis) window.__lenis.start();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[120]" data-lenis-prevent style={{ overscrollBehavior: "contain" }}>
      {/* Overlay — click to close */}
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none">
        <div
          ref={panelRef}
          className="w-full max-w-3xl max-h-[85vh] rounded-2xl bg-white shadow-2xl ring-1 ring-black/[0.06] flex flex-col pointer-events-auto"
          style={{
            animation: "modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header — fixe */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-neutral-100 rounded-t-2xl">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900">{labels.title || "Filtres"} <span className="text-[#FF4A3E]">{labels.titleAccent || "avancés"}</span></h2>
              <p className="mt-1 text-sm text-neutral-400">
                {labels.subtitle || ""}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 rounded-full border border-neutral-200 inline-flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition-colors"
              aria-label={labels.closeAdvanced || "Close"}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Contenu — scrollable */}
          <div
            className="flex-1 min-h-0 px-6 py-5"
            style={{ overflowY: "auto", overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" }}
          >
            {children}
          </div>

          {/* Footer — fixe */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-t border-neutral-100 bg-neutral-50/60 rounded-b-2xl">
            <span className="text-sm text-neutral-500">
              {activeCount > 0
                ? labels.activeFilters?.(activeCount) || `${activeCount} active`
                : labels.noAdvancedFilter || ""}
            </span>
            <div className="flex items-center gap-2">
              {onReset && activeCount > 0 && (
                <button
                  type="button"
                  onClick={onReset}
                  className="h-11 px-5 rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <RotateCcw className="h-3.5 w-3.5" />
                    {labels.reset || "Reset"}
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-6 rounded-lg bg-neutral-900 text-white text-sm font-semibold hover:bg-[#FF4A3E] transition-colors"
              >
                {labels.apply || "Apply"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ------------------------------- Filtres bar ------------------------------- */

export default function FiltersBar({
  cities = [],
  cantons = [],
  types = [],
  features = [],
  resultCount = 0,
  onChange,
  initialFilters = {},
  sortValue,
  onSortChange,
}) {
  const { t } = useLocale();

  const ATOUTS_LIST = useMemo(() => ATOUTS_KEYS.map((key) => ({
    key,
    label: t(`filters.atout_${key}`),
  })), [t]);

  const [openKey, setOpenKey] = useState(null); // 'ville' | 'type' | 'budget' | 'chambres' | 'surface'
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [barRevealed, setBarRevealed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);
  const [showStickyBtn, setShowStickyBtn] = useState(false);
  const [reachedBottom, setReachedBottom] = useState(false);
  const sectionAnchorRef = useRef(null);

  // Animate mobile panel open/close
  const openMobile = () => {
    setMobileOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setMobileVisible(true)));
  };
  const closeMobile = () => {
    setMobileVisible(false);
    setTimeout(() => setMobileOpen(false), 350);
  };

  // Lock body scroll when mobile panel is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  // Show sticky button only after scrolling past the hero (i.e. when this section enters viewport)
  useEffect(() => {
    const el = sectionAnchorRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setShowStickyBtn(entry.isIntersecting || entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Hide sticky button when reaching the bottom boundary (chiffres clé / TrustStrip)
  useEffect(() => {
    const el = document.getElementById("chiffres-cle");
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setReachedBottom(entry.isIntersecting || entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setBarRevealed(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Filtres principaux
  const [city, setCity] = useState(initialFilters.city || "");
  const [type, setType] = useState(initialFilters.type || "");
  const [priceMin, setPriceMin] = useState(initialFilters.priceMin || "");
  const [priceMax, setPriceMax] = useState(initialFilters.priceMax || "");
  const [chambresMin, setChambresMin] = useState(initialFilters.chambresMin || "");
  const [sdbMin, setSdbMin] = useState(initialFilters.sdbMin || "");
  const [surfaceMin, setSurfaceMin] = useState(initialFilters.surfaceMin || "");
  const [surfaceMax, setSurfaceMax] = useState(initialFilters.surfaceMax || "");

  // Avancés
  const [canton, setCanton] = useState(initialFilters.canton || "");
  const [meuble, setMeuble] = useState(initialFilters.meuble || false);
  const [dispoBefore, setDispoBefore] = useState(initialFilters.dispoBefore || "");
  const [terrainMin, setTerrainMin] = useState(initialFilters.terrainMin || "");
  const [atouts, setAtouts] = useState(() => {
    const base = Object.fromEntries(ATOUTS_KEYS.map((k) => [k, false]));
    if (initialFilters.atouts) Object.assign(base, initialFilters.atouts);
    return base;
  });
  const [extraFeatures, setExtraFeatures] = useState(initialFilters.extraFeatures || []);

  // Remontée au parent (shape identique à avant)
  useEffect(() => {
    onChange?.({
      city,
      type,
      priceMin,
      priceMax,
      piecesMin: "",
      surfaceMin,
      surfaceMax,
      canton,
      chambresMin,
      sdbMin,
      meuble,
      dispoBefore,
      terrainMin,
      atouts,
      extraFeatures,
    });
  }, [
    city,
    type,
    priceMin,
    priceMax,
    surfaceMin,
    surfaceMax,
    canton,
    chambresMin,
    sdbMin,
    meuble,
    dispoBefore,
    terrainMin,
    atouts,
    extraFeatures,
    onChange,
  ]);

  // Chips actifs
  const chips = useMemo(() => {
    const arr = [];
    if (city) arr.push({ k: "city", label: `${t("filters.city")}: ${city}` });
    if (type) arr.push({ k: "type", label: `${t("filters.type")}: ${type}` });
    if (priceMin) arr.push({ k: "priceMin", label: `≥ ${priceMin} CHF` });
    if (priceMax) arr.push({ k: "priceMax", label: `≤ ${priceMax} CHF` });
    if (surfaceMin) arr.push({ k: "surfaceMin", label: `≥ ${surfaceMin} m²` });
    if (surfaceMax) arr.push({ k: "surfaceMax", label: `≤ ${surfaceMax} m²` });
    if (chambresMin) arr.push({ k: "chambresMin", label: `≥ ${chambresMin} ${t("filters.bedrooms_abbr")}` });
    if (sdbMin) arr.push({ k: "sdbMin", label: `≥ ${sdbMin} ${t("filters.bathrooms_abbr")}` });
    if (canton) arr.push({ k: "canton", label: `${t("filters.canton")}: ${canton}` });
    if (terrainMin) arr.push({ k: "terrainMin", label: `${t("filters.land")} ≥ ${terrainMin} m²` });
    if (meuble) arr.push({ k: "meuble", label: t("filters.furnished") });
    if (dispoBefore) arr.push({ k: "dispoBefore", label: `${t("filters.available_before")}: ${dispoBefore}` });
    ATOUTS_LIST.forEach(
      ({ key, label }) => atouts[key] && arr.push({ k: `atout:${key}`, label })
    );
    extraFeatures.forEach((f) => arr.push({ k: `feat:${f}`, label: f }));
    return arr;
  }, [
    city,
    type,
    priceMin,
    priceMax,
    surfaceMin,
    surfaceMax,
    chambresMin,
    sdbMin,
    canton,
    terrainMin,
    meuble,
    dispoBefore,
    atouts,
    extraFeatures,
    t,
    ATOUTS_LIST,
  ]);

  const advancedCount = useMemo(
    () =>
      chips.filter(
        (c) =>
          !["city", "type", "priceMin", "priceMax"].includes(c.k)
      ).length,
    [chips]
  );

  function resetAll() {
    setCity("");
    setType("");
    setPriceMin("");
    setPriceMax("");
    setSurfaceMin("");
    setSurfaceMax("");
    setChambresMin("");
    setSdbMin("");
    setCanton("");
    setMeuble(false);
    setDispoBefore("");
    setTerrainMin("");
    setAtouts(Object.fromEntries(ATOUTS_KEYS.map((k) => [k, false])));
    setExtraFeatures([]);
    setOpenKey(null);
  }

  function clearChip(k) {
    if (k === "city") setCity("");
    else if (k === "type") setType("");
    else if (k === "priceMin") setPriceMin("");
    else if (k === "priceMax") setPriceMax("");
    else if (k === "surfaceMin") setSurfaceMin("");
    else if (k === "surfaceMax") setSurfaceMax("");
    else if (k === "chambresMin") setChambresMin("");
    else if (k === "sdbMin") setSdbMin("");
    else if (k === "canton") setCanton("");
    else if (k === "terrainMin") setTerrainMin("");
    else if (k === "meuble") setMeuble(false);
    else if (k === "dispoBefore") setDispoBefore("");
    else if (k.startsWith("atout:"))
      setAtouts((prev) => ({ ...prev, [k.split(":")[1]]: false }));
    else if (k.startsWith("feat:"))
      setExtraFeatures((prev) => prev.filter((x) => x !== k.split(":")[1]));
  }

  /* --------------------------------- Render -------------------------------- */

  /* Contenu des filtres (partagé entre mobile panel et desktop advanced modal) */
  const filtersContent = (
    <div className="grid gap-5">
      {/* Ville */}
      <div>
        <label className="text-[13px] uppercase tracking-[0.14em] font-semibold text-[#FF4A3E] mb-2 block">{t("filters.city")}</label>
        <CityAutosuggest
          options={cities}
          value={city}
          onChange={setCity}
          placeholder={t("filters.search_city")}
          noCityLabel={t("filters.no_city_found")}
          clearTitle={t("filters.clear")}
          searchLabel={t("filters.search_city")}
        />
      </div>

      {/* Type de bien */}
      <div>
        <label className="text-[13px] uppercase tracking-[0.14em] font-semibold text-[#FF4A3E] mb-2 block">{t("filters.property_type")}</label>
        <div className="grid grid-cols-2 gap-2">
          {types.map((tp) => (
            <button
              type="button"
              key={tp}
              onClick={() => setType((prev) => (tp === prev ? "" : tp))}
              className={`border px-4 py-3 text-sm text-left transition-colors ${
                tp === type
                  ? "border-[#FF4A3E] bg-[#FF4A3E]/5 text-[#FF4A3E]"
                  : "border-neutral-200 bg-white hover:bg-neutral-50"
              }`}
            >
              {tp}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="text-[13px] uppercase tracking-[0.14em] font-semibold text-[#FF4A3E] mb-2 block">{t("filters.budget")}</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            inputMode="numeric"
            placeholder={t("filters.min_chf")}
            aria-label={t("filters.aria_budget_min")}
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="h-12 w-full border border-neutral-200 bg-white px-4 text-[15px]"
          />
          <input
            inputMode="numeric"
            placeholder={t("filters.max_chf")}
            aria-label={t("filters.aria_budget_max")}
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="h-12 w-full border border-neutral-200 bg-white px-4 text-[15px]"
          />
        </div>
      </div>

      {/* Chambres & SDB */}
      <div>
        <label className="text-[13px] uppercase tracking-[0.14em] font-semibold text-[#FF4A3E] mb-4 block">{t("filters.bedrooms_bathrooms")}</label>
        <div className="grid gap-6">
          <Stepper label={t("filters.bedrooms_min")} value={Number(chambresMin || 0)} onChange={(v) => setChambresMin(String(v))} min={0} max={10} />
          <Stepper label={t("filters.bathrooms_min")} value={Number(sdbMin || 0)} onChange={(v) => setSdbMin(String(v))} min={0} max={10} />
        </div>
      </div>

      {/* Surface */}
      <div>
        <label className="text-[13px] uppercase tracking-[0.14em] font-semibold text-[#FF4A3E] mb-2 block">{t("filters.surface")}</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            inputMode="numeric"
            placeholder={t("filters.min_sqm")}
            aria-label={t("filters.aria_surface_min")}
            value={surfaceMin}
            onChange={(e) => setSurfaceMin(e.target.value)}
            className="h-12 w-full border border-neutral-200 bg-white px-4 text-[15px]"
          />
          <input
            inputMode="numeric"
            placeholder={t("filters.max_sqm")}
            aria-label={t("filters.aria_surface_max")}
            value={surfaceMax}
            onChange={(e) => setSurfaceMax(e.target.value)}
            className="h-12 w-full border border-neutral-200 bg-white px-4 text-[15px]"
          />
        </div>
      </div>

      {/* Canton */}
      <div>
        <label className="text-[13px] uppercase tracking-[0.14em] font-semibold text-[#FF4A3E] mb-2 block">{t("filters.canton")}</label>
        <select
          value={canton}
          onChange={(e) => setCanton(e.target.value)}
          className="h-12 w-full border border-neutral-200 bg-white px-4 text-[15px]"
        >
          <option value="">{t("filters.all")}</option>
          {cantons.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Atouts */}
      <div>
        <label className="text-[13px] uppercase tracking-[0.14em] font-semibold text-[#FF4A3E] mb-2 block">{t("filters.amenities")}</label>
        <div className="flex flex-wrap gap-2">
          {ATOUTS_LIST.map((a) => {
            const active = !!atouts[a.key];
            return (
              <button
                type="button"
                key={a.key}
                onClick={() => setAtouts((prev) => ({ ...prev, [a.key]: !prev[a.key] }))}
                className={`rounded-full px-4 py-2 text-sm border transition-colors ${
                  active
                    ? "border-[#FF4A3E] bg-[#FF4A3E]/10 text-[#FF4A3E]"
                    : "border-neutral-200 bg-white hover:bg-neutral-50"
                }`}
              >
                {a.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <section ref={sectionAnchorRef} className="mt-6 mb-10 lg:mt-8 lg:mb-14">

      {/* ========================
          MOBILE / TABLETTE (<lg)
          Bouton sticky en bas
         ======================== */}
      <div className="lg:hidden">
        {/* Chips visibles en mobile aussi */}
        {chips.length > 0 && (
          <div className="px-4 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              {chips.map((c) => (
                <Chip key={c.k} onClear={() => clearChip(c.k)} clearTitle={t("filters.remove_filter")}>
                  {c.label}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bouton sticky mobile/tablette — en portal pour rester au-dessus de tout */}
      {!mobileOpen && createPortal(
        <div
          className={`
            filters-sticky-btn lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto
            transition-all duration-300 ease-out
            ${showStickyBtn && !reachedBottom
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6 pointer-events-none"
            }
          `}
        >
          <button
            type="button"
            onClick={openMobile}
            className="
              inline-flex items-center gap-3
              bg-neutral-900 text-white
              pl-6 pr-5 py-4
              rounded-full
              shadow-[0_8px_32px_rgba(0,0,0,0.3)]
              active:scale-[0.97] transition-transform
            "
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span className="text-[13px] font-semibold uppercase tracking-[0.12em]">
              {t("filters.title")}
            </span>
            {chips.length > 0 && (
              <span className="bg-[#FF4A3E] text-white text-[11px] font-bold rounded-full h-5 min-w-[20px] inline-flex items-center justify-center px-1.5">
                {chips.length}
              </span>
            )}
          </button>
        </div>,
        document.body
      )}

      {/* Panneau full-screen mobile/tablette — animé slide-up */}
      {mobileOpen && createPortal(
        <div className="fixed inset-0 z-[200] lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/30 transition-opacity duration-300"
            style={{ opacity: mobileVisible ? 1 : 0 }}
            onClick={closeMobile}
          />
          {/* Panel */}
          <div
            className="absolute inset-0 flex flex-col bg-white transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: mobileVisible ? "translateY(0)" : "translateY(100%)",
              transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
              <div>
                <h2 className="text-base font-semibold tracking-tight">{t("filters.title")}</h2>
                <p className="text-[12px] text-neutral-500 mt-0.5">
                  {resultCount} {t("filters.listings")} {t("filters.available")}
                </p>
              </div>
              <button
                type="button"
                onClick={closeMobile}
                className="h-10 w-10 rounded-full border border-neutral-200 inline-flex items-center justify-center hover:bg-neutral-50"
                aria-label={t("filters.close_filters")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Contenu scrollable */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {filtersContent}
            </div>

            {/* Footer sticky */}
            <div className="border-t border-neutral-200 px-5 py-4 flex gap-3" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
              <button
                type="button"
                onClick={resetAll}
                className="flex-1 h-14 border border-neutral-200 text-neutral-900 text-[13px] uppercase tracking-[0.12em] font-medium hover:bg-neutral-50 transition-colors"
              >
                {t("filters.reset")}
              </button>
              <button
                type="button"
                onClick={closeMobile}
                className="flex-[2] h-14 bg-neutral-900 text-white text-[13px] uppercase tracking-[0.12em] font-semibold hover:bg-[#FF4A3E] transition-colors"
              >
                {t("filters.see")} {resultCount} {t("filters.listings")}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================
          DESKTOP (>=lg)
          Barre classique
         ======================== */}
      <div className="hidden lg:block max-w-7xl mx-auto px-4">
        {/* Carte principale : rectangulaire, animation du centre vers les côtés */}
        <div
          className="relative z-[10] border border-line/60 bg-[#F5F0EB] shadow-xl ring-1 ring-black/5"
          style={{
            transform: barRevealed ? "scaleX(1)" : "scaleX(0)",
            opacity: barRevealed ? 1 : 0,
            transformOrigin: "center",
            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease",
          }}
        >
          <div className="px-5 py-5 md:px-6 md:py-6 flex flex-nowrap items-center gap-3">
            {/* Boutons principaux */}
            <div className="flex items-center gap-2 flex-nowrap">
              {/* Ville */}
              <div className="relative">
                <TinyButton
                  active={openKey === "ville" || !!city}
                  onClick={() => setOpenKey((k) => (k === "ville" ? null : "ville"))}
                  className="max-w-[220px]"
                >
                  <span className="truncate">{city || t("filters.city")}</span>
                </TinyButton>
                <Popover open={openKey === "ville"} onClose={() => setOpenKey(null)}>
                  <CityAutosuggest
                    options={cities}
                    value={city}
                    onChange={setCity}
                    placeholder={t("filters.search_city")}
                    noCityLabel={t("filters.no_city_found")}
                    clearTitle={t("filters.clear")}
                    searchLabel={t("filters.search_city")}
                  />
                </Popover>
              </div>

              {/* Type */}
              <div className="relative">
                <TinyButton
                  active={openKey === "type" || !!type}
                  onClick={() => setOpenKey((k) => (k === "type" ? null : "type"))}
                  aria-label={t("filters.property_type")}
                >
                  {type || t("filters.type")}
                </TinyButton>
                <Popover open={openKey === "type"} onClose={() => setOpenKey(null)}>
                  <div className="grid grid-cols-2 gap-2">
                    {types.map((tp) => (
                      <button
                        type="button"
                        key={tp}
                        onClick={() => {
                          setType((prev) => (tp === prev ? "" : tp));
                          setOpenKey(null);
                        }}
                        className={`border px-3 py-2 text-sm text-left ${
                          tp === type
                            ? "border-primary/60 bg-primary/5 text-primary"
                            : "border-line/70 hover:bg-bgAlt"
                        }`}
                      >
                        {tp}
                      </button>
                    ))}
                  </div>
                </Popover>
              </div>

              {/* Budget */}
              <div className="relative">
                <TinyButton
                  active={openKey === "budget" || priceMin || priceMax}
                  onClick={() => setOpenKey((k) => (k === "budget" ? null : "budget"))}
                >
                  {t("filters.budget")}
                </TinyButton>
                <Popover open={openKey === "budget"} onClose={() => setOpenKey(null)}>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      inputMode="numeric"
                      placeholder="Min"
                      aria-label={t("filters.aria_budget_min")}
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      className="h-12 w-full border border-line/70 bg-white px-3"
                    />
                    <div className="flex gap-2">
                      <input
                        inputMode="numeric"
                        placeholder="Max"
                        aria-label={t("filters.aria_budget_max")}
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="h-12 w-full border border-line/70 bg-white px-3"
                      />
                      <div className="inline-flex h-12 items-center border border-line/70 bg-white px-3 text-sm">
                        CHF
                      </div>
                    </div>
                  </div>
                </Popover>
              </div>

              {/* Chambres & SDB */}
              <div className="relative">
                <TinyButton
                  active={openKey === "chambres" || chambresMin || sdbMin}
                  onClick={() =>
                    setOpenKey((k) => (k === "chambres" ? null : "chambres"))
                  }
                >
                  {t("filters.bedrooms_bathrooms")}
                </TinyButton>
                <Popover open={openKey === "chambres"} onClose={() => setOpenKey(null)}>
                  <div className="grid grid-cols-2 gap-3">
                    <Stepper
                      label={t("filters.bedrooms_min")}
                      value={Number(chambresMin || 0)}
                      onChange={(v) => setChambresMin(String(v))}
                      min={0}
                      max={10}
                    />
                    <Stepper
                      label={t("filters.bathrooms_min")}
                      value={Number(sdbMin || 0)}
                      onChange={(v) => setSdbMin(String(v))}
                      min={0}
                      max={10}
                    />
                  </div>
                </Popover>
              </div>

              {/* Surface */}
              <div className="relative">
                <TinyButton
                  active={openKey === "surface" || surfaceMin || surfaceMax}
                  onClick={() => setOpenKey((k) => (k === "surface" ? null : "surface"))}
                >
                  {t("filters.surface_short")}
                </TinyButton>
                <Popover open={openKey === "surface"} onClose={() => setOpenKey(null)}>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      inputMode="numeric"
                      placeholder={`Min (m²)`}
                      aria-label={t("filters.aria_surface_min")}
                      value={surfaceMin}
                      onChange={(e) => setSurfaceMin(e.target.value)}
                      className="h-12 w-full border border-line/70 bg-white px-3"
                    />
                    <input
                      inputMode="numeric"
                      placeholder={`Max (m²)`}
                      aria-label={t("filters.aria_surface_max")}
                      value={surfaceMax}
                      onChange={(e) => setSurfaceMax(e.target.value)}
                      className="h-12 w-full border border-line/70 bg-white px-3"
                    />
                  </div>
                </Popover>
              </div>
            </div>

            {/* Côté droit : Avancés + n annonces + Reset */}
            <div className="ml-auto flex items-center gap-3 shrink-0">
              <button
                type="button"
                className="inline-flex h-16 md:h-[4.5rem] items-center justify-center gap-2 border border-[#FF4A3E] bg-[#FF4A3E] text-white px-5 md:px-6 text-[15px] md:text-base hover:bg-[#e8423a] transition-colors"
                onClick={() => setAdvancedOpen(true)}
                aria-expanded={advancedOpen}
              >
                <Filter className="h-4 w-4" />
                <span className="font-medium">{t("filters.advanced")}</span>
                {advancedCount > 0 && (
                  <span className="text-xs rounded-full bg-white/25 text-white px-2 py-0.5">
                    {advancedCount}
                  </span>
                )}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    advancedOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {onSortChange && (
                <div className="relative">
                  <TinyButton
                    active={openKey === "tri"}
                    onClick={() => setOpenKey((k) => (k === "tri" ? null : "tri"))}
                  >
                    {t("filters.sort")}
                  </TinyButton>
                  <Popover open={openKey === "tri"} onClose={() => setOpenKey(null)}>
                    <div className="flex flex-col gap-1 min-w-[180px]">
                      {[
                        { value: "recent", label: t("filters.sort_recent") },
                        { value: "prix-asc", label: t("filters.sort_price_asc") },
                        { value: "prix-desc", label: t("filters.sort_price_desc") },
                        { value: "surface", label: t("filters.surface") },
                      ].map((opt) => (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => { onSortChange(opt.value); setOpenKey(null); }}
                          className={`text-left px-3 py-2 text-sm ${
                            sortValue === opt.value
                              ? "border border-primary/60 bg-primary/5 text-primary"
                              : "border border-transparent hover:bg-bgAlt"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </Popover>
                </div>
              )}

              <button
                type="button"
                className="inline-flex h-16 md:h-[4.5rem] items-center justify-center gap-2 border border-[#FF4A3E]/30 bg-[#FF4A3E]/5 text-[#FF4A3E] px-5 md:px-6 text-[15px] md:text-base hover:bg-[#FF4A3E]/10 transition-colors"
                onClick={resetAll}
                title={t("filters.reset_all")}
              >
                <RotateCcw className="h-4 w-4" />
                <span className="font-medium">Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chips sous la barre */}
        {chips.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 mt-2">
            <div className="flex items-center gap-2 flex-wrap">
              {chips.map((c) => (
                <Chip key={c.k} onClear={() => clearChip(c.k)} clearTitle={t("filters.remove_filter")}>
                  {c.label}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL Filtres avancés (desktop only) */}
      <AdvancedModal
        open={advancedOpen}
        onClose={() => setAdvancedOpen(false)}
        activeCount={advancedCount}
        onReset={resetAll}
        labels={{
          title: t("filters.title"),
          titleAccent: t("filters.advanced"),
          subtitle: t("filters.advanced_subtitle"),
          closeAdvanced: t("filters.close_advanced"),
          noAdvancedFilter: t("filters.no_advanced_filter"),
          activeFilters: (count) => t("filters.active_filters", { count }),
          reset: t("filters.reset"),
          apply: t("filters.apply"),
        }}
      >
        <div className="space-y-6">
          {/* ── Section 1 : Localisation & Disponibilité ── */}
          <div>
            <h3 className="text-[13px] uppercase tracking-[0.14em] font-semibold text-[#FF4A3E] mb-4">
              {t("filters.location_availability")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700">{t("filters.canton")}</label>
                <select
                  value={canton}
                  onChange={(e) => setCanton(e.target.value)}
                  className="h-12 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[15px] text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#FF4A3E]/20 focus:border-[#FF4A3E]/40 transition-shadow"
                >
                  <option value="">{t("filters.all_cantons")}</option>
                  {cantons.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700">{t("filters.available_before")}</label>
                <input
                  type="date"
                  value={dispoBefore}
                  onChange={(e) => setDispoBefore(e.target.value)}
                  className="h-12 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[15px] text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#FF4A3E]/20 focus:border-[#FF4A3E]/40 transition-shadow"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-[#FF4A3E]/15" />

          {/* ── Section 2 : Caractéristiques ── */}
          <div>
            <h3 className="text-[13px] uppercase tracking-[0.14em] font-semibold text-[#FF4A3E] mb-4">
              {t("filters.characteristics")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <Stepper
                  size="sm"
                  label={t("filters.bedrooms_min")}
                  value={Number(chambresMin || 0)}
                  onChange={(v) => setChambresMin(String(v))}
                  min={0}
                  max={10}
                />
              </div>
              <div>
                <Stepper
                  size="sm"
                  label={t("filters.bathrooms_min")}
                  value={Number(sdbMin || 0)}
                  onChange={(v) => setSdbMin(String(v))}
                  min={0}
                  max={10}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700">{t("filters.surface_min_sqm")}</label>
                <input
                  inputMode="numeric"
                  value={surfaceMin}
                  onChange={(e) => setSurfaceMin(e.target.value)}
                  placeholder="—"
                  className="h-12 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[15px] text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#FF4A3E]/20 focus:border-[#FF4A3E]/40 transition-shadow"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700">{t("filters.surface_max_sqm")}</label>
                <input
                  inputMode="numeric"
                  value={surfaceMax}
                  onChange={(e) => setSurfaceMax(e.target.value)}
                  placeholder="—"
                  className="h-12 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[15px] text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#FF4A3E]/20 focus:border-[#FF4A3E]/40 transition-shadow"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700">{t("filters.land_min_sqm")}</label>
                <input
                  inputMode="numeric"
                  value={terrainMin}
                  onChange={(e) => setTerrainMin(e.target.value)}
                  placeholder="—"
                  className="h-12 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[15px] text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#FF4A3E]/20 focus:border-[#FF4A3E]/40 transition-shadow"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700">{t("filters.furnished")}</label>
                <button
                  type="button"
                  onClick={() => setMeuble((m) => !m)}
                  className={`w-full h-12 rounded-lg border px-3 text-[15px] transition-all ${
                    meuble
                      ? "border-[#FF4A3E]/40 bg-[#FF4A3E]/5 text-[#FF4A3E] font-medium"
                      : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {meuble ? t("filters.furnished_only") : t("filters.indifferent")}
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-[#FF4A3E]/15" />

          {/* ── Section 3 : Atouts & Équipements ── */}
          <div>
            <h3 className="text-[13px] uppercase tracking-[0.14em] font-semibold text-[#FF4A3E] mb-4">
              {t("filters.amenities_equipment")}
            </h3>

            {/* Atouts */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-sm font-medium text-neutral-700">{t("filters.amenities")}</span>
                {Object.values(atouts).filter(Boolean).length > 0 && (
                  <span className="text-[13px] text-neutral-400">
                    {Object.values(atouts).filter(Boolean).length} {t("filters.selected")}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {ATOUTS_LIST.map((a) => {
                  const active = !!atouts[a.key];
                  return (
                    <button
                      type="button"
                      key={a.key}
                      onClick={() =>
                        setAtouts((prev) => ({ ...prev, [a.key]: !prev[a.key] }))
                      }
                      className={`rounded-full px-4 py-2.5 text-sm border transition-all duration-150 ${
                        active
                          ? "border-[#FF4A3E] bg-[#FF4A3E]/8 text-[#FF4A3E] font-medium shadow-[0_0_0_1px_rgba(255,74,62,0.15)]"
                          : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300"
                      }`}
                    >
                      {a.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Équipements */}
            {features.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm font-medium text-neutral-700">{t("filters.equipment")}</span>
                  {extraFeatures.length > 0 && (
                    <span className="text-[13px] text-neutral-400">
                      {extraFeatures.length} {t("filters.selected")}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {features.map((f) => {
                    const active = extraFeatures.includes(f);
                    return (
                      <button
                        type="button"
                        key={f}
                        onClick={() =>
                          setExtraFeatures((prev) =>
                            active ? prev.filter((x) => x !== f) : [...prev, f]
                          )
                        }
                        className={`rounded-full border px-4 py-2 text-[13px] transition-all duration-150 ${
                          active
                            ? "border-[#FF4A3E] bg-[#FF4A3E]/8 text-[#FF4A3E] font-medium shadow-[0_0_0_1px_rgba(255,74,62,0.15)]"
                            : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300"
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </AdvancedModal>
    </section>
  );
}
