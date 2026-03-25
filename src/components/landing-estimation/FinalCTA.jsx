import React, { useRef, useState, useEffect } from "react";
import { useLocale } from "../../hooks/useLocale.js";

export default function FinalCTA() {
  const { t } = useLocale();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollToForm = (e) => {
    e.preventDefault();
    if (window.__lenis) {
      window.__lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section ref={ref} id="cta-final" className="relative min-h-[70vh] flex items-center overflow-hidden">
      <img
        src="/img/gary/extver5.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[#1A1A1A]/70" />

      <div className="relative z-10 w-full max-w-[900px] mx-auto px-6 md:px-8 py-20 md:py-28 text-center">
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <p className="text-[12px] uppercase tracking-[0.3em] text-[#FF4A3E] mb-5">
            {t("estimate.cta_final.label")}
          </p>
          <h2 className="font-serif text-[clamp(2.2rem,5vw,3.8rem)] tracking-[-0.03em] leading-[1.05] text-white mb-5">
            {t("estimate.cta_final.title_line1")}
            <br />
            {t("estimate.cta_final.title_line2")}
            <span className="text-[#FF4A3E]">&nbsp;?</span>
          </h2>
          <p className="text-[1.05rem] text-white/60 leading-relaxed max-w-[50ch] mx-auto mb-10">
            {t("estimate.cta_final.subtitle")}
          </p>

          {/* CTA — sweep shine on hover */}
          <button
            onClick={scrollToForm}
            className="group relative inline-block overflow-hidden bg-[#FF4A3E] active:scale-[0.97] transition-transform duration-150"
          >
            <span className="absolute inset-0 bg-white/[0.12] -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            <span className="relative inline-flex items-center gap-3 text-white px-14 py-5 text-[1.1rem] font-medium tracking-[0.04em]">
              {t("sell.cta_estimate")}
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </button>

          <p className="text-[0.72rem] text-white/30 mt-6 tracking-wide uppercase">
            {t("estimate.cta_final.disclaimer")}
          </p>
        </div>
      </div>
    </section>
  );
}
