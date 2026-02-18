import React, { useState, useEffect, useRef } from "react";
import CTAFuturaGlow from "../cta/CTAFuturaGlow.jsx";
import CTAWhiteSweep from "../cta/CTAWhiteSweep.jsx";

function HeroContent({ onScrollToForm }) {
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
      <div className="relative flex justify-center md:justify-start">
        <div className="relative w-full max-w-[92vw] sm:max-w-[min(900px,84vw)] mx-auto md:mx-0">
          {/* Glassmorphic tile */}
          <div className="absolute -inset-y-5 -inset-x-4 sm:-inset-y-6 sm:-inset-x-6 md:-inset-y-8 md:-inset-x-8 bg-white/60 backdrop-blur-md rounded-2xl shadow-[0_22px_70px_-30px_rgba(0,0,0,0.25)]" />

          <div className="relative text-center px-3 sm:px-0 py-5 sm:py-0">
            {/* Eyebrow */}
            <p className="text-[12px] md:text-[13px] uppercase tracking-[0.2em] text-neutral-600 mb-3">
              Estimation immobilière
            </p>

            {/* Headline */}
            <h1 className="font-serif tracking-[-0.03em] leading-[0.95] md:leading-[0.9] text-[clamp(2.6rem,11vw,4.2rem)] md:text-[clamp(4.2rem,10vw,7.6rem)]">
              Estimez votre bien<span className="text-[#FF4A3E]">,</span>
              <br />
              <span className="block">gratuitement.</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-5 text-[clamp(1.05rem,2.1vw,1.4rem)] text-neutral-900/90 max-w-[52ch] mx-auto">
              Estimation détaillée en 48h par nos experts, basée sur les données
              du marché genevois. 100% gratuit et sans engagement.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <CTAFuturaGlow
                label="Estimer mon bien"
                onClick={onScrollToForm}
                minWidth={260}
              />
              <CTAWhiteSweep to="/contact" label="Contacter GARY" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection({ onScrollToForm }) {
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
        <HeroContent onScrollToForm={onScrollToForm} />
      </section>
    </>
  );
}
