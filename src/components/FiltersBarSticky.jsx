// src/components/FiltersBarSticky.jsx
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronDown, Search } from "lucide-react"

/* ---------------- utils ---------------- */
const norm = (s = "") =>
  (s ?? "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

function useDebouncedEffect(fn, deps, delay = 250) {
  useEffect(() => {
    const id = setTimeout(() => fn?.(), delay)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || []), delay])
}

/** Mesure header si topOffset n'est pas fourni */
function useHeaderOffset() {
  const [offset, setOffset] = useState(0)
  useLayoutEffect(() => {
    const el = document.querySelector("[role='banner']") || document.getElementById("site-header")
    const measure = () => setOffset(el ? el.getBoundingClientRect().height : 0)
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])
  return offset
}

/** Visibilité sticky = (on a dépassé l’ancre) + (scroll up) avec hystérésis anti-clignotement */
function useStickyVisibility(anchorId, offset = 0, {
  deadZone = 8,           // hystérésis : apparaît quand top <= offset - deadZone, disparaît quand top > offset + deadZone
  minShowMs = 180,        // durée mini visible/cachée avant de rechanger d’état
  minHideMs = 240,
} = {}) {
  const [visible, setVisible] = useState(false)
  const lastY = useRef(typeof window !== "undefined" ? window.scrollY : 0)
  const lastChange = useRef(0)
  useEffect(() => {
    const el = document.getElementById(anchorId)
    if (!el) return

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || 0
        const dirUp = y < lastY.current - 2
        const dirDown = y > lastY.current + 2
        lastY.current = y

        const top = el.getBoundingClientRect().top
        const now = performance.now()
        const pastShow = top <= (offset - deadZone)
        const pastHide = top > (offset + deadZone)

        if (!visible && pastShow && dirUp && (now - lastChange.current > minShowMs)) {
          setVisible(true)
          lastChange.current = now
        } else if (visible && (dirDown || pastHide) && (now - lastChange.current > minHideMs)) {
          setVisible(false)
          lastChange.current = now
        }
      })
    }

    onScroll() // init
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [anchorId, offset, deadZone, minShowMs, minHideMs, visible])

  return visible
}

/** Outside click + Escape pour popovers */
function useOutsideDismiss({ panelRef, anchorRef, onDismiss, when = true }) {
  useEffect(() => {
    if (!when) return
    const onPD = (e) => {
      const p = panelRef.current, a = anchorRef.current
      const inPanel = p && p.contains(e.target)
      const inAnchor = a && a.contains(e.target)
      if (!inPanel && !inAnchor) onDismiss?.()
    }
    const onKey = (e) => { if (e.key === "Escape") onDismiss?.() }
    document.addEventListener("pointerdown", onPD, true)
    document.addEventListener("keydown", onKey, true)
    return () => {
      document.removeEventListener("pointerdown", onPD, true)
      document.removeEventListener("keydown", onKey, true)
    }
  }, [panelRef, anchorRef, onDismiss, when])
}

function useAnchorPosition(anchorRef, open, { gap = 8, maxWidth = 520 } = {}) {
  const [style, setStyle] = useState({ top: 0, left: 0, minWidth: 0, width: 0 })
  useLayoutEffect(() => {
    if (!open) return
    const compute = () => {
      const el = anchorRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vw = window.innerWidth
      const top = Math.round(r.bottom + gap)
      const minWidth = Math.round(r.width)
      const width = Math.min(Math.max(minWidth, 300), maxWidth)
      let left = Math.round(r.left)
      if (left + width + 8 > vw) left = Math.max(8, vw - width - 8)
      setStyle({ top, left, minWidth, width })
    }
    compute()
    window.addEventListener("scroll", compute, true)
    window.addEventListener("resize", compute)
    return () => {
      window.removeEventListener("scroll", compute, true)
      window.removeEventListener("resize", compute)
    }
  }, [anchorRef, open, gap, maxWidth])
  return style
}

/* ---------------- petites UI ---------------- */
function PortalPop({ open, anchorRef, onClose, children, className = "" }) {
  const panelRef = useRef(null)
  useOutsideDismiss({ panelRef, anchorRef, onDismiss: onClose, when: open })
  const pos = useAnchorPosition(anchorRef, open)
  if (!open) return null
  return createPortal(
    <div
      ref={panelRef}
      onPointerDownCapture={(e) => e.stopPropagation()}
      style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width, minWidth: pos.minWidth, zIndex: 10000 }}
      className={"pointer-events-auto rounded-md border border-zinc-200 bg-white p-3 shadow-2xl " + className}
    >
      {children}
    </div>,
    document.body
  )
}

