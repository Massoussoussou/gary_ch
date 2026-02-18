import React, { useState, useEffect, useRef } from "react";

function HeroContent({ children }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      setOffset(window.scrollY * 0.35);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-8 py-14 sm:py-16 md:py-24"
      style={{ transform: `translateY(${offset}px)` }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-10 md:gap-14 items-start">

        {/* LEFT — Glassmorphic tile, offset to the left */}
        <div className="relative order-1 md:-translate-x-8">
          {/* Tile background */}
          <div className="absolute -inset-5 sm:-inset-6 bg-white/60 backdrop-blur-md rounded-2xl shadow-[0_22px_70px_-30px_rgba(0,0,0,0.25)]" />

          <div className="relative px-4 sm:px-6 py-8 sm:py-10 text-center md:text-left">
            {/* Eyebrow */}
            <p className="text-[12px] md:text-[13px] uppercase tracking-[0.2em] text-neutral-600 mb-3">
              Estimation immobilière
            </p>

            {/* Headline */}
            <h1 className="font-serif tracking-[-0.03em] leading-[0.95] text-[clamp(2.2rem,7vw,3.2rem)] md:text-[clamp(2.6rem,3.8vw,4.2rem)]">
              Estimez votre bien<span className="text-[#FF4A3E]">,</span>
              <br />
              <span className="block">gratuitement.</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-4 text-[clamp(0.95rem,1.8vw,1.15rem)] text-neutral-900/80 max-w-[42ch] mx-auto md:mx-0">
              Estimation détaillée en 48h par nos experts, basée sur les données
              du marché genevois. 100% gratuit et sans engagement.
            </p>

            {/* Stats */}
            <div className="mt-6 pt-6 border-t border-neutral-200/80 flex gap-6 md:gap-8 justify-center md:justify-start">
              <div>
                <span className="font-serif text-[26px] font-bold text-[#c8a45c]">3</span>
                <span className="block text-[11px] text-neutral-500 mt-1">Phases de vente</span>
              </div>
              <div>
                <span className="font-serif text-[26px] font-bold text-[#c8a45c]">48h</span>
                <span className="block text-[11px] text-neutral-500 mt-1">Estimation détaillée</span>
              </div>
              <div>
                <span className="font-serif text-[26px] font-bold text-[#c8a45c]">100%</span>
                <span className="block text-[11px] text-neutral-500 mt-1">Gratuit & sans engagement</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="order-2">
          {children}
        </div>

      </div>
    </div>
  );
}

export default function HeroSection({ children }) {
  const [ready, setReady] = useState(false);

  return (
    <>
      {/* Fixed background video */}
      <div className="fixed inset-0" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 bg-neutral-900" aria-hidden="true" />

        <img
          src="/media/sell/sell-hero-poster.webp"
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
          fetchPriority="high"
          decoding="async"
        />

        <video
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/sell/sell-hero-poster.webp"
          onLoadedData={() => setReady(true)}
          onCanPlay={() => setReady(true)}
          aria-hidden="true"
        >
          <source src="/media/sell/sell-hero-720p.webm" type="video/webm" />
          <source src="/media/sell/sell-hero-720p.mp4" type="video/mp4" />
        </video>

        {/* Overlay layers */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-transparent md:from-white/55 md:via-white/25 md:to-transparent" />
        <div className="absolute inset-0 md:bg-gradient-to-r md:from-white/55 md:via-white/25 md:to-transparent" />
      </div>

      {/* Hero section */}
      <section
        className="relative min-h-[100svh] flex items-center overflow-x-clip"
        style={{ zIndex: 1 }}
      >
        <HeroContent>{children}</HeroContent>
      </section>
    </>
  );
}
