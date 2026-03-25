import React, { useRef, useState, useEffect } from "react";
import { useLocale } from "../../hooks/useLocale.js";

export default function TrustSection() {
  const { t } = useLocale();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeIdx, setActiveIdx] = useState(1);

  const testimonials = [
    {
      quote: t("estimate.trust.quote_1"),
      initials: "ML",
      name: t("estimate.trust.name_1"),
      detail: t("estimate.trust.detail_1"),
      accent: false,
    },
    {
      quote: t("estimate.trust.quote_2"),
      initials: "PD",
      name: t("estimate.trust.name_2"),
      detail: t("estimate.trust.detail_2"),
      accent: true,
    },
    {
      quote: t("estimate.trust.quote_3"),
      initials: "SF",
      name: t("estimate.trust.name_3"),
      detail: t("estimate.trust.detail_3"),
      accent: false,
    },
    {
      quote: t("estimate.trust.quote_4"),
      initials: "AR",
      name: t("estimate.trust.name_4"),
      detail: t("estimate.trust.detail_4"),
      accent: false,
    },
  ];

  const numbers = [
    { val: "150+", label: t("estimate.trust.stat_sold") },
    { val: t("estimate.trust.stat_geneva_val"), label: t("estimate.trust.stat_geneva_label") },
    { val: "48h", label: t("estimate.trust.stat_estimate") },
    { val: "4.9\u2605", label: t("estimate.trust.stat_google") },
  ];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[#FAF7F4] py-24 md:py-32 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        {/* Header + stats side by side */}
        {/* Header */}
        <div
          className="mb-10 md:mb-12"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <p className="text-[12px] uppercase tracking-[0.3em] text-[#FF4A3E] mb-4">
            {t("estimate.trust.label")}
          </p>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] tracking-[-0.02em] leading-[1.05] text-[#1A1A1A]">
            {t("estimate.trust.title_line1")}
            <br />
            {t("estimate.trust.title_line2")}<span className="text-[#FF4A3E]">.</span>
          </h2>
        </div>

        {/* Testimonials — 2x2 grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => {
            const active = activeIdx === i;
            return (
            <div
              key={i}
              onClick={() => setActiveIdx(i)}
              className="relative p-7 md:p-9 cursor-pointer"
              style={{
                backgroundColor: active ? "#1A1A1A" : "#ffffff",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(25px)",
                transition: `background-color 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.6s ease ${0.2 + i * 0.1}s, transform 0.6s ease ${0.2 + i * 0.1}s`,
              }}
            >
              {/* Decorative quote */}
              <span
                className="absolute top-4 right-5 font-serif text-[3.5rem] leading-none select-none pointer-events-none"
                style={{
                  color: active ? "rgba(255,255,255,0.06)" : "rgba(255,74,62,0.08)",
                  transition: "color 0.3s cubic-bezier(0.4,0,0.2,1) 0.1s",
                }}
              >
                &ldquo;
              </span>

              <div className="relative">
                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg
                      key={j}
                      className="w-3.5 h-3.5"
                      fill="#FF4A3E"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                <blockquote
                  className="text-[0.95rem] leading-[1.7] mb-7"
                  style={{
                    color: active ? "rgba(255,255,255,0.85)" : "rgb(64,64,64)",
                    transition: "color 0.3s cubic-bezier(0.4,0,0.2,1) 0.12s",
                  }}
                >
                  &laquo;&nbsp;{t.quote}&nbsp;&raquo;
                </blockquote>

                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[0.7rem] font-bold"
                    style={{
                      backgroundColor: active ? "#FF4A3E" : "#F5F2ED",
                      color: active ? "#fff" : "#1A1A1A",
                      transition: "background-color 0.3s cubic-bezier(0.4,0,0.2,1) 0.18s, color 0.3s cubic-bezier(0.4,0,0.2,1) 0.18s",
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p
                      className="text-[0.85rem] font-medium"
                      style={{
                        color: active ? "#fff" : "#1A1A1A",
                        transition: "color 0.3s cubic-bezier(0.4,0,0.2,1) 0.15s",
                      }}
                    >
                      {t.name}
                    </p>
                    <p
                      className="text-[0.75rem]"
                      style={{
                        color: active ? "rgba(255,255,255,0.5)" : "rgb(115,115,115)",
                        transition: "color 0.3s cubic-bezier(0.4,0,0.2,1) 0.2s",
                      }}
                    >
                      {t.detail}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Stats row — under testimonials */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mt-20 md:mt-28 text-center">
          {numbers.map((n, i) => (
            <div
              key={i}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(15px)",
                transition: `opacity 0.5s ease ${0.6 + i * 0.1}s, transform 0.5s ease ${0.6 + i * 0.1}s`,
              }}
            >
              <p
                className="font-sans font-bold text-[clamp(2.8rem,5vw,4.2rem)] leading-none tracking-tight text-[#FF4A3E] mb-2"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {n.val}
              </p>
              <p className="text-[0.75rem] uppercase tracking-[0.12em] text-neutral-500">
                {n.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
