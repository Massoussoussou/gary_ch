import React, { useEffect, useRef, useState } from "react";
import TeamMemberCard from "../components/TeamMemberCard";
import team from "../data/team.json";

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

/* ========== Trait blanc amande (disparaît quand morphReady) ========== */
function LensOutline({ show, fadeOut }) {
  const svgRef = useRef(null);
  const [arcs, setArcs] = useState(["", "", "", ""]);

  useEffect(() => {
    const compute = () => {
      const el = svgRef.current;
      if (!el) return;
      const { width: w, height: h } = el.getBoundingClientRect();
      const R = 0.75 * h;
      const cx = w / 2;
      const cy = 0.45 * h;
      const d = 0.55 * h;
      const dy = Math.sqrt(R * R - d * d);
      const topY = cy - dy;
      const botY = cy + dy;
      const midRightX = cx + d - R;
      const midLeftX = cx - d + R;
      setArcs([
        `M ${cx} ${topY} A ${R} ${R} 0 0 1 ${midLeftX} ${cy}`,
        `M ${cx} ${botY} A ${R} ${R} 0 0 0 ${midLeftX} ${cy}`,
        `M ${cx} ${topY} A ${R} ${R} 0 0 0 ${midRightX} ${cy}`,
        `M ${cx} ${botY} A ${R} ${R} 0 0 1 ${midRightX} ${cy}`,
      ]);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        zIndex: 8,
        opacity: fadeOut ? 0 : 1,
        transition: `opacity ${fadeOut ? "0.6s ease-in" : "0.3s ease-out"}`,
      }}
    >
      {arcs.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength="1"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeDasharray="1"
          strokeDashoffset={show ? 0 : 1}
          style={{ transition: `stroke-dashoffset ${show ? "1s ease-out 1.2s" : "0.6s ease-in 0s"}` }}
        />
      ))}
    </svg>
  );
}

/* ========== Trait blanc cercle autour du logo (apparaît quand morphReady) ========== */
function CircleOutline({ show }) {
  return (
    <div
      className="absolute left-1/2 rounded-full pointer-events-none"
      style={{
        top: "45%",
        width: "320px",
        height: "320px",
        zIndex: 8,
        border: "2.5px solid white",
        opacity: show ? 1 : 0,
        transform: show
          ? "translate(-50%, -50%) scale(1)"
          : "translate(-50%, -50%) scale(1.8, 2.6)",
        transition: show
          ? "opacity 0.8s ease-out, transform 1.4s cubic-bezier(0.25, 1, 0.5, 1)"
          : "opacity 0.4s ease-in, transform 0.4s ease-in",
      }}
    />
  );
}

/* ========== Remplissage coloré de l'amande ========== */
function LensFill({ show, fill = "#FFFFFF", style: extraStyle = {} }) {
  const svgRef = useRef(null);
  const [path, setPath] = useState("");

  useEffect(() => {
    const compute = () => {
      const el = svgRef.current;
      if (!el) return;
      const { width: w, height: h } = el.getBoundingClientRect();

      const R = 0.75 * h;
      const cx = w / 2;
      const cy = 0.45 * h;
      const d = 0.55 * h;

      const dy = Math.sqrt(R * R - d * d);
      const topY = cy - dy;
      const botY = cy + dy;

      setPath(
        `M ${cx} ${topY} A ${R} ${R} 0 0 1 ${cx} ${botY} A ${R} ${R} 0 0 1 ${cx} ${topY} Z`
      );
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 4, ...extraStyle }}
    >
      <path
        d={path}
        fill={fill}
        opacity={show ? 1 : 0}
        style={{ transition: `opacity ${show ? "1s ease-out 1.1s" : "0.5s ease-in 0s"}` }}
      />
    </svg>
  );
}

/* ========== Ligne décorative dessinée (SVG stroke-dashoffset) ========== */
function DrawnLine({ width = 120, show, delay = 1.2, strokeWidth = 0.8, color = "#FF4A3E", className = "" }) {
  return (
    <svg width={width} height="2" className={`block ${className}`}>
      <path
        d={`M 0 1 L ${width} 1`}
        pathLength="1"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray="1"
        strokeDashoffset={show ? 0 : 1}
        style={{ transition: `stroke-dashoffset ${show ? `0.9s ease-out ${delay}s` : "0.5s ease-in 0s"}` }}
      />
    </svg>
  );
}

