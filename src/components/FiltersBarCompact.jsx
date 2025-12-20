import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";

/* ---------- Utils ---------- */

const norm = (s = "") =>
  s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const SIZE_TOKENS = {
  md: {
    bar: "h-14",
    btn: "h-14 px-3 text-[15px]",
    input: "h-12 text-[15px]",
    search: "h-14 px-4 text-[15px]",
  },
  xl: {
    bar: "h-16",
    btn: "h-16 px-4 text-[16px]",
    input: "h-14 text-[16px]",
    search: "h-16 px-6 text-[16px]",
  },
  "2xl": {
    bar: "h-20",
    btn: "h-20 px-6 text-[18px]",
    input: "h-16 text-[17px]",
    search: "h-20 px-8 text-[17px]",
  },
};

function useDebouncedEffect(effect, deps, delay = 250) {
  useEffect(() => {
    const id = setTimeout(effect, delay);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || []), delay]);
}

/** Outside dismiss robuste (capture + Escape) */
function useOutsideDismiss({ panelRef, anchorRef, onDismiss, when = true }) {
  useEffect(() => {
    if (!when) return;

    const onPointerDown = (e) => {
      const panel = panelRef.current;
      const anchor = anchorRef?.current;
      const path = typeof e.composedPath === "function" ? e.composedPath() : [];

      const inPanel = panel && (panel.contains(e.target) || path.includes(panel));
      const inAnchor = anchor && (anchor.contains(e.target) || path.includes(anchor));

      if (!inPanel && !inAnchor) onDismiss?.();
    };

    const onKey = (e) => {
      if (e.key === "Escape") onDismiss?.();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKey, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [panelRef, anchorRef, onDismiss, when]);
}

/** Positionne le popover à l’écran par rapport au bouton */
function useAnchorPosition(anchorRef, open, { gap = 8, maxWidth = 576 } = {}) {
  const [style, setStyle] = useState({ top: 0, left: 0, minWidth: 0, maxWidth });

  useLayoutEffect(() => {
    if (!open) return;

    const compute = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;

      const r = anchor.getBoundingClientRect();
      const vw = window.innerWidth;

      const top = Math.round(r.bottom + gap);
      const minWidth = Math.round(r.width);
      const width = Math.min(Math.max(minWidth, 320), maxWidth);

      let left = Math.round(r.left);
      if (left + width + 8 > vw) left = Math.max(8, vw - width - 8);

      setStyle({ top, left, minWidth, maxWidth: width });
    };

    compute();
    window.addEventListener("scroll", compute, true);
    window.addEventListener("resize", compute);

    return () => {
      window.removeEventListener("scroll", compute, true);
      window.removeEventListener("resize", compute);
    };
  }, [anchorRef, open, gap, maxWidth]);

  return style;
}

/* ---------- Popover en portal ---------- */

function PortalPop({ open, anchorRef, onClose, children, className = "" }) {
  const panelRef = useRef(null);

  useOutsideDismiss({
    panelRef,
    anchorRef,
    onDismiss: onClose,
    when: open,
  });

  const pos = useAnchorPosition(anchorRef, open, { gap: 8, maxWidth: 576 });

  if (!open) return null;

  return createPortal(
    <div
      ref={panelRef}
      onPointerDownCapture={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        width: pos.maxWidth,
        minWidth: pos.minWidth,
        zIndex: 10000,
      }}
      className={
        "pointer-events-auto rounded-md border border-zinc-200 bg-white p-3 shadow-2xl " +
        className
      }
    >
      {children}
    </div>,
    document.body
  );
}

/* ---------- Bottom-sheet mobile (luxe) ---------- */

