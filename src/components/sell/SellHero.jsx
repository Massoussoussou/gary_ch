// src/components/sell/SellHero.jsx
import { useState } from "react";
import CTAFuturaGlow, { KeyIcon } from "../CTAFuturaGlow.jsx";
import CTAWhiteSweep from "../CTAWhiteSweep.jsx";

export default function SellHero() {
  const [ready, setReady] = useState(false);

  return (
    <section className="relative isolate h-[100svh] overflow-hidden">
      {/* === BACKGROUND (vidéo) === */}
      <div className="absolute inset-0 z-0">
        {/* Couleur de secours */}
        <div className="absolute inset-0 bg-neutral-900" aria-hidden="true" />

        {/* Poster = LCP */}
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

        {/* Vidéo */}
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

        {/* Voiles pour lisibilité */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-transparent md:from-white/55 md:via-white/25 md:to-transparent" />
        <div className="absolute inset-0 md:bg-gradient-to-r md:from-white/55 md:via-white/25 md:to-transparent" />
      </div>

      {/* === CONTENT (au-dessus du hero) === */}
      <div className="relative z-10 h-full mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-8">
        {/* ✅ Mobile centré / Desktop à gauche */}
        <div className="h-full flex items-center justify-center md:justify-start">
          <div className="relative w-full max-w-[92vw] sm:max-w-[min(900px,84vw)] mx-auto md:mx-0">
            {/* ✅ “tuile verre” : arrondi/ombre sur mobile seulement */}
            <div
              className="
                absolute
                -inset-y-5 -inset-x-4
                sm:-inset-y-6 sm:-inset-x-6
                md:-inset-y-6 md:-left-6 md:-right-6
                bg-white/55 backdrop-blur-sm
                rounded-3xl md:rounded-none
                shadow-[0_22px_70px_-45px_rgba(0,0,0,0.45)] md:shadow-none
              "
            />

            <div className="relative text-center px-3 sm:px-0 py-5 sm:py-0">
              <p className="text-[12px] md:text-[13px] uppercase tracking-[0.2em] text-neutral-600 mb-3">
                Vendre
              </p>

              {/* ✅ H1 plus petit sur mobile, identique sur md+ */}
              <h1 className="font-serif tracking-[-0.03em] leading-[0.95] md:leading-[0.9] text-[clamp(2.6rem,11vw,4.2rem)] md:text-[clamp(4.2rem,10vw,7.6rem)]">
                Vendez votre bien d’exception<span className="text-[#FF4A3E]">,</span>
                <br />
                <span className="block">discrètement.</span>
              </h1>

              <p className="mt-5 text-[clamp(1.05rem,2.1vw,1.4rem)] text-neutral-900/90 max-w-[52ch] mx-auto">
                Sélection stricte d’acheteurs, marketing premium et accompagnement senior
                pour optimiser votre prix et sécuriser la vente.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <CTAFuturaGlow to="/contact" label="Prendre rendez-vous" Icon={KeyIcon} />
                <CTAWhiteSweep to="/estimer" label="Estimation en ligne" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
