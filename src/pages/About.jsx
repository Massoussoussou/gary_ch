import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
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

/* ========== Section 1 — Hero + Cercles : visibles, rotation 360° au scroll ========== */
function HeroCirclesSection() {
  const [loaded, setLoaded] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [showText, setShowText] = useState(false);
  const isMobile = useIsMobile();
  const wrapperRef = useRef(null);

  useEffect(() => { setLoaded(true); }, []);

  // Premier scroll → lance la rotation
  useEffect(() => {
    if (spinning) return;
    const trigger = () => { setSpinning(true); };
    window.addEventListener("wheel", trigger, { once: true, passive: true });
    window.addEventListener("touchmove", trigger, { once: true, passive: true });
    window.addEventListener("keydown", (e) => {
      if (["ArrowDown", "ArrowUp", "Space", "PageDown"].includes(e.code)) trigger();
    }, { once: true });
    return () => {
      window.removeEventListener("wheel", trigger);
      window.removeEventListener("touchmove", trigger);
    };
  }, [spinning]);

  // Après la rotation → affiche les textes
  useEffect(() => {
    if (!spinning) return;
    const t = setTimeout(() => setShowText(true), 1600);
    return () => clearTimeout(t);
  }, [spinning]);

  const circleSize = isMobile ? 340 : 600;
  const overlap = isMobile ? 60 : 100;
  const offsetX = (circleSize - overlap) / 2;

  return (
    <div ref={wrapperRef} className="relative" style={{ height: "200vh" }}>
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-black">
        {/* Vidéo de fond */}
        <video
          autoPlay muted loop playsInline
          disablePictureInPicture
          controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <source src="/media/buy/hero24.mp4" type="video/mp4" />
        </video>

        {/* Voile sombre */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1, background: "rgba(0,0,0,0.55)" }}
        />

        {/* Logo GARY — disparaît après la rotation */}
        <div
          className="absolute left-1/2 top-1/2 pointer-events-none flex flex-col items-center"
          style={{
            zIndex: 20,
            transform: "translate(-50%, -40%)",
            opacity: showText ? 0 : (loaded ? 1 : 0),
            transition: showText ? "opacity 0.5s ease-out" : "opacity 1s ease-out 0.3s",
          }}
        >
          <img
            src="/Logo/logo-gary-orange.png"
            alt="GARY"
            className="w-[120px] md:w-[200px] h-auto"
            style={{
              filter: "brightness(0) invert(1) drop-shadow(0 0 30px rgba(255,255,255,0.3))",
            }}
          />
          <p
            className="mt-6 text-white/60 text-sm md:text-base uppercase tracking-[0.3em] font-light"
            style={{
              opacity: spinning ? 0 : 1,
              transition: "opacity 0.4s ease-out",
            }}
          >
            Qui sommes-nous
          </p>
        </div>

        {/* Indicateur scroll */}
        <div
          className="absolute bottom-36 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{
            zIndex: 20,
            opacity: loaded && !spinning ? 1 : 0,
            transition: "opacity 0.3s ease-out",
          }}
        >
          <span className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Scroll</span>
          <svg
            className="w-5 h-5 text-white/40"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"
            style={{ animation: "heroScrollBounce 2s ease-in-out infinite" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/*
          Container qui tient les deux cercles.
          Au scroll il tourne de 360° clockwise autour du centre.
        */}
        <div
          className={`absolute pointer-events-none ${spinning ? "hero-orbit--spin" : ""}`}
          style={{
            left: "50%",
            top: "50%",
            width: 0,
            height: 0,
            zIndex: 5,
          }}
        >
          {/* Cercle A (corail) — à gauche */}
          <div
            className="absolute rounded-full flex items-center justify-center"
            style={{
              width: `${circleSize}px`,
              height: `${circleSize}px`,
              background: "linear-gradient(135deg, rgba(255,74,62,0.35) 0%, rgba(255,120,90,0.25) 100%)",
              backdropFilter: "blur(16px) saturate(1.4) brightness(1.2)",
              WebkitBackdropFilter: "blur(16px) saturate(1.4) brightness(1.2)",
              border: "1px solid rgba(255,255,255,0.28)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
              top: `${-circleSize / 2}px`,
              left: `${-circleSize / 2 - offsetX}px`,
              opacity: loaded ? 1 : 0,
              transition: "opacity 1s ease-out 0.4s",
            }}
          >
            <div
              className={`text-center pointer-events-none ${spinning ? "hero-counter-spin" : ""}`}
              style={{
                opacity: showText ? 1 : 0,
                transition: "opacity 0.6s ease-out",
              }}
            >
              <h3 className="font-serif text-4xl md:text-6xl text-white tracking-wide" style={{ lineHeight: "1.4" }}>
                Puissance
              </h3>
              <div className="flex justify-center my-3 md:my-4">
                <div className={`h-px bg-white/60 ${showText ? "hero-underline" : ""}`} style={{ width: 0 }} />
              </div>
              <h3 className="font-serif text-4xl md:text-6xl text-white tracking-wide" style={{ lineHeight: "1.4" }}>
                Marketing
              </h3>
              <div className="flex justify-center mt-3 md:mt-4">
                <div className={`h-px bg-white/60 ${showText ? "hero-underline hero-underline--delay" : ""}`} style={{ width: 0 }} />
              </div>
              <p className="mt-3 text-white/70 text-sm md:text-base max-w-[240px] mx-auto leading-relaxed tracking-wide">
                Une mise en valeur stratégique &amp; une diffusion digitale maximale et maîtrisée
              </p>
            </div>
          </div>

          {/* Cercle B (saumon) — à droite */}
          <div
            className="absolute rounded-full flex items-center justify-center"
            style={{
              width: `${circleSize}px`,
              height: `${circleSize}px`,
              background: "linear-gradient(225deg, rgba(255,130,100,0.35) 0%, rgba(255,180,150,0.22) 100%)",
              backdropFilter: "blur(16px) saturate(1.4) brightness(1.2)",
              WebkitBackdropFilter: "blur(16px) saturate(1.4) brightness(1.2)",
              border: "1px solid rgba(255,255,255,0.25)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.18)",
              top: `${-circleSize / 2}px`,
              left: `${-circleSize / 2 + offsetX}px`,
              opacity: loaded ? 1 : 0,
              transition: "opacity 1s ease-out 0.4s",
            }}
          >
            <div
              className={`text-center pointer-events-none ${spinning ? "hero-counter-spin" : ""}`}
              style={{
                opacity: showText ? 1 : 0,
                transition: "opacity 0.6s ease-out",
              }}
            >
              <h3 className="font-serif text-4xl md:text-6xl text-white tracking-wide" style={{ lineHeight: "1.4" }}>
                Expertise
              </h3>
              <div className="flex justify-center my-3 md:my-4">
                <div className={`h-px bg-white/60 ${showText ? "hero-underline" : ""}`} style={{ width: 0 }} />
              </div>
              <h3 className="font-serif text-4xl md:text-6xl text-white tracking-wide" style={{ lineHeight: "1.4" }}>
                Locale
              </h3>
              <div className="flex justify-center mt-3 md:mt-4">
                <div className={`h-px bg-white/60 ${showText ? "hero-underline hero-underline--delay" : ""}`} style={{ width: 0 }} />
              </div>
              <p className="mt-3 text-white/70 text-sm md:text-base max-w-[240px] mx-auto leading-relaxed tracking-wide">
                Plus de 60 ans d'expérience cumulée sur le marché immobilier romand
              </p>
            </div>
          </div>
        </div>

        {/* "Découvrir nos résultats" — invitation au scroll */}
        <div
          className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          style={{
            zIndex: 20,
            opacity: showText ? 1 : 0,
            transition: "opacity 0.8s ease-out 0.6s",
          }}
          onClick={() => window.scrollTo({ top: window.innerHeight * 2, behavior: "smooth" })}
        >
          <span className="text-white/70 text-[12px] md:text-[13px] uppercase tracking-[0.2em]">
            Découvrir nos résultats
          </span>
          <svg
            className="w-5 h-5 text-white/60"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"
            style={{ animation: "heroScrollBounce 2s ease-in-out infinite" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Gradient transition bas */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            zIndex: 15,
            background: "linear-gradient(to bottom, transparent, #ffffff)",
            opacity: showText ? 1 : 0,
            transition: "opacity 0.8s ease-out 0.3s",
          }}
        />
      </div>

      <style>{`
        @keyframes heroScrollBounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(6px); opacity: 1; }
        }

        /* Rotation 360° clockwise du container (les 2 cercles ensemble) */
        .hero-orbit--spin {
          animation: orbitSpin 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes orbitSpin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(180deg); }
        }
        @keyframes orbitSpinMobile {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(225deg); }
        }

        /* Contre-rotation pour que le texte ne tourne pas */
        .hero-counter-spin {
          animation: counterSpin 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes counterSpin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(-180deg); }
        }
        @keyframes counterSpinMobile {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(-225deg); }
        }

        @media (max-width: 767px) {
          .hero-orbit--spin {
            animation-name: orbitSpinMobile;
          }
          .hero-counter-spin {
            animation-name: counterSpinMobile;
          }
        }

        /* Trait blanc animé sous chaque mot */
        .hero-underline {
          animation: drawLine 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards;
        }
        .hero-underline--delay {
          animation-delay: 0.6s;
        }
        @keyframes drawLine {
          0%   { width: 0; }
          100% { width: 80px; }
        }
      `}</style>
    </div>
  );
}

