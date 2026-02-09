// src/components/BandCarousel.jsx
import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ListingCardV1 from "./cards/ListingCardV1.jsx"
import ListingCardSold from "./cards/ListingCardSold.jsx"

export default function BandCarousel({ title, items = [], cta, onCta, renderItem }) {
  const wrapRef = useRef(null)
  const scroller = useRef(null)

  const [startPad, setStartPad] = useState(16) // padding gauche (aligne la 1re carte)
  const [endPad, setEndPad]     = useState(16) // padding droit (pour finir "au large")
  const [dragging, setDragging] = useState(false)
  const Card = renderItem || ListingCardV1;

  // Detect touch device: disable custom drag on touch to allow native momentum scroll
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches)
  }, [])

  // anti-clic fantôme
  const DRAG_THRESHOLD = 8
  const dragRef = useRef({ active:false, startX:0, startLeft:0, moved:false })

  // calcule les gouttières gauche/droite du container (pour padding du rail)
  useEffect(() => {
    const update = () => {
      const el = wrapRef.current
      if (!el) return
      const rect  = el.getBoundingClientRect()
      const css   = getComputedStyle(el)
      const pl    = parseFloat(css.paddingLeft || "0")
      const pr    = parseFloat(css.paddingRight || "0")

      // distance du bord de viewport jusqu’au bord intérieur du container
      const leftGutter  = Math.max(0, rect.left + pl)
      // distance du bord droit du viewport jusqu’au bord intérieur droit du container
      const rightGutter = Math.max(0, window.innerWidth - rect.right + pr)

      setStartPad(leftGutter)
      setEndPad(rightGutter || leftGutter) // si centré, ça sera symétrique
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const scrollBy = (dx) => scroller.current?.scrollBy({ left: dx, behavior: "smooth" })

  // drag libre
  const getClientX = (e) => (e.touches?.[0]?.clientX ?? e.clientX)
  const onDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return
    dragRef.current.active = true
    dragRef.current.moved  = false
    dragRef.current.startX = getClientX(e)
    dragRef.current.startLeft = scroller.current.scrollLeft
    setDragging(true)
  }
  const onMove = (e) => {
    if (!dragRef.current.active) return
    const dx = getClientX(e) - dragRef.current.startX
    if (!dragRef.current.moved && Math.abs(dx) > DRAG_THRESHOLD) dragRef.current.moved = true
    scroller.current.scrollLeft = dragRef.current.startLeft - dx
    e.preventDefault()
  }
  const onUp = () => {
    dragRef.current.active = false
    setDragging(false)
  }
  const onClickCapture = (e) => {
    if (dragRef.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      dragRef.current.moved = false
    }
  }

  if (!items.length) return null

  return (
    <section ref={wrapRef} className="w-full max-w-6xl mx-auto px-4 md:px-5 py-10 md:py-12">
      <div className="mb-4 md:mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <h2 className="font-serif text-2xl md:text-5xl">{title}</h2>
          <div className="hidden md:flex items-center gap-2">
            <button
              aria-label="Précédent"
              onClick={() => scrollBy(-Math.min(900, window.innerWidth * 0.8))}
              className="h-9 w-9 rounded-full bg-white shadow border border-zinc-200 flex items-center justify-center hover:bg-zinc-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              aria-label="Suivant"
              onClick={() => scrollBy(Math.min(900, window.innerWidth * 0.8))}
              className="h-9 w-9 rounded-full bg-white shadow border border-zinc-200 flex items-center justify-center hover:bg-zinc-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {cta && (
          <button
            onClick={onCta}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 text-white px-4 py-2 text-sm hover:brightness-110"
          >
            {cta}
          </button>
        )}
      </div>

      {/* Rail full-bleed, scroll LIBRE (pas de snap) + drag */}
      <div
        ref={scroller}
        className={`overflow-x-auto flex gap-4 md:gap-5 pb-2 ${!isTouch && dragging ? "cursor-grabbing" : !isTouch ? "cursor-grab" : ""} select-none
                    [-ms-overflow-style:none] [scrollbar-width:none]`}
        style={{
          scrollbarWidth: "none",
          marginLeft:  "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
          paddingLeft:  `${startPad}px`,   // même départ qu'actuellement
          paddingRight: `${endPad}px`,     // >>> ajoute un "coussin" à droite
          userSelect: "none",
          WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
        }}
        // Only attach drag handlers on non-touch devices (desktop)
        onMouseDown={!isTouch ? onDown : undefined}
        onMouseMove={!isTouch ? onMove : undefined}
        onMouseUp={!isTouch ? onUp : undefined}
        onMouseLeave={!isTouch ? onUp : undefined}
        onClickCapture={!isTouch ? onClickCapture : undefined}
        draggable={false}
        onDragStart={(e)=>e.preventDefault()}
      >
        {items.map((it, i) => (
          <div
            key={it.id ?? i}
            className="shrink-0 w-[320px] sm:w-[360px] md:w-[400px] lg:w-[420px] 2xl:w-[440px]"
          >
            <Card key={it.id ?? it.href ?? it.titre} listing={it} item={it} />
          </div>
        ))}
      </div>
    </section>
  )
}
