import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import TeamMemberCard from "../components/TeamMemberCard";
import team from "../data/team.json";
import DomeGallery from "../components/DomeGallery";
import CTAFuturaGlow, { PhoneIcon } from "../components/cta/CTAFuturaGlow.jsx";


/* ========== Bande sous le titre (sobre) ========== */
function TitleWithBand({ children, align = "left" }) {
  const bandColor = "rgba(255,74,62,0.10)";
  const heightEm = 0.55;
  const dropEm = 0.25;
  let leftInset = "2%", rightInset = "0%";
  if (align === "right") { leftInset = "0%"; rightInset = "8%"; }
  if (align === "center") { leftInset = "10%"; rightInset = "10%"; }
  return (
    <h2 className="relative inline-block text-3xl md:text-5xl font-serif leading-tight">
      <span
        aria-hidden
        className="absolute block z-0"
        style={{ left: leftInset, right: rightInset, height: `${heightEm}em`, bottom: `-${dropEm}em`, backgroundColor: bandColor }}
      />
      <span className="relative z-10">{children}</span>
    </h2>
  );
}

/* ========== Image plein écran (bandeau) ========== */
function FullBleedImage({ src, alt = "" }) {
  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] my-10 md:my-16">
      <img src={src} alt={alt} className="w-full h-[48vh] md:h-[64vh] object-cover" loading="lazy" />
    </div>
  );
}

