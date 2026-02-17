// src/components/ThreeHeroTiles.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const bands = [
  {
    id: "acheter",
    label: "ACHETER",
    to: "/acheter",
    // Mobile: centré / Desktop: gauche
    justify: "justify-center sm:justify-start",
    offsetClass: "md:ml-[8vw] lg:ml-[10vw]",
    direction: "left",
    delay: 0,
  },
  {
    id: "vendre",
    label: "VENDRE",
    to: "/vendre",
    // Mobile: centré / Desktop: droite
    justify: "justify-center sm:justify-end",
    offsetClass: "md:mr-[10vw] lg:mr-[12vw]",
    direction: "right",
    delay: 120,
  },
  {
    id: "estimer",
    label: "ESTIMER",
    to: "/estimer",
    // Mobile: centré / Desktop: gauche
    justify: "justify-center sm:justify-start",
    offsetClass: "md:ml-[6vw] lg:ml-[8vw]",
    direction: "left",
    delay: 240,
  },
];

export default function ThreeHeroTiles() {
  const [textEntered, setTextEntered] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [imageEntered, setImageEntered] = useState(false);

  useEffect(() => {
    const t0 = setTimeout(() => setImageEntered(true), 50);
    const t1 = setTimeout(() => setTextEntered(true), 80);
    const t2 = setTimeout(() => setPulsePhase(1), 300);
    const t3 = setTimeout(() => setPulsePhase(2), 1100);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <section className="relative h-[calc(100vh-80px)] w-full overflow-hidden bg-black">
      {/* IMAGE HERO DE FOND */}
      <div className="absolute inset-0">
        <img
          src="/bg-house.webp"
          alt="Propriété contemporaine avec piscine"
          className={`
            h-full w-full object-cover
            transform transition-transform duration-[1200ms] ease-out
            ${imageEntered ? "scale-100" : "scale-110"}
          `}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* CONTENU */}
      <div className="relative z-10 h-full w-full">
        <div className="grid h-full w-full grid-rows-3 border-y-[1.5px] border-white/60 divide-y-[1.5px] divide-white/45">
          {bands.map((band) => {
            const isLeft = band.direction === "left";
            const hiddenTransform = isLeft ? "-translate-x-full" : "translate-x-full";
            const peekTransform = isLeft ? "-translate-x-[60%]" : "translate-x-[60%]";
            const baseTransform = pulsePhase === 1 ? peekTransform : hiddenTransform;

            return (
              <Link
                key={band.id}
                to={band.to}
                className={`group relative flex ${band.justify} items-center overflow-hidden px-4 sm:px-6`}
              >
                {/* Remplissage orange animé */}
                <div
                  className={`
                    pointer-events-none absolute inset-0 bg-[#FF4A3E]
                    transform ${baseTransform}
                    transition-transform ease-out
                    ${pulsePhase === 1 ? "duration-700" : "duration-300"}
                    group-hover:translate-x-0 group-hover:duration-500
                  `}
                />

                {/* Texte */}
                <span
                  style={{ transitionDelay: `${band.delay}ms` }}
                  className={`
                    relative z-10
                    leading-none select-none
                    text-white font-light
                    transform transition-all duration-700
                    ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
                    ${textEntered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}

                    /* ✅ MOBILE (<640px) : taille fluide + tracking réduit + centrage */
                    text-[clamp(44px,14vw,86px)]
                    tracking-[0.18em]
                    text-center

                    /* ✅ DESKTOP (>=640px) : tu récupères ton style actuel */
                    sm:text-8xl sm:tracking-[0.25em]
                    md:text-9xl lg:text-10xl
                    ${band.offsetClass}
                  `}
                >
                  {band.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
