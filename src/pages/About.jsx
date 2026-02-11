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

/* ========== Trait blanc amande — contour unique qui suit les cercles ========== */
function LensOutline({ show, fadeOut, vertical = false }) {
  const svgRef = useRef(null);
  const animRef = useRef(null);

  /* --- Mobile : path fermé unique --- */
  const [mobilePath, setMobilePath] = useState("");
  const mobilePathRef = useRef(null);
  const mobileGRef = useRef(null);

  const computeAmandePath = useCallback((w, h, halfDistVh) => {
    // Utilise window.innerHeight pour matcher exactement les unités CSS vh
    const vh = window.innerHeight / 100;
    const R = 55 * vh;        // 110vh / 2 — exactement comme le CSS
    const d = halfDistVh * vh; // en vh aussi
    const cx = w / 2;
    const cy = 0.42 * h;
    const val = R * R - d * d;
    if (val <= 0) return "";
    const dx = Math.sqrt(val);
    const leftX = cx - dx;
    const rightX = cx + dx;
    return `M ${leftX} ${cy} A ${R} ${R} 0 0 1 ${rightX} ${cy} A ${R} ${R} 0 0 1 ${leftX} ${cy} Z`;
  }, []);

  /* --- Desktop : 4 demi-arcs pour split gauche/droite --- */
  const [arcs, setArcs] = useState(["", "", "", ""]);

  // Calcul initial
  useEffect(() => {
    const compute = () => {
      const el = svgRef.current;
      if (!el) return;
      const { width: w, height: h } = el.getBoundingClientRect();

      if (vertical) {
        setMobilePath(computeAmandePath(w, h, 45));
      } else {
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
      }
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [vertical, computeAmandePath]);

  // Mobile fadeOut : anime le path unique frame par frame (suit les cercles)
  useEffect(() => {
    if (!vertical || !fadeOut) return;
    const el = svgRef.current;
    if (!el) return;
    const { width: w, height: h } = el.getBoundingClientRect();
    const vh = window.innerHeight / 100;
    const R_vh = 55;              // rayon en vh (110vh / 2)
    const startD_vh = 45;         // offset initial en vh
    const endD_vh = 120;          // offset final en vh
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const rawT = Math.min((now - start) / duration, 1);
      const progress = rawT * rawT * rawT;
      const d_vh = startD_vh + (endD_vh - startD_vh) * progress;

      if (d_vh >= R_vh) {
        if (mobileGRef.current) mobileGRef.current.style.opacity = "0";
        return;
      }

      const newPath = computeAmandePath(w, h, d_vh);
      if (mobilePathRef.current && newPath) {
        mobilePathRef.current.setAttribute("d", newPath);
      }

      const fadeProgress = (d_vh - startD_vh) / (R_vh - startD_vh);
      if (mobileGRef.current) {
        mobileGRef.current.style.opacity = String(1 - fadeProgress);
      }

      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [vertical, fadeOut, computeAmandePath]);

  const drawn = show && !fadeOut;

  const desktopPathProps = (idx) => ({
    d: arcs[idx],
    pathLength: "1",
    fill: "none",
    stroke: "white",
    strokeWidth: "2.5",
    strokeDasharray: "1",
    strokeDashoffset: drawn ? 0 : 1,
    style: { transition: `stroke-dashoffset ${drawn ? "1.4s ease-out 0s" : "1s ease-in 0s"}` },
  });

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 8, overflow: "visible" }}
    >
      {vertical ? (
        /* Mobile : contour amande unique, animé frame par frame au fadeOut */
        <g ref={mobileGRef}>
          <path
            ref={mobilePathRef}
            d={mobilePath}
            pathLength="1"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeDasharray="1"
            strokeDashoffset={show ? 0 : 1}
            style={{
              transition: fadeOut
                ? "none"
                : `stroke-dashoffset ${show ? "1.4s ease-out 0s" : "1s ease-in 0s"}`,
            }}
          />
        </g>
      ) : (
        /* Desktop : le contour se divise gauche/droite avec les cercles */
        <>
          <g style={{
            transform: fadeOut ? "translateX(-85vh)" : "translate(0,0)",
            opacity: fadeOut ? 0 : 1,
            transition: fadeOut
              ? "transform 1.2s cubic-bezier(0.5, 0, 0.75, 0), opacity 0.8s ease-in 0.6s"
              : "transform 0.3s ease-out, opacity 0.3s ease-out",
          }}>
            <path {...desktopPathProps(0)} />
            <path {...desktopPathProps(1)} />
          </g>
          <g style={{
            transform: fadeOut ? "translateX(85vh)" : "translate(0,0)",
            opacity: fadeOut ? 0 : 1,
            transition: fadeOut
              ? "transform 1.2s cubic-bezier(0.5, 0, 0.75, 0), opacity 0.8s ease-in 0.6s"
              : "transform 0.3s ease-out, opacity 0.3s ease-out",
          }}>
            <path {...desktopPathProps(2)} />
            <path {...desktopPathProps(3)} />
          </g>
        </>
      )}
    </svg>
  );
}

