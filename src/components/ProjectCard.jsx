import { Link } from "react-router-dom"
import { Home, BedDouble, Ruler, Bath } from "lucide-react"

// Format prix CHF avec apostrophes
function formatCHF(n) {
  if (typeof n !== "number" || isNaN(n)) return n
  return "CHF " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'")
}

function isRecent(d, days = 21) {
  if (!d) return false
  const dt = new Date(d)
  if (isNaN(dt)) return false
  return Date.now() - dt.getTime() <= days * 24 * 60 * 60 * 1000
}

// size: "md" | "lg" | "xl"
export default function ListingCard({ item, size = "md" }) {
  const hasExclu = (item.tags || []).some((t) => /exclu/i.test(String(t)))
  const recent = isRecent(item.createdAt)
  const badgeLabel =
    item.badge || (hasExclu ? "EXCLUSIVITÉ" : recent ? "NOUVEAUTÉ" : null)

  // Aspect & typo selon la taille choisie
  const aspect =
    size === "xl" ? "aspect-[21/10]" : size === "lg" ? "aspect-[4/3]" : "aspect-[3/2]"
  const titleClass =
    size === "xl"
      ? "mt-1 font-serif text-xl md:text-2xl leading-snug line-clamp-2"
      : size === "lg"
      ? "mt-1 font-serif text-lg md:text-xl leading-snug line-clamp-2"
      : "mt-1 font-serif text-lg leading-snug line-clamp-2"

  return (
    <Link
      to={`/annonce/${item.id}`}
      className="group rounded-2xl overflow-hidden border border-line/60 bg-white hover:shadow-xl hover:-translate-y-0.5 transition
                 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
    >
      {/* Image + overlays */}
      <div className={`relative ${aspect} overflow-hidden`}>
        <img
          src={item.images?.[0]}
          alt={item.titre || "Annonce"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dégradé subtil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-70 group-hover:opacity-80 transition-opacity" />

        {/* Badge Nouveauté / Exclusivité */}
        {badgeLabel && (
          <span
            className={`absolute top-3 left-3 rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow
              ${hasExclu ? "bg-rose-600" : "bg-emerald-600"}`}
          >
            {badgeLabel}
          </span>
        )}

        {/* Prix (box orange translucide) */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-block rounded-md badge-price px-3 py-1.5 text-sm md:text-base font-semibold shadow-md min-w-[96px] text-center">
            {item.prix ? formatCHF(item.prix) : "Prix sur demande"}
          </span>
        </div>
      </div>

      {/* Corps */}
      <div className="p-4">
        {/* Ville + canton */}
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-text">{item.ville}</span>
          {item.canton && (
            <span className="ml-1 text-[12px] px-1.5 py-1 bg-gray-100 rounded uppercase">
              {item.canton}
            </span>
          )}
        </div>

        {/* Titre */}
        <div className={titleClass}>{item.titre}</div>

        {/* Infos compacts */}
        <div className="mt-3 flex flex-wrap items-center gap-5 text-[13px] text-text/70">
          <div className="inline-flex items-center gap-1">
            <Home className="w-4 h-4" />
            <span>{item.pieces ?? item.nbr_pieces ?? "-"} pièces</span>
          </div>
          <div className="inline-flex items-center gap-1">
            <BedDouble className="w-4 h-4" />
            <span>{item.chambres ?? item.nbr_chambres ?? "-"} ch.</span>
          </div>
          <div className="inline-flex items-center gap-1">
            <Ruler className="w-4 h-4" />
            <span>{item.surface_m2 ?? item.surface ?? "-"} m²</span>
          </div>
          <div className="inline-flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{item.sdb ?? item.salles_eau ?? item.salle_bain ?? "-"} s.d’eau</span>
          </div>
        </div>

        {/* Tags (3 max) */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags?.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-xs bg-bgAlt border border-line/60 rounded-full px-2 py-0.5"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
