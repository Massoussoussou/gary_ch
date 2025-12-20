// src/components/DoorRevealOverlay.jsx
import { useEffect, useRef, useState } from "react"
import GaryMonogram from "./brand/GaryMonogram.jsx" // <- OK même si on ne l'affiche plus

export default function DoorRevealOverlay() {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches

  const [visible, setVisible] = useState(
    !prefersReduced &&
    typeof window !== "undefined" &&
    sessionStorage.getItem("doorRevealed") !== "1"
  )
  const [open, setOpen] = useState(false)
  const doneRef = useRef(false)

  useEffect(() => {
    if (!visible) return
    const onScroll = () => setOpen(true)
    window.addEventListener("scroll", onScroll, { once: true, passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [visible])

  function finish() {
    if (doneRef.current) return
    doneRef.current = true
    try { sessionStorage.setItem("doorRevealed", "1") } catch {}
    window.dispatchEvent(new Event("door:reveal"))
    setVisible(false)
  }

  if (!visible) return null

  // Palette bois sombre (facile à tweaker)
  const tone = {
    base: "#2b1a10",   // fond
    mid:  "#3a2516",   // teinte panneau
    edge: "#1e120a",   // ombre / bords
    brass1: "#E8C96B", // laiton clair
    brass2: "#8C6A21", // laiton foncé
  }

  // Style "bois noble" par couches (opaque, pas de voile)
  const woodLayer = (side = "left") => ({
    backgroundColor: tone.mid,
    backgroundImage: [
      // grain fin (lignes obliques très discrètes)
      `repeating-linear-gradient(${side === "left" ? -7 : 7}deg,
        rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 2px,
        rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px
      )`,
      // légères nervures verticales espacées
      `repeating-linear-gradient(90deg,
        rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 10px
      )`,
      // lustrage vertical doux
      `linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.12))`,
    ].join(","),
    backgroundBlendMode: "overlay, normal, normal",
  })

  return (
    // NOTE: z-[60] (sous la barre), et éléments opaques (pas de transparence du contenu derrière)
    <div className="fixed inset-0 z-[60] pointer-events-none select-none" aria-hidden>
      {/* Battant gauche */}
      <div
        className={[
          "absolute inset-y-0 left-0 w-1/2 overflow-hidden",
          "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "-translate-x-full" : "translate-x-0",
        ].join(" ")}
      >
        {/* panneau bois opaque */}
        <div className="absolute inset-0" style={woodLayer("left")} />
        {/* teinte chaude + ombres internes */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${tone.edge}77, transparent 35%)` }} />
        <div className="absolute inset-0 shadow-[inset_-18px_0_36px_rgba(0,0,0,0.45)]" />
        {/* cadre intérieur pour aspect menuisé */}
        <div className="absolute inset-4 rounded-md border border-black/35 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]" />
        {/* reflet proche de la jointure */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white/14 to-transparent" />
        {/* poignée laiton (cercle) */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2">
          <div
            className="h-5 w-5 rounded-full"
            style={{ background: `linear-gradient(135deg, ${tone.brass1}, ${tone.brass2})`, boxShadow: "0 0 0 2px rgba(0,0,0,.2), inset 0 0 2px rgba(255,255,255,.35)" }}
          />
        </div>
      </div>

      {/* Battant droit */}
      <div
        className={[
          "absolute inset-y-0 right-0 w-1/2 overflow-hidden",
          "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-x-full" : "translate-x-0",
        ].join(" ")}
        onTransitionEnd={() => open && finish()}
      >
        <div className="absolute inset-0" style={woodLayer("right")} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(270deg, ${tone.edge}77, transparent 35%)` }} />
        <div className="absolute inset-0 shadow-[inset_18px_0_36px_rgba(0,0,0,0.45)]" />
        <div className="absolute inset-4 rounded-md border border-black/35 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white/14 to-transparent" />
        <div className="absolute left-8 top-1/2 -translate-y-1/2">
          <div
            className="h-5 w-5 rounded-full"
            style={{ background: `linear-gradient(135deg, ${tone.brass1}, ${tone.brass2})`, boxShadow: "0 0 0 2px rgba(0,0,0,.2), inset 0 0 2px rgba(255,255,255,.35)" }}
          />
        </div>
      </div>

      {/* jointure centrale fine + ombrage */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-white/25" />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[6px] -translate-x-1/2 bg-black/20 blur-[2px]" />

      {/* (Option) Monogramme au centre — désactivé pour un rendu plus clean */}
      {/* Tu peux réactiver si tu veux: il se lève/fade pendant l'ouverture */}
      {/* <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${open ? "-translate-y-20 opacity-0" : "opacity-100"}`}>
        <GaryMonogram size={96} />
      </div> */}

      {/* Bouton Passer */}
      <div className="absolute bottom-6 right-6 pointer-events-auto z-[95]">
        <button
          onClick={finish}
          className="rounded-full bg-white/90 px-3 py-1.5 text-sm shadow hover:bg-white"
        >
          Passer
        </button>
      </div>
    </div>
  )
}