function CityAutosuggest({ options = [], value, onChange, placeholder = "Ville" }) {
  const [q, setQ] = useState(value || "")
  const [open, setOpen] = useState(false)
  useEffect(() => setQ(value || ""), [value])
  const list = useMemo(() => {
    const qq = norm(q); if (!qq) return options
    return options.filter((v) => norm(v).includes(qq))
  }, [q, options])
  const select = (v) => { onChange?.(v); setQ(v); setOpen(false) }
  return (
    <div className="relative">
      <div className="h-10 flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3">
        <Search className="h-4 w-4 opacity-60" aria-hidden="true" />
        <input className="w-full h-full block outline-none text-[14px]" value={q} placeholder={placeholder}
               onFocus={() => setOpen(true)} onChange={(e) => { setQ(e.target.value); setOpen(true) }} />
        {value && (
          <button type="button" className="h-6 w-6 grid place-items-center text-zinc-500 hover:text-zinc-800"
                  onClick={() => { onChange?.(""); setQ(""); setOpen(false) }} aria-label="Effacer" title="Effacer">×</button>
        )}
      </div>
      {open && (
        <div className="absolute z-[9999] mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-md max-h-56 overflow-auto text-sm">
          {list.length === 0 ? <div className="px-3 py-2 text-zinc-500">Aucune ville trouvée</div> :
            list.map((v) => (
              <button key={v} onClick={() => select(v)}
                      className={`block w-full text-left px-3 py-2 hover:bg-zinc-50 ${v === value ? "bg-zinc-50" : ""}`}>
                {v}
              </button>
            ))}
        </div>
      )}
    </div>
  )
}

function SquareButton({ active, children, className = "", onToggle, ...rest }) {
  return (
    <button
      {...rest}
      type="button"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle?.(e) }}
      className={[
        "h-full inline-flex items-center gap-2 px-3 text-[14px] rounded-none shrink-0 select-none",
        active ? "bg-[#FF4A3E] text-white" : "bg-white text-zinc-900",
        "transition-colors hover:bg-[#FF4A3E] hover:text-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        className,
      ].join(" ")}
    >
      <span className="truncate">{children}</span>
      <ChevronDown className={`h-4 w-4 opacity-70 transition ${active ? "-rotate-180" : ""}`} aria-hidden="true" />
    </button>
  )
}

function Counter({ label, value = 0, onChange, min = 0, max = 10 }) {
  const v = Number.isFinite(+value) ? +value : 0
  const set = (x) => onChange?.(Math.max(min, Math.min(max, x)))
  return (
    <div className="flex items-center justify-between h-10 rounded-md border border-zinc-200 bg-white px-2">
      <span className="text-sm opacity-70 pl-1">{label}</span>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => set(v - 1)} className="h-8 w-8 border rounded-md" aria-label={`Moins ${label}`}>−</button>
        <span className="w-6 text-center tabular-nums">{v}</span>
        <button type="button" onClick={() => set(v + 1)} className="h-8 w-8 border rounded-md" aria-label={`Plus ${label}`}>+</button>
      </div>
    </div>
  )
}

/* ================= WRAPPER ================= */
export default function FiltersBarSticky({
  facets = {},
  cities: citiesProp,
  types: typesProp,
  onChange,
  onSearch,
  resultCount,
  anchorId = "filters-under-hero",
  topOffset, // prioritaire si fourni
}) {
  const autoHeaderOffset = useHeaderOffset()
  const headerOffset = typeof topOffset === "number" ? topOffset : autoHeaderOffset

  // visibilité stable (sans clignotement)
  const visible = useStickyVisibility(anchorId, headerOffset, { deadZone: 6, minShowMs: 160, minHideMs: 220 })
  if (!visible) return null

  return (
    <StickyInner
      headerOffset={headerOffset}
      facets={facets}
      cities={citiesProp}
      types={typesProp}
      onChange={onChange}
      onSearch={onSearch}
      resultCount={resultCount}
    />
  )
}