/* ========== Trait blanc cercle autour du logo (cross-fade depuis amande) ========== */
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
          : "translate(-50%, -50%) scale(1.4, 2.0)",
        transition: show
          ? "opacity 1.2s ease-in-out, transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)"
          : "opacity 0.4s ease-in, transform 0.4s ease-in",
      }}
    />
  );
}

/* ========== Remplissage coloré de l'amande — disparaît quand les cercles s'écartent ========== */
function LensFill({ show, fill = "#FFFFFF", style: extraStyle = {}, horizontal = false }) {
  const svgRef = useRef(null);
  const [path, setPath] = useState("");

  useEffect(() => {
    const compute = () => {
      const el = svgRef.current;
      if (!el) return;
      const { width: w, height: h } = el.getBoundingClientRect();

      if (horizontal) {
        // Amande couchée — utilise vh pour matcher exactement les cercles CSS (110vh)
        const vh = window.innerHeight / 100;
        const R = 55 * vh;       // 110vh / 2
        const cx = w / 2;
        const cy = 0.42 * h;
        const d = 45 * vh;       // 45vh offset
        const dx = Math.sqrt(R * R - d * d);
        const leftX = cx - dx;
        const rightX = cx + dx;
        setPath(
          `M ${leftX} ${cy} A ${R} ${R} 0 0 1 ${rightX} ${cy} A ${R} ${R} 0 0 1 ${leftX} ${cy} Z`
        );
      } else {
        // Amande verticale — basée sur la hauteur
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
      }
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [horizontal]);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 6, ...extraStyle }}
    >
      <path
        d={path}
        fill={fill}
        opacity={show ? 1 : 0}
        style={{ transition: `opacity ${show ? "0.8s ease-out 0s" : "0.5s ease-in 0s"}` }}
      />
    </svg>
  );
}