/* ========== Section 2 — Notre identité (fond blanc) ========== */
function IdentitySection() {
  const [ref, seen] = useInViewOnce({ threshold: 0.3 });

  return (
    <section ref={ref} className="relative z-10 bg-white py-24 md:py-32">
      <div className="max-w-[800px] mx-auto px-6 md:px-12 text-center">
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

        {/* Titre */}
        <h2
          className="font-serif text-4xl md:text-6xl tracking-wide text-gray-900 mb-10 md:mb-12"
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
          className="text-xl md:text-2xl leading-relaxed text-gray-700 font-light"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(15px)",
            transition: "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
          }}
        >
          <strong className="font-semibold text-gray-900">GARY</strong> est une agence immobilière spécialisée dans la vente d'appartements,
          de maisons et de projets neufs en suisse romande.
        </p>
        <p
          className="mt-4 text-xl md:text-2xl leading-relaxed text-gray-700 font-light"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(15px)",
            transition: "opacity 0.8s ease-out 0.35s, transform 0.8s ease-out 0.35s",
          }}
        >
          Véritables stratèges de la vente immobilière, notre équipe combine une connaissance fine du marché immobilier local,
          forgée par plus de <strong className="font-semibold text-gray-900">60 ans d'expérience cumulée</strong>, à une expertise
          marketing nouvelle génération, innovante et performante.
        </p>
      </div>

      {/* Ce qui nous distingue — style Philosophie */}
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 mt-20 md:mt-28">
        <h3
          className="font-serif text-3xl md:text-5xl tracking-wide text-gray-900 text-center mb-14 md:mb-20"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(15px)",
            transition: "opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s",
          }}
        >
          Ce qui nous distingue<span className="text-[#FF4A3E]">,</span> concrètement.
        </h3>

        <div className="border-t border-neutral-300/60">
          {[
            {
              main: "Chaque courtier possède plus de 10 ans d'expérience sur le marché immobilier local",
              detail: "Expertise confirmée, conseils stratégiques avisés",
              img: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600",
            },
            {
              main: "Une approche marketing moderne et performante",
              detail: "Mise en valeur sur mesure, photos et vidéos professionnelles, diffusion stratégique sur les différents canaux d'acquisition",
              img: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600",
            },
            {
              main: "Une communauté active et fidèle de plus de 40k followers sur les réseaux sociaux",
              detail: null,
              img: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=600",
            },
            {
              main: "Un réseau d'acheteurs qualifiés",
              detail: "Base de données de plus de 5000 clients acheteurs",
              img: "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=600",
            },
            {
              main: "Un réseau de partenaires de confiance",
              detail: "Financements, notaires, avocats, architectes, …",
              img: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative border-b border-neutral-300/60 cursor-default transition-all duration-500 overflow-hidden"
              style={{
                opacity: seen ? 1 : 0,
                transform: seen ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.6s ease-out ${0.5 + i * 0.12}s, transform 0.6s ease-out ${0.5 + i * 0.12}s`,
              }}
            >
              <div className="flex items-center gap-5 py-7 md:py-9 transition-all duration-500 lg:group-hover:py-11">
                <span className="w-[10px] h-[10px] rounded-full bg-[#FF4A3E] shrink-0 transition-transform duration-300 lg:group-hover:scale-125" />
                <div className="flex-1 min-w-0">
                  <span className="font-serif text-[clamp(1.15rem,2.2vw,1.6rem)] tracking-[-0.01em] leading-[1.3] text-gray-900 block">
                    {item.main}
                  </span>
                  {item.detail && (
                    <span className="block mt-1.5 text-[14px] md:text-[15px] text-[#FF4A3E]/70 leading-relaxed">
                      {item.detail}
                    </span>
                  )}
                </div>
                {/* Image au hover — desktop uniquement */}
                <div className="hidden lg:block w-0 group-hover:w-[200px] h-[115px] shrink-0 overflow-hidden rounded-sm transition-all duration-500 opacity-0 group-hover:opacity-100">
                  <img
                    src={item.img}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              {/* Image visible — mobile/tablette */}
              <div className="lg:hidden overflow-hidden rounded-sm mb-6 -mt-1 max-h-0 group-hover:max-h-[200px] transition-all duration-500 opacity-0 group-hover:opacity-100">
                <img
                  src={item.img}
                  alt=""
                  className="w-full aspect-[16/9] object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>

        <p
          className="mt-14 md:mt-20 text-center text-xl md:text-2xl leading-relaxed text-gray-700 font-light"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.8s ease-out 1.2s, transform 0.8s ease-out 1.2s",
          }}
        >
          L'ensemble réuni pour vous offrir un accompagnement fluide, efficace,
          et centré sur la réussite de votre projet immobilier.
        </p>
      </div>
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

          {/* Instagram feed */}
          <div
            style={{
              opacity: seen ? 1 : 0,
              transform: seen ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
            }}
          >
            <a
              href="https://www.instagram.com/gary_realestate/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Profil header */}
              <div className="flex items-center gap-4 p-5 border-b border-gray-100">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[2px] shrink-0">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <img src="/Logo/logo-gary-orange.png" alt="GARY" className="w-9 h-auto" />
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-gray-900 text-sm">gary_realestate</span>
                    <svg className="w-4 h-4 text-[#3897f0]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.4 14.6l-4.2-4.2 1.4-1.4 2.8 2.8 5.6-5.6 1.4 1.4-7 7z"/></svg>
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">GARY Real Estate</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-around py-4 text-center border-b border-gray-100">
                <div>
                  <span className="block font-bold text-gray-900 text-base">105</span>
                  <span className="text-gray-500 text-[11px]">publications</span>
                </div>
                <div>
                  <span className="block font-bold text-gray-900 text-base">36K</span>
                  <span className="text-gray-500 text-[11px]">followers</span>
                </div>
                <div>
                  <span className="block font-bold text-gray-900 text-base">535</span>
                  <span className="text-gray-500 text-[11px]">suivi(e)s</span>
                </div>
              </div>

              {/* CTA */}
              <div className="p-5 flex items-center justify-center gap-2 text-[#FF4A3E] group-hover:text-[#E43E33] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <span className="text-sm font-semibold uppercase tracking-[0.1em]">Suivre sur Instagram</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
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

        {/* Google Reviews embed + lien */}
        <div
          className="mb-14 md:mb-20 flex flex-col items-center gap-4"
          style={{
            opacity: seen ? 1 : 0,
            transition: "opacity 0.6s ease-out 0.1s",
          }}
        >
          <div className="w-full rounded-lg overflow-hidden border border-gray-200" style={{ minHeight: "320px" }}>
            <iframe
              title="Avis Google — GARY Real Estate"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2761.5!2d6.1467!3d46.2044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c652fa0560c43%3A0x2e2e2e2e2e2e2e2e!2sGARY%20Real%20Estate!5e0!3m2!1sfr!2sch!4v1"
              className="w-full h-[320px] md:h-[400px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <a
            href="https://www.google.com/maps/place/GARY+Real+Estate"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.12em] text-[#FF4A3E] hover:text-[#E43E33] font-medium transition-colors"
          >
            Voir tous nos avis sur Google
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

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

        {/* ====== Photo d'équipe (pleine largeur) ====== */}
        <section className="relative z-10 bg-white">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-16 md:pb-24">
            <div className="overflow-hidden rounded-lg">
              <img
                src="/team-photo.jpg"
                alt="L'équipe GARY Real Estate"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>

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
