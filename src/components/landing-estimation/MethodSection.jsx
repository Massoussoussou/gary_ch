import React, { useRef, useState, useEffect } from "react";

const phases = [
  {
    num: "01",
    title: "Off-Market",
    desc: "Votre bien est présenté exclusivement à un cercle restreint d'acquéreurs qualifiés. La rareté crée la valeur.",
    tag: "Crée l'exclusivité",
    img: "/img/gary/garymontalegre03.webp",
  },
  {
    num: "02",
    title: "Coming Soon",
    desc: "La visibilité s'élargit progressivement. Les acquéreurs réalisent que la fenêtre se referme.",
    tag: "Amplifie la demande",
    img: "/img/gary/ExtVer-6.webp",
  },
  {
    num: "03",
    title: "Public",
    desc: "Publication sur tous les portails avec un historique de demandes et une dynamique de prix favorable.",
    tag: "Maximise le prix",
    img: "/img/gary/ExtBlv-8.webp",
  },
];

export default function MethodSection() {
  const headerRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const cardRefs = useRef([]);
  const [revealed, setRevealed] = useState([false, false, false]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const observers = cardRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setRevealed((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
          }
        },
        { threshold: 0.2 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section className="bg-white py-24 md:py-36 overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-5 md:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className="max-w-[650px] mb-16 md:mb-24"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(25px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <p className="text-[12px] uppercase tracking-[0.3em] text-[#FF4A3E] mb-4">
            Notre approche exclusive
          </p>
          <h2 className="font-serif text-[clamp(2.2rem,4.5vw,3.6rem)] tracking-[-0.03em] leading-[1.05] text-[#1A1A1A] mb-5">
            Une stratégie en 3 phases pour vendre au meilleur prix
            <span className="text-[#FF4A3E]">.</span>
          </h2>
          <p className="text-[1.05rem] text-neutral-500 leading-relaxed">
            La plupart des agences publient immédiatement. Nous faisons
            l'inverse : une diffusion séquentielle qui crée l'urgence à chaque
            étape.
          </p>
        </div>

        {/* Triptych — three vertical cards */}
        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {phases.map((p, i) => (
            <div
              key={p.num}
              ref={(el) => (cardRefs.current[i] = el)}
              className="group"
              style={{
                opacity: revealed[i] ? 1 : 0,
                transform: revealed[i] ? "translateY(0)" : "translateY(50px)",
                transition: `opacity 0.8s ease ${i * 0.15}s, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 0.15}s`,
              }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] md:aspect-[3/4] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-[1.04]"
                  style={{
                    filter: revealed[i] ? "grayscale(0)" : "grayscale(1)",
                    transition: `filter 1.5s ease ${i * 0.15 + 0.3}s, transform 0.7s ease-out`,
                  }}
                  loading="lazy"
                />
                {/* Dark gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-[#1A1A1A]/10 to-transparent" />

                {/* Phase badge */}
                <div className="absolute top-5 left-5">
                  <span className="inline-block bg-white/90 backdrop-blur-sm text-[#1A1A1A] text-[0.65rem] font-semibold uppercase tracking-[0.18em] px-3 py-1.5">
                    Phase {p.num}
                  </span>
                </div>

                {/* Large number watermark */}
                <span className="absolute bottom-2 right-4 font-serif text-[5rem] md:text-[6.5rem] text-white/[0.1] leading-none select-none pointer-events-none">
                  {p.num}
                </span>

                {/* Title on image */}
                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="font-serif text-[1.6rem] md:text-[1.9rem] text-white tracking-[-0.01em] leading-[1.1]">
                    {p.title}
                  </h3>
                </div>
              </div>

              {/* Content below */}
              <div className="pt-5 pb-3">
                <p className="text-[0.95rem] text-neutral-600 leading-relaxed mb-4">
                  {p.desc}
                </p>
                <span className="inline-flex items-center gap-2.5 text-[0.78rem] text-[#FF4A3E] font-medium tracking-[0.02em]">
                  <span className="w-5 h-px bg-[#FF4A3E]" />
                  {p.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