/* ========== Ligne décorative dessinée (SVG stroke-dashoffset) ========== */
function DrawnLine({ width = 120, show, delay = 1.2, strokeWidth = 0.8, color = "#FF4A3E", className = "", style: extraStyle }) {
  return (
    <svg width={width} height="2" className={`block ${className}`} style={extraStyle}>
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

/* ========== Texte avec lignes décoratives (whiteMode = sans fond, tout blanc) ========== */
function CircleText({ title, lines, show, style, whiteMode = false, minHeight }) {
  return (
    <div
      className="absolute z-10 text-center pointer-events-none flex flex-col items-center"
      style={style}
    >
      <div
        className="relative px-4 py-3 md:px-10 md:py-8 flex flex-col items-center justify-center"
        style={{
          minHeight: minHeight || "auto",
          opacity: show ? 1 : 0,
          transform: show ? "scale(1)" : "scale(0.92)",
          transition: "opacity 0.9s ease-out, transform 0.9s ease-out",
        }}
      >
        {/* Fond opaque — masqué en whiteMode, plus compact sur mobile */}
        <div
          className="absolute inset-0 -inset-y-2 -inset-x-1 md:-inset-y-4 md:-inset-x-3 bg-white/55 backdrop-blur-sm shadow-[0_22px_70px_-45px_rgba(0,0,0,0.3)]"
          style={{
            opacity: whiteMode ? 0 : 1,
            transition: "opacity 0.8s ease-out",
          }}
        />

        <h2
          className="relative z-10 font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide leading-tight"
          style={{
            color: whiteMode ? "white" : "#171717",
            transition: "color 0.8s ease-out",
          }}
        >
          {title}
        </h2>

        {/* Ligne horizontale — tracée à l'ouverture, disparaît en whiteMode */}
        <svg
          width="140" height="2"
          className="relative z-10 mt-6 mb-4 block"
          style={{
            opacity: whiteMode ? 0 : 1,
            transition: "opacity 0.6s ease-out",
          }}
        >
          <path
            d="M 0 1 L 140 1"
            pathLength="1"
            fill="none"
            stroke="#525252"
            strokeWidth="0.5"
            strokeDasharray="1"
            strokeDashoffset={show ? 0 : 1}
            style={{ transition: `stroke-dashoffset ${show ? "0.8s ease-out 0.3s" : "0.4s ease-in 0s"}` }}
          />
        </svg>

        {lines.map((line, i) => (
          <p
            key={i}
            className="relative z-10 text-sm md:text-lg lg:text-xl leading-relaxed tracking-wider uppercase mt-1"
            style={{
              color: whiteMode ? "rgba(255,255,255,0.85)" : "#525252",
              opacity: whiteMode ? 0 : 1,
              maxHeight: whiteMode ? 0 : "3em",
              overflow: "hidden",
              transition: "color 0.6s ease-out, opacity 0.6s ease-out, max-height 0.6s ease-out",
            }}
          >
            {line}
          </p>
        ))}

        {/* Trait blanc décoratif — se dessine en whiteMode (même animation que l'amande) */}
        <svg
          width="160" height="2"
          className="relative z-10 mt-6 block"
          style={{
            opacity: whiteMode && show ? 1 : 0,
            transition: `opacity ${whiteMode ? "0.3s ease-out" : "0.3s ease-in"}`,
          }}
        >
          <path
            d="M 0 1 L 160 1"
            pathLength="1"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeDasharray="1"
            strokeDashoffset={whiteMode && show ? 0 : 1}
            style={{ transition: `stroke-dashoffset ${whiteMode ? "1.2s ease-out 0.2s" : "0.4s ease-in 0s"}` }}
          />
        </svg>
      </div>
    </div>
  );
}

/* ========== HERO — Vidéo + logo visible d'entrée, clic → amande → cercles s'écartent ========== */
function HeroGiantCircles({ onComplete }) {
  const isMobile = useIsMobile();
  const [animating, setAnimating] = useState(false);   // clic → cercles arrivent, amande se dessine
  const [neonOn, setNeonOn] = useState(false);         // néon commence (traits ~70%)
  const [amandeDone, setAmandeDone] = useState(false); // amande dessinée
  const [spreading, setSpreading] = useState(false);   // cercles s'écartent → révèle équipe

  // Quand l'animation commence → néon → amande → cercles s'écartent
  useEffect(() => {
    if (!animating) return;
    const t0 = setTimeout(() => setNeonOn(true), 950);
    const t1 = setTimeout(() => setAmandeDone(true), 1400);
    const t2 = setTimeout(() => setSpreading(true), 1800);
    const t3 = setTimeout(() => { if (onComplete) onComplete(); }, 2600);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [animating, onComplete]);

  const handleDiscover = () => setAnimating(true);

  const circleSize = isMobile ? "110vh" : "150vh";
  const cy = isMobile ? "42%" : "45%";

  return (
    <section className="relative w-full h-screen overflow-hidden" style={{ isolation: "isolate" }}>
      {/* Vidéo plein écran en fond — toujours visible */}
      <video
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src="/media/buy/hero24.mp4" type="video/mp4" />
      </video>

      {/* Overlay clair (comme les autres hero) */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-transparent md:from-white/55 md:via-white/25 md:to-transparent" />
      </div>

      {/* Cercle A (corail) — gauche sur desktop, haut sur mobile */}
      <div
        className="absolute rounded-full"
        style={{
          width: circleSize,
          height: circleSize,
          zIndex: 5,
          top: cy,
          left: "50%",
          background: "linear-gradient(135deg, #FF5C50 0%, #FF7A6A 100%)",
          transform: isMobile
            ? (spreading
              ? `translate(-50%, calc(-50% - 120vh))`
              : `translate(-50%, calc(-50% - 45vh))`)
            : (spreading
              ? "translate(calc(-50% - 140vh), -50%)"
              : "translate(calc(-50% - 55vh), -50%)"),
          opacity: animating ? (spreading ? 0 : 1) : 0,
          transition: spreading
            ? "transform 1.2s cubic-bezier(0.5, 0, 0.75, 0), opacity 0.8s ease-in 0.6s"
            : "opacity 0.4s ease-out",
        }}
      />

      {/* Cercle B (saumon) — droit sur desktop, bas sur mobile */}
      <div
        className="absolute rounded-full"
        style={{
          width: circleSize,
          height: circleSize,
          zIndex: 5,
          top: cy,
          left: "50%",
          background: "linear-gradient(225deg, #FF8A7A 0%, #FFA494 100%)",
          transform: isMobile
            ? (spreading
              ? `translate(-50%, calc(-50% + 120vh))`
              : `translate(-50%, calc(-50% + 45vh))`)
            : (spreading
              ? "translate(calc(-50% + 140vh), -50%)"
              : "translate(calc(-50% + 55vh), -50%)"),
          opacity: animating ? (spreading ? 0 : 1) : 0,
          transition: spreading
            ? "transform 1.2s cubic-bezier(0.5, 0, 0.75, 0), opacity 0.8s ease-in 0.6s"
            : "opacity 0.4s ease-out",
        }}
      />

      {/* Remplissage orange de l'amande — visible quand animating, néon + brightness à neonOn */}
      <LensFill
        show={animating && !spreading}
        fill="#FF4A3E"
        horizontal={isMobile}
        style={{
          filter: neonOn && !spreading
            ? "brightness(1.35) drop-shadow(0 0 25px rgba(255,74,62,1)) drop-shadow(0 0 70px rgba(255,74,62,0.8)) drop-shadow(0 0 160px rgba(255,74,62,0.5)) drop-shadow(0 0 250px rgba(255,74,62,0.25))"
            : "brightness(1) drop-shadow(0 0 0px transparent)",
          transition: neonOn && !spreading
            ? "filter 0.8s ease-out"
            : "filter 0.5s ease-in",
        }}
      />

      {/* Couche saturée par-dessus — renforce l'orange quand le néon s'allume */}
      <LensFill
        show={neonOn && !spreading}
        fill="#FF6A3E"
        horizontal={isMobile}
        style={{
          zIndex: 6,
          mixBlendMode: "screen",
          opacity: neonOn && !spreading ? 0.4 : 0,
          transition: "opacity 0.8s ease-out",
        }}
      />

      {/* Halo néon — s'étend progressivement à neonOn */}
      <div
        className="absolute pointer-events-none"
        style={{
          zIndex: 7,
          top: isMobile ? "42%" : "45%",
          left: "50%",
          width: isMobile ? "90vw" : "100vh",
          height: isMobile ? "70vh" : "130vh",
          transform: neonOn && !spreading
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -50%) scale(0.5)",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(255,74,62,0.75) 0%, rgba(255,80,55,0.45) 20%, rgba(255,74,62,0.2) 40%, rgba(255,74,62,0.06) 60%, transparent 75%)",
          opacity: neonOn && !spreading ? 1 : 0,
          transition: neonOn && !spreading
            ? "opacity 0.7s ease-out, transform 0.9s ease-out"
            : "opacity 0.4s ease-in, transform 0.4s ease-in",
        }}
      />

      {/* Trait blanc amande — se dessine au clic, disparaît à spreading */}
      <LensOutline show={animating} fadeOut={spreading} vertical={isMobile} />

      {/* Texte gauche (desktop) / haut (mobile) */}
      <CircleText
        title="Jeunes courtiers"
        lines={isMobile ? [] : ["Marketing nouvelle génération", "Innovante & performante"]}
        show={!spreading}
        whiteMode={animating}
        minHeight={isMobile ? undefined : "400px"}
        style={isMobile ? {
          top: "16%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "280px",
        } : {
          top: "45%",
          left: "22%",
          transform: "translate(-50%, -50%)",
          maxWidth: "380px",
        }}
      />

      {/* Texte droit (desktop) / bas (mobile) */}
      <CircleText
        title="Grande expertise"
        lines={isMobile ? [] : ["Marché immobilier local", "60 ans d'expérience cumulée", "Stratèges de la vente"]}
        show={!spreading}
        whiteMode={animating}
        minHeight={isMobile ? undefined : "400px"}
        style={isMobile ? {
          top: "76%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "280px",
        } : {
          top: "45%",
          right: "22%",
          transform: "translate(50%, -50%)",
          maxWidth: "380px",
        }}
      />

      {/* Logo GARY orange → blanc quand animating, disparaît à spreading */}
      <div
        className="absolute left-1/2"
        style={{
          top: isMobile ? "42%" : "45%",
          zIndex: 10,
          opacity: spreading ? 0 : 1,
          transform: spreading
            ? "translate(-50%, -50%) scale(0.85)"
            : "translate(-50%, -50%) scale(1)",
          transition: spreading
            ? "opacity 0.6s ease-in, transform 0.6s ease-in"
            : "opacity 0.5s ease-out, transform 0.5s ease-out",
        }}
      >
        <img
          src="/Logo/logo-gary-orange.png"
          alt="GARY"
          className="w-[140px] md:w-[260px] h-auto"
          style={{
            filter: animating ? "brightness(0) invert(1)" : "none",
            transition: "filter 0.8s ease-out",
          }}
        />
      </div>

      {/* Bouton Découvrez — visible avant le clic */}
      <div
        className="absolute left-1/2"
        style={{
          top: isMobile ? "calc(42% + 60px)" : "calc(45% + 80px)",
          zIndex: 25,
          opacity: animating ? 0 : 1,
          transform: animating
            ? "translate(-50%, -8px)"
            : "translate(-50%, 0)",
          transition: "opacity 0.4s ease-in, transform 0.4s ease-in",
          pointerEvents: animating ? "none" : "auto",
        }}
      >
        <button
          onClick={handleDiscover}
          className="group relative px-6 py-2 md:px-7 md:py-2.5 bg-[#FF4A3E] text-white font-light text-sm md:text-lg tracking-[0.25em] uppercase
                     border border-[#FF4A3E] rounded-full hover:bg-white hover:text-[#FF4A3E] hover:border-white
                     transition-all duration-300 cursor-pointer"
          style={isMobile ? {
            boxShadow: "0 0 18px rgba(255,74,62,0.5), 0 0 50px rgba(255,74,62,0.2)",
            animation: "btnPulse 2.4s ease-in-out infinite",
          } : undefined}
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

/* ========== Carte équipe grande avec hover ========== */
function TeamCard({ name, role, photo, quote, slug }) {
  const startX = useRef(0);

  const handleClick = (e) => {
    // Si l'utilisateur a dragué le carrousel (> 5px), ne pas naviguer
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

      {/* Infos en bas — visibles par défaut */}
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
  const [showContent, setShowContent] = useState(false);
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const setWidthRef = useRef(0);
  const offsetRef = useRef(0);
  const lastFrameTime = useRef(0);
  const isDragging = useRef(false);
  const dragLastX = useRef(0);

  useEffect(() => { window.scrollTo(0, 0); }, []);

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

  // Auto-scroll permanent avec transform — pause pendant le drag
  useEffect(() => {
    if (!showContent) return;
    let raf;
    const SPEED = 30; // px/s
    // Initialise l'offset au début du 2e jeu pour pouvoir boucler dans les deux sens
    offsetRef.current = setWidthRef.current || 0;
    lastFrameTime.current = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - lastFrameTime.current) / 1000, 0.1);
      lastFrameTime.current = now;

      if (!isDragging.current) {
        offsetRef.current += SPEED * dt;
      }

      // Boucle seamless
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
  }, [showContent]);

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

  // Toujours 3× les cards (boucle seamless)
  const displayTeam = [...team, ...team, ...team];

  return (
    <div className="relative bg-black" style={{ minHeight: "100vh" }}>
      {/* HERO avec animation — positionné absolu pour superposer */}
      <div
        className="absolute inset-0 z-10"
        style={{
          opacity: showContent ? 0 : 1,
          pointerEvents: showContent ? "none" : "auto",
          transition: "opacity 0.8s ease-out",
        }}
      >
        <HeroGiantCircles onComplete={() => setShowContent(true)} />
      </div>

      {/* CONTENU — équipe en carousel sur vidéo de fond (toujours en dessous) */}
      <section
        className="relative min-h-screen overflow-hidden"
        style={{ pointerEvents: showContent ? "auto" : "none" }}
      >
        {/* Vidéo de fond continue */}
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/media/buy/hero24.mp4" type="video/mp4" />
        </video>

        {/* Voile sombre — apparaît progressivement */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(0,0,0,0.55)",
            opacity: showContent ? 1 : 0,
            transition: "opacity 1s ease-out 0.1s",
          }}
        />

        {/* Contenu par-dessus */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-16">
          <h2
            className="text-white font-serif text-3xl md:text-6xl tracking-wide mb-6 md:mb-10"
            style={{
              opacity: showContent ? 1 : 0,
              transform: showContent ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease-out 0.1s, transform 0.8s ease-out 0.1s",
            }}
          >
            Notre équipe
          </h2>

          {/* Carousel — overflow:hidden clippe, le track interne est déplacé via transform */}
          <div
            ref={containerRef}
            className="w-full overflow-hidden py-4"
            style={{
              cursor: "grab",
              opacity: showContent ? 1 : 0,
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
        </div>
      </section>
    </div>
  );
}