/* ========== STRIP auto-défilante, drag-only, bords carrés ========== */
function AutoScrollStrip({
  images,
  // ↑ vitesse de base augmentée (0.28 → 0.42) pour que ça file un peu plus
  speed = 0.42,               
  speedMultiplier = 1,
  direction = -1,
  tileW = 420,
  rowHeightVh = 33.34,
}) {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const listRef = useRef(null);
  const rafRef = useRef(null);
  const xRef = useRef(0);
  const dragging = useRef(false);
  const lastPointerX = useRef(0);
  const [listW, setListW] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const multRef = useRef(speedMultiplier);
  useEffect(() => { multRef.current = speedMultiplier; }, [speedMultiplier]);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReducedMotion(mq.matches);
    handler();
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const measure = () => {
    if (!listRef.current) return;
    setListW(listRef.current.scrollWidth);
  };

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (listRef.current) ro.observe(listRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (!trackRef.current || reducedMotion) return;
    const step = () => {
      const v = direction * speed * multRef.current;
      xRef.current += v;
      if (xRef.current <= -listW) xRef.current += listW;
      if (xRef.current >= 0)      xRef.current -= listW;
      trackRef.current.style.transform = `translate3d(${xRef.current}px,0,0)`;
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [listW, speed, direction, reducedMotion]);

  // --- Drag uniquement (pas de molette) ---
  const onPointerDown = (e) => {
    dragging.current = true;
    lastPointerX.current = e.clientX;
    wrapRef.current?.setPointerCapture(e.pointerId);
    e.preventDefault();
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPointerX.current;
    lastPointerX.current = e.clientX;
    xRef.current += dx;
    while (xRef.current <= -listW) xRef.current += listW;
    while (xRef.current > 0)       xRef.current -= listW;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${xRef.current}px,0,0)`;
    }
    e.preventDefault();
  };
  const endDrag = (e) => {
    dragging.current = false;
    wrapRef.current?.releasePointerCapture?.(e.pointerId);
  };

  const Tile = ({ src }) => (
    <li
      className="relative flex-none h-full overflow-hidden border border-neutral-200 bg-neutral-100 group"
      style={{ width: `${tileW}px` }}
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.12] will-change-transform"
      />
    </li>
  );

  const ALL = images;

  return (
    <div
      ref={wrapRef}
      className="relative select-none cursor-grab active:cursor-grabbing"
      style={{ height: `${rowHeightVh}vh`, touchAction: "pan-y" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="overflow-visible h-full">
        <div ref={trackRef} className="flex gap-4 px-4 will-change-transform h-full">
          <ul ref={listRef} className="flex gap-4 h-full">
            {ALL.map((src, i) => <Tile key={`a-${i}`} src={src} />)}
          </ul>
          <ul className="flex gap-4 h-full" aria-hidden>
            {ALL.map((src, i) => <Tile key={`b-${i}`} src={src} />)}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ========== HERO à 3 BANDES collées plein écran ========== */
function HeroThreeStrips() {
  const ref = useRef(null);
  const [local, setLocal] = useState(0);
  const [sectionVh, setSectionVh] = useState(180);

  // ↓↓↓ Moins de scroll pour faire toute l’animation
  const ENTER_SPAN = 380;   // 700 → 380
  const ACCEL_SPAN = 520;   // 900 → 520
  const HOLD_PX    = 60;    // 100 → 60
  const BIG_GARY_FADE_PX = 180; // 280 → 180

  const clamp01  = (x) => Math.max(0, Math.min(1, x));
  const remap01  = (x, a, b) => clamp01((x - a) / (b - a));
  const easeOutC = (x) => 1 - Math.pow(1 - x, 3);

  // Calcule une hauteur de section plus courte (moins de défilement)
  useEffect(() => {
    const recompute = () => {
      const ih = typeof window !== "undefined" ? window.innerHeight : 800;
      const extra = (ENTER_SPAN + ACCEL_SPAN + HOLD_PX) / Math.max(1, ih) * 90; // 100 → 90 pour compresser un peu
      setSectionVh(100 + Math.round(extra));
    };
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const top = window.scrollY + el.getBoundingClientRect().top;
      const vh  = window.innerHeight;
      const totalLocal = Math.max(1, el.offsetHeight - vh);
      const l = Math.min(Math.max(0, window.scrollY - top), totalLocal);
      setLocal(l);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Progressions
  const pEnter   = easeOutC(remap01(local, 0, ENTER_SPAN));
  const pAccel   = remap01(local, ENTER_SPAN * 0.35, ENTER_SPAN + ACCEL_SPAN);
  const pBigGary = (t => 1 - Math.pow(1 - t, 3))(
    Math.max(0, Math.min(1, (local - ENTER_SPAN) / BIG_GARY_FADE_PX))
  );

  // Vitesse : de 1x → 8x (avant 1→6)
  const speedMult = 1 + 7 * pAccel;

  // Transform d’entrée des bandes
  const rowH = 100 / 3;
  const topTransform = `translate3d(${(-30 + 30 * pEnter)}px, ${(-rowH) * (1 - pEnter)}vh, 0)`;
  const midTransform = `translate3d(0, 0, 0)`;
  const botTransform = `translate3d(${(30 - 30 * pEnter)}px, ${(rowH) * (1 - pEnter)}vh, 0)`;

  const titleOpacity = 1 - clamp01(pEnter * 1.2);

  const bigGaryOpacity = pBigGary;
  const bigGaryScale   = 0.9 + 0.1 * pBigGary;

  const STRIP_IMAGES = [
    "https://images.pexels.com/photos/2583494/pexels-photo-2583494.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1600&h=900",
    "https://images.pexels.com/photos/29672245/pexels-photo-29672245.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1600&h=900",
    "https://images.pexels.com/photos/7746566/pexels-photo-7746566.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1600&h=900",
    "https://images.pexels.com/photos/13041118/pexels-photo-13041118.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1600&h=900",
    "https://images.pexels.com/photos/13752348/pexels-photo-13752348.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1600&h=900",
    "https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2000&auto=format&fit=crop",
    
    "https://images.pexels.com/photos/18559611/pexels-photo-18559611.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1600&h=900",
    "https://images.pexels.com/photos/32312775/pexels-photo-32312775.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1600&h=900",
    "https://images.pexels.com/photos/30278097/pexels-photo-30278097.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1200&h=800",
        
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop"
  ];

  return (
    <section ref={ref} className="relative" style={{ height: `${sectionVh}vh` }}>
      <div className="sticky top-0 h-screen bg-white overflow-hidden">
        {/* Petit titre + phrase (logo + baseline) */}
        <div
          className="max-w-6xl mx-auto px-4 pt-16 md:pt-24 text-center pointer-events-none"
          style={{ opacity: titleOpacity, transition: "opacity 160ms linear" }}
        >
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <img
              src="/Logo/logo-gary-orange.png"
              alt="GARY"
              className="h-[56px] md:h-[96px] w-auto object-contain"
              loading="eager"
            />
          </div>
          <p className="mt-3 text-lg md:text-2xl text-neutral-800">Groupe immobilier d’excellence — Suisse</p>
        </div>

        {/* 3 bandes qui remplissent l’écran */}
        <div className="absolute inset-0">
          {/* Bande du haut */}
          <div className="absolute left-0 right-0" style={{ top: 0, transform: topTransform, transition: "transform 80ms linear" }}>
            <AutoScrollStrip
              images={STRIP_IMAGES}
              direction={1}
              speed={0.2}           // 0.30 → 0.45 pour accentuer la vitesse
              speedMultiplier={speedMult}
              rowHeightVh={100 / 3}
              tileW={460}
            />
          </div>

          {/* Bande du milieu */}
          <div className="absolute left-0 right-0" style={{ top: "33.3333vh", transform: midTransform }}>
            <AutoScrollStrip
              images={STRIP_IMAGES}
              direction={-1}
              speed={0.2}
              speedMultiplier={speedMult}
              rowHeightVh={100 / 3}
              tileW={460}
            />
          </div>

          {/* Bande du bas */}
          <div className="absolute left-0 right-0" style={{ top: "66.6667vh", transform: botTransform, transition: "transform 80ms linear" }}>
            <AutoScrollStrip
              images={STRIP_IMAGES}
              direction={1}
              speed={0.2}
              speedMultiplier={speedMult}
              rowHeightVh={100 / 3}
              tileW={460}
            />
          </div>
        </div>

        {/* Flèche noire (non cliquable) sous la 2e bande */}
        <div
          className="pointer-events-none absolute left-0 right-0 flex justify-center"
          style={{
            top: "calc(66.6667vh + 100px)",
            opacity: 1 - Math.min(1, pEnter * 1.2),
            transition: "opacity 160ms linear",
          }}
        >
          <svg
            viewBox="0 0 64 36"
            width="88"
            height="50"
            className="animate-[nudge_1.8s_ease-in-out_infinite]"
            style={{ filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.25))" }}
            aria-hidden="true"
          >
            <path
              d="M16 12 L32 28 L48 12"
              fill="none"
              stroke="#000"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* keyframes locales */}
        <style>{`
          @keyframes nudge {
            0%   { transform: translateY(0);    opacity: 0.9; }
            50%  { transform: translateY(9px);  opacity: 1; }
            100% { transform: translateY(0);    opacity: 0.9; }
          }
        `}</style>

        {/* Logo GARY géant par-dessus, remplace le texte géant */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: bigGaryOpacity, transition: "opacity 160ms linear" }}
        >
          <img
            src="/Logo/logo-gary-orange.png"
            alt="GARY"
            className="w-[62vw] max-w-[1020px] h-auto"
            style={{ transform: `scale(${bigGaryScale})`, transition: "transform 160ms linear" }}
          />
        </div>
      </div>
    </section>
  );
}

/* ========== Section alternée (texte + image) ========== */
function AltSection({ title, copy, img, align = "left", onSeeTeam }) {
  return (
    <section className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto px-4 py-16 md:py-24">
      <div className={`${align === "right" ? "md:order-2" : ""}`}>
        <TitleWithBand align={align === "right" ? "right" : "left"}>{title}</TitleWithBand>
        <p className="mt-6 text-lg md:text-xl text-neutral-800 leading-relaxed whitespace-pre-line">{copy}</p>
        {onSeeTeam && (
          <button
            onClick={onSeeTeam}
            className="mt-6 inline-flex items-center gap-2 border border-black px-5 py-3 text-black hover:bg-black hover:text-white transition"
          >
            Voir l'équipe <span aria-hidden>›</span>
          </button>
        )}
      </div>

      <div className={`${align === "right" ? "md:order-1" : ""}`}>
        <div className="w-full aspect-[4/3] border border-neutral-300">
          <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
      </div>
    </section>
  );
}

/* ========== Section GARY + KPIs scroll-driven (gauche/droite) ========== */
const KPIS = [
  { value: "100+", label: "ventes réalisées en 2025", side: "left" },
  { value: "90+", label: "avis 5 étoiles sur Google", side: "right", link: "https://g.page/r/gary-immobilier", linkText: "Voir les avis" },
  { value: "6.6M", label: "de vues sur nos publications", side: "left" },
  { value: "40k+", label: "followers sur nos réseaux", side: "right" },
];

function GaryVennKPISection() {
  const sectionRef = useRef(null);
  const [logoVisible, setLogoVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Détecter quand la section entre → faire apparaître le logo GARY
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !logoVisible) {
          setLogoVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [logoVisible]);

  // Scroll tracking pour les KPIs
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      const scrollableHeight = el.offsetHeight - viewH;

      if (scrollableHeight <= 0) {
        setScrollProgress(0);
        return;
      }

      const scrolledInSection = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolledInSection / scrollableHeight));
      setScrollProgress(progress);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Calcul progression pour chaque KPI (apparition échelonnée, lente)
  const getKpiProgress = (index) => {
    // Chaque KPI prend 30% du scroll, décalé de 20% entre chaque
    const start = index * 0.18;
    const end = start + 0.35;
    const raw = (scrollProgress - start) / (end - start);
    return Math.max(0, Math.min(1, raw));
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-white"
      style={{ height: "450vh" }} // Long scroll pour animation lente
    >
      {/* Container sticky */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">

        {/* Cercle central GARY - GROS */}
        <div
          className="absolute z-10 transition-all duration-1000 ease-out"
          style={{
            width: "min(340px, 44vw)",
            height: "min(340px, 44vw)",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${logoVisible ? 1 : 0.5})`,
            opacity: logoVisible ? 1 : 0,
          }}
        >
          <div
            className="w-full h-full rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(145deg, #FF4A3E 0%, #FF5A4A 100%)",
              boxShadow: "0 40px 120px -25px rgba(255, 74, 62, 0.6)",
            }}
          >
            <img
              src="/Logo/logo-gary.png"
              alt="GARY"
              className="w-[48%] h-auto"
              style={{ filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.2))" }}
            />
          </div>
        </div>

        {/* KPIs à gauche et à droite */}
        {KPIS.map((kpi, i) => {
          const progress = getKpiProgress(i);
          const isLeft = kpi.side === "left";

          // Position horizontale : vient de l'extérieur vers le bord du cercle
          // À 0% : hors écran, à 100% : près du cercle central
          const startX = isLeft ? -60 : 60; // vw, hors écran
          const endX = isLeft ? -32 : 32;   // vw, près du cercle
          const currentX = startX + (endX - startX) * progress;

          // Position verticale : légèrement décalée pour chaque KPI
          const yOffsets = [-15, -5, 5, 15]; // vh
          const currentY = yOffsets[i] || 0;

          // Ease out cubic pour mouvement plus naturel
          const easedProgress = 1 - Math.pow(1 - progress, 3);

          return (
            <div
              key={i}
              className="absolute z-20"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${currentX}vw), calc(-50% + ${currentY}vh))`,
                opacity: easedProgress,
                transition: "transform 80ms linear, opacity 80ms linear",
              }}
            >
              {/* Cercle KPI - GROS */}
              <div
                className="flex flex-col items-center"
                style={{
                  transform: `scale(${0.6 + 0.4 * easedProgress})`,
                  transition: "transform 80ms linear",
                }}
              >
                <div
                  className="rounded-full flex flex-col items-center justify-center text-center"
                  style={{
                    width: "min(180px, 26vw)",
                    height: "min(180px, 26vw)",
                    background: "linear-gradient(145deg, #FF4A3E 0%, #FF6B5B 100%)",
                    boxShadow: `0 ${20 * easedProgress}px ${60 * easedProgress}px -15px rgba(255, 74, 62, 0.55)`,
                  }}
                >
                  <span className="text-4xl md:text-5xl font-bold text-white leading-none">
                    {kpi.value}
                  </span>
                  <span className="text-sm md:text-base text-white/90 mt-2 px-4 leading-snug max-w-[150px]">
                    {kpi.label}
                  </span>
                </div>

                {/* Lien si présent */}
                {kpi.link && progress > 0.7 && (
                  <a
                    href={kpi.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-sm text-[#FF4A3E] hover:underline whitespace-nowrap transition-opacity"
                    style={{ opacity: (progress - 0.7) / 0.3 }}
                  >
                    {kpi.linkText} →
                  </a>
                )}
              </div>
            </div>
          );
        })}

        {/* Texte baseline en bas */}
        <div
          className="absolute bottom-[12%] left-1/2 -translate-x-1/2 text-center max-w-2xl px-6 transition-opacity duration-700"
          style={{ opacity: logoVisible && scrollProgress < 0.85 ? 1 : 0 }}
        >
          <p className="text-xl md:text-2xl text-neutral-500 tracking-wide font-light">
            Véritables stratèges de la vente immobilière
          </p>
        </div>

        {/* Indicateur scroll */}
        {logoVisible && scrollProgress < 0.05 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF4A3E"
              strokeWidth="2"
              className="animate-bounce"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        )}
      </div>
    </section>
  );
}

function CTA() {
  const btnRef = React.useRef(null);

  return (
    <section
      id="cta"
      className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden mb-20 md:mb-28 min-h-[130vh]"
    >
      {/* Dôme en arrière-plan */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-full">
        <DomeGallery
          className="w-full h-full"
          fitBasis="width"
          fit={0.9}
          padFactor={0.16}
          speedDegPerSec={6}
          grayscale={false}
          /* >>> bande blanche retirée (cf. §2) <<< */
          overlayBlurColor="transparent"
        />
        
        {/* Vignette top/bottom pour opacifier les bords */}
<div aria-hidden className="pointer-events-none absolute inset-0 z-[2]">
  <div className="absolute inset-x-0 top-0 h-24 md:h-40 bg-gradient-to-b from-white to-transparent" />
  <div className="absolute inset-x-0 bottom-0 h-24 md:h-40 bg-gradient-to-t from-white to-transparent" />
</div>

      </div>

      {/* Bloc “HERO Estimer” cloné (tuile opaque + titre + 2 boutons) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
        <div className="relative mx-auto w-full max-w-7xl px-6 md:px-8 py-20 md:py-28 pointer-events-none">
          <div className="relative flex justify-start">
            <div
              className="
                relative w-full max-w-[min(900px,84vw)]
                md:translate-x-[165px]
                md:-translate-y-[0px]
              "
            >
              {/* Tuile verre derrière le contenu */}
              <div className="absolute -inset-y-6 -left-6 -right-6 bg-white/55 backdrop-blur-sm" />

              {/* Contenu */}
              <div className="relative z-10 text-center text-black pointer-events-auto">
                <p className="text-[12px] md:text-[13px] uppercase tracking-[0.2em] text-neutral-600 mb-3">
                  GARY
                </p>

                <h3 className="font-serif tracking-[-0.03em] leading-[0.9] text-[clamp(3.2rem,8vw,6rem)]">
                  Un projet <span className="text-[#FF4A3E]">immobilier</span><br />
                  d’exception&nbsp;?
                </h3>

                <p className="mt-5 text-[clamp(1.05rem,2.1vw,1.35rem)] text-neutral-900/90 max-w-[52ch] mx-auto">
                  Parlons-en aujourd’hui. Mise en valeur, commercialisation&nbsp;: on s’occupe de tout.
                </p>

                {/* CTAs (mêmes styles que Estimer) */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                      {/* Bouton orange (nouveau CTA + nouvelle icône) */}
         <CTAFuturaGlow
  to="/contact"
  label="Contactez-nous"
  Icon={(p) => <PhoneIcon {...p} angle={-90} />}
  iconOffsetX="12px"   // ajuste si tu veux pousser 1–2 px à droite
  iconOffsetY="-1px"
  
/>

    
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      
    </section>
  );
}


function DownNudge() {
  const brand = "#000000";
  const goCTA = () => {
    const el = document.getElementById("cta");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div className="mt-12 md:mt-16 flex justify-center select-none">
      <button
        onClick={goCTA}
        aria-label="Voir la suite"
        className="group relative inline-flex items-center justify-center"
      >
        <svg
          viewBox="0 0 64 36"
          width="88"
          height="50"
          className="md:w-[104px] md:h-[58px] animate-[nudge_1.8s_ease-in-out_infinite]"
          style={{ filter: "drop-shadow(0 6px 16px rgba(255,74,62,0.35))" }}
        >
          <path
            d="M16 12 L32 28 L48 12"
            fill="none"
            stroke={brand}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span
          aria-hidden
          className="absolute -inset-6 rounded-full opacity-0 group-hover:opacity-25 transition-opacity"
          style={{
            background:
              "radial-gradient(80px 80px at 50% 50%, rgba(255,74,62,0.18), rgba(255,74,62,0) 70%)",
          }}
        />
      </button>

      <style>{`
        @keyframes nudge {
          0%   { transform: translateY(0);    opacity: 0.9; }
          50%  { transform: translateY(9px);  opacity: 1; }
          100% { transform: translateY(0);    opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}

export default function About() {
  const pageRef = useRef(null);
  const teamRef = useRef(null);
  const scrollToTeam = () => teamRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  useEffect(() => { window.scrollTo(0, 0); }, []);

useEffect(() => {
  const cta = document.getElementById("cta");
  if (!cta) return;

  let stopY = 0;

  const calc = () => {
    const vh = window.innerHeight || 800;
    stopY = Math.max(0, cta.offsetTop + cta.offsetHeight / 2 - vh / 2);

    const biasPx = Math.round(vh * 0.02);
    stopY += biasPx;
  };

  const clamp = () => {
    if (window.scrollY > stopY) window.scrollTo({ top: stopY });
  };

  const blockDown = (e) => {
    const goingDown = (e.deltaY ?? 0) > 0 || e.type === "touchmove";
    if (goingDown && window.scrollY >= stopY - 1) {
      e.preventDefault();
      e.stopPropagation();
      window.scrollTo({ top: stopY });
    }
  };

  // ✅ 1) Calcul immédiat
  calc();
  clamp();

  // ✅ 2) Re-calculs “post navigation” (le temps que les images/layout se posent)
  const r1 = requestAnimationFrame(() => { calc(); clamp(); });
  const r2 = requestAnimationFrame(() => { calc(); clamp(); });
  const t1 = setTimeout(() => { calc(); clamp(); }, 200);
  const t2 = setTimeout(() => { calc(); clamp(); }, 700);

  // ✅ 3) Observer le CTA + la PAGE (quand les images chargent, la page change de hauteur)
  const ro = new ResizeObserver(() => { calc(); clamp(); });
  ro.observe(cta);
  if (pageRef.current) ro.observe(pageRef.current);

  window.addEventListener("resize", calc);
  window.addEventListener("scroll", clamp, { passive: true });
  window.addEventListener("wheel", blockDown, { passive: false });
  window.addEventListener("touchmove", blockDown, { passive: false });

  return () => {
    cancelAnimationFrame(r1);
    cancelAnimationFrame(r2);
    clearTimeout(t1);
    clearTimeout(t2);
    ro.disconnect();
    window.removeEventListener("resize", calc);
    window.removeEventListener("scroll", clamp);
    window.removeEventListener("wheel", blockDown);
    window.removeEventListener("touchmove", blockDown);
  };
}, []);




  return (
    <div ref={pageRef} className="bg-white">
      {/* HERO 3 BANDES */}
      <HeroThreeStrips />

      {/* SECTION VENN + KPIs (nouvelle animation scroll-driven) */}
      <GaryVennKPISection />

      {/* ÉQUIPE */}
      <section ref={teamRef} className="max-w-6xl mx-auto px-4 py-20 text-center">
        <TitleWithBand align="center">Notre équipe</TitleWithBand>
        <div className="md:hidden mt-6 overflow-x-auto">
          <div className="flex gap-4 justify-center">
            {team.map((m) => (
              <div className="shrink-0 w-72" key={m.slug || m.id || m.name}>
                <TeamMemberCard {...m} />
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:grid mt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
          {team.map((m) => (
            <div className="w-full max-w-[360px]" key={m.slug || m.id || m.name}>
              <TeamMemberCard {...m} />
            </div>
          ))}
        </div>
      </section>

      <DownNudge />

      {/* CTA final */}
      <div aria-hidden="true" className="h-[18vh] md:h-[28vh]" />  
      <CTA />
          
      <div className="mb-24 md:mb-36" />
    </div>
  );
}
