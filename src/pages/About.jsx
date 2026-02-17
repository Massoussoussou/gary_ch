import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import team from "../data/team.json";

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

/* ========== Hook : progression du scroll dans un container ========== */
function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) { setProgress(0); return; }
      const p = Math.max(0, Math.min(1, -rect.top / scrollable));
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);
  return progress;
}

/* ========== Chiffres clés 2025 ========== */
const KEY_FIGURES = [
  { value: 100, suffix: "+", label: "ventes en 2025", prefix: "" },
  { value: 90, suffix: "+", label: "avis 5 étoiles sur Google", prefix: "", link: "https://www.google.com/maps/place/GARY+Real+Estate", linkText: "voir ici" },
  { value: 6.6, suffix: "M", label: "de vues sur nos publications", prefix: "", decimals: 1 },
  { value: 40, suffix: "k+", label: "followers sur nos réseaux", prefix: "" },
];

function KeyFigures() {
  const [sectionRef, seen] = useInViewOnce({ threshold: 0.2 });

  return (
    <div ref={sectionRef} className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pb-24 md:pb-32 pt-8 md:pt-12">
      {/* Ligne décorative orange au-dessus */}
      <div className="flex justify-center mb-10 md:mb-14">
        <div
          className="h-px bg-[#FF4A3E]/40"
          style={{
            width: seen ? "180px" : "0px",
            transition: "width 1s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>

      {/* Titre */}
      <h3
        className="text-center font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide mb-4 md:mb-5"
        style={{
          color: "white",
          opacity: seen ? 1 : 0,
          transform: seen ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
        }}
      >
        Quelques chiffres de <span className="text-[#FF4A3E]">2025</span>
      </h3>

      {/* Sous-ligne orange */}
      <div className="flex justify-center mb-14 md:mb-20">
        <div
          className="h-px bg-[#FF4A3E]/30"
          style={{
            width: seen ? "100px" : "0px",
            transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s",
          }}
        />
      </div>

      {/* Grille de chiffres */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 md:gap-y-16 gap-x-10 md:gap-x-16 lg:gap-x-20">
        {KEY_FIGURES.map((fig, i) => (
          <FigureItem key={i} fig={fig} index={i} active={seen} />
        ))}
      </div>
    </div>
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
      {/* Petit trait orange au-dessus */}
      <div
        className="mb-5 md:mb-6 h-px bg-[#FF4A3E]"
        style={{
          width: active ? "40px" : "0px",
          transition: `width 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay + 0.3}s`,
        }}
      />

      {/* Nombre */}
      <span
        className="font-serif text-[64px] md:text-[90px] lg:text-[110px] leading-none tracking-tight text-[#FF4A3E]"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {fig.prefix}{display}{fig.suffix}
      </span>

      {/* Label */}
      <p
        className="mt-4 text-[16px] md:text-[20px] uppercase tracking-[0.15em] text-white/70 leading-relaxed max-w-[280px]"
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

/* ========== Section Hero + Cercles fusionnés — scroll-driven ========== */
function HeroCirclesSection() {
  const [loaded, setLoaded] = useState(false);
  const isMobile = useIsMobile();
  const wrapperRef = useRef(null);
  const progress = useScrollProgress(wrapperRef);

  useEffect(() => { setLoaded(true); }, []);

  // Easing cubique
  const eased = 1 - Math.pow(1 - Math.min(progress * 1.6, 1), 3);

  // Taille : 320px mobile / 520px desktop
  const circleSize = isMobile ? 320 : 520;

  // Opacité des cercles : apparaissent progressivement
  const circleOpacity = Math.min(progress * 3, 1);

  // Les cercles se chevauchent légèrement au centre sur le logo
  const finalGap = isMobile ? -40 : -60;
  const finalOffset = finalGap / 2 + circleSize / 2;
  const startOffset = isMobile ? window.innerHeight * 0.6 : window.innerWidth * 0.5;
  const currentOffset = startOffset - (startOffset - finalOffset) * eased;

  // Textes dans les cercles
  const textOpacity = Math.min(progress * 2.5, 1);

  // "Qui sommes-nous" + indicateur scroll disparaissent quand on scrolle
  const heroFade = Math.max(0, 1 - progress * 5);

  return (
    <div ref={wrapperRef} className="relative" style={{ height: "300vh" }}>
      <div
        className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center"
      >
        {/* Logo GARY — toujours centré, présent dès le début */}
        <div
          className="absolute left-1/2 top-1/2 pointer-events-none flex flex-col items-center"
          style={{
            zIndex: 10,
            transform: "translate(-50%, -50%)",
          }}
        >
          <img
            src="/Logo/logo-gary-orange.png"
            alt="GARY"
            className="w-[160px] md:w-[280px] h-auto"
            style={{
              filter: "brightness(0) invert(1) drop-shadow(0 0 30px rgba(255,255,255,0.3))",
              opacity: loaded ? 1 : 0,
              transition: "opacity 1s ease-out 0.3s",
            }}
          />

          {/* "Qui sommes-nous" — disparaît au scroll */}
          <p
            className="mt-6 text-white/60 text-sm md:text-base uppercase tracking-[0.3em] font-light"
            style={{
              opacity: loaded ? heroFade : 0,
              transition: loaded ? "none" : "opacity 1s ease-out 0.8s",
            }}
          >
            Qui sommes-nous
          </p>
        </div>

        {/* Indicateur scroll — disparaît au scroll */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{
            zIndex: 10,
            opacity: loaded ? heroFade : 0,
            transition: loaded ? "none" : "opacity 1s ease-out 1.2s",
          }}
        >
          <span className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Scroll</span>
          <svg
            className="w-5 h-5 text-white/40"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"
            style={{ animation: "scrollBounce 2s ease-in-out infinite" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Cercle A (corail) — gauche / haut */}
        <div
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: `${circleSize}px`,
            height: `${circleSize}px`,
            zIndex: 5,
            background: "linear-gradient(135deg, #FF5C50 0%, #FF7A6A 100%)",
            opacity: circleOpacity,
            ...(isMobile ? {
              left: "50%",
              top: "50%",
              transform: `translate(-50%, calc(-50% - ${currentOffset}px))`,
            } : {
              top: "50%",
              left: "50%",
              transform: `translate(calc(-50% - ${currentOffset}px), -50%)`,
            }),
          }}
        >
          <div
            className="text-center pointer-events-none px-5"
            style={{ opacity: textOpacity }}
          >
            <h3 className="font-serif text-2xl md:text-4xl text-white tracking-wide leading-tight">
              Jeunes courtiers
            </h3>
            <div className="mx-auto my-3 h-px bg-white/30" style={{ width: "60px" }} />
            <p className="text-white/70 text-xs md:text-sm uppercase tracking-[0.12em] leading-relaxed">
              Marketing nouvelle génération
            </p>
            <p className="text-white/70 text-xs md:text-sm uppercase tracking-[0.12em] leading-relaxed mt-1">
              Innovante &amp; performante
            </p>
          </div>
        </div>

        {/* Cercle B (saumon) — droite / bas */}
        <div
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: `${circleSize}px`,
            height: `${circleSize}px`,
            zIndex: 5,
            background: "linear-gradient(225deg, #FF8A7A 0%, #FFA494 100%)",
            opacity: circleOpacity,
            ...(isMobile ? {
              left: "50%",
              top: "50%",
              transform: `translate(-50%, calc(-50% + ${currentOffset}px))`,
            } : {
              top: "50%",
              left: "50%",
              transform: `translate(calc(-50% + ${currentOffset}px), -50%)`,
            }),
          }}
        >
          <div
            className="text-center pointer-events-none px-5"
            style={{ opacity: textOpacity }}
          >
            <h3 className="font-serif text-2xl md:text-4xl text-white tracking-wide leading-tight">
              Grande expertise
            </h3>
            <div className="mx-auto my-3 h-px bg-white/30" style={{ width: "60px" }} />
            <p className="text-white/70 text-xs md:text-sm uppercase tracking-[0.12em] leading-relaxed">
              Marché immobilier local
            </p>
            <p className="text-white/70 text-xs md:text-sm uppercase tracking-[0.12em] leading-relaxed mt-1">
              60 ans d'expérience cumulée
            </p>
            <p className="text-white/70 text-xs md:text-sm uppercase tracking-[0.12em] leading-relaxed mt-1">
              Stratèges de la vente
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ========== Carte équipe grande avec hover ========== */
function TeamCard({ name, role, photo, quote, slug }) {
  const startX = useRef(0);

  const handleClick = (e) => {
    if (Math.abs(e.clientX - startX.current) > 5) e.preventDefault();
  };

  return (
    <Link
      to={`/equipe/${slug}`}
      className="group relative overflow-hidden shrink-0 w-[75vw] md:w-[420px] h-[55vh] md:h-[520px] border border-white/30 block"
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

      {/* Voile sombre de base */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-all duration-500 group-hover:opacity-0" />
      {/* Voile orange au hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "linear-gradient(to top, rgba(255,74,62,0.85) 0%, rgba(255,74,62,0.35) 45%, transparent 100%)" }}
      />

      {/* Infos en bas */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10 transition-transform duration-500 group-hover:translate-y-[-20px]">
        <p className="text-white/60 text-xs md:text-sm uppercase tracking-[0.2em] mb-1">{role}</p>
        <p className="text-white text-2xl md:text-3xl font-serif tracking-wide">{name}</p>

        {/* Citation — apparaît au hover */}
        <div className="overflow-hidden max-h-0 group-hover:max-h-40 transition-all duration-500 ease-out">
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
  const isMobile = useIsMobile();
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
    <div className="relative bg-black" style={{ minHeight: "100vh" }}>
      {/* ====== VIDÉO DE FOND FIXÉE ====== */}
      <video
        autoPlay muted loop playsInline
        className="fixed inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src="/media/buy/hero24.mp4" type="video/mp4" />
      </video>

      {/* Voile sombre fixé */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 1, background: "rgba(0,0,0,0.45)" }}
      />

      {/* ====== CONTENU SCROLLABLE ====== */}
      <div className="relative" style={{ zIndex: 10 }}>

        {/* Section 1+2 — Hero + Cercles fusionnés */}
        <HeroCirclesSection />

        {/* Section 3 — Équipe */}
        <section ref={teamSectionRef} className="relative py-16 md:py-24">
          <h2
            className="text-center text-white font-serif text-3xl md:text-6xl tracking-wide mb-6 md:mb-10"
            style={{
              opacity: teamSeen ? 1 : 0,
              transform: teamSeen ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
            }}
          >
            Notre équipe
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

          {/* Section 4 — Chiffres clés */}
          <KeyFigures />
        </section>
      </div>
    </div>
  );
}
