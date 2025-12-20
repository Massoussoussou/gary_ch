// src/components/MapExplorer.jsx
import { useEffect, useMemo, useRef, useState } from "react"
import ListingCardV1 from "./cards/ListingCardV1.jsx"

const DEFAULT_CHIPS = [
  { key: "lake_view",     label: "Vue lac" },
  { key: "mountain_view", label: "Vue montagne" },
  { key: "city",          label: "Dans la ville" },
  { key: "lakeside",      label: "Bord du lac" },
  { key: "countryside",   label: "Campagne" },
]

function defaultChipMatch(chipKey, it) {
  const hay = [
    ...(it?.tags || []),
    it?.category, it?.categorie, it?.type,
    it?.titre, it?.title, it?.description,
  ].filter(Boolean).join(" ").toLowerCase()

  switch (chipKey) {
    case "lake_view":     return /lac|lake|lakeside|vue\s*lac/.test(hay)
    case "mountain_view": return /montagne|alps|mountain|alp/.test(hay)
    case "city":          return /ville|city|centre|downtown|urbain/.test(hay)
    case "lakeside":      return /bord\s*du\s*lac|lakeside|waterfront/.test(hay)
    case "countryside":   return /campagne|countryside|rural|village/.test(hay)
    default:              return true
  }
}

export default function MapExplorer({
  listings = [],
  onMarkerClick = () => {},
  onChipChange = () => {},
  chipDefs = DEFAULT_CHIPS,
  chipMatch = defaultChipMatch,
  title = "Découvrez la Suisse à travers ses maisons d’exception",
}) {
  const items = useMemo(
    () => (listings || []).filter(Boolean).map((it, idx) => {
      const stableId = it.id ?? it._id ?? it.slug ?? `${it.ville || "loc"}-${it.prix || "0"}-${idx}`
      return { ...it, __id: String(stableId) }
    }),
    [listings]
  )

  const [activeChip, setActiveChip] = useState(chipDefs[0]?.key || null)
  const filtered = useMemo(() => {
    const arr = items.filter((it) => chipMatch(activeChip, it))
    return arr.length ? arr : items
  }, [items, activeChip, chipMatch])

  const [activeId, setActiveId] = useState(filtered[0]?.__id || null)
  useEffect(() => {
    if (!filtered.length) return setActiveId(null)
    if (!filtered.some(i => i.__id === activeId)) setActiveId(filtered[0].__id)
  }, [filtered, activeId])

  const activeItem = useMemo(
    () => filtered.find(i => i.__id === activeId) || null,
    [filtered, activeId]
  )

  const listRef = useRef(null)
  useEffect(() => {
    if (!listRef.current || typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(() => {})
    ro.observe(listRef.current)
    return () => ro.disconnect()
  }, [])

  const selectItem = (id) => {
    setActiveId(id)
    onMarkerClick(id)
  }

  return (
    <section className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Titre centré */}
        <h2 className="font-serif text-2xl md:text-7xl leading-tight text-center max-w-5xl mx-auto">
          {title}
        </h2>

        {/* Grille : chips au-dessus de la carte (gauche), liste+preview (droite) */}
        <div className="mt-10 grid grid-cols-12 gap-y-10 gap-x-10 xl:gap-x-12 items-start">
          {/* Colonne gauche : chips + carte */}
          <div className="col-span-12 lg:col-span-7 w-full flex flex-col items-center">
            {/* Chips au-dessus de la carte */}
            <div className="w-full max-w-[720px] flex justify-center">
              <ul className="inline-flex flex-wrap gap-3 md:gap-4" role="list">
                {chipDefs.map((c) => {
                  const selected = c.key === activeChip
                  return (
                    <li key={c.key}>
                      <button
                        type="button"
                        onClick={() => { setActiveChip(c.key); onChipChange(c.key) }}
                        className={[
                          "inline-flex items-center justify-center h-10 md:h-11 px-4 md:px-5",
                          "text-[15px] md:text-base font-medium tracking-tight border rounded-none select-none",
                          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF4A3E]",
                          selected
                            ? "bg-[#FF4A3E] text-white border-[#FF4A3E]"
                            : "bg-white text-[#0F1115] border-black/20 hover:bg-black/5"
                        ].join(" ")}
                        aria-pressed={selected}
                      >
                        {c.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Carte */}
            <div
              className="mt-6 relative aspect-[4/3] w-full max-w-[720px] bg-white border border-black/20 rounded-none shadow-sm"
              role="img"
              aria-label="Carte — à brancher Mapbox/Leaflet"
              style={{ marginTop: 0 }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "linear-gradient(0deg, #000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-3 py-1.5 bg-white text-[#61646B] text-sm border border-black/10 rounded-none">
                  Carte — à brancher Mapbox/Leaflet
                </span>
              </div>
            </div>
          </div>

          {/* Colonne droite : liste + preview, alignées en haut */}
          <div className="col-span-12 lg:col-span-5 w-full max-w-[720px]">
            <div ref={listRef} className="bg-white border border-black/20 rounded-none shadow-sm">
              <ul
                className="max-h-28 overflow-y-auto divide-y divide-black/10 p-1"
                role="listbox"
                aria-label="Sélection de propriétés"
                aria-controls="map-explorer-preview"
              >
                {filtered.slice(0, 60).map((it) => {
                  const selected = it.__id === activeId
                  const label = (it.titre || it.title || it.ville || "—").toString()
                  return (
                    <li key={it.__id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        title={label}
                        onClick={() => selectItem(it.__id)}
                        className={[
                          "w-full text-left px-3.5 py-2 text-sm truncate",
                          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF4A3E]",
                          selected ? "bg-black/10" : "hover:bg-black/5"
                        ].join(" ")}
                      >
                        {label}
                      </button>
                    </li>
                  )
                })}
                {filtered.length === 0 && (
                  <li className="px-3.5 py-2 text-sm text-[#61646B]">Aucun bien</li>
                )}
              </ul>
            </div>

            <div id="map-explorer-preview" className="mt-5 w-full flex justify-center">
              {activeItem ? <PreviewCompact item={activeItem} /> : <EmptyPreview />}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PreviewCompact({ item }) {
  return (
    <div className="w-full">
      <div className="mx-auto w-[min(520px,100%)]">
        <div className="origin-top-left scale-[0.9] md:scale-[0.85] lg:scale-[0.8] [transform:translateZ(0)]">
          <ListingCardV1 item={item} />
        </div>
      </div>
    </div>
  )
}

function EmptyPreview() {
  return (
    <div className="min-h-[280px] border border-black/20 bg-white flex items-center justify-center rounded-none">
      <p className="text-[#61646B]">Aucun bien à prévisualiser</p>
    </div>
  )
}
