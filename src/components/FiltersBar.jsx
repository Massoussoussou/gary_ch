// src/components/FiltersBar.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Filter, X, ChevronDown, RotateCcw, Search, Plus, Minus, SlidersHorizontal } from "lucide-react";

/* ---------------------------- Constantes & utils --------------------------- */

const ATOUTS_LIST = [
  { key: "jardin", label: "Jardin" },
  { key: "piscine", label: "Piscine" },
  { key: "vue", label: "Vue d’exception" },
  { key: "garage", label: "Garage" },
  { key: "parkingInterieur", label: "Parking intérieur" },
  { key: "parkingExterieur", label: "Parking extérieur" },
  { key: "cave", label: "Cave" },
  { key: "balconTerrasse", label: "Balcon / Terrasse" },
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

function Chip({ children, onClear }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="group inline-flex items-center gap-1 rounded-full border border-line/60 bg-bgAlt px-3 py-1 text-xs text-text hover:bg-white"
      title="Retirer ce filtre"
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

function Stepper({ value = 0, onChange, min = 0, max = 10, className = "", size = "md", label }) {
  const h = size === "sm" ? "h-10" : "h-12";
  const text = size === "sm" ? "text-sm" : "text-base";
  const v = Number.isFinite(+value) ? +value : 0;
  const set = (v2) => onChange?.(Math.max(min, Math.min(max, v2)));

  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="text-xs text-text/70">{label}</label>}
      <div className={`inline-flex items-center border border-line/70 bg-white ${h}`}>
        <button
          type="button"
          onClick={() => set(v - 1)}
          disabled={v <= min}
          className="h-full aspect-square inline-grid place-items-center border-r border-line/60 disabled:opacity-40"
          aria-label={`Diminuer ${label || ""}`}
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className={`px-4 grow ${text} text-center select-none tabular-nums`}>{v}</div>
        <button
          type="button"
          onClick={() => set(v + 1)}
          disabled={v >= max}
          className="h-full aspect-square inline-grid place-items-center border-l border-line/60 disabled:opacity-40"
          aria-label={`Augmenter ${label || ""}`}
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

function CityAutosuggest({ options = [], value, onChange, placeholder = "Ville" }) {
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
            title="Effacer"
          >
            ×
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-30 mt-1 w-full border border-line/70 bg-white shadow-md">
          {noResult ? (
            <div className="px-3 py-2 text-sm text-red-600">Cette ville n’est pas disponible</div>
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

function AdvancedModal({ open, onClose, children, activeCount = 0 }) {
  const panelRef = useRef(null);
  useClickOutside(panelRef, onClose);

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
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/20 backdrop-blur-[1px] px-4">
      <div
        ref={panelRef}
        className="w-full max-w-5xl border border-line/60 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 md:px-6 py-4 border-b border-line/60">
          <div>
            <h2 className="text-base md:text-lg font-medium tracking-tight">Filtres avancés</h2>
            <p className="mt-1 text-xs md:text-sm text-text/70">
              Affinez votre recherche. Les résultats se mettent à jour automatiquement.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line/70 hover:bg-bgAlt"
            aria-label="Fermer les filtres avancés"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Contenu */}
        <div className="px-5 md:px-6 py-4">{children}</div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-5 md:px-6 py-3 border-t border-line/60">
          <span className="text-[11px] md:text-xs text-text/70">
            {activeCount > 0
              ? `${activeCount} filtre${activeCount > 1 ? "s" : ""} actif${
                  activeCount > 1 ? "s" : ""
                }`
              : "Aucun filtre avancé actif"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center border border-line/70 bg-bgAlt px-4 py-2 text-xs md:text-sm hover:bg-white"
          >
            Fermer
          </button>
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
}) {
  const [openKey, setOpenKey] = useState(null); // 'ville' | 'type' | 'budget' | 'chambres' | 'surface'
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [barRevealed, setBarRevealed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showStickyBtn, setShowStickyBtn] = useState(false);
  const [reachedBottom, setReachedBottom] = useState(false);
  const sectionAnchorRef = useRef(null);

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
    const base = Object.fromEntries(ATOUTS_LIST.map((a) => [a.key, false]));
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
    if (city) arr.push({ k: "city", label: `Ville: ${city}` });
    if (type) arr.push({ k: "type", label: `Type: ${type}` });
    if (priceMin) arr.push({ k: "priceMin", label: `≥ ${priceMin} CHF` });
    if (priceMax) arr.push({ k: "priceMax", label: `≤ ${priceMax} CHF` });
    if (surfaceMin) arr.push({ k: "surfaceMin", label: `≥ ${surfaceMin} m²` });
    if (surfaceMax) arr.push({ k: "surfaceMax", label: `≤ ${surfaceMax} m²` });
    if (chambresMin) arr.push({ k: "chambresMin", label: `≥ ${chambresMin} ch.` });
    if (sdbMin) arr.push({ k: "sdbMin", label: `≥ ${sdbMin} sdb` });
    if (canton) arr.push({ k: "canton", label: `Canton: ${canton}` });
    if (terrainMin) arr.push({ k: "terrainMin", label: `Terrain ≥ ${terrainMin} m²` });
    if (meuble) arr.push({ k: "meuble", label: "Meublé" });
    if (dispoBefore) arr.push({ k: "dispoBefore", label: `Dispo avant: ${dispoBefore}` });
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
    setAtouts(Object.fromEntries(ATOUTS_LIST.map((a) => [a.key, false])));
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
        <label className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 mb-2 block">Ville</label>
        <CityAutosuggest
          options={cities}
          value={city}
          onChange={setCity}
          placeholder="Rechercher une ville"
        />
      </div>

      {/* Type de bien */}
      <div>
        <label className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 mb-2 block">Type de bien</label>
        <div className="grid grid-cols-2 gap-2">
          {types.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setType((prev) => (t === prev ? "" : t))}
              className={`border px-4 py-3 text-sm text-left transition-colors ${
                t === type
                  ? "border-[#FF4A3E] bg-[#FF4A3E]/5 text-[#FF4A3E]"
                  : "border-neutral-200 bg-white hover:bg-neutral-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 mb-2 block">Budget</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            inputMode="numeric"
            placeholder="Min CHF"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="h-12 w-full border border-neutral-200 bg-white px-4 text-[15px]"
          />
          <input
            inputMode="numeric"
            placeholder="Max CHF"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="h-12 w-full border border-neutral-200 bg-white px-4 text-[15px]"
          />
        </div>
      </div>

      {/* Chambres & SDB */}
      <div>
        <label className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 mb-2 block">Chambres & SDB</label>
        <div className="grid gap-2">
          <Stepper label="Chambres min" value={Number(chambresMin || 0)} onChange={(v) => setChambresMin(String(v))} min={0} max={10} />
          <Stepper label="Salles de bain min" value={Number(sdbMin || 0)} onChange={(v) => setSdbMin(String(v))} min={0} max={10} />
        </div>
      </div>

      {/* Surface */}
      <div>
        <label className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 mb-2 block">Surface</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            inputMode="numeric"
            placeholder="Min m²"
            value={surfaceMin}
            onChange={(e) => setSurfaceMin(e.target.value)}
            className="h-12 w-full border border-neutral-200 bg-white px-4 text-[15px]"
          />
          <input
            inputMode="numeric"
            placeholder="Max m²"
            value={surfaceMax}
            onChange={(e) => setSurfaceMax(e.target.value)}
            className="h-12 w-full border border-neutral-200 bg-white px-4 text-[15px]"
          />
        </div>
      </div>

      {/* Canton */}
      <div>
        <label className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 mb-2 block">Canton</label>
        <select
          value={canton}
          onChange={(e) => setCanton(e.target.value)}
          className="h-12 w-full border border-neutral-200 bg-white px-4 text-[15px]"
        >
          <option value="">Tous</option>
          {cantons.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Atouts */}
      <div>
        <label className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 mb-2 block">Atouts</label>
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
                <Chip key={c.k} onClear={() => clearChip(c.k)}>
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
            lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto
            transition-all duration-300 ease-out
            ${showStickyBtn && !reachedBottom
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6 pointer-events-none"
            }
          `}
        >
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
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
              Filtres
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

      {/* Panneau full-screen mobile/tablette */}
      {mobileOpen && createPortal(
        <div className="fixed inset-0 z-[200] lg:hidden flex flex-col bg-white">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Filtres</h2>
              <p className="text-[12px] text-neutral-500 mt-0.5">
                {resultCount} annonce{resultCount > 1 ? "s" : ""} disponible{resultCount > 1 ? "s" : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="h-10 w-10 rounded-full border border-neutral-200 inline-flex items-center justify-center hover:bg-neutral-50"
              aria-label="Fermer les filtres"
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
              Réinitialiser
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex-[2] h-14 bg-neutral-900 text-white text-[13px] uppercase tracking-[0.12em] font-semibold hover:bg-[#FF4A3E] transition-colors"
            >
              Voir {resultCount} annonce{resultCount > 1 ? "s" : ""}
            </button>
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
                  <span className="truncate">{city || "Ville"}</span>
                </TinyButton>
                <Popover open={openKey === "ville"} onClose={() => setOpenKey(null)}>
                  <CityAutosuggest
                    options={cities}
                    value={city}
                    onChange={setCity}
                    placeholder="Rechercher une ville"
                  />
                </Popover>
              </div>

              {/* Type */}
              <div className="relative">
                <TinyButton
                  active={openKey === "type" || !!type}
                  onClick={() => setOpenKey((k) => (k === "type" ? null : "type"))}
                  aria-label="Type de bien"
                >
                  {type || "Type"}
                </TinyButton>
                <Popover open={openKey === "type"} onClose={() => setOpenKey(null)}>
                  <div className="grid grid-cols-2 gap-2">
                    {types.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => {
                          setType((prev) => (t === prev ? "" : t));
                          setOpenKey(null);
                        }}
                        className={`border px-3 py-2 text-sm text-left ${
                          t === type
                            ? "border-primary/60 bg-primary/5 text-primary"
                            : "border-line/70 hover:bg-bgAlt"
                        }`}
                      >
                        {t}
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
                  Budget
                </TinyButton>
                <Popover open={openKey === "budget"} onClose={() => setOpenKey(null)}>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      inputMode="numeric"
                      placeholder="Min"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      className="h-12 w-full border border-line/70 bg-white px-3"
                    />
                    <div className="flex gap-2">
                      <input
                        inputMode="numeric"
                        placeholder="Max"
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
                  Chambres &amp; SDB
                </TinyButton>
                <Popover open={openKey === "chambres"} onClose={() => setOpenKey(null)}>
                  <div className="grid grid-cols-2 gap-3">
                    <Stepper
                      label="Chambres min"
                      value={Number(chambresMin || 0)}
                      onChange={(v) => setChambresMin(String(v))}
                      min={0}
                      max={10}
                    />
                    <Stepper
                      label="Salles de bain min"
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
                  Surf.
                </TinyButton>
                <Popover open={openKey === "surface"} onClose={() => setOpenKey(null)}>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      inputMode="numeric"
                      placeholder="Min (m²)"
                      value={surfaceMin}
                      onChange={(e) => setSurfaceMin(e.target.value)}
                      className="h-12 w-full border border-line/70 bg-white px-3"
                    />
                    <input
                      inputMode="numeric"
                      placeholder="Max (m²)"
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
                <span className="font-medium">Avancés</span>
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

              <span className="text-sm text-text/70">|</span>
              <span className="text-sm text-text/70">
                {resultCount} annonce{resultCount > 1 ? "s" : ""}
              </span>

              <button
                type="button"
                className="inline-flex h-16 md:h-[4.5rem] items-center justify-center gap-2 border border-[#FF4A3E]/30 bg-[#FF4A3E]/5 text-[#FF4A3E] px-5 md:px-6 text-[15px] md:text-base hover:bg-[#FF4A3E]/10 transition-colors"
                onClick={resetAll}
                title="Réinitialiser tous les filtres"
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
                <Chip key={c.k} onClear={() => clearChip(c.k)}>
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
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Ligne 1 */}
          <div className="space-y-2">
            <label className="text-xs text-text/70">Canton</label>
            <select
              value={canton}
              onChange={(e) => setCanton(e.target.value)}
              className="h-10 w-full border border-line/70 bg-white px-3 text-sm"
            >
              <option value="">Tous</option>
              {cantons.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-text/70">Dispo avant le</label>
            <input
              type="date"
              value={dispoBefore}
              onChange={(e) => setDispoBefore(e.target.value)}
              className="h-10 w-full border border-line/70 bg-white px-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-text/70">Terrain min (m²)</label>
            <input
              inputMode="numeric"
              value={terrainMin}
              onChange={(e) => setTerrainMin(e.target.value)}
              className="h-10 w-full border border-line/70 bg-white px-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-text/70">Meublé</label>
            <button
              type="button"
              onClick={() => setMeuble((m) => !m)}
              className={`w-full h-10 border px-3 text-sm ${
                meuble
                  ? "border-primary/60 bg-primary/5 text-primary"
                  : "border-line/70 bg-white"
              }`}
            >
              {meuble ? "Uniquement meublé" : "Inclure non meublé"}
            </button>
          </div>

          {/* Atouts */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-text/70">Atouts</label>
              <span className="text-[11px] text-text/60">
                {Object.values(atouts).filter(Boolean).length} sélectionné(s)
              </span>
            </div>
            <div className="border border-line/60 bg-white p-3">
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
                      className={`rounded-full px-3 py-1 text-sm border ${
                        active
                          ? "border-primary/60 bg-primary/10 text-primary"
                          : "border-line/60 bg-white hover:bg-bgAlt"
                      }`}
                    >
                      {a.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Équipements */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-text/70">Équipements</label>
              <span className="text-[11px] text-text/60">
                {extraFeatures.length} sélectionné(s)
              </span>
            </div>
            <div className="border border-line/60 bg-white p-3">
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
                      className={`rounded-full border px-3 py-1 text-sm ${
                        active
                          ? "border-primary/60 bg-primary/10 text-primary"
                          : "border-line/60 bg-white hover:bg-bgAlt"
                      }`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Ligne bas : chambres / sdb / surfaces */}
          <div className="space-y-2">
            <Stepper
              size="sm"
              label="Chambres min"
              value={Number(chambresMin || 0)}
              onChange={(v) => setChambresMin(String(v))}
              min={0}
              max={10}
            />
          </div>
          <div className="space-y-2">
            <Stepper
              size="sm"
              label="Salles de bain min"
              value={Number(sdbMin || 0)}
              onChange={(v) => setSdbMin(String(v))}
              min={0}
              max={10}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text/70">Surface min (m²)</label>
            <input
              inputMode="numeric"
              value={surfaceMin}
              onChange={(e) => setSurfaceMin(e.target.value)}
              className="h-10 w-full border border-line/70 bg-white px-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text/70">Surface max (m²)</label>
            <input
              inputMode="numeric"
              value={surfaceMax}
              onChange={(e) => setSurfaceMax(e.target.value)}
              className="h-10 w-full border border-line/70 bg-white px-3 text-sm"
            />
          </div>
        </div>
      </AdvancedModal>
    </section>
  );
}
