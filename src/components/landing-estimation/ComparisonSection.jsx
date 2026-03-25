import React, { useRef, useState, useEffect } from "react";
import { useLocale } from "../../hooks/useLocale.js";

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function ComparisonSection() {
  const { t } = useLocale();
  const sectionRef = useRef(null);
  const columnsRef = useRef(null);
  const garyColRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [garyOffset, setGaryOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const classicItems = t("estimate.comparison.classic_items", { returnObjects: true });
  const garyItems = t("estimate.comparison.gary_items", { returnObjects: true });

  /* Mobile detect */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* Reveal */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* How far GARY column needs to shift to reach center */
  useEffect(() => {
    if (!visible || isMobile) return;
    const calc = () => {
      if (!columnsRef.current || !garyColRef.current) return;
      const cRect = columnsRef.current.getBoundingClientRect();
      const gRect = garyColRef.current.getBoundingClientRect();
      setGaryOffset(
        cRect.left + cRect.width / 2 - (gRect.left + gRect.width / 2)
      );
    };
    const t = setTimeout(calc, 80);
    window.addEventListener("resize", calc);
    return () => { clearTimeout(t); window.removeEventListener("resize", calc); };
  }, [visible, isMobile]);

  /* Scroll progress within sticky section */
  useEffect(() => {
    if (isMobile) return;
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      setProgress(Math.max(0, Math.min(1, -rect.top / scrollable)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  /* Derived animation values */
  const classicFade = easeOutCubic(Math.min(1, Math.max(0, (progress - 0.25)) / 0.4));
  const garyMove = easeOutCubic(Math.max(0, Math.min(1, (progress - 0.35) / 0.65)));

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#1A1A1A]"
      style={{ minHeight: isMobile ? "auto" : "200vh" }}
    >
      <div
        className={
          isMobile
            ? "py-24 px-5"
            : "sticky top-0 min-h-screen flex flex-col justify-center"
        }
      >
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 w-full">
          {/* Header */}
          <div
            className="text-center mb-14 md:mb-16"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <p className="text-[12px] uppercase tracking-[0.3em] text-[#FF4A3E] mb-4">
              {t("estimate.comparison.label")}
            </p>
            <h2 className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] tracking-[-0.02em] leading-[1.05] text-white mb-4">
              {t("estimate.comparison.title")}
              <span className="text-[#FF4A3E]">.</span>
            </h2>
            <p className="text-[1.1rem] text-white/60">
              {t("estimate.comparison.subtitle")}
            </p>
          </div>

          {/* Two columns — no VS separator */}
          <div
            ref={columnsRef}
            className="grid md:grid-cols-2 gap-10 md:gap-16"
          >
            {/* Classic — slides down & fades on scroll */}
            <div
              style={
                isMobile
                  ? undefined
                  : {
                      opacity: 1 - classicFade,
                      transform: `translateY(${classicFade * 60}px)`,
                      willChange: "transform, opacity",
                    }
              }
            >
              <h3 className="text-[0.9rem] uppercase tracking-[0.2em] text-white/45 mb-8 pb-3 border-b border-white/10">
                {t("estimate.comparison.classic_heading")}
              </h3>
              <div className="space-y-7">
                {classicItems.map((text, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(12px)",
                      transition: `opacity 0.4s ease ${0.35 + i * 0.08}s, transform 0.4s ease ${0.35 + i * 0.08}s`,
                    }}
                  >
                    <span className="shrink-0 w-5 h-5 rounded-full border border-white/20 flex items-center justify-center mt-1">
                      <span className="block w-2 h-px bg-white/40" />
                    </span>
                    <span className="text-[1.2rem] text-white/60 leading-relaxed">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* GARY — moves to center & scales on scroll */}
            <div
              ref={garyColRef}
              style={
                isMobile
                  ? undefined
                  : {
                      transform: `translateX(${garyOffset * garyMove}px) scale(${1 + garyMove * 0.08})`,
                      transformOrigin: "center top",
                      willChange: "transform",
                    }
              }
            >
              <h3 className="text-[0.9rem] uppercase tracking-[0.2em] text-[#FF4A3E] mb-8 pb-3 border-b border-[#FF4A3E]/25">
                {t("estimate.comparison.gary_heading")}
              </h3>
              <div className="space-y-7">
                {garyItems.map((text, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(12px)",
                      transition: `opacity 0.4s ease ${0.35 + i * 0.08}s, transform 0.4s ease ${0.35 + i * 0.08}s`,
                    }}
                  >
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[#FF4A3E] flex items-center justify-center mt-1">
                      <svg
                        className="w-2.5 h-2.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="white"
                        strokeWidth="3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="text-[1.2rem] text-white/90 leading-relaxed">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
