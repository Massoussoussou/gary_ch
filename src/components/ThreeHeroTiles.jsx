// src/components/ThreeHeroTiles.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const bands = [
  {
    id: "acheter",
    label: "ACHETER",
    to: "/acheter",
    justify: "justify-center sm:justify-start",
    offsetClass: "md:ml-[8vw] lg:ml-[10vw]",
    direction: "left",
    delay: 0,
  },
  {
    id: "vendre",
    label: "VENDRE",
    to: "/vendre",
    justify: "justify-center sm:justify-end",
    offsetClass: "md:mr-[10vw] lg:mr-[12vw]",
    direction: "right",
    delay: 120,
  },
  {
    id: "estimer",
    label: "ESTIMER",
    to: "/estimer",
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
    <section className="relative w-full overflow-hidden bg-black" style={{ height: 'calc(100svh - var(--header-h, 80px))' }}>
      {/* FOND HERO — vidéo portrait sur mobile, image sur desktop */}
      <div className="absolute inset-0">
        {/* Mobile : vidéo portrait */}
        <video
          className={`
            md:hidden h-full w-full object-cover
            transform transition-transform duration-[1200ms] ease-out
            ${imageEntered ? "scale-100" : "scale-110"}
          `}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/img/gary/01.webp"
        >
          <source src="/media/home/hero-mobile.mp4" type="video/mp4" />
        </video>

        {/* Desktop : image */}
        <img
          src="/img/gary/01.webp"
          alt="Propriété contemporaine avec piscine"
          width={1920}
          height={1080}
          fetchpriority="high"
          className={`
            hidden md:block h-full w-full object-cover
            transform transition-transform duration-[1200ms] ease-out
            ${imageEntered ? "scale-100" : "scale-110"}
          `}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* CONTENU */}
      <div className="relative z-10 h-full w-full flex flex-col justify-center sm:block">
        <div className="grid w-full grid-rows-3 gap-6 sm:gap-0 border-y-0 sm:border-y-[1.5px] border-white/60 divide-y-0 sm:divide-y-[1.5px] divide-white/45 h-[90%] sm:h-full">
          {bands.map((band, i) => {
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
                {/* Ligne raccourcie entre les boutons (mobile only) */}
                {i > 0 && (
                  <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-white/50 sm:hidden" />
                )}

                {/* Remplissage orange animé (desktop only) */}
                <div
                  className={`
                    pointer-events-none absolute inset-0 bg-[#FF4A3E]
                    hidden sm:block
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
                    text-white font-sans font-light
                    transition-[transform,opacity,color] duration-300
                    ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
                    ${textEntered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}

                    active:scale-110 active:text-[#FF4A3E]
                    sm:active:scale-100 sm:active:text-white

                    text-[clamp(28px,9vw,56px)]
                    tracking-[0.35em]
                    text-center

                    sm:text-6xl sm:tracking-[0.35em]
                    md:text-7xl lg:text-8xl
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