/* ========== Texte dans un cercle avec lignes décoratives ========== */
function CircleText({ title, lines, show, style }) {
  return (
    <div
      className="absolute z-10 text-center pointer-events-none flex flex-col items-center"
      style={style}
    >
      <div
        className="relative px-8 py-6 md:px-10 md:py-8 flex flex-col items-center"
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "scale(1)" : "scale(0.92)",
          transition: show
            ? "opacity 0.9s ease-out 1.2s, transform 0.9s ease-out 1.2s"
            : "opacity 0.4s ease-in 0s, transform 0.4s ease-in 0s",
        }}
      >
        {/* Fond opaque style hero */}
        <div className="absolute inset-0 -inset-y-4 -inset-x-3 bg-white/55 backdrop-blur-sm shadow-[0_22px_70px_-45px_rgba(0,0,0,0.3)]" />

        <DrawnLine width={160} show={show} delay={1.2} strokeWidth={0.5} className="relative z-10 mb-5" />

        <h2
          className="relative z-10 font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide leading-tight text-neutral-900"
          style={{
            opacity: show ? 1 : 0,
            transform: show ? "translateY(0)" : "translateY(12px)",
            transition: show
              ? "opacity 0.9s ease-out 1.35s, transform 0.9s ease-out 1.35s"
              : "opacity 0.4s ease-in 0s, transform 0.4s ease-in 0s",
          }}
        >
          {title}
        </h2>

        <DrawnLine width={50} show={show} delay={1.5} strokeWidth={0.5} className="relative z-10 my-4" />

        {lines.map((line, i) => (
          <p
            key={i}
            className="relative z-10 text-sm md:text-lg lg:text-xl text-neutral-600 leading-relaxed tracking-wider uppercase"
            style={{
              opacity: show ? 1 : 0,
              transform: show ? "translateY(0)" : "translateY(8px)",
              transition: show
                ? `opacity 0.7s ease-out ${1.6 + i * 0.15}s, transform 0.7s ease-out ${1.6 + i * 0.15}s`
                : "opacity 0.3s ease-in 0s, transform 0.3s ease-in 0s",
            }}
          >
            {line}
          </p>
        ))}

        <DrawnLine width={100} show={show} delay={1.8} strokeWidth={0.5} className="relative z-10 mt-5" />
      </div>
    </div>
  );
}

