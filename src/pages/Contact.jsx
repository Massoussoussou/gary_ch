// src/pages/Contact.jsx
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const ESTIMATE_BG = [
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d19?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496307653780-42ee777d4833?q=80&w=2400&auto=format&fit=crop",
];

const HERO_BG =
  "https://images.unsplash.com/photo-1515266591878-f93e32bc5937?q=80&w=2400&auto=format&fit=crop";

function BackgroundSlideshow({ images, duration = 6.2 }) {
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState(null);

  useEffect(() => {
    const next = (idx + 1) % images.length;

    // Précharge next (évite flash)
    const img = new Image();
    img.decoding = "async";
    img.src = images[next];

    const t = setTimeout(() => {
      setPrev(idx);
      setIdx(next);
      setTimeout(() => setPrev(null), 900); // durée fade
    }, duration * 1000);

    return () => clearTimeout(t);
  }, [idx, images, duration]);

  const current = images[idx];
  const previous = prev !== null ? images[prev] : null;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none select-none overflow-hidden">
      {/* previous */}
      {previous && (
        <div className="absolute inset-0 opacity-0 transition-opacity duration-900">
          <img
            src={previous}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover scale-[1.08]"
            decoding="async"
          />
        </div>
      )}

      {/* current */}
      <div className="absolute inset-0 opacity-100 transition-opacity duration-900">
        <img
          src={current}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover scale-[1.10] translate-x-[-2%]"
          decoding="async"
          fetchPriority="high"
        />
      </div>

      {/* Voiles luxe */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-0 bg-black/18" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-transparent md:from-white/55 md:via-white/25 md:to-transparent" />
        <div className="absolute inset-0 md:bg-gradient-to-r md:from-white/55 md:via-white/25 md:to-transparent" />
      </div>
    </div>
  );
}

function TabsDemandType({ type, onChange }) {
  const types = ["Achat", "Vente", "Estimation", "Autre"];

  return (
    <div className="flex justify-center">
      <div
        className="
          inline-flex items-center justify-center
          flex-wrap gap-2
          rounded-2xl sm:rounded-full
          border border-black/10 bg-black/5
          px-3 py-2
          max-w-full
        "
      >
        {types.map((t) => {
          const active = t === type;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange(t)}
              className={[
                "px-4 py-2 rounded-full uppercase tracking-[0.10em] text-[12px] font-semibold",
                "transition-colors border",
                active
                  ? "bg-[#FF4A3E] text-white border-[#FF4A3E]"
                  : "bg-white/80 text-black/70 border-black/10 hover:bg-white",
              ].join(" ")}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Tuile responsive :
 * - mobile (<md) : pleine largeur, hauteur auto, arrondi + blur (premium)
 * - desktop (>=md) : carré (base) qui s'agrandit si le contenu dépasse
 */
function SquareTile({ base = 780, children }) {
  const wrapRef = useRef(null);
  const [side, setSide] = useState(base);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = (e) => setIsMobile(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  useLayoutEffect(() => {
    if (isMobile) return;
    if (typeof ResizeObserver === "undefined") return;

    const el = wrapRef.current;
    const inner = el?.querySelector?.("[data-square-inner]");
    if (!el || !inner) return;

    const measure = () => {
      const innerH = inner.scrollHeight;
      setSide(Math.max(base, innerH + 32));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [base, isMobile]);

  return (
    <div ref={wrapRef} className="mx-auto w-full grid place-items-center">
      <div
        className="
          relative overflow-hidden shadow-xl
          border border-black/10 md:border-white/25
          bg-white/94 md:bg-white
          backdrop-blur-xl md:backdrop-blur-sm
          rounded-3xl md:rounded-none
          w-full max-w-[min(560px,94vw)] md:max-w-none
          h-auto
        "
        style={!isMobile ? { width: side, height: side } : undefined}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)" }}
        />
        {children}
      </div>
    </div>
  );
}

export default function Contact() {
  const [type, setType] = useState("Estimation");

  const onSubmit = (e) => {
    e.preventDefault();
    alert("Message envoyé (démo). Branche sur ton API/CRM.");
  };

  return (
    <div className="relative isolate min-h-screen overflow-x-clip">
      <BackgroundSlideshow images={[HERO_BG, ...ESTIMATE_BG]} duration={6.2} />

      {/* ✅ évite de passer sous le header mobile */}
      <main className="relative z-10 flex justify-center px-4 pt-24 pb-14 sm:py-16">
        <section className="w-full max-w-[min(980px,94vw)]">
          <SquareTile base={780}>
            <div
              data-square-inner
              className="relative z-10 px-5 sm:px-8 md:px-14 py-6 sm:py-8 md:py-12"
            >
              <header className="text-center mt-2 md:mt-8">
                <h1 className="font-serif tracking-[-0.03em] leading-tight text-[clamp(2.15rem,9vw,3.5rem)] text-black">
                  Parlez-nous de votre{" "}
                  <span className="text-[#FF4A3E]">projet</span>
                </h1>

                <p className="mt-3 text-[clamp(1rem,1.9vw,1.1rem)] text-black/70 max-w-md mx-auto">
                  Nous vous recontactons rapidement pour vous conseiller.
                </p>

                <div className="mt-6 md:mt-9">
                  <TabsDemandType type={type} onChange={setType} />
                </div>
              </header>

              <form onSubmit={onSubmit} className="mt-8 grid gap-5 md:gap-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="nom" className="text-sm text-black/70">
                      Nom
                    </label>
                    <input
                      id="nom"
                      name="nom"
                      required
                      className="w-full rounded-lg border border-black/15 bg-white/95 px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
                    />
                  </div>
                  <div>
                    <label htmlFor="prenom" className="text-sm text-black/70">
                      Prénom
                    </label>
                    <input
                      id="prenom"
                      name="prenom"
                      required
                      className="w-full rounded-lg border border-black/15 bg-white/95 px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="text-sm text-black/70">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full rounded-lg border border-black/15 bg-white/95 px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
                      placeholder="vous@exemple.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="tel" className="text-sm text-black/70">
                      Téléphone
                    </label>
                    <input
                      id="tel"
                      name="tel"
                      type="tel"
                      inputMode="tel"
                      required
                      className="w-full rounded-lg border border-black/15 bg-white/95 px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
                      placeholder="+41 79 123 45 67"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="sujet" className="text-sm text-black/70">
                    Sujet
                  </label>
                  <input
                    id="sujet"
                    name="sujet"
                    className="w-full rounded-lg border border-black/15 bg-white/95 px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
                    placeholder="Estimer mon bien / Vendre mon bien..."
                  />
                </div>

                <input type="hidden" name="type" value={type} />

                <div>
                  <label htmlFor="message" className="text-sm text-black/70">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full rounded-lg border border-black/15 bg-white/95 px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
                    placeholder="Décrivez votre bien (type, surface, localisation), vos délais, vos questions…"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-xs text-black/60 leading-relaxed">
                    En envoyant ce formulaire, vous acceptez d’être recontacté(e)
                    par GARY.
                  </p>

                  <button
                    type="submit"
                    className="group inline-flex items-center justify-center gap-2 px-7 md:px-9 py-3 rounded-2xl text-white shadow-lg transition hover:shadow-xl"
                    style={{ backgroundColor: "#FF4A3E" }}
                  >
                    Envoyer
                    <span
                      aria-hidden
                      className="inline-block translate-x-0 transition-transform duration-200 ease-out group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </SquareTile>
        </section>
      </main>
    </div>
  );
}
