// src/components/sell/SellHero.jsx
import { useState, useRef, useEffect } from "react";
import CTAFuturaGlow, { KeyIcon } from "../cta/CTAFuturaGlow.jsx";
import CTAWhiteSweep from "../cta/CTAWhiteSweep.jsx";

/* ─── Contenu Hero — tuile glassmorphique centrée ─── */
function SellHeroContent() {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      setOffset(window.scrollY * 0.4);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-8 py-14 sm:py-16 md:py-28"
      style={{ transform: `translateY(${offset}px)` }}
    >
      <div className="relative flex justify-center">
        <div className="relative w-full max-w-[92vw] sm:max-w-[min(900px,84vw)] mx-auto">
          {/* Fond glassmorphique — identique Estimer / About */}
          <div
            className="
              absolute
              -inset-y-5 -inset-x-4
              sm:-inset-y-6 sm:-inset-x-6
              md:-inset-y-6 md:-left-6 md:-right-6
              bg-white/55 backdrop-blur-sm
              rounded-none
              shadow-[0_22px_70px_-45px_rgba(0,0,0,0.45)] md:shadow-none
            "
          />

          <div className="relative z-10 text-center px-3 sm:px-0 py-5 sm:py-0">
            <p className="text-[12px] md:text-[13px] uppercase tracking-[0.2em] text-neutral-600 mb-3">
              Vendre avec GARY
            </p>

            <h1 className="font-serif tracking-[-0.03em] leading-[0.95] md:leading-[0.9] text-[clamp(2.6rem,11vw,4.2rem)] md:text-[clamp(4.2rem,10vw,7.6rem)]">
              Votre bien mérite<br />
              mieux qu'une mise en ligne
              <span className="text-[#FF4A3E]">.</span>
            </h1>

            <p className="mt-5 text-[clamp(1.05rem,2.1vw,1.4rem)] text-neutral-900/90 max-w-[52ch] mx-auto">
              Nous ne publions pas votre bien partout en espérant un acheteur.
              Nous contrôlons qui le voit, quand, et à quel prix.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <CTAFuturaGlow to="/estimer" label="Estimer mon bien" Icon={KeyIcon} />
              <CTAWhiteSweep to="#parcours" label="Notre approche" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Export principal ─── */
export default function SellHero() {
  const [ready, setReady] = useState(false);

  return (
    <>
      {/* Vidéo de fond FIXÉE */}
      <div className="fixed inset-0" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 bg-neutral-900" aria-hidden="true" />

        <img
          src="/media/sell/sell-hero-poster.webp"
          alt=""
          width="1920"
          height="1080"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            ready ? "opacity-0" : "opacity-100"
          }`}
          fetchpriority="high"
          decoding="async"
        />

        <video
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/sell/hero12.webp"
          onLoadedData={() => setReady(true)}
          onCanPlay={() => setReady(true)}
          aria-hidden="true"
        >
          <source src="/media/sell/hero12.webm" type="video/webm" />
          <source src="/media/sell/hero12.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-transparent md:from-white/55 md:via-white/25 md:to-transparent" />
        <div className="absolute inset-0 md:bg-gradient-to-r md:from-white/55 md:via-white/25 md:to-transparent" />
      </div>

      {/* Hero avec parallax */}
      <section
        className="relative min-h-[100svh] flex items-center overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <SellHeroContent />
      </section>
    </>
  );
}