/* ================= CHILD (hooks stables) ================= */
function StickyInner({
  headerOffset = 0,
  facets = {},
  cities: citiesProp,
  types: typesProp,
  onChange,
  onSearch,
  resultCount,
}) {
  const cities = citiesProp || facets.cities || []
  const types  = typesProp  || facets.types  || []

  const [filters, setFilters] = useState({
    city: "", type: "",
    priceMin: "", priceMax: "",
    chambresMin: 0, sdbMin: 0,
    surfaceMin: "", surfaceMax: "",
  })
  const lastPartial = useRef(null)
  const patch = (partial) => { lastPartial.current = partial; setFilters((s) => ({ ...s, ...partial })) }
  useDebouncedEffect(() => { if (lastPartial.current && typeof onChange === "function") onChange(lastPartial.current) }, [filters], 250)

  const n = typeof resultCount === "number" ? resultCount : null
  const searchLabel = n === null ? "Rechercher" : `Rechercher (${n})`
  const disabled = n === 0

  const [open, setOpen] = useState(null) // "ville"|"type"|"budget"|"rooms"|"surf"|null
  const anchorRef = useRef(null)
  const openWithAnchor = (id, e) => { anchorRef.current = e.currentTarget; setOpen((p) => (p === id ? null : id)) }

  return (
    <div
      role="search"
      className="sticky z-40 -mt-px"     // sous un header z-50
      style={{ top: headerOffset || 0 }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="py-0">
          {/* aucun fond sur toute la largeur -> pas de bande blanche */}
          <div className="grid place-items-center">
            {/* fond uniquement autour de la barre */}
            <div className="w-fit rounded-md border border-zinc-200/80 bg-white/70 supports-[backdrop-filter]:bg-white/60 backdrop-blur shadow-md">
              <div className="h-10 flex items-stretch gap-0 divide-x divide-zinc-200/80">
                <SquareButton active={open === "ville" || !!filters.city} onToggle={(e) => openWithAnchor("ville", e)}
                              className="w-[120px] justify-between bg-white" aria-haspopup="dialog" aria-expanded={open === "ville"}>
                  {filters.city || "Ville"}
                </SquareButton>

                <SquareButton active={open === "type" || !!filters.type} onToggle={(e) => openWithAnchor("type", e)}
                              className="w-[92px] justify-between bg-white" aria-haspopup="dialog" aria-expanded={open === "type"}>
                  {filters.type || "Type"}
                </SquareButton>

                <SquareButton active={open === "budget" || !!filters.priceMin || !!filters.priceMax} onToggle={(e) => openWithAnchor("budget", e)}
                              className="w-[96px] justify-between bg-white" aria-haspopup="dialog" aria-expanded={open === "budget"}>
                  Budget
                </SquareButton>

                <SquareButton active={open === "rooms" || !!filters.chambresMin || !!filters.sdbMin} onToggle={(e) => openWithAnchor("rooms", e)}
                              className="w-[128px] justify-between bg-white" aria-haspopup="dialog" aria-expanded={open === "rooms"}>
                  Ch.&amp;SDB
                </SquareButton>

                <SquareButton active={open === "surf" || !!filters.surfaceMin || !!filters.surfaceMax} onToggle={(e) => openWithAnchor("surf", e)}
                              className="w-[84px] justify-between bg-white" aria-haspopup="dialog" aria-expanded={open === "surf"}>
                  Surf.
                </SquareButton>

                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSearch?.(filters) }}
                  disabled={disabled}
                  className="h-full inline-flex items-center justify-center rounded-none bg-[#FF4A3E] text-white px-3 text-[14px] transition-colors hover:opacity-95 shrink-0 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF4A3E] focus-visible:ring-offset-white"
                  aria-disabled={disabled ? "true" : "false"}
                  title={disabled ? "Aucun résultat" : "Lancer la recherche"}
                >
                  {searchLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* POPOVERS */}
      <PortalPop open={open === "ville"} anchorRef={anchorRef} onClose={() => setOpen(null)}>
        <CityAutosuggest options={cities} value={filters.city} onChange={(v) => { patch({ city: v }) }} placeholder="Rechercher une ville" />
      </PortalPop>

      <PortalPop open={open === "type"} anchorRef={anchorRef} onClose={() => setOpen(null)}>
        <div className="grid grid-cols-2 gap-2">
          {types.length > 0 ? types.map((t) => (
            <button key={t} onClick={() => { patch({ type: t === filters.type ? "" : t }); setOpen(null) }}
              className={`rounded-md border px-3 py-2 text-sm text-left ${t === filters.type ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:bg-zinc-50"}`}>
              {t}
            </button>
          )) : <div className="text-sm text-zinc-500">Aucun type disponible</div>}
        </div>
      </PortalPop>

      <PortalPop open={open === "budget"} anchorRef={anchorRef} onClose={() => setOpen(null)}>
        <div className="grid grid-cols-2 gap-2">
          <input inputMode="numeric" value={filters.priceMin} onChange={(e) => patch({ priceMin: e.target.value })}
            placeholder="Min CHF" className="block h-10 w-full rounded-md border border-zinc-200 bg-white px-3" aria-label="Budget minimum en francs suisses" />
          <input inputMode="numeric" value={filters.priceMax} onChange={(e) => patch({ priceMax: e.target.value })}
            placeholder="Max CHF" className="block h-10 w-full rounded-md border border-zinc-200 bg-white px-3" aria-label="Budget maximum en francs suisses" />
        </div>
      </PortalPop>

      <PortalPop open={open === "rooms"} anchorRef={anchorRef} onClose={() => setOpen(null)}>
        <div className="grid grid-cols-1 gap-2">
          <Counter label="Chambres" value={filters.chambresMin} onChange={(v) => patch({ chambresMin: v })} min={0} max={10} />
          <Counter label="Salles de bain" value={filters.sdbMin} onChange={(v) => patch({ sdbMin: v })} min={0} max={10} />
        </div>
      </PortalPop>

      <PortalPop open={open === "surf"} anchorRef={anchorRef} onClose={() => setOpen(null)}>
        <div className="grid grid-cols-2 gap-2">
          <input inputMode="numeric" value={filters.surfaceMin} onChange={(e) => patch({ surfaceMin: e.target.value })}
            placeholder="Min m²" className="block h-10 w-full rounded-md border border-zinc-200 bg-white px-3" aria-label="Surface minimale" />
          <input inputMode="numeric" value={filters.surfaceMax} onChange={(e) => patch({ surfaceMax: e.target.value })}
            placeholder="Max m²" className="block h-10 w-full rounded-md border border-zinc-200 bg-white px-3" aria-label="Surface maximale" />
        </div>
      </PortalPop>
    </div>
  )
}