/* ========== HERO — Deux cercles géants qui couvrent tout l'écran ========== */
function HeroGiantCircles({ onComplete }) {
  const [mounted, setMounted] = useState(false);
  const [maskReady, setMaskReady] = useState(false);   // vidéos + bord droit
  const [morphReady, setMorphReady] = useState(false);  // cercle autour du logo
  const [reversed, setReversed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Phase 1 : vidéos apparaissent, séparation devient droite
  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => setMaskReady(true), 2200);
    return () => clearTimeout(t);
  }, [mounted]);

  // Phase 2 : amande → cercle (1.2s après phase 1)
  useEffect(() => {
    if (!maskReady) return;
    const t = setTimeout(() => setMorphReady(true), 1200);
    return () => clearTimeout(t);
  }, [maskReady]);

  const handleDiscover = () => {
    setReversed(true);
    setMorphReady(false);
    setMaskReady(false);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 1800);
  };

  // show = true quand tout est visible, false quand pas encore monté OU en reverse
  const show = mounted && !reversed;

  const circleSize = "150vh";

  return (
    <section className="relative w-full h-screen overflow-hidden bg-white" style={{ isolation: "isolate" }}>
      {/* Cercle gauche (corail + vidéo) */}
      <div
        className="absolute rounded-full overflow-hidden"
        style={{
          width: circleSize,
          height: circleSize,
          zIndex: 1,
          top: "45%",
          left: "50%",
          transform: show
            ? "translate(calc(-50% - 55vh), -50%)"
            : "translate(calc(-50% - 140vh), -50%)",
          opacity: show ? 1 : 0,
          transition: show
            ? "transform 1.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease-out"
            : "transform 1.2s cubic-bezier(0.5, 0, 0.75, 0) 0.5s, opacity 0.6s ease-in 1.2s",
          ...(maskReady ? {
            WebkitMaskImage: morphReady
              ? "linear-gradient(to right, white 130vh, transparent 130vh)"
              : "radial-gradient(circle 75vh at 185vh 75vh, transparent 99.5%, white 100%)",
            maskImage: morphReady
              ? "linear-gradient(to right, white 130vh, transparent 130vh)"
              : "radial-gradient(circle 75vh at 185vh 75vh, transparent 99.5%, white 100%)",
          } : {}),
        }}
      >
        {/* Couleur de fond */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #FF5C50 0%, #FF7A6A 100%)",
            opacity: show ? (maskReady ? 0 : 1) : 1,
            transition: "opacity 1.4s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        />
        {/* Vidéo */}
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: maskReady ? 1 : 0,
            transition: "opacity 1.4s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          <source src="/hero-house.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Cercle droit (saumon + vidéo) */}
      <div
        className="absolute rounded-full overflow-hidden"
        style={{
          width: circleSize,
          height: circleSize,
          zIndex: 3,
          top: "45%",
          left: "50%",
          transform: show
            ? "translate(calc(-50% + 55vh), -50%)"
            : "translate(calc(-50% + 140vh), -50%)",
          opacity: show ? 1 : 0,
          transition: show
            ? "transform 1.4s cubic-bezier(0.25, 1, 0.5, 1) 0.15s, opacity 0.8s ease-out 0.15s"
            : "transform 1.2s cubic-bezier(0.5, 0, 0.75, 0) 0.5s, opacity 0.6s ease-in 1.2s",
        }}
      >
        {/* Couleur de fond */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(225deg, #FF8A7A 0%, #FFA494 100%)",
            opacity: show ? (maskReady ? 0 : 1) : 1,
            transition: "opacity 1.4s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        />
        {/* Vidéo */}
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: maskReady ? 1 : 0,
            transition: "opacity 1.4s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          <source src="/media/home/acheter.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Remplissage orange de l'amande → disparaît quand morphReady */}
      <LensFill show={show && !morphReady} fill="#FF4A3E" />

      {/* Trait blanc amande (disparaît quand morphReady) */}
      <LensOutline show={show} fadeOut={morphReady} />

      {/* Trait blanc cercle autour du logo (apparaît quand morphReady) */}
      <CircleOutline show={show && morphReady} />

      {/* Texte cercle gauche */}
      <CircleText
        title="Jeunes courtiers"
        lines={["Marketing nouvelle génération", "Innovante & performante"]}
        show={show}
        style={{
          top: "45%",
          left: "22%",
          transform: "translate(-50%, -50%)",
          maxWidth: "380px",
        }}
      />

      {/* Texte cercle droit */}
      <CircleText
        title="Grande expertise"
        lines={["Marché immobilier local", "60 ans d'expérience cumulée", "Stratèges de la vente"]}
        show={show}
        style={{
          top: "45%",
          right: "22%",
          transform: "translate(50%, -50%)",
          maxWidth: "380px",
        }}
      />

      {/* Cercle orange qui se forme autour du logo (apparaît à morphReady) */}
      <div
        className="absolute left-1/2 rounded-full"
        style={{
          top: "45%",
          width: "320px",
          height: "320px",
          background: "#FF4A3E",
          zIndex: 6,
          opacity: (show && morphReady) ? 1 : 0,
          transform: (show && morphReady)
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -50%) scale(2.5, 3.5)",
          transition: (show && morphReady)
            ? "opacity 1.4s cubic-bezier(0.25, 1, 0.5, 1), transform 1.4s cubic-bezier(0.25, 1, 0.5, 1)"
            : "opacity 0.6s ease-in 0s, transform 0.6s ease-in 0s",
        }}
      />

      {/* Logo GARY au centre */}
      <div
        className="absolute left-1/2 z-10"
        style={{
          top: "45%",
          zIndex: 7,
          opacity: show ? 1 : 0,
          transform: show
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -50%) scale(0.85)",
          transition: show
            ? "opacity 1s ease-out 1.2s, transform 1s cubic-bezier(0.25, 1, 0.5, 1) 1.2s"
            : "opacity 0.5s ease-in 0s, transform 0.5s ease-in 0s",
        }}
      >
        <img
          src="/Logo/logo-gary.png"
          alt="GARY"
          className="w-[180px] md:w-[260px] h-auto"
        />
      </div>

      {/* Bouton Découvrez — dans le cercle orange, sous le logo */}
      <div
        className="absolute left-1/2"
        style={{
          top: "calc(45% + 50px)",
          zIndex: 25,
          opacity: (morphReady && !reversed) ? 1 : 0,
          transform: (morphReady && !reversed)
            ? "translate(-50%, 0)"
            : "translate(-50%, 8px)",
          transition: (morphReady && !reversed)
            ? "opacity 0.8s ease-out 0.8s, transform 0.8s ease-out 0.8s"
            : "opacity 0.4s ease-in 0s, transform 0.4s ease-in 0s",
          pointerEvents: (morphReady && !reversed) ? "auto" : "none",
        }}
      >
        <button
          onClick={handleDiscover}
          className="group relative px-7 py-2.5 bg-transparent text-white font-light text-base md:text-lg tracking-[0.25em] uppercase
                     border border-white/60 rounded-full hover:bg-white hover:text-[#FF4A3E]
                     transition-all duration-300 cursor-pointer"
        >
          <span className="relative z-10">Découvrez</span>
        </button>
      </div>
    </section>
  );
}

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

/* ========== PAGE ABOUT ========== */
export default function About() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-white">
      {/* HERO avec animation */}
      <div
        style={{
          height: showContent ? 0 : "100vh",
          overflow: "hidden",
          opacity: showContent ? 0 : 1,
          transition: "height 0.6s ease-in-out, opacity 0.4s ease-in",
        }}
      >
        <HeroGiantCircles onComplete={() => setShowContent(true)} />
      </div>

      {/* CONTENU (équipe, etc.) */}
      <div
        style={{
          opacity: showContent ? 1 : 0,
          transform: showContent ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
        }}
      >
        {/* ÉQUIPE */}
        <section className="max-w-6xl mx-auto px-4 py-20 text-center">
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
      </div>
    </div>
  );
}
