// src/pages/Contact.jsx — Page contact : tuile carrée opaque + slideshow + onglets intégrés
// - Slideshow plein écran derrière (images d'Estimate) : fade-in, pan linéaire gauche→droite, zoom linéaire
// - Tuile blanche OPAQUE et CARRÉE qui englobe tout le formulaire (peut dépasser l'écran en bas)
// - Onglets intégrés dans une barre blanche OPAQUE en haut du questionnaire (font partie du carré)

import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// === Images d'Estimate (extraits) ===
const ESTIMATE_BG = [
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d19?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496307653780-42ee777d4833?q=80&w=2400&auto=format&fit=crop",
]
const HERO_BG = "https://images.unsplash.com/photo-1515266591878-f93e32bc5937?q=80&w=2400&auto=format&fit=crop"

// === Icônes (mêmes logos que pour les onglets) ===
const Icons = {
  Estimation: (props) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <rect x="3" y="3" width="14" height="14" rx="2" />
      <path d="M7 7h6M7 11h6M7 15h3" />
      <path d="M17 17l4 4" />
    </svg>
  ),
  Achat: (props) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M3 11l9-7 9 7" />
      <path d="M9 21V11h6v10" />
      <circle cx="17" cy="14" r="1.6" />
      <path d="M20 17l-3 3" />
    </svg>
  ),
  Vente: (props) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M4 7h12l4 5-4 5H4z" />
      <path d="M9 12h6" />
    </svg>
  ),
  Autre: (props) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M4 12h2M18 12h2M12 4v2M12 18v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </svg>
  ),
}

// === Slideshow de fond, une image à la fois ===
function BackgroundSlideshow({ images, duration = 5.8, pan = 88, scaleFrom = 1.14, scaleTo = 1.22 }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const next = (idx + 1) % images.length
    const img = new Image()
    img.decoding = "async"
    img.src = images[next]
    const t = setTimeout(() => setIdx(next), duration * 1000)
    return () => clearTimeout(t)
  }, [idx, images, duration])

  const currentSrc = images[idx]

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none select-none">
      <AnimatePresence>
        <motion.div
          key={currentSrc}
          className="absolute inset-0 will-change-[transform,opacity] transform-gpu"
          initial={{ opacity: 0, x: -pan / 2, scale: scaleFrom }}
          animate={{ opacity: 1, x: pan / 2, scale: scaleTo }}
          exit={{ opacity: 0 }}
          style={{ transformOrigin: "50% 50%", backfaceVisibility: "hidden" }}
          transition={{
            opacity: { duration: 0.9, ease: [0.22, 0.61, 0.36, 1] },
            x: { duration: duration, ease: "linear" }, // vitesse constante
            scale: { duration: duration, ease: "linear" }, // zoom constant
          }}
        >
          <img
            src={currentSrc}
            alt=""
            aria-hidden
            className="absolute inset-0 object-cover [width:120vw] [height:120vh] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </motion.div>
      </AnimatePresence>

      {/* Voile blanc/assombrissement au-dessus des images */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-0 bg-black/18" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-transparent md:from-white/55 md:via-white/25 md:to-transparent" />
        <div className="absolute inset-0 md:bg-gradient-to-r md:from-white/55 md:via-white/25 md:to-transparent" />
      </div>
    </div>
  )
}

// === Onglets Type de demande – version "pills" plus grande ===
function TabsDemandType({ type, onChange }) {
  const types = [ "Achat", "Vente","Estimation", "Autre"]

  return (
    <div className="flex justify-center">
      <div
        role="tablist"
        aria-label="Type de demande"
        className="inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-black/5 bg-black/5 px-3 py-2 shadow-sm select-none max-w-full"

      >
        {types.map((t) => {
          const isActive = t === type
          const Icon = Icons[t]

          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(t)}
              className="relative px-0 py-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(255,74,62,0.25)] rounded-full"
            >
              <motion.span
                layout
                className="relative inline-flex items-center gap-2.25 md:gap-2.5 px-4.5 md:px-5 py-2 md:py-2.25 rounded-full"
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                {isActive && (
                  <motion.span
                    layoutId="contact-tab-pill"
                    className="absolute inset-0 rounded-full bg-white shadow-md"
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    aria-hidden
                  />
                )}

                {/* Icône */}
                {Icon && (
                  <span
                    className={
                      "relative z-10 grid place-items-center text-[1.15em] " +
                      (isActive ? "text-[#FF4A3E]" : "text-black/45")
                    }
                  >
                    <Icon className="w-[1.15em] h-[1.15em]" />
                  </span>
                )}

                {/* Label */}
                <span
                  className={
                    "relative z-10 text-[13px] md:text-[14px] font-semibold tracking-[0.09em] uppercase " +
                    (isActive ? "text-black" : "text-black/65")
                  }
                >
                  {t}
                </span>
              </motion.span>
            </button>
          )
        })}
      </div>
    </div>
  )
}


