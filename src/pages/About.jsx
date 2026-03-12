import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import team from "../data/team.json";
import CTAFuturaGlow, { PhoneIcon } from "../components/cta/CTAFuturaGlow.jsx";

/* ========== Hook : détecte mobile (< 768px) ========== */
function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const h = (e) => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}

/* ========== Hook : déclenche une seule fois quand l'élément est visible ========== */
function useInViewOnce(options = { threshold: 0.35 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (!ref.current || seen) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setSeen(true);
    }, options);
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [seen, options]);

  return [ref, seen];
}

/* ========== Hook : compteur animé (incrémente de 0 à target) ========== */
function useCountUp(target, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) { setValue(0); return; }
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(eased * target);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return value;
}


/* ========== Sponsors / Partenaires ========== */
const SPONSORS = [
  { name: "divorce.ch", src: "/sponsors/divorce-ch.jpeg" },
  { name: "Mise en Voix", src: "/sponsors/mise-en-voix.jpeg" },
  { name: "Planifique", src: "/sponsors/planifique.jpeg" },
  { name: "Plus+ Financement immobilier", src: "/sponsors/plus-financement.jpeg" },
  { name: "Veyrier Grand Donzel", src: "/sponsors/veyrier-grand-donzel.jpeg" },
];

/* ========== Section 7 — Partenaires (fond beige, cartes avec ombres) ========== */
function SponsorsSection() {
  const [ref, seen] = useInViewOnce({ threshold: 0.15 });

  return (
    <section ref={ref} className="relative z-10 w-full py-20 md:py-28 bg-[#FAF6F0]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Trait décoratif */}
        <div className="flex justify-center mb-6">
          <div
            className="h-[2px] bg-[#FF4A3E]"
            style={{
              width: seen ? "60px" : "0px",
              transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>

        <h3
          className="text-center font-serif text-3xl md:text-5xl tracking-wide mb-14 md:mb-20 text-gray-900"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(15px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          Nos <span className="text-[#FF4A3E]">partenaires</span>
        </h3>

        {/* Grille responsive avec cartes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6">
          {SPONSORS.map((s, i) => (
            <div
              key={s.name}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center p-6 md:p-8"
              style={{
                opacity: seen ? 1 : 0,
                transform: seen ? "translateY(0)" : "translateY(15px)",
                transition: `opacity 0.6s ease-out ${0.15 + i * 0.1}s, transform 0.6s ease-out ${0.15 + i * 0.1}s, box-shadow 0.3s ease`,
                minHeight: "120px",
              }}
            >
              <img
                src={s.src}
                alt={s.name}
                className="h-14 md:h-16 lg:h-20 w-auto max-w-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== Chiffres clés 2025 (fond beige) ========== */
const KEY_FIGURES = [
  { value: 100, suffix: "+", label: "ventes en 2025", prefix: "", icon: "sales" },
  { value: 90, suffix: "+", label: "avis 5 étoiles sur Google", prefix: "", link: "https://www.google.com/maps/place/GARY+Real+Estate", linkText: "voir ici", icon: "star" },
  { value: 6.6, suffix: "M", label: "de vues sur nos publications", prefix: "", decimals: 1, icon: "eye" },
  { value: 40, suffix: "k+", label: "followers sur nos réseaux", prefix: "", icon: "followers" },
];

function FigureIcon({ type }) {
  const cls = "w-8 h-8 md:w-10 md:h-10 text-[#FF4A3E]/70";
  switch (type) {
    case "sales":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      );
    case "star":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      );
    case "eye":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "followers":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      );
    default:
      return null;
  }
}

function KeyFigures() {
  const [sectionRef, seen] = useInViewOnce({ threshold: 0.2 });

  return (
    <section ref={sectionRef} className="relative z-10 w-full bg-[#FAF6F0] py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Trait décoratif orange au-dessus */}
        <div className="flex justify-center mb-6">
          <div
            className="h-[2px] bg-[#FF4A3E]"
            style={{
              width: seen ? "60px" : "0px",
              transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>

        {/* Titre */}
        <h3
          className="text-center font-serif text-3xl md:text-5xl tracking-wide mb-16 md:mb-20 text-gray-900"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          Quelques chiffres de <span className="text-[#FF4A3E]">2025</span>
        </h3>

        {/* Grille de chiffres */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-14 md:gap-y-16 gap-x-8 md:gap-x-12 lg:gap-x-16">
          {KEY_FIGURES.map((fig, i) => (
            <FigureItem key={i} fig={fig} index={i} active={seen} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FigureItem({ fig, index, active }) {
  const delay = index * 0.15;
  const count = useCountUp(fig.value, 2200, active);
  const display = fig.decimals
    ? count.toFixed(count >= fig.value * 0.99 ? fig.decimals : 1)
    : Math.round(count);

  return (
    <div
      className="flex flex-col items-center text-center"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
      }}
    >
      {/* Icône */}
      <div
        className="mb-4 md:mb-5"
        style={{
          opacity: active ? 1 : 0,
          transition: `opacity 0.6s ease-out ${delay + 0.1}s`,
        }}
      >
        <FigureIcon type={fig.icon} />
      </div>

      {/* Nombre — Inter (sans-serif) gras */}
      <span
        className="font-sans font-bold text-[52px] md:text-[72px] lg:text-[88px] leading-none tracking-tight text-[#FF4A3E]"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {fig.prefix}{display}{fig.suffix}
      </span>

      {/* Label */}
      <p
        className="mt-3 text-[14px] md:text-[17px] uppercase tracking-[0.12em] text-gray-600 leading-relaxed max-w-[260px]"
        style={{
          opacity: active ? 1 : 0,
          transition: `opacity 0.6s ease-out ${delay + 0.4}s`,
        }}
      >
        {fig.label}
      </p>

      {/* Lien optionnel */}
      {fig.link && (
        <a
          href={fig.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-[12px] uppercase tracking-[0.12em] text-[#FF4A3E]/80 hover:text-[#FF4A3E] transition-colors duration-300"
          style={{
            opacity: active ? 1 : 0,
            transition: `opacity 0.6s ease-out ${delay + 0.6}s`,
          }}
        >
          {fig.linkText}
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  );
}

/* ========== Contenu partagé ========== */
const VL = { label: "Puissance", sub: "Marketing", desc: "Une mise en valeur stratégique & une diffusion digitale maximale et maîtrisée", kw: ["stratégique", "maximale"] };
const VR = { label: "Expertise", sub: "Locale", desc: "Plus de 60 ans d'expérience cumulée sur le marché immobilier romand", kw: ["60 ans", "romand"] };
function hl(t, kw) { let r = t; kw.forEach(k => { r = r.replace(k, `<span class="text-[#FF4A3E] font-medium">${k}</span>`); }); return r; }

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/* ========== Section 1 — Hero : Ligne Expansion ========== */
/* Logo GARY → trait orange se dessine → s'élargit en tuile glassmorphique → contenu */
function HeroCirclesSection() {
  const [loaded, setLoaded] = useState(false);
  const [phase, setPhase] = useState(0);
  const wrapperRef = useRef(null);

  useEffect(() => { setLoaded(true); }, []);

  /* Scroll trigger */
  useEffect(() => {
    if (phase > 0) return;
    const fire = () => {
      setPhase(1);
      setTimeout(() => setPhase(2), 500);
      setTimeout(() => setPhase(3), 750);
      setTimeout(() => setPhase(4), 850);
    };
    window.addEventListener("wheel", fire, { once: true, passive: true });
    window.addEventListener("touchmove", fire, { once: true, passive: true });
    window.addEventListener("keydown", (e) => {
      if (["ArrowDown", "ArrowUp", "Space", "PageDown"].includes(e.code)) fire();
    }, { once: true });
    return () => {
      window.removeEventListener("wheel", fire);
      window.removeEventListener("touchmove", fire);
    };
  }, [phase]);

  const [winW, setWinW] = useState(() => typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setWinW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const tileW = Math.min(1100, winW - (winW < 768 ? 32 : 64));
  const tileH = winW < 768 ? 580 : winW < 1024 ? 510 : 490;

  return (
    <div ref={wrapperRef} className="relative" style={{ height: "200vh" }}>
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-neutral-200">
        {/* Vidéo de fond */}
        <video autoPlay muted loop playsInline disablePictureInPicture
          controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <source src="/media/buy/hero24.mp4" type="video/mp4" />
        </video>

        {/* Voile lumineux */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-transparent md:from-white/55 md:via-white/25 md:to-transparent" />
          <div className="absolute inset-0 md:bg-gradient-to-r md:from-white/55 md:via-white/25 md:to-transparent" />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-36 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ zIndex: 20, opacity: loaded && phase === 0 ? 1 : 0, transition: "opacity 0.3s ease-out" }}>
          <span className="text-white text-[11px] uppercase tracking-[0.2em]">Scroll</span>
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"
            style={{ animation: "heroScrollBounce 2s ease-in-out infinite" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Logo GARY initial */}
        <img src="/Logo/logo-gary-orange.png" alt="GARY"
          className="absolute left-1/2 pointer-events-none"
          style={{
            top: "45%",
            transform: "translate(-50%, -50%)",
            width: winW < 768 ? "280px" : winW < 1024 ? "380px" : "480px",
            opacity: loaded ? (phase >= 1 ? 0 : 1) : 0,
            transition: "opacity 0.5s ease-out",
            zIndex: 8,
          }}
        />

        {/* La ligne / rectangle qui grandit */}
        <div className="absolute left-1/2" style={{
          top: "45%",
          transform: "translate(-50%, -50%)", zIndex: 7,
          width: phase >= 2 ? tileW : phase >= 1 ? tileW : 0,
          height: phase >= 2 ? tileH : phase >= 1 ? 2 : 0,
          background: phase >= 2 ? "rgba(255,255,255,0.6)" : "#FF4A3E",
          backdropFilter: phase >= 2 ? "blur(16px)" : "none",
          WebkitBackdropFilter: phase >= 2 ? "blur(16px)" : "none",
          border: phase >= 2 ? "1px solid rgba(255,255,255,0.2)" : "none",
          transition: phase >= 2
            ? `width 0.8s ${EASE}, height 0.8s ${EASE}, background 0.6s ease-out, backdrop-filter 0.6s ease-out, -webkit-backdrop-filter 0.6s ease-out, border 0.6s ease-out`
            : `width 0.7s ${EASE}, height 0.1s ease-out`,
          overflow: "hidden",
        }}>
          <div className="w-full h-full flex flex-col justify-between" style={{
            opacity: phase >= 3 ? 1 : 0, transition: "opacity 0.6s ease-out",
          }}>
            <div className="text-center pt-8 md:pt-12 px-6 md:px-10 w-full flex-1 flex flex-col justify-center">
              <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-500 mb-6" style={{ opacity: phase >= 4 ? 1 : 0, transform: phase >= 4 ? "translateY(0)" : "translateY(8px)", transition: "all 0.5s ease-out" }}>Qui sommes-nous</p>
              <div className="flex flex-col md:flex-row items-center md:items-stretch">
                <div className="flex-1 text-center px-4 md:px-8" style={{ opacity: phase >= 4 ? 1 : 0, transform: phase >= 4 ? "translateX(0)" : "translateX(-20px)", transition: "all 0.7s ease-out 0.1s" }}>
                  <h3 className="font-serif text-[clamp(1.8rem,5.5vw,3.8rem)] text-neutral-900 leading-[1.08]"><span className="text-[#FF4A3E]">{VL.label}</span><br />{VL.sub}</h3>
                  <p className="mt-4 text-neutral-600 text-[clamp(0.95rem,1.8vw,1.15rem)] leading-relaxed max-w-[360px] mx-auto" dangerouslySetInnerHTML={{ __html: hl(VL.desc, VL.kw) }} />
                </div>
                <div className="hidden md:flex items-center justify-center w-px relative my-2"><div className="w-px bg-neutral-900 origin-bottom" style={{ height: "80%", transform: phase >= 4 ? "scaleY(1)" : "scaleY(0)", transition: `transform 1.2s ${EASE} 0.3s` }} /></div>
                <div className="md:hidden flex justify-center my-4"><div className="h-px bg-neutral-900 origin-left" style={{ width: "40%", transform: phase >= 4 ? "scaleX(1)" : "scaleX(0)", transition: `transform 1.2s ${EASE} 0.3s` }} /></div>
                <div className="flex-1 text-center px-4 md:px-8" style={{ opacity: phase >= 4 ? 1 : 0, transform: phase >= 4 ? "translateX(0)" : "translateX(20px)", transition: "all 0.7s ease-out 0.2s" }}>
                  <h3 className="font-serif text-[clamp(1.8rem,5.5vw,3.8rem)] text-neutral-900 leading-[1.08]"><span className="text-[#FF4A3E]">{VR.label}</span><br />{VR.sub}</h3>
                  <p className="mt-4 text-neutral-600 text-[clamp(0.95rem,1.8vw,1.15rem)] leading-relaxed max-w-[360px] mx-auto" dangerouslySetInnerHTML={{ __html: hl(VR.desc, VR.kw) }} />
                </div>
              </div>
            </div>
            {/* CTA — Découvrir nos résultats */}
            <div className="pb-6 md:pb-8 flex justify-center" style={{ opacity: phase >= 4 ? 1 : 0, transform: phase >= 4 ? "translateY(0)" : "translateY(10px)", transition: "all 0.6s ease-out 0.4s" }}>
                <span
                  className="cursor-pointer inline-flex flex-col items-center gap-1.5 text-[12px] md:text-[13px] uppercase tracking-[0.15em] text-neutral-600 hover:text-[#FF4A3E] transition-colors duration-300"
                  onClick={() => window.scrollTo({ top: window.innerHeight * 2, behavior: "smooth" })}
                >
                  Découvrir nos résultats
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"
                    style={{ animation: "heroScrollBounce 2s ease-in-out infinite" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
            </div>
          </div>
        </div>

        {/* Gradient bas */}
        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ zIndex: 15, background: "linear-gradient(to bottom, transparent, #ffffff)", opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.8s ease-out 0.3s" }}
        />
      </div>

      <style>{`
        @keyframes heroScrollBounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}


/* ========== Données "Ce qui nous distingue" ========== */
const DISTINGUISH_POINTS = [
  { main: "Chaque courtier possède plus de 10 ans d'expérience sur le marché immobilier local", detail: "Expertise confirmée, conseils stratégiques avisés" },
  { main: "Une approche marketing moderne et performante", detail: "Mise en valeur sur mesure, photos et vidéos professionnelles, diffusion stratégique" },
  { main: "Une communauté active et fidèle de plus de 40k followers", detail: null },
  { main: "Un réseau d'acheteurs qualifiés", detail: "Base de données de plus de 5000 clients acheteurs" },
  { main: "Un réseau de partenaires de confiance", detail: "Financements, notaires, avocats, architectes, …" },
];

/* ========== Ce qui nous distingue — Zigzag avec ligne SVG animée ========== */
function DistinguishZigzag({ seen }) {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  /* Scroll-driven progress : 0 → 1 en fonction de la position dans le viewport */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const winH = window.innerHeight;
      // Start animating when section enters viewport, finish when it's about to leave
      const start = winH * 0.85;
      const end = -rect.height * 0.3;
      const raw = (start - rect.top) / (start - end);
      setProgress(Math.max(0, Math.min(1, raw)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const count = DISTINGUISH_POINTS.length;

  /* Layout positions for each point — alternating left/right */
  /* Each point is positioned at a fixed vertical step */
  const stepY = 160; // vertical spacing between points in px
  const totalH = stepY * (count - 1) + 80; // extra padding at bottom
  const dotRadius = 8;

  /* Build SVG path connecting all dots with smooth curves */
  const getPositions = (containerW) => {
    const leftX = containerW * 0.18;
    const rightX = containerW * 0.82;
    const positions = DISTINGUISH_POINTS.map((_, i) => ({
      x: i % 2 === 0 ? leftX : rightX,
      y: 40 + i * stepY,
    }));
    return positions;
  };

  /* Build a smooth SVG cubic bezier path through all points */
  const buildPath = (positions) => {
    if (positions.length < 2) return "";
    let d = `M ${positions[0].x} ${positions[0].y}`;
    for (let i = 0; i < positions.length - 1; i++) {
      const curr = positions[i];
      const next = positions[i + 1];
      const midY = (curr.y + next.y) / 2;
      // Smooth S-curve between points
      d += ` C ${curr.x} ${midY}, ${next.x} ${midY}, ${next.x} ${next.y}`;
    }
    return d;
  };

  const [containerW, setContainerW] = useState(800);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setContainerW(el.offsetWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const positions = getPositions(containerW);
  const pathD = buildPath(positions);

  return (
    <div ref={sectionRef} className="mt-20 md:mt-28">
      {/* Trait orange décoratif */}
      <div className="flex justify-center mb-6">
        <div
          className="h-[2px] bg-[#FF4A3E]"
          style={{
            width: seen ? "60px" : "0px",
            transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>

      <h3
        className="text-center font-serif text-3xl md:text-5xl tracking-wide mb-16 md:mb-20 text-gray-900"
        style={{
          opacity: seen ? 1 : 0,
          transform: seen ? "translateY(0)" : "translateY(15px)",
          transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
        }}
      >
        Ce qui nous <span className="text-[#FF4A3E]">distingue</span>, concrètement.
      </h3>

      <div
        ref={containerRef}
        className="relative max-w-[900px] mx-auto px-6 md:px-12"
        style={{ height: totalH }}
      >
        {/* SVG ligne courbe connectant les points */}
        <svg
          className="absolute inset-0 w-full pointer-events-none"
          style={{ height: totalH }}
          viewBox={`0 0 ${containerW} ${totalH}`}
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d={pathD}
            stroke="#FF4A3E"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="2000"
            strokeDashoffset={2000 - 2000 * progress}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
        </svg>

        {/* Points et textes */}
        {DISTINGUISH_POINTS.map((point, i) => {
          const isLeft = i % 2 === 0;
          const pos = positions[i];
          /* Each point becomes visible when progress reaches its threshold */
          const pointThreshold = i / (count - 1) * 0.85;
          const pointVisible = progress > pointThreshold;

          return (
            <div
              key={i}
              className="absolute"
              style={{
                top: pos.y,
                left: isLeft ? 0 : "auto",
                right: isLeft ? "auto" : 0,
                transform: "translateY(-50%)",
                width: "50%",
                display: "flex",
                flexDirection: isLeft ? "row" : "row-reverse",
                alignItems: "center",
                gap: "16px",
              }}
            >
              {/* Le point orange */}
              <div
                className="shrink-0 relative"
                style={{
                  width: dotRadius * 2,
                  height: dotRadius * 2,
                }}
              >
                {/* Halo animé */}
                <span
                  className="absolute rounded-full bg-[#FF4A3E]/20"
                  style={{
                    inset: "-8px",
                    transform: pointVisible ? "scale(1)" : "scale(0)",
                    opacity: pointVisible ? 1 : 0,
                    transition: `transform 0.6s ${EASE} 0.1s, opacity 0.4s ease-out`,
                  }}
                />
                {/* Point solide */}
                <span
                  className="absolute inset-0 rounded-full bg-[#FF4A3E]"
                  style={{
                    transform: pointVisible ? "scale(1)" : "scale(0)",
                    transition: `transform 0.5s ${EASE}`,
                  }}
                />
              </div>

              {/* Texte */}
              <div
                className={isLeft ? "text-left" : "text-right"}
                style={{
                  opacity: pointVisible ? 1 : 0,
                  transform: pointVisible
                    ? "translateX(0)"
                    : isLeft ? "translateX(-20px)" : "translateX(20px)",
                  transition: `opacity 0.6s ease-out 0.15s, transform 0.6s ${EASE} 0.15s`,
                }}
              >
                <p className="text-[15px] md:text-[17px] leading-snug text-gray-900 font-medium">
                  {point.main}
                </p>
                {point.detail && (
                  <p className="mt-1.5 text-[13px] md:text-[14px] text-gray-500 leading-relaxed">
                    {point.detail}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Paragraphe de conclusion */}
      <p
        className="mt-16 text-center text-xl md:text-2xl leading-relaxed text-gray-700 font-light max-w-[800px] mx-auto px-6"
        style={{
          opacity: progress > 0.8 ? 1 : 0,
          transform: progress > 0.8 ? "translateY(0)" : "translateY(15px)",
          transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
        }}
      >
        L'ensemble réuni pour vous offrir un service <strong className="font-semibold text-[#FF4A3E]">sur mesure</strong>,
        à la hauteur de vos ambitions.
      </p>
    </div>
  );
}

/* ========== Section 2 — Notre identité (fond blanc) ========== */
function IdentitySection() {
  const [ref, seen] = useInViewOnce({ threshold: 0.3 });

  return (
    <section ref={ref} className="relative z-10 bg-white py-24 md:py-32">
      <div className="relative max-w-[1000px] mx-auto px-6 md:px-12 text-center">
        {/* Logo GARY orange — watermark derrière le texte, descend depuis le haut */}
        <img
          src="/Logo/logo-gary-orange.png"
          alt=""
          className="absolute left-0 right-0 mx-auto pointer-events-none"
          style={{
            top: "68%",
            transform: seen ? "translateY(-50%)" : "translateY(calc(-50% - 120px))",
            width: "clamp(400px, 65vw, 900px)",
            opacity: seen ? 0.08 : 0,
            transition: "opacity 1.2s ease-out 0.3s, transform 1.6s cubic-bezier(0.22, 1, 0.36, 1) 0.3s",
            zIndex: 0,
          }}
        />

        {/* Trait orange décoratif */}
        <div className="relative z-10 flex justify-center mb-6">
          <div
            className="h-[2px] bg-[#FF4A3E]"
            style={{
              width: seen ? "60px" : "0px",
              transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>

        {/* Titre */}
        <h2
          className="relative z-10 font-serif text-4xl md:text-6xl tracking-wide text-gray-900 mb-10 md:mb-12"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          Notre <span className="text-[#FF4A3E]">identité</span>
        </h2>

        {/* Texte */}
        <p
          className="relative z-10 text-xl md:text-2xl leading-relaxed text-gray-700 font-light"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(15px)",
            transition: "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
          }}
        >
          <strong className="font-semibold text-[#FF4A3E]">GARY</strong> est une agence immobilière spécialisée dans la vente d'appartements,
          de maisons et de projets neufs en suisse romande.
        </p>
        <p
          className="relative z-10 mt-4 text-xl md:text-2xl leading-relaxed text-gray-700 font-light"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(15px)",
            transition: "opacity 0.8s ease-out 0.35s, transform 0.8s ease-out 0.35s",
          }}
        >
          Véritables stratèges de la vente immobilière, notre équipe combine une connaissance fine du marché immobilier local,
          forgée par plus de <strong className="font-semibold text-[#FF4A3E]">60 ans d'expérience cumulée</strong>, à une expertise
          marketing nouvelle génération, innovante et performante.
        </p>
      </div>

      {/* Ce qui nous distingue — zigzag avec ligne SVG animée au scroll */}
      <DistinguishZigzag seen={seen} />
    </section>
  );
}

/* ========== Section 5 — Influenceurs immobilier suisse (fond beige) ========== */
function InfluencersSection() {
  const [ref, seen] = useInViewOnce({ threshold: 0.2 });

  return (
    <section ref={ref} className="relative z-10 bg-[#FAF6F0] py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Texte */}
          <div
            style={{
              opacity: seen ? 1 : 0,
              transform: seen ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
            }}
          >
            {/* Trait orange */}
            <div
              className="h-[2px] bg-[#FF4A3E] mb-6"
              style={{
                width: seen ? "60px" : "0px",
                transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />

            <h3 className="font-serif text-3xl md:text-5xl tracking-wide text-gray-900 mb-6 leading-tight">
              Les <span className="text-[#FF4A3E]">influenceurs</span> de l'immobilier suisse
            </h3>
            <p className="text-lg md:text-xl leading-relaxed text-gray-600 font-light">
              Votre bien touche une audience que les portails n'atteignent pas.
              Nous créons le désir avant même la mise en vente.
            </p>
          </div>

          {/* Instagram — profil + grille de posts */}
          <div
            style={{
              opacity: seen ? 1 : 0,
              transform: seen ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
            }}
          >
            {/* Header profil */}
            <a
              href="https://www.instagram.com/gary_realestate/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 mb-6 hover:opacity-80 transition-opacity"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#FF4A3E] flex items-center justify-center shrink-0 overflow-hidden">
                <img src="/Logo/logo-gary-orange.png" alt="GARY" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-900 text-base md:text-lg">gary_realestate</span>
                  <svg className="w-5 h-5 text-[#3897f0]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.4 14.6l-4.2-4.2 1.4-1.4 2.8 2.8 5.6-5.6 1.4 1.4-7 7z"/></svg>
                </div>
                <p className="text-gray-500 text-sm mt-0.5">36K followers</p>
              </div>
              <svg className="w-5 h-5 ml-auto text-gray-400 group-hover:text-[#FF4A3E] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            {/* Grille de posts (images immobilier) */}
            <div className="grid grid-cols-3 gap-1.5 rounded-lg overflow-hidden">
              {[
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=400&fit=crop&q=80",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop&q=80",
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=400&fit=crop&q=80",
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=400&fit=crop&q=80",
                "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=400&fit=crop&q=80",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=400&fit=crop&q=80",
              ].map((src, i) => (
                <a
                  key={i}
                  href="https://www.instagram.com/gary_realestate/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/post relative aspect-square overflow-hidden"
                >
                  <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover/post:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover/post:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white opacity-0 group-hover/post:opacity-100 transition-opacity duration-300" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>

            {/* Bouton */}
            <a
              href="https://www.instagram.com/gary_realestate/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.12em] text-[#FF4A3E] hover:text-[#E43E33] font-medium transition-colors"
            >
              Voir tout sur Instagram
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== Section 6 — Avis Google (fond blanc) ========== */
const GOOGLE_REVIEWS = [
  {
    name: "Sophie M.",
    rating: 5,
    text: "Une équipe au top ! Gregory et son équipe ont été d'une efficacité remarquable pour la vente de notre appartement. Résultat au-dessus de nos attentes. Je recommande vivement !",
  },
  {
    name: "Laurent D.",
    rating: 5,
    text: "Professionnalisme et réactivité. Steven a su nous accompagner tout au long du processus de vente avec beaucoup de professionnalisme. La stratégie marketing mise en place était innovante et efficace.",
  },
  {
    name: "Marie-Claire B.",
    rating: 5,
    text: "Expérience exceptionnelle avec GARY. Frédéric a trouvé des solutions là où d'autres avaient échoué. Sa connaissance du marché genevois est impressionnante. Merci pour tout !",
  },
  {
    name: "Thomas R.",
    rating: 5,
    text: "GARY a vendu notre villa en un temps record et à un prix supérieur à notre estimation. Leur approche marketing sur les réseaux sociaux a fait toute la différence. Bravo à toute l'équipe !",
  },
];

function GoogleReviewsSection() {
  const [ref, seen] = useInViewOnce({ threshold: 0.15 });

  return (
    <section ref={ref} className="relative z-10 bg-white py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Trait décoratif */}
        <div className="flex justify-center mb-6">
          <div
            className="h-[2px] bg-[#FF4A3E]"
            style={{
              width: seen ? "60px" : "0px",
              transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>

        <h3
          className="text-center font-serif text-3xl md:text-5xl tracking-wide mb-14 md:mb-20 text-gray-900"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(15px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          Ce que nos clients <span className="text-[#FF4A3E]">pensent</span> de nous
        </h3>

        {/* Avis clients */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GOOGLE_REVIEWS.map((review, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-100 shadow-md p-6 md:p-8"
              style={{
                opacity: seen ? 1 : 0,
                transform: seen ? "translateY(0)" : "translateY(15px)",
                transition: `opacity 0.6s ease-out ${0.2 + i * 0.12}s, transform 0.6s ease-out ${0.2 + i * 0.12}s`,
              }}
            >
              {/* Étoiles */}
              <div className="flex gap-1 mb-3">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <svg key={j} className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Texte */}
              <p className="text-gray-700 text-[15px] md:text-base leading-relaxed mb-4 italic">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Nom */}
              <p className="text-gray-900 font-semibold text-sm">{review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== Section 8 — CTA Final (fond sombre) ========== */
function CTASection() {
  const [ref, seen] = useInViewOnce({ threshold: 0.3 });

  return (
    <section ref={ref} className="relative z-10 bg-[#0A0A0A] py-24 md:py-32">
      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      <div className="relative max-w-[800px] mx-auto px-6 md:px-12 text-center">
        <h2
          className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide text-white mb-8 md:mb-10"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          Un projet immobilier ? <br className="hidden md:block" />
          <span className="text-[#FF4A3E]">Parlons-en.</span>
        </h2>

        <div
          className="flex justify-center"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(15px)",
            transition: "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
          }}
        >
          <CTAFuturaGlow
            to="/contact"
            label="Nous contacter"
            Icon={PhoneIcon}
          />
        </div>
      </div>
    </section>
  );
}

/* ========== Carte équipe avec hover ========== */
function TeamCard({ name, role, photo, quote, slug }) {
  const startX = useRef(0);

  const handleClick = (e) => {
    if (Math.abs(e.clientX - startX.current) > 5) e.preventDefault();
  };

  return (
    <Link
      to={`/equipe/${slug}`}
      className="group relative overflow-hidden shrink-0 w-[44vw] md:w-[420px] h-[36vh] md:h-[520px] border border-white/30 block"
      draggable={false}
      onMouseDown={(e) => { startX.current = e.clientX; }}
      onClick={handleClick}
    >
      <img
        src={photo}
        alt={`${name} — ${role}`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        loading="lazy"
        draggable={false}
      />

      {/* Voile sombre de base — masqué sur mobile */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-all duration-500 group-hover:opacity-0 max-md:opacity-0" />
      {/* Voile orange — toujours visible sur mobile, hover sur desktop */}
      {/* Voile orange — desktop: hover, mobile: toujours visible mais plus léger */}
      <div className="absolute inset-0 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "linear-gradient(to top, rgba(255,74,62,0.85) 0%, rgba(255,74,62,0.35) 45%, transparent 100%)" }}
      />
      <div className="absolute inset-0 md:hidden"
        style={{ background: "linear-gradient(to top, rgba(255,74,62,0.5) 0%, rgba(255,74,62,0.12) 40%, transparent 100%)" }}
      />

      {/* Infos en bas */}
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-8 z-10 transition-transform duration-500 group-hover:translate-y-[-20px] max-md:translate-y-[-10px]">
        <p className="text-white/60 text-[9px] md:text-sm uppercase tracking-[0.2em] mb-0.5 md:mb-1">{role}</p>
        <p className="text-white text-base md:text-3xl font-serif tracking-wide">{name}</p>

        {/* Citation — apparaît au hover */}
        <div className="overflow-hidden max-md:max-h-0 max-h-0 group-hover:max-h-40 transition-all duration-500 ease-out">
          <p className="text-white/80 text-sm md:text-base italic leading-relaxed mt-4">
            &ldquo;{quote}&rdquo;
          </p>
          <span
            className="inline-block mt-4 px-5 py-2 text-sm uppercase tracking-[0.15em] text-white border border-white/50
                       hover:bg-white hover:text-[#FF4A3E] transition-all duration-300"
          >
            Découvrir
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ========== Points interactifs sur la photo d'équipe ========== */
/* Chaque membre : position du point (%) + zone cliquable couvrant le corps */
const TEAM_DOTS = [
  { slug: "jared-camaddo",    dotX: 12.5, dotY: 38, zoneX: 3,  zoneY: 8,  zoneW: 16, zoneH: 85 },
  { slug: "frederic-batista",  dotX: 27,   dotY: 52, zoneX: 19, zoneY: 20, zoneW: 14, zoneH: 75 },
  { slug: "guive-emami",       dotX: 42,   dotY: 32, zoneX: 33, zoneY: 5,  zoneW: 14, zoneH: 75 },
  { slug: "gregory-autieri",   dotX: 52.5, dotY: 55, zoneX: 45, zoneY: 18, zoneW: 14, zoneH: 78 },
  { slug: "steven-bourg",      dotX: 69,   dotY: 56, zoneX: 60, zoneY: 18, zoneW: 15, zoneH: 78 },
  { slug: "florie-autieri",    dotX: 83.5, dotY: 38, zoneX: 76, zoneY: 10, zoneW: 17, zoneH: 82 },
];

function TeamMemberZone({ member, dotX, dotY, zoneX, zoneY, zoneW, zoneH, index }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  /* Position fluide du label qui suit la souris avec un léger délai */
  const labelRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const labelPos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);
  const containerRef = useRef(null);

  /* Lerp loop — le label rattrape la souris avec un facteur d'inertie */
  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      labelPos.current.x = lerp(labelPos.current.x, mousePos.current.x, 0.12);
      labelPos.current.y = lerp(labelPos.current.y, mousePos.current.y, 0.12);
      if (labelRef.current) {
        labelRef.current.style.left = `${labelPos.current.x}px`;
        labelRef.current.style.top = `${labelPos.current.y}px`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  /* Pair = au-dessus, impair = en-dessous */
  const labelBelow = index % 2 === 1;
  const yOffset = labelBelow ? 40 : -50;

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePos.current.x = e.clientX - rect.left;
    mousePos.current.y = e.clientY - rect.top + yOffset;
  }, [yOffset]);

  const handleMouseEnter = useCallback((e) => {
    setHovered(true);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top + yOffset;
      mousePos.current = { x, y };
      labelPos.current = { x, y };
    }
  }, [yOffset]);

  if (!member) return null;

  const relDotX = ((dotX - zoneX) / zoneW) * 100;
  const relDotY = ((dotY - zoneY) / zoneH) * 100;

  return (
    <div
      ref={containerRef}
      className="absolute cursor-pointer"
      style={{
        left: `${zoneX}%`,
        top: `${zoneY}%`,
        width: `${zoneW}%`,
        height: `${zoneH}%`,
        zIndex: hovered ? 30 : 20,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={() => navigate(`/equipe/${member.slug}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") navigate(`/equipe/${member.slug}`); }}
      aria-label={`Voir le profil de ${member.name}`}
    >
      {/* Point orange — positionné sur le torse */}
      <div
        className="absolute"
        style={{
          left: `${relDotX}%`,
          top: `${relDotY}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Pulse qui respire en continu */}
        <span
          className="absolute rounded-full"
          style={{
            width: "40px",
            height: "40px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(255,74,62,0.25)",
            animation: hovered ? "none" : "teamDotPulse 2.5s ease-in-out infinite",
            opacity: hovered ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Le point lui-même — s'étend en pill au hover */}
        <span
          className="flex items-center justify-center rounded-full"
          style={{
            width: hovered ? "90px" : "18px",
            height: hovered ? "30px" : "18px",
            background: "#FF4A3E",
            boxShadow: hovered
              ? "0 0 20px rgba(255,74,62,0.6), 0 2px 8px rgba(0,0,0,0.2)"
              : "0 0 10px rgba(255,74,62,0.5), 0 2px 6px rgba(0,0,0,0.15)",
            borderRadius: hovered ? "20px" : "50%",
            transition: "width 0.4s cubic-bezier(0.22, 1, 0.36, 1), height 0.4s cubic-bezier(0.22, 1, 0.36, 1), border-radius 0.4s ease, box-shadow 0.3s ease",
            transform: "translate(-50%, -50%)",
            position: "absolute",
            left: "50%",
            top: "50%",
          }}
        >
          <span
            className="text-white font-medium tracking-wide whitespace-nowrap"
            style={{
              fontSize: "12px",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "scale(1)" : "scale(0.7)",
              transition: "opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s",
            }}
          >
            voir →
          </span>
        </span>
      </div>

      {/* Label qui suit la souris avec inertie — reveal de gauche à droite */}
      <div
        ref={labelRef}
        className="absolute pointer-events-none"
        style={{
          transform: labelBelow ? "translate(-50%, 0%)" : "translate(-50%, -100%)",
          willChange: "left, top",
        }}
      >
        <span
          className="inline-block whitespace-nowrap font-semibold tracking-wide overflow-hidden"
          style={{
            fontSize: "clamp(14px, 1.3vw, 18px)",
            color: "#1a1a1a",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(6px)",
            outline: "0.5px solid rgba(255,74,62,0.4)",
            outlineOffset: "-3px",
            padding: hovered ? "10px 20px" : "10px 0px",
            maxWidth: hovered ? "300px" : "0px",
            opacity: hovered ? 1 : 0,
            transition: "max-width 1.2s cubic-bezier(0.22, 1, 0.36, 1), padding 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease",
          }}
        >
          {member.name}
        </span>
      </div>
    </div>
  );
}

function TeamPhotoSection() {
  return (
    <section className="relative z-10 overflow-hidden">
      <style>{`
        @keyframes teamDotPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          50% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
        }
      `}</style>
      <div className="relative w-full">
        <img
          src="/team-photo.jpg"
          alt="L'équipe GARY Real Estate"
          className="w-full h-auto block"
          loading="lazy"
        />

        {/* Zones cliquables + points interactifs */}
        {TEAM_DOTS.map((dot, i) => {
          const member = team.find((m) => m.slug === dot.slug);
          return (
            <TeamMemberZone key={dot.slug} member={member} index={i} {...dot} />
          );
        })}

        {/* Overlay dégradé bas léger */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>
    </section>
  );
}

/* ========== PAGE ABOUT ========== */
export default function About() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const setWidthRef = useRef(0);
  const offsetRef = useRef(0);
  const lastFrameTime = useRef(0);
  const isDragging = useRef(false);
  const dragLastX = useRef(0);
  const [teamSeen, setTeamSeen] = useState(false);
  const teamSectionRef = useRef(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Détecte quand la section équipe est visible → lance le carrousel
  useEffect(() => {
    const el = teamSectionRef.current;
    if (!el || teamSeen) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setTeamSeen(true);
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [teamSeen]);

  // Calcule la largeur d'un jeu de cartes
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const compute = () => {
      const totalW = el.scrollWidth;
      const sw = totalW / 3;
      if (sw > 0) setWidthRef.current = sw;
    };
    compute();
    const t1 = setTimeout(compute, 200);
    window.addEventListener("resize", compute);
    return () => { clearTimeout(t1); window.removeEventListener("resize", compute); };
  }, []);

  // Auto-scroll permanent — démarre quand teamSeen
  useEffect(() => {
    if (!teamSeen) return;
    let raf;
    const SPEED = 30;
    offsetRef.current = setWidthRef.current || 0;
    lastFrameTime.current = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - lastFrameTime.current) / 1000, 0.1);
      lastFrameTime.current = now;

      if (!isDragging.current) {
        offsetRef.current += SPEED * dt;
      }

      const sw = setWidthRef.current;
      if (sw > 0) {
        if (offsetRef.current >= sw * 2) offsetRef.current -= sw;
        else if (offsetRef.current < 0) offsetRef.current += sw;
      }

      const el = trackRef.current;
      if (el) el.style.transform = `translateX(${-offsetRef.current}px)`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [teamSeen]);

  // Drag souris
  const onMouseDown = useCallback((e) => {
    isDragging.current = true;
    dragLastX.current = e.clientX;
    const el = containerRef.current;
    if (el) { el.style.cursor = "grabbing"; el.style.userSelect = "none"; }
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const dx = e.clientX - dragLastX.current;
    offsetRef.current -= dx;
    dragLastX.current = e.clientX;
  }, []);

  const onMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    lastFrameTime.current = performance.now();
    const el = containerRef.current;
    if (el) { el.style.cursor = "grab"; el.style.userSelect = ""; }
  }, []);

  // Touch (mobile)
  const onTouchStart = useCallback((e) => {
    isDragging.current = true;
    dragLastX.current = e.touches[0].clientX;
  }, []);

  const onTouchMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - dragLastX.current;
    offsetRef.current -= dx;
    dragLastX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    lastFrameTime.current = performance.now();
  }, []);

  const displayTeam = [...team, ...team, ...team];

  return (
    <div className="relative" style={{ minHeight: "100vh" }}>

      {/* ====== SECTION 1 — Hero + Cercles (fond sombre) ====== */}
      <HeroCirclesSection />

      {/* ====== CONTENU POST-HERO (z-10 passe au-dessus du sticky) ====== */}
      <div className="relative" style={{ zIndex: 10 }}>

        {/* ====== SECTION 2 — Notre identité (fond blanc) ====== */}
        <IdentitySection />

        {/* ====== Photo d'équipe — bandeau pleine largeur avec points interactifs ====== */}
        <TeamPhotoSection />

        {/* ====== SECTION 3 — Chiffres clés 2025 (fond beige) ====== */}
        <KeyFigures />

        {/* ====== SECTION 4 — Équipe carousel (fond blanc) ====== */}
        <section ref={teamSectionRef} className="relative bg-white py-16 md:py-24">
          <div className="flex justify-center mb-6">
            <div
              className="h-[2px] bg-[#FF4A3E]"
              style={{
                width: teamSeen ? "60px" : "0px",
                transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </div>

          <h2
            className="text-center text-gray-900 font-serif text-3xl md:text-5xl tracking-wide mb-6 md:mb-10"
            style={{
              opacity: teamSeen ? 1 : 0,
              transform: teamSeen ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
            }}
          >
            Notre <span className="text-[#FF4A3E]">équipe</span>
          </h2>

          {/* Carrousel */}
          <div
            ref={containerRef}
            className="w-full overflow-hidden py-4"
            style={{
              cursor: "grab",
              opacity: teamSeen ? 1 : 0,
              transition: "opacity 0.8s ease-out 0.15s",
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              ref={trackRef}
              className="flex gap-5 md:gap-8 px-8 md:px-20"
              style={{ willChange: "transform" }}
            >
              {displayTeam.map((m, i) => (
                <div key={`${m.slug}-${i}`} className="shrink-0">
                  <TeamCard {...m} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== SECTION 5 — Influenceurs (fond beige) ====== */}
        <InfluencersSection />

        {/* ====== SECTION 6 — Avis Google (fond blanc) ====== */}
        <GoogleReviewsSection />

        {/* ====== SECTION 7 — Partenaires (fond beige) ====== */}
        <SponsorsSection />

        {/* ====== SECTION 8 — CTA final (fond sombre) ====== */}
        <CTASection />
      </div>
    </div>
  );
}
