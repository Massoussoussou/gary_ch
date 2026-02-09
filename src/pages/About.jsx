import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import TeamMemberCard from "../components/TeamMemberCard";
import team from "../data/team.json";
import DomeGallery from "../components/DomeGallery";
import CTAFuturaGlow, { PhoneIcon } from "../components/CTAFuturaGlow";


// --- Scroll lock helpers (used to pause scroll during the Venn animation) ---
function lockScroll() {
  const scrollY = window.scrollY;
  document.body.dataset.scrollLockY = String(scrollY);
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
}

function unlockScroll() {
  const y = Number(document.body.dataset.scrollLockY || "0");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  delete document.body.dataset.scrollLockY;
  window.scrollTo(0, y);
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

/* ========== Image plein écran (bandeau) ========== */
function FullBleedImage({ src, alt = "" }) {
  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] my-10 md:my-16">
      <img src={src} alt={alt} className="w-full h-[48vh] md:h-[64vh] object-cover" loading="lazy" />
    </div>
  );
}


/* ========== Section Venn améliorée avec fusion des cercles ========== */
function GaryVennSection({
  copy = "Véritables stratèges de la vente immobilière, GARY combine une connaissance fine du marché immobilier local, forgée par plus de 60 ans d'expérience cumulée, à une expertise marketing nouvelle génération, innovante et performante.",
  leftLabel = "Courtiers jeunes",
  rightLabel = "Grande expertise",
  // déclenchement: "scroll" (comportement original) ou "mount" (dès chargement)
  trigger = "scroll",
  // lock scroll pendant l'anim
  lockScrollOnStart = true,
  // afficher ou non le texte sous l'animation
  showCopy = true,
  // mode hero (plein écran, utilisé quand les bandes passent par dessus)
  hero = false,
} = {}) {
  // --- Tuning knobs (micro-adjustments) ---
  const CENTER_TOLERANCE_PX = 18;  // how close to center we require (px)
  const CENTER_BIAS_PX = 120;      // + pushes the circles LOWER in the viewport, - pushes higher
  const LOCK_MS = 2000;            // how long to lock scroll once the animation starts

  const [wrapRef, seen] = useInViewOnce({ threshold: 0.25 });

  const sectionRef = useRef(null);
  const circlesRef = useRef(null);

  const didRunRef = useRef(false);
  const rafRef = useRef(0);
  const unlockTimerRef = useRef(0);

  const [startAnim, setStartAnim] = useState(false);

  useEffect(() => {
    // mode "mount" : on lance direct, sans recentrage
    if (trigger === "mount") {
      setStartAnim(true);
      if (lockScrollOnStart) {
        lockScroll();
        unlockTimerRef.current = window.setTimeout(() => unlockScroll(), LOCK_MS);
      }
      return () => {
        if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);
        unlockScroll();
      };
    }

    if (!seen) return;
    if (didRunRef.current) return;

    // Respect "Reduce motion" accessibility setting
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduceMotion) {
      setStartAnim(true);
      return;
    }

    didRunRef.current = true;

    const el = circlesRef.current || sectionRef.current;
    if (!el) return;

    const isCentered = () => {
      const r = el.getBoundingClientRect();
      const elCenterY = r.top + r.height / 2;
      const viewCenterY = window.innerHeight / 2 + CENTER_BIAS_PX;
      return Math.abs(elCenterY - viewCenterY) <= CENTER_TOLERANCE_PX;
    };

    const scrollToTarget = () => {
      const r = el.getBoundingClientRect();
      const elCenterAbs = window.scrollY + r.top + r.height / 2;
      const targetY = elCenterAbs - (window.innerHeight / 2 + CENTER_BIAS_PX);

      const maxY = document.documentElement.scrollHeight - window.innerHeight;
      const clampedY = Math.max(0, Math.min(targetY, maxY));

      window.scrollTo({ top: clampedY, behavior: "smooth" });
    };

    // Start centering
    scrollToTarget();

    const tick = () => {
      if (isCentered()) {
        // Start the animation AND lock scroll at the same moment
        setStartAnim(true);
        if (lockScrollOnStart) lockScroll();

        unlockTimerRef.current = window.setTimeout(() => {
          unlockScroll();
        }, LOCK_MS);

        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);
      unlockScroll();
    };
  }, [seen, trigger, lockScrollOnStart]);

  return (
    <section
      ref={(node) => {
        wrapRef.current = node;
        sectionRef.current = node;
      }}
      className={hero ? "relative min-h-[100svh] flex items-center justify-center pt-8 pb-20 md:pt-10 md:pb-24" : "relative pt-20 pb-16 md:pt-32 md:pb-24"}
    >
      <style>{`
        @keyframes vennLeftSlide {
          0%   { transform: translate3d(-200%, 0, 0); opacity: 0; }
          100% { transform: translate3d(0, 0, 0); opacity: 1; }
        }
        @keyframes vennRightSlide {
          0%   { transform: translate3d(200%, 0, 0); opacity: 0; }
          100% { transform: translate3d(0, 0, 0); opacity: 1; }
        }
        @keyframes vennMergeLeft {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(26%, 0, 0); }
        }
        @keyframes vennMergeRight {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-26%, 0, 0); }
        }
        @keyframes logoReveal {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.5); filter: blur(10px); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); filter: blur(0px); }
        }
        @keyframes labelFade {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }

        /* Make transforms stable */
        .vennCircle {
          will-change: transform, opacity;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }

        .vennMergeLeft, .vennMergeRight {
          animation-fill-mode: both;
        }
      `}</style>

      <div className={"mx-auto max-w-6xl px-4 flex flex-col items-center " + (hero ? " -translate-y-6 md:-translate-y-10" : "")}>
        <div
          ref={circlesRef}
          className="relative w-full max-w-[1100px] mx-auto overflow-visible h-[460px] md:h-[620px]"
        >
          {/* Cercle gauche */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <div
              className="w-[340px] h-[340px] md:w-[520px] md:h-[520px] rounded-full bg-gradient-to-br from-[#FF4A3E] to-[#FF6B5E] shadow-2xl
                         flex items-center justify-center text-center px-10 transition-all duration-1000 vennCircle"
              style={{
                opacity: startAnim ? 1 : 0,
                transform: startAnim ? undefined : "translate3d(-200%, 0, 0)",
                animation: startAnim
                  ? "vennLeftSlide 1s cubic-bezier(.34,.46,.34,1) 0s both, vennMergeLeft 1.2s cubic-bezier(.34,.46,.34,1) 1.2s both"
                  : undefined,
              }}
            >
              <div
                className="text-2xl md:text-4xl font-semibold text-white leading-tight"
                style={{
                  animation: startAnim ? "labelFade 0.6s ease-out 1.8s both" : "none",
                }}
              >
                {leftLabel}
              </div>
            </div>
          </div>

          {/* Cercle droite */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <div
              className="w-[340px] h-[340px] md:w-[520px] md:h-[520px] rounded-full bg-gradient-to-bl from-[#FF7A6E]/70 to-[#FFB3A8]/60 shadow-2xl
                         flex items-center justify-center text-center px-10 transition-all duration-1000 vennCircle"
              style={{
                opacity: startAnim ? 1 : 0,
                transform: startAnim ? undefined : "translate3d(200%, 0, 0)",
                animation: startAnim
                  ? "vennRightSlide 1s cubic-bezier(.34,.46,.34,1) 0.2s both, vennMergeRight 1.2s cubic-bezier(.34,.46,.34,1) 1.2s both"
                  : undefined,
              }}
            >
              <div
                className="text-2xl md:text-4xl font-semibold text-neutral-900 leading-tight"
                style={{
                  animation: startAnim ? "labelFade 0.6s ease-out 1.8s both" : "none",
                }}
              >
                {rightLabel}
              </div>
            </div>
          </div>

          {/* Logo GARY au centre */}
          <img
            src="/Logo/logo-gary.png"
            alt="GARY"
            className="absolute left-1/2 top-1/2 w-[140px] md:w-[200px] h-auto z-10"
            style={{
              animation: startAnim ? "logoReveal 1s cubic-bezier(.34,.46,.34,1) 2s both" : "none",
            }}
          />
        </div>

        {/* Texte descriptif */}
        {showCopy && (
        <div
          className={[
            "mt-10 w-full flex flex-col items-center",
            "transition-all duration-700 ease-out",
            startAnim ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
          ].join(" ")}
          style={{ transitionDelay: "2.6s" }}
        >
          <p className={(hero ? "mt-4" : "mt-6") + " text-xl md:text-2xl text-neutral-800 leading-relaxed text-center max-w-4xl"}>
            {copy}
          </p>
        </div>
        )}
      </div>
    </section>
  );
}




/* ========== Section Chiffres Clés avec cercles animés au scroll ========== */
function KeyNumbersSection() {
  const [containerRef, containerSeen] = useInViewOnce({ threshold: 0.15 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !containerSeen) return;

    const handleScroll = () => {
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;
      
      // Calculer la progression du scroll (0 à 1)
      const start = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, start / (windowHeight + elementHeight * 0.5)));
      
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [containerSeen, containerRef]);

  const keyNumbers = [
    {
      number: "60+",
      label: "Années d'expérience",
      description: "Un savoir-faire transmis et perfectionné",
      color: "from-[#FF4A3E] to-[#FF6B5E]",
      delay: 0
    },
    {
      number: "200M+",
      label: "En transactions",
      description: "Des projets d'exception réalisés",
      color: "from-[#FF6B5E] to-[#FF8A7E]",
      delay: 0.15
    },
    {
      number: "95%",
      label: "Clients satisfaits",
      description: "La confiance comme moteur",
      color: "from-[#FF8A7E] to-[#FFB3A8]",
      delay: 0.3
    }
  ];

  return (
    <section ref={containerRef} className="relative py-20 md:py-32 overflow-hidden">
      <style>{`
        @keyframes floatCircle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes numberPop {
          0% { opacity: 0; transform: scale(0.5); }
          50% { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes textSlide {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-6xl font-serif text-neutral-900 mb-4">
            GARY en chiffres
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
            Des résultats qui parlent d'eux-mêmes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {keyNumbers.map((item, idx) => {
            const progress = Math.max(0, Math.min(1, (scrollProgress - item.delay) / 0.3));
            const isVisible = progress > 0;
            const scale = 0.8 + (progress * 0.2);
            const opacity = progress;
            const translateY = (1 - progress) * 50;

            return (
              <div
                key={idx}
                className="relative flex flex-col items-center"
                style={{
                  opacity,
                  transform: `translateY(${translateY}px)`,
                  transition: "opacity 0.6s ease-out, transform 0.6s ease-out"
                }}
              >
                {/* Cercle avec gradient */}
                <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] mb-8">
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${item.color} shadow-2xl flex items-center justify-center`}
                    style={{
                      transform: `scale(${scale})`,
                      animation: isVisible ? "floatCircle 4s ease-in-out infinite" : "none",
                      animationDelay: `${item.delay * 2}s`
                    }}
                  >
                    <div className="text-center">
                      <div 
                        className="text-6xl md:text-7xl font-bold text-white mb-2"
                        style={{
                          animation: isVisible ? `numberPop 0.6s cubic-bezier(.34,.46,.34,1) ${item.delay + 0.3}s both` : "none"
                        }}
                      >
                        {item.number}
                      </div>
                      <div 
                        className="text-xl md:text-2xl font-semibold text-white/90"
                        style={{
                          animation: isVisible ? `textSlide 0.6s ease-out ${item.delay + 0.5}s both` : "none"
                        }}
                      >
                        {item.label}
                      </div>
                    </div>
                  </div>

                  {/* Effet de lueur */}
                  <div 
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${item.color} opacity-20 blur-2xl`}
                    style={{
                      transform: `scale(${scale * 1.2})`,
                      transition: "transform 0.6s ease-out"
                    }}
                  />
                </div>

                {/* Description */}
                <p 
                  className="text-center text-lg md:text-xl text-neutral-700 max-w-[280px] leading-relaxed"
                  style={{
                    animation: isVisible ? `textSlide 0.6s ease-out ${item.delay + 0.7}s both` : "none"
                  }}
                >
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}




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

/* ========== HERO 3 STRIPS ========== */
function HeroThreeStrips({ hideTitle = false, startHidden = false, overlayFadeInPx = 40, children = null } = {}) {
  const ref = useRef(null);
  const [local, setLocal] = useState(0);
  const [sectionVh, setSectionVh] = useState(180);

  // Timeline (en px de scroll) — pensée pour ton nouveau scénario
  // 1) La bande du milieu monte et passe AU-DESSUS du logo
  // 2) Les deux autres bandes arrivent en 2e & 3e position
  // 3) Le gros logo GARY apparaît au-dessus des 3 bandes
  const LIFT_SPAN  = 260;
  const STACK_SPAN = 360;
  const BIG_SPAN   = 90;

  // Gain de scroll (1.0 = normal, >1 = l’anim avance plus vite)
  const SCROLL_GAIN = 1.35;


  const clamp01  = (x) => Math.max(0, Math.min(1, x));
  const remap01  = (x, a, b) => clamp01((x - a) / (b - a));
  const lerp     = (a, b, t) => a + (b - a) * t;
  const easeOutC = (x) => 1 - Math.pow(1 - x, 3);
  const easeInOutC = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

  // Calcule une hauteur de section suffisante pour que toute la timeline se déroule
  // (sinon, le gros logo n’atteint jamais 100% quand on accélère le scroll).
  useEffect(() => {
    const recompute = () => {
      const vh = typeof window !== "undefined" ? window.innerHeight : 800;
      const totalSpan = LIFT_SPAN + STACK_SPAN + BIG_SPAN;

      // local = scrollPx * SCROLL_GAIN → scroll réel nécessaire = totalSpan / SCROLL_GAIN
      const neededScrollPx = (totalSpan / SCROLL_GAIN) * 1.08; // marge
      const neededVh = 100 * (1 + neededScrollPx / Math.max(1, vh));

      // Valeur mini pour éviter un rendu trop “sec” sur grands écrans.
      setSectionVh(Math.max(140, Math.ceil(neededVh)));
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
      setLocal(l * SCROLL_GAIN);

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
  const pLift  = easeOutC(remap01(local, 0, LIFT_SPAN));
  const pStack = easeInOutC(remap01(local, LIFT_SPAN, LIFT_SPAN + STACK_SPAN));
  const pBig   = easeOutC(remap01(local, LIFT_SPAN + STACK_SPAN, LIFT_SPAN + STACK_SPAN + BIG_SPAN));

  // Bandes latérales : présentes dès le départ mais hors écran (donc invisibles)
  // Opacité optionnelle (évite un pop si le scroll est micro)
  const stackAlpha = clamp01(pStack / 0.02);

  // NEW: au tout début, on peut masquer l'overlay (cercles visibles), puis fade-in dès qu'on scroll
  const overlayOpacity = startHidden ? clamp01(local / Math.max(1, overlayFadeInPx)) : 1;


  // Vitesse auto-défilante : 1x → 10x au fur et à mesure qu’on empile les bandes
  const speedMult = 1 + 6.5 * (0.35 * pLift + 0.65 * pStack);

  // Positions verticales (en vh)
  const rowH = 100 / 3;
  const Y_TOP = 0;
  const Y_MID = rowH;
  const Y_BOT = rowH * 2;

  const yMid = lerp(Y_MID, Y_TOP, pLift);

  // Les 2 autres bandes arrivent en "phase 2" par les côtés (entrée horizontale),
  // et se placent ensuite en 2e & 3e position (milieu + bas).
  const yTop = Y_MID;
  const yBot = Y_BOT;

    const xTopVw = lerp(-100, 0, pStack); // arrive depuis la gauche (hors écran au départ)
    const xBotVw = lerp(100, 0, pStack);  // arrive depuis la droite (hors écran au départ)

  // Transforms
    const topTransform = `translate3d(${xTopVw}vw, ${yTop}vh, 0)`;
  const midTransform = `translate3d(0, ${yMid}vh, 0)`;
    const botTransform = `translate3d(${xBotVw}vw, ${yBot}vh, 0)`;

  // Petit logo + baseline : on le laisse au début, puis on le fait disparaître
  const titleOpacity = 1 - clamp01((pLift - 0.08) / 0.18);

  // Gros logo au-dessus des 3 bandes
  const bigGaryOpacity = pBig;
  const bigGaryScale   = 0.92 + 0.08 * pBig;

  // Z-index : la bande du milieu passe AU-DESSUS du logo dès qu’on scroll un peu
  const midZ = (pLift > 0 && pLift < 0.98) ? 30 : 12;

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
        {/* Contenu derrière l'overlay (ex: cercles) */}
        <div className="absolute inset-0 z-[0]">
          {children}
        </div>
        {/* Petit titre + phrase (logo + baseline) */}
        {!hideTitle && (
          <div
            className="relative z-[20] max-w-6xl mx-auto px-4 pt-16 md:pt-24 text-center pointer-events-none"
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
        )}

        {/* 3 bandes qui remplissent l’écran */}
        <div className="absolute inset-0 z-[10]" style={{ opacity: overlayOpacity, transition: "opacity 140ms linear" }}>
          {/* Bande du haut */}
          <div
            className="absolute left-0 right-0 top-0"
            style={{ transform: topTransform, opacity: stackAlpha, transition: "transform 140ms linear, opacity 140ms linear", zIndex: 12, overflow: "hidden", width: "100vw" }}
          >
            <AutoScrollStrip
              images={STRIP_IMAGES}
              direction={1}
              speed={0.22}           // 0.30 → 0.45 pour accentuer la vitesse
              speedMultiplier={speedMult}
              rowHeightVh={100 / 3}
              tileW={460}
            />
          </div>

          {/* Bande du milieu */}
          <div
            className="absolute left-0 right-0 top-0"
            style={{ transform: midTransform, transition: "transform 120ms linear", zIndex: midZ }}
          >
            <AutoScrollStrip
              images={STRIP_IMAGES}
              direction={-1}
              speed={0.22}
              speedMultiplier={speedMult}
              rowHeightVh={100 / 3}
              tileW={460}
            />
          </div>

          {/* Bande du bas */}
          <div
            className="absolute left-0 right-0 top-0"
            style={{ transform: botTransform, opacity: stackAlpha, transition: "transform 140ms linear, opacity 140ms linear", zIndex: 12, overflow: "hidden", width: "100vw" }}
          >
            <AutoScrollStrip
              images={STRIP_IMAGES}
              direction={-1}
              speed={0.22}
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
            opacity: 1 - clamp01(local / (LIFT_SPAN * 0.75)),
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
          style={{ opacity: bigGaryOpacity, transition: "opacity 160ms linear", zIndex: 50 }}
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
            Voir l’équipe <span aria-hidden>›</span>
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

function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden bg-white" style={{ height: "100vh" }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-full">
        <DomeGallery
          className="w-full h-full"
          fitBasis="width"
          fit={0.9}
          padFactor={0.16}
          speedDegPerSec={6}
          grayscale={false}
          overlayBlurColor="transparent"
        />
        
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[2]">
          <div className="absolute inset-x-0 top-0 h-24 md:h-40 bg-gradient-to-b from-white to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 md:h-40 bg-gradient-to-t from-white to-transparent" />
        </div>
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
        <div className="relative mx-auto w-full max-w-7xl px-6 md:px-8 py-20 md:py-28 pointer-events-none">
          <div className="relative flex justify-start">
            <div className="relative w-full max-w-[min(900px,84vw)] md:translate-x-[165px]">
              <div className="absolute -inset-y-6 -left-6 -right-6 bg-white/55 backdrop-blur-sm" />

              <div className="relative z-10 text-center text-black pointer-events-auto">
                <p className="text-[12px] md:text-[13px] uppercase tracking-[0.2em] text-neutral-600 mb-3">
                  GARY
                </p>

                <h3 className="font-serif tracking-[-0.03em] leading-[0.9] text-[clamp(3.2rem,8vw,6rem)]">
                  Un projet <span className="text-[#FF4A3E]">immobilier</span><br />
                  d'exception&nbsp;?
                </h3>

                <p className="mt-5 text-[clamp(1.05rem,2.1vw,1.35rem)] text-neutral-900/90 max-w-[52ch] mx-auto">
                  Parlons-en aujourd'hui. Mise en valeur, commercialisation&nbsp;: on s'occupe de tout.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <CTAFuturaGlow
                    to="/contact"
                    label="Contactez-nous"
                    Icon={(p) => <PhoneIcon {...p} angle={-90} />}
                    iconOffsetX="12px"
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

    calc();
    clamp();

    const r1 = requestAnimationFrame(() => { calc(); clamp(); });
    const r2 = requestAnimationFrame(() => { calc(); clamp(); });
    const t1 = setTimeout(() => { calc(); clamp(); }, 200);
    const t2 = setTimeout(() => { calc(); clamp(); }, 700);

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
      {/* HERO (cercles au chargement) + bandes qui recouvrent au scroll */}
      <HeroThreeStrips hideTitle startHidden overlayFadeInPx={36}>
        <GaryVennSection
          trigger="mount"
          lockScrollOnStart={false}
          showCopy={true}
          hero
          copy="Véritables stratèges de la vente immobilière, GARY combine une connaissance fine du marché immobilier local, forgée par plus de 60 ans d'expérience cumulée, à une expertise marketing nouvelle génération, innovante et performante."
          leftLabel="Courtiers jeunes"
          rightLabel="Grande expertise"
        />
      </HeroThreeStrips>


      {/* NOUVELLE SECTION CHIFFRES CLÉS */}
      <KeyNumbersSection />

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