function SquareTile({ base = 780, children }) {
  const wrapRef = useRef(null)
  const [side, setSide] = useState(base)
  const [isMdUp, setIsMdUp] = useState(false)

  // Detecte "md" (>= 768px) pour garder la tuile carrée seulement sur desktop/tablette
  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(min-width: 768px)")
    const update = () => setIsMdUp(mq.matches)
    update()

    // compat Safari/anciens navigateurs
    if (mq.addEventListener) mq.addEventListener("change", update)
    else mq.addListener(update)

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update)
      else mq.removeListener(update)
    }
  }, [])

  // Mesure uniquement quand on est en md+
  useLayoutEffect(() => {
    if (!isMdUp) return
    const el = wrapRef.current
    if (!el) return
    const inner = el.querySelector("[data-square-inner]")
    if (!inner) return

    const measure = () => {
      const innerH = inner.scrollHeight
      const desired = Math.max(base, innerH + 32) // marge interne
      setSide(desired)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(inner)
    return () => ro.disconnect()
  }, [base, isMdUp])

  // ✅ MOBILE: tuile fluide (pas carrée)
  if (!isMdUp) {
    return (
      <div ref={wrapRef} className="mx-auto w-full">
        <div className="relative w-full bg-white/95 backdrop-blur-sm border border-white/25 shadow-md overflow-hidden rounded-2xl">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)" }}
          />
          {children}
        </div>
      </div>
    )
  }

  // ✅ DESKTOP (md+): tuile carrée comme avant
  return (
    <div ref={wrapRef} className="mx-auto grid place-items-center">
      <div
        className="relative bg-white backdrop-blur-sm border border-white/25 shadow-md overflow-hidden rounded-none"
        style={{ width: side, height: side }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)" }}
        />
        {children}
      </div>
    </div>
  )
}


export default function Contact() {
  const onSubmit = (e) => { e.preventDefault(); alert("Message envoyé (démo). Branche sur ton API/CRM.") }
  const [type, setType] = useState("Estimation")

  return (
    <div className="relative isolate min-h-screen">
      {/* FOND SLIDESHOW */}
      <BackgroundSlideshow images={[HERO_BG, ...ESTIMATE_BG]} duration={5.8} pan={88} scaleFrom={1.14} scaleTo={1.22} />

      {/* CONTENU : la page entière scroll (pas de scroll interne à la tuile) */}
      <main className="relative z-10 flex justify-center px-4 py-10 md:py-16">

        <section className="w-full max-w-[min(980px,94vw)]">
          <SquareTile base={780}>
            <div data-square-inner className="relative z-10 px-5 sm:px-8 md:px-14 py-7 sm:py-8 md:py-12">


            

              {/* En-tête */}
      <header className="text-center mt-6 md:mt-8">
  <h1 className="font-serif tracking-[-0.03em] leading-tight text-[clamp(2.15rem,7vw,3.5rem)] text-black">
    Parlez-nous de votre <span className="text-[#FF4A3E]">projet</span>
  </h1>

  <p className="mt-3 text-[clamp(1rem,1.9vw,1.1rem)] text-black/70 max-w-md mx-auto">
    Nous vous recontactons rapidement pour vous conseiller.
  </p>

  {/* Plus d’espace entre le bloc titre+phrase et les onglets */}
  <div className="mt-7 md:mt-9 flex justify-center">
    <TabsDemandType type={type} onChange={setType} />
  </div>
</header>


              {/* Formulaire (sans overflow interne) */}
              <form onSubmit={onSubmit} className="mt-8 grid gap-5 md:gap-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="nom" className="text-sm text-black/70">Nom</label>
                    <input id="nom" name="nom" required className="w-full rounded-lg border border-black/15 bg-white/95 px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]" />
                  </div>
                  <div>
                    <label htmlFor="prenom" className="text-sm text-black/70">Prénom</label>
                    <input id="prenom" name="prenom" required className="w-full rounded-lg border border-black/15 bg-white/95 px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="text-sm text-black/70">Email</label>
                    <input id="email" name="email" type="email" required className="w-full rounded-lg border border-black/15 bg-white/95 px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]" placeholder="vous@exemple.com" />
                  </div>
                  <div>
                    <label htmlFor="tel" className="text-sm text-black/70">Téléphone</label>
                    <input id="tel" name="tel" type="tel" inputMode="tel" required className="w-full rounded-lg border border-black/15 bg-white/95 px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]" placeholder="+41 79 123 45 67" />
                  </div>
                </div>

                {/* Sujet (le type est géré par les onglets) */}
                <div>
                  <label htmlFor="sujet" className="text-sm text-black/70">Sujet</label>
                  <input id="sujet" name="sujet" className="w-full rounded-lg border border-black/15 bg-white/95 px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]" placeholder="Estimer mon bien / Vendre mon bien..." />
                </div>
                {/* Valeur issue des onglets */}
                <input type="hidden" name="type" value={type} />

                {/* Message (conservé comme demandé) */}
                <div>
                  <label htmlFor="message" className="text-sm text-black/70">Message</label>
                  <textarea id="message" name="message" rows={6} className="w-full rounded-lg border border-black/15 bg-white/95 px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]" placeholder="Décrivez votre bien (type, surface, localisation), vos délais, vos questions…" />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-xs text-black/60 leading-relaxed">En envoyant ce formulaire, vous acceptez d’être recontacté(e) par GARY.</p>
                  <button type="submit" className="group inline-flex items-center justify-center gap-2 px-7 md:px-9 py-3 rounded-xl text-white shadow-lg transition hover:shadow-xl" style={{ backgroundColor: "#FF4A3E" }}>
                    Envoyer
                    <span aria-hidden className="inline-block translate-x-0 transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </form>
            </div>
          </SquareTile>
        </section>
      </main>
    </div>
  )
}
