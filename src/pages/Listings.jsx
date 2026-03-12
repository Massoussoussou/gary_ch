// src/pages/Listings.jsx
import { useMemo, useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import useProperties from "../hooks/useProperties.js"
import FiltersBar from "../components/FiltersBar.jsx"
import ListingGrid from "../components/ListingGrid.jsx"
import SortMenu from "../components/SortMenu.jsx"
import DesignSwitcher from "../components/DesignSwitcher.jsx"
import SpecsCard from "../components/listing/SpecsCard.jsx";
import { hasTag } from "../utils/data.js";

function uniqSorted(arr) {
  return [...new Set(arr.filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b), "fr"))
}

function deriveFacets(items){
  const cities   = uniqSorted(items.map(i => i.ville))
  const cantons  = uniqSorted(items.map(i => i.canton))
  const types    = uniqSorted(items.map(i => i.type))
  const features = uniqSorted(items.flatMap(i => i.equipements || []))
  return { cities, cantons, types, features }
}

function matchesAtouts(equipements = [], atouts = {}){
  const has = (needle) => equipements.some(x => x?.toString().toLowerCase().includes(needle))
  let ok = true
  if (atouts.jardin) ok = ok && has("jardin")
  if (atouts.piscine) ok = ok && has("piscine")
  if (atouts.vue) ok = ok && has("vue")
  if (atouts.garage) ok = ok && has("garage")
  if (atouts.parkingInterieur) ok = ok && (has("parking") || has("garage"))
  if (atouts.parkingExterieur) ok = ok && has("parking")
  if (atouts.cave) ok = ok && has("cave")
  if (atouts.balconTerrasse) ok = ok && (has("balcon") || has("terrasse"))
  return ok
}

function applyFilters(items, f){
  let res = items
  if (f.city)   res = res.filter(i => i.ville === f.city)
  if (f.canton) res = res.filter(i => i.canton === f.canton)
  if (f.type)   res = res.filter(i => i.type === f.type)

  const min = parseInt(f.priceMin || "0", 10)
  const max = parseInt(f.priceMax || "0", 10)
  if (min) res = res.filter(i => i.prix >= min)
  if (max) res = res.filter(i => i.prix <= max)

  const piecesMin = parseInt(f.piecesMin || "0", 10)
  if (piecesMin) res = res.filter(i => i.pieces >= piecesMin)

  const chMin = parseInt(f.chambresMin || "0", 10)
  if (chMin) res = res.filter(i => i.chambres >= chMin)

  const sdbMin = parseInt(f.sdbMin || "0", 10)
  if (sdbMin) res = res.filter(i => i.sdb >= sdbMin)

  const sMin = parseInt(f.surfaceMin || "0", 10)
  const sMax = parseInt(f.surfaceMax || "0", 10)
  if (sMin) res = res.filter(i => i.surface_m2 >= sMin)
  if (sMax) res = res.filter(i => i.surface_m2 <= sMax)

  const tMin = parseInt(f.terrainMin || "0", 10)
  if (tMin) res = res.filter(i => (i.terrain_m2 ? i.terrain_m2 >= tMin : true))

  if (f.meuble) res = res.filter(i => i.meuble)

  if (f.dispoBefore) {
    const d = f.dispoBefore
    res = res.filter(i => !i.dispo || i.dispo <= d)
  }

  if (f.atouts) res = res.filter(i => matchesAtouts(i.equipements, f.atouts))

  if (Array.isArray(f.extraFeatures) && f.extraFeatures.length){
    const want = f.extraFeatures.map(s => s.toLowerCase())
    res = res.filter(i => {
      const eq = (i.equipements || []).map(s => s.toLowerCase())
      return want.every(w => eq.some(e => e.includes(w)))
    })
  }
  return res
}

function sortItems(items, mode){
  const arr = [...items]
  if (mode === "prix-asc")       arr.sort((a,b)=>a.prix - b.prix)
  else if (mode === "prix-desc") arr.sort((a,b)=>b.prix - a.prix)
  else if (mode === "surface")   arr.sort((a,b)=>b.surface_m2 - a.surface_m2)
  else if (mode === "recent")    arr.sort((a,b)=>new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
  return arr
}

function hasActiveFilters(f){
  if (!f) return false
  return Object.entries(f).some(([k,v])=>{
    if (v == null) return false
    if (typeof v === "string") return v.trim() !== ""
    if (typeof v === "number") return !Number.isNaN(v) && v !== 0
    if (typeof v === "boolean") return v
    if (Array.isArray(v)) return v.length > 0
    if (typeof v === "object") return hasActiveFilters(v)
    return false
  })
}

// -------------------- NEW: lecture filtres/tri depuis l'URL --------------------
function parseFiltersFromQS(search) {
  const p = new URLSearchParams(search)
  const f = {}

  const pick = (k) => { const v = p.get(k); if (v !== null && v !== "") f[k] = v }
  // ajuster cette liste selon ce que tu envoies depuis BuyIntro / FiltersBarCompact
  ;["city","canton","type","priceMin","priceMax","piecesMin","chambresMin","sdbMin","surfaceMin","surfaceMax","terrainMin","dispoBefore"]
    .forEach(pick)

  if (p.get("meuble") === "1") f.meuble = true

  // atouts.*=1  -> f.atouts = { piscine:true, jardin:true, ... }
  for (const [k,v] of p.entries()) {
    if (k.startsWith("atouts.") && v === "1") {
      f.atouts ??= {}; f.atouts[k.slice(7)] = true
    }
  }

  // multi-valeurs éventuelles: extraFeatures=...&extraFeatures=...
  const extras = p.getAll("extraFeatures")
  if (extras.length) f.extraFeatures = extras

  return f
}

function parseSortFromQS(search) {
  const v = new URLSearchParams(search).get("sort")
  return v || "recent"
}

// -------------------- Component --------------------
export default function Listings(){
  const location = useLocation()
  const { data, loading, error } = useProperties()

  const available  = useMemo(() => data.filter(d => !d.vendu && !hasTag(d, /vendu|suspendu|archiv/i)), [data])
  const facets = useMemo(() => deriveFacets(available), [available])

  // init depuis l’URL, et re-sync si l’URL change (back/forward ou navigation depuis BuyIntro)
  const [filters, setFilters] = useState(() => parseFiltersFromQS(location.search))
  const [sort, setSort]       = useState(() => parseSortFromQS(location.search))

  useEffect(() => {
    setFilters(parseFiltersFromQS(location.search))
    setSort(parseSortFromQS(location.search))
  }, [location.search])

  const filtered   = useMemo(() => sortItems(applyFilters(available, filters), sort), [available, filters, sort])
  const isFiltered = hasActiveFilters(filters)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-neutral-500 animate-pulse">Chargement des annonces…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-red-500">Erreur de chargement : {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">

      <div className="relative">
        <FiltersBar
          cities={facets.cities}
          cantons={facets.cantons}
          types={facets.types}
          features={facets.features}
          resultCount={filtered.length}
          onChange={setFilters}
        />
      </div>

      <SortMenu value={sort} onChange={setSort} />

      <ListingGrid items={filtered} isFiltered={isFiltered} />
    </div>
  )
}
