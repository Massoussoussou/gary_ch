// src/components/FiltersBar.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Filter, X, ChevronDown, RotateCcw, Search, Plus, Minus } from "lucide-react";

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
      className={`relative inline-flex h-14 md:h-16 items-center justify-center gap-2 rounded-xl border px-4 md:px-6 text-[15px] md:text-[16px] ${
        active
          ? "border-primary/70 bg-primary/5 text-primary shadow-[0_0_0_1px_rgba(0,0,0,0.02)]"
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
      <div className={`inline-flex items-center rounded-xl border border-line/70 bg-white ${h}`}>
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
      className={`absolute left-0 top-full z-30 mt-2 w-[min(92vw,36rem)] rounded-2xl border border-line/70 bg-white p-3 shadow-xl ${className}`}
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
      <div className="h-12 md:h-14 flex items-center gap-2 rounded-2xl border border-line/70 bg-white px-4 md:px-5">
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
        <div className="absolute z-30 mt-1 w-full rounded-xl border border-line/70 bg-white shadow-md">
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
        className="w-full max-w-5xl rounded-3xl border border-line/60 bg-white shadow-2xl"
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
            className="inline-flex items-center justify-center rounded-xl border border-line/70 bg-bgAlt px-4 py-2 text-xs md:text-sm hover:bg-white"
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

  return (
    <section className="my-10 md:my-14">
      <div className="max-w-6xl mx-auto px-4">
        {/* Carte principale : bords plus carrés, hauteur auto */}
        <div className="relative z-[10] rounded-2xl border border-line/60 bg-white/98 shadow-xl ring-1 ring-black/5">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap lg:flex-nowrap items-center gap-3">
            {/* Boutons principaux */}
            <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap">
              {/* Ville */}
              <div className="relative">
                <TinyButton
                  active={openKey === "ville" || !!city}
                  onClick={() => setOpenKey((k) => (k === "ville" ? null : "ville"))}
                  className="max-w-[180px] md:max-w-[220px]"
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
                        className={`rounded-xl border px-3 py-2 text-sm text-left ${
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
                      className="h-12 w-full rounded-xl border border-line/70 bg-white px-3"
                    />
                    <div className="flex gap-2">
                      <input
                        inputMode="numeric"
                        placeholder="Max"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="h-12 w-full rounded-xl border border-line/70 bg-white px-3"
                      />
                      <div className="inline-flex h-12 items-center rounded-xl border border-line/70 bg-white px-3 text-sm">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      className="h-12 w-full rounded-xl border border-line/70 bg-white px-3"
                    />
                    <input
                      inputMode="numeric"
                      placeholder="Max (m²)"
                      value={surfaceMax}
                      onChange={(e) => setSurfaceMax(e.target.value)}
                      className="h-12 w-full rounded-xl border border-line/70 bg-white px-3"
                    />
                  </div>
                </Popover>
              </div>
            </div>

            {/* Côté droit : Avancés + n annonces + Reset */}
            <div className="ml-auto flex items-center gap-3 shrink-0">
              <button
                type="button"
                className="inline-flex h-14 md:h-16 items-center justify-center gap-2 rounded-xl border border-line/70 bg-white px-4 md:px-5 text-[15px] md:text-[16px] hover:bg-bgAlt/80"
                onClick={() => setAdvancedOpen(true)}
                aria-expanded={advancedOpen}
              >
                <Filter className="h-4 w-4" />
                <span>Avancés</span>
                {advancedCount > 0 && (
                  <span className="text-xs rounded-full bg-primary/10 text-primary px-2 py-0.5">
                    {advancedCount}
                  </span>
                )}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    advancedOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <span className="hidden md:inline text-sm text-text/70">|</span>
              <span className="text-sm text-text/70">
                {resultCount} annonce{resultCount > 1 ? "s" : ""}
              </span>

              <button
                type="button"
                className="inline-flex h-14 md:h-16 items-center justify-center gap-2 rounded-xl border border-line/70 bg-white px-4 md:px-5 text-[15px] md:text-[16px] hover:bg-bgAlt/80"
                onClick={resetAll}
                title="Réinitialiser tous les filtres"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
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

      {/* MODAL Filtres avancés */}
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
              className="h-10 w-full rounded-xl border border-line/70 bg-white px-3 text-sm"
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
              className="h-10 w-full rounded-xl border border-line/70 bg-white px-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-text/70">Terrain min (m²)</label>
            <input
              inputMode="numeric"
              value={terrainMin}
              onChange={(e) => setTerrainMin(e.target.value)}
              className="h-10 w-full rounded-xl border border-line/70 bg-white px-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-text/70">Meublé</label>
            <button
              type="button"
              onClick={() => setMeuble((m) => !m)}
              className={`w-full h-10 rounded-xl border px-3 text-sm ${
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
            <div className="rounded-2xl border border-line/60 bg-white p-3">
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
            <div className="rounded-2xl border border-line/60 bg-white p-3">
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
              className="h-10 w-full rounded-xl border border-line/70 bg-white px-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text/70">Surface max (m²)</label>
            <input
              inputMode="numeric"
              value={surfaceMax}
              onChange={(e) => setSurfaceMax(e.target.value)}
              className="h-10 w-full rounded-xl border border-line/70 bg-white px-3 text-sm"
            />
          </div>
        </div>
      </AdvancedModal>
    </section>
  );
}
