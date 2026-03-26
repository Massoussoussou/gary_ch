import React, { useState, useEffect } from "react";

export default function StickyMobileCTA({ hidden }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      if (hidden) { setVisible(false); return; }
      const formEl = document.getElementById("form");
      if (!formEl) return;
      const formRect = formEl.getBoundingClientRect();
      const pastForm = formRect.bottom < 0;

      // Cacher quand le CTA final est visible
      const ctaEl = document.getElementById("cta-final");
      const atCta = ctaEl ? ctaEl.getBoundingClientRect().top < window.innerHeight * 0.8 : false;

      setVisible(pastForm && !atCta);
    };
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [hidden]);

  const scrollToForm = (e) => {
    e.preventDefault();
    if (window.__lenis) {
      window.__lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 md:hidden z-40 transition-transform duration-300"
      style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
    >
      <div className="bg-white/95 backdrop-blur-md border-t border-neutral-200 px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.85rem] font-medium text-[#1A1A1A] truncate">Estimation gratuite</p>
          <p className="text-[0.7rem] text-neutral-400">Résultat sous 48h</p>
        </div>
        <button
          onClick={scrollToForm}
          className="shrink-0 bg-[#FF4A3E] text-white px-5 py-2.5 text-[0.8rem] font-medium tracking-[0.03em] active:bg-[#e5382d] transition-colors"
        >
          Estimer mon bien
        </button>
      </div>
    </div>
  );
}
