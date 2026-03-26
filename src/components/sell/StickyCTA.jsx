// src/components/sell/StickyCTA.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale.js";

export default function StickyCTA() {
  const { t, link } = useLocale();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = () => {
      const scrolled = window.scrollY > 400;

      // Disparaît quand le CTA final est visible
      const ctaEl = document.getElementById("cta-final-sell");
      const atCta = ctaEl
        ? ctaEl.getBoundingClientRect().top < window.innerHeight * 0.8
        : false;

      setShow(scrolled && !atCta);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 md:hidden z-40 transition-transform duration-300"
      style={{ transform: show ? "translateY(0)" : "translateY(100%)" }}
    >
      <div className="bg-white/95 backdrop-blur-md border-t border-neutral-200 px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.85rem] font-medium text-[#1A1A1A] truncate">Estimation gratuite</p>
          <p className="text-[0.7rem] text-neutral-400">Résultat sous 48h</p>
        </div>
        <Link
          to={link("estimate")}
          className="shrink-0 bg-[#FF4A3E] text-white px-5 py-2.5 text-[0.8rem] font-medium tracking-[0.03em] active:bg-[#e5382d] transition-colors"
        >
          {t("sell.cta_estimate")}
        </Link>
      </div>
    </div>
  );
}