function MobileSheet({ open, onClose, title = "Filtres", children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10050] sm:hidden">
      {/* overlay */}
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
      />

      {/* sheet */}
      <div
        ref={panelRef}
        className="
          absolute inset-x-0 bottom-0
          max-h-[88vh]
          rounded-t-3xl
          bg-white/92 backdrop-blur-xl
          border-t border-black/10
          shadow-2xl
          overflow-hidden
        "
        style={{
          paddingBottom: "max(14px, env(safe-area-inset-bottom))",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b border-black/10"
          style={{ paddingTop: "max(14px, env(safe-area-inset-top))" }}
        >
          <div className="text-[12px] uppercase tracking-[0.28em] text-black/60">
            {title}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="
              h-11 w-11 rounded-full
              bg-white/70 border border-black/10 shadow-sm
              inline-flex items-center justify-center
              hover:bg-white hover:border-black/20
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E]/35
            "
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-5 overflow-y-auto max-h-[calc(88vh-72px)]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ---------- Autosuggest Ville ---------- */

function CityAutosuggest({
  options = [],
  value,
  onChange,
  placeholder = "Ville",
  size = "md",
}) {
  const [q, setQ] = useState(value || "");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => setQ(value || ""), [value]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", handleClick, true);
    return () => document.removeEventListener("pointerdown", handleClick, true);
  }, [open]);

  const list = useMemo(() => {
    const qq = norm(q);
    if (!qq) return options;
    return options.filter((v) => norm(v).includes(qq));
  }, [q, options]);

  const select = (v) => {
    onChange?.(v);
    setQ(v);
    setOpen(false);
  };

  const TOK = SIZE_TOKENS[size] || SIZE_TOKENS.md;
  const inputText =
    size === "2xl" ? "text-[17px]" : size === "xl" ? "text-[16px]" : "text-[15px]";

  return (
    <div className="relative" ref={wrapRef}>
      <div
        className={`flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 ${TOK.input}`}
      >
        <Search className="h-4 w-4 opacity-60" aria-hidden="true" />
        <input
          className={`w-full h-full block outline-none ${inputText}`}
          value={q}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
        />
        {value && (
          <button
            type="button"
            className="h-8 w-8 grid place-items-center text-zinc-500 hover:text-zinc-800"
            onClick={() => {
              onChange?.("");
              setQ("");
              setOpen(false);
            }}
            aria-label="Effacer"
            title="Effacer"
          >
            ×
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-[9999] mt-2 w-full rounded-xl border border-zinc-200 bg-white shadow-md max-h-64 overflow-auto text-sm">
          {list.length === 0 ? (
            <div className="px-4 py-3 text-zinc-500">Aucune ville trouvée</div>
          ) : (
            list.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => select(v)}
                className={`block w-full text-left px-4 py-3 hover:bg-zinc-50 ${
                  v === value ? "bg-zinc-50" : ""
                }`}
              >
                {v}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Bouton “carré” (DESKTOP) ---------- */

function Button({ active, children, className = "", onToggle, size = "md", ...rest }) {
  const TOK = SIZE_TOKENS[size] || SIZE_TOKENS.md;
  return (
    <button
      {...rest}
      type="button"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle?.();
      }}
      className={[
        `${TOK.btn} inline-flex items-center gap-2 rounded-none select-none`,
        active ? "bg-[#FF4A3E] text-white" : "bg-white text-zinc-900",
        "transition-colors hover:bg-[#FF4A3E] hover:text-white",
        className,
      ].join(" ")}
    >
      <span className="whitespace-nowrap">{children}</span>
      <ChevronDown
        className={`h-4 w-4 opacity-70 transition ${active ? "-rotate-180" : ""}`}
        aria-hidden="true"
      />
    </button>
  );
}

/* ---------- Compteur ± ---------- */

function Counter({ label, value = 0, onChange, min = 0, max = 10 }) {
  const v = Number.isFinite(+value) ? +value : 0;
  const set = (x) => onChange?.(Math.max(min, Math.min(max, x)));

  return (
    <div className="flex items-center justify-between h-14 rounded-xl border border-zinc-200 bg-white px-4">
      <span className="text-[14px] opacity-70">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => set(v - 1)}
          className="h-10 w-10 flex items-center justify-center border border-zinc-200 rounded-lg text-lg leading-none"
          aria-label={`Moins ${label}`}
        >
          −
        </button>
        <span className="w-6 text-center tabular-nums text-[15px]">{v}</span>
        <button
          type="button"
          onClick={() => set(v + 1)}
          className="h-10 w-10 flex items-center justify-center border border-zinc-200 rounded-lg text-lg leading-none"
          aria-label={`Plus ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

/* ---------- Composant principal ---------- */

export default function FiltersBarCompact({
  facets = {},
  cities: citiesProp,
  types: typesProp,
  onSearch,
  onChange,
  resultCount,
  size = "md",
}) {
  const cities = citiesProp || facets.cities || [];
  const types = typesProp || facets.types || [];
  const TOK = SIZE_TOKENS[size] || SIZE_TOKENS.md;

  const INITIAL = useMemo(
    () => ({
      city: "",
      type: "",
      priceMin: "",
      priceMax: "",
      chambresMin: 0,
      sdbMin: 0,
      surfaceMin: "",
      surfaceMax: "",
    }),
    []
  );

  const [filters, setFilters] = useState(INITIAL);

  // popovers desktop
  const [open, setOpen] = useState(null);
  const is = (id) => open === id;
  const toggle = (id) => setOpen((prev) => (prev === id ? null : id));

  // mobile sheet
  const [mobileOpen, setMobileOpen] = useState(false);

  // refs d’ancrage desktop
  const refVille = useRef(null);
  const refType = useRef(null);
  const refBudget = useRef(null);
  const refRooms = useRef(null);
  const refSurf = useRef(null);

  const lastPartialRef = useRef(null);
  const patch = (partial) => {
    lastPartialRef.current = partial;
    setFilters((state) => ({ ...state, ...partial }));
  };

  useDebouncedEffect(
    () => {
      if (typeof onChange === "function" && lastPartialRef.current) {
        onChange(lastPartialRef.current);
      }
    },
    [filters],
    250
  );

  const submit = () => onSearch?.(filters);

  const resetAll = () => {
    lastPartialRef.current = INITIAL;
    setFilters(INITIAL);
    onChange?.(INITIAL);
  };

  const n = typeof resultCount === "number" ? resultCount : null;
  const searchLabel = n === null ? "VOIR LES ANNONCES" : `VOIR LES ANNONCES (${n})`;
  const searchDisabled = n === 0;

  /* =======================
     ✅ MOBILE (<sm) — bouton + sheet
     ======================= */
  return (
    <div className="relative z-[90] w-full mx-auto" role="search">
      {/* MOBILE BAR */}
      <div className="sm:hidden">
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="
              w-full flex items-center justify-between gap-4
              px-4 py-4
              active:scale-[0.99] transition-transform
            "
          >
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">
                Recherche
              </div>
              <div className="mt-1 text-[15px] text-zinc-900 truncate">
                {filters.city ? filters.city : "Choisir une ville"}{" "}
                <span className="text-zinc-400">•</span>{" "}
                <span className="text-zinc-500">
                  {n === null ? "— annonces" : `${n} annonces`}
                </span>
              </div>
            </div>

            <div
  className="
    h-12 w-12
    rounded-2xl
    bg-white/60 backdrop-blur-md
    border border-black/10
    shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]
    inline-flex items-center justify-center
  "
  aria-hidden="true"
>
  <SlidersHorizontal className="h-5 w-5 text-black/70" />
</div>

          </button>

          <div className="px-4 pb-4">
            <button
              type="button"
              onClick={submit}
              disabled={searchDisabled}
              className="
                w-full inline-flex items-center justify-center gap-2
                rounded-full bg-zinc-900 text-white
                px-5 py-4
                uppercase tracking-[0.14em] text-[12px] font-semibold
                transition-colors
                hover:bg-[#FF4A3E]
                disabled:opacity-40
              "
              title={searchDisabled ? "Aucun résultat" : "Voir les annonces"}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              {searchLabel}
            </button>
          </div>
        </div>

        {/* MOBILE SHEET */}
        <MobileSheet open={mobileOpen} onClose={() => setMobileOpen(false)} title="Filtres">
          {/* Compteur live */}
          <div className="mb-5 flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-[0.26em] text-black/50">
              Résultats
            </div>
            <div className="text-[13px] text-black/70">
              {n === null ? "—" : `${n} annonce${n > 1 ? "s" : ""}`}
            </div>
          </div>

          <div className="grid gap-4">
            {/* Ville */}
            <div>
              <div className="text-[11px] uppercase tracking-[0.26em] text-black/45 mb-2">
                Ville
              </div>
              <CityAutosuggest
                size="xl"
                options={cities}
                value={filters.city}
                onChange={(v) => patch({ city: v })}
                placeholder="Rechercher une ville"
              />
            </div>

            {/* Type */}
            <div>
              <div className="text-[11px] uppercase tracking-[0.26em] text-black/45 mb-2">
                Type
              </div>
              <div className="grid grid-cols-2 gap-2">
                {types.length > 0 ? (
                  types.map((t) => {
                    const active = t === filters.type;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => patch({ type: active ? "" : t })}
                          className={`
                            rounded-2xl border px-4 py-3 text-left
                            transition-all duration-200
                            ${active
                              ? "bg-[#FF4A3E] border-[#FF4A3E] text-white shadow-sm"
                              : "bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50"}
                          `}
                        >
                          <div className="text-[14px]">{t}</div>
                        </button>
                      );

                  })
                ) : (
                  <div className="text-sm text-zinc-500">Aucun type disponible</div>
                )}
              </div>
            </div>

            {/* Budget */}
            <div>
              <div className="text-[11px] uppercase tracking-[0.26em] text-black/45 mb-2">
                Budget
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  inputMode="numeric"
                  value={filters.priceMin}
                  onChange={(e) => patch({ priceMin: e.target.value })}
                  placeholder="Min CHF"
                  className="block h-14 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-[15px]"
                />
                <input
                  inputMode="numeric"
                  value={filters.priceMax}
                  onChange={(e) => patch({ priceMax: e.target.value })}
                  placeholder="Max CHF"
                  className="block h-14 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-[15px]"
                />
              </div>
            </div>

            {/* Chambres / SDB */}
            <div>
              <div className="text-[11px] uppercase tracking-[0.26em] text-black/45 mb-2">
                Chambres & SDB
              </div>
              <div className="grid gap-2">
                <Counter
                  label="Chambres"
                  value={filters.chambresMin}
                  onChange={(v) => patch({ chambresMin: v })}
                  min={0}
                  max={10}
                />
                <Counter
                  label="Salles de bain"
                  value={filters.sdbMin}
                  onChange={(v) => patch({ sdbMin: v })}
                  min={0}
                  max={10}
                />
              </div>
            </div>

            {/* Surface */}
            <div>
              <div className="text-[11px] uppercase tracking-[0.26em] text-black/45 mb-2">
                Surface
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  inputMode="numeric"
                  value={filters.surfaceMin}
                  onChange={(e) => patch({ surfaceMin: e.target.value })}
                  placeholder="Min m²"
                  className="block h-14 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-[15px]"
                />
                <input
                  inputMode="numeric"
                  value={filters.surfaceMax}
                  onChange={(e) => patch({ surfaceMax: e.target.value })}
                  placeholder="Max m²"
                  className="block h-14 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-[15px]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={resetAll}
                className="
                  h-14 rounded-full
                  border border-zinc-200 bg-white
                  text-zinc-900
                  uppercase tracking-[0.14em] text-[12px]
                  hover:bg-zinc-50
                "
              >
                Reset
              </button>

              <button
                type="button"
                onClick={() => {
                  submit();
                  setMobileOpen(false);
                }}
                disabled={searchDisabled}
                className="
                  h-14 rounded-full
                  bg-zinc-900 text-white
                  uppercase tracking-[0.14em] text-[12px] font-semibold
                  hover:bg-[#FF4A3E]
                  disabled:opacity-40
                "
              >
                {n === null ? "Voir" : `Voir ${n}`}
              </button>
            </div>

            <div className="text-center text-[12px] text-black/45 pt-1">
              Mise à jour en temps réel selon vos filtres
            </div>
          </div>
        </MobileSheet>
      </div>

      {/* =======================
          DESKTOP (>=sm) — ton code actuel intact
         ======================= */}
      <div className="hidden sm:block">
        {/* Barre de filtres compacte */}
        <div
          className={`
            ${TOK.bar}
            grid items-stretch
            grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6
            bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden
            divide-y sm:divide-y md:divide-y-0 md:divide-x divide-zinc-200
          `}
        >
          {/* VILLE */}
          <div className="relative w-full" ref={refVille}>
            <Button
              size={size}
              active={is("ville") || !!filters.city}
              onToggle={() => toggle("ville")}
              className="w-full justify-between"
            >
              {filters.city || "Ville"}
            </Button>
            <PortalPop open={is("ville")} onClose={() => setOpen(null)} anchorRef={refVille}>
              <CityAutosuggest
                size={size}
                options={cities}
                value={filters.city}
                onChange={(v) => patch({ city: v })}
                placeholder="Rechercher une ville"
              />
            </PortalPop>
          </div>

          {/* TYPE */}
          <div className="relative w-full" ref={refType}>
            <Button
              size={size}
              active={is("type") || !!filters.type}
              onToggle={() => toggle("type")}
              className="w-full justify-between"
            >
              {filters.type || "Type"}
            </Button>
            <PortalPop open={is("type")} onClose={() => setOpen(null)} anchorRef={refType}>
              <div className="grid grid-cols-2 gap-2">
                {types.length > 0 ? (
                  types.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        patch({ type: t === filters.type ? "" : t });
                        setOpen(null);
                      }}
                      className={`rounded-md border px-3 py-2 text-sm text-left ${
                        t === filters.type
                          ? "border-zinc-900 bg-zinc-50"
                          : "border-zinc-200 hover:bg-zinc-50"
                      }`}
                    >
                      {t}
                    </button>
                  ))
                ) : (
                  <div className="text-sm text-zinc-500">Aucun type disponible</div>
                )}
              </div>
            </PortalPop>
          </div>

          {/* BUDGET */}
          <div className="relative w-full" ref={refBudget}>
            <Button
              size={size}
              active={is("budget") || filters.priceMin || filters.priceMax}
              onToggle={() => toggle("budget")}
              className="w-full justify-between"
            >
              Budget
            </Button>
            <PortalPop open={is("budget")} onClose={() => setOpen(null)} anchorRef={refBudget}>
              <div className="grid grid-cols-2 gap-2">
                <input
                  inputMode="numeric"
                  value={filters.priceMin}
                  onChange={(e) => patch({ priceMin: e.target.value })}
                  placeholder="Min CHF"
                  className="block h-12 w-full rounded-md border border-zinc-200 bg-white px-3"
                  aria-label="Budget minimum en francs suisses"
                />
                <input
                  inputMode="numeric"
                  value={filters.priceMax}
                  onChange={(e) => patch({ priceMax: e.target.value })}
                  placeholder="Max CHF"
                  className="block h-12 w-full rounded-md border border-zinc-200 bg-white px-3"
                  aria-label="Budget maximum en francs suisses"
                />
              </div>
            </PortalPop>
          </div>

          {/* CHAMBRES & SDB */}
          <div className="relative w-full" ref={refRooms}>
            <Button
              size={size}
              active={is("rooms") || filters.chambresMin || filters.sdbMin}
              onToggle={() => toggle("rooms")}
              className="w-full justify-between"
            >
              Chambres &amp; SDB
            </Button>
            <PortalPop open={is("rooms")} onClose={() => setOpen(null)} anchorRef={refRooms}>
              <div className="grid grid-cols-1 gap-2">
                <Counter
                  label="Chambres"
                  value={filters.chambresMin}
                  onChange={(v) => patch({ chambresMin: v })}
                  min={0}
                  max={10}
                />
                <Counter
                  label="Salles de bain"
                  value={filters.sdbMin}
                  onChange={(v) => patch({ sdbMin: v })}
                  min={0}
                  max={10}
                />
              </div>
            </PortalPop>
          </div>

          {/* SURFACE */}
          <div className="relative w-full" ref={refSurf}>
            <Button
              size={size}
              active={is("surf") || filters.surfaceMin || filters.surfaceMax}
              onToggle={() => toggle("surf")}
              className="w-full justify-between"
            >
              Surf.
            </Button>
            <PortalPop open={is("surf")} onClose={() => setOpen(null)} anchorRef={refSurf}>
              <div className="grid grid-cols-2 gap-2">
                <input
                  inputMode="numeric"
                  value={filters.surfaceMin}
                  onChange={(e) => patch({ surfaceMin: e.target.value })}
                  placeholder="Min m²"
                  className="block h-12 w-full rounded-md border border-zinc-200 bg-white px-3"
                  aria-label="Surface minimale"
                />
                <input
                  inputMode="numeric"
                  value={filters.surfaceMax}
                  onChange={(e) => patch({ surfaceMax: e.target.value })}
                  placeholder="Max m²"
                  className="block h-12 w-full rounded-md border border-zinc-200 bg-white px-3"
                  aria-label="Surface maximale"
                />
              </div>
            </PortalPop>
          </div>

          {/* RECHERCHER */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              submit();
            }}
            className={`${TOK.search} w-full inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-[0.08em] rounded-none bg-zinc-900 text-white transition-colors hover:bg-[#FF4A3E] disabled:opacity-40`}
            disabled={searchDisabled}
            aria-disabled={searchDisabled ? "true" : "false"}
            title={searchDisabled ? "Aucun résultat" : "Lancer la recherche"}
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span>{n === null ? "RECHERCHER" : `RECHERCHER (${n})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
