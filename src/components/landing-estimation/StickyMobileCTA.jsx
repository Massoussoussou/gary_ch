import React, { useState, useEffect } from "react";

export default function StickyMobileCTA({ hidden }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      if (hidden) { setVisible(false); return; }
      const formEl = document.getElementById("form");
      if (!formEl) return;
      const rect = formEl.getBoundingClientRect();
      setVisible(rect.bottom < 0);
    };
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [hidden]);

  const scrollToForm = (e) => {
    e.preventDefault();
    const el = document.getElementById("form");
    if (!el) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className={`sticky-cta${visible ? " visible" : ""}`}>
      <div className="sticky-cta-text">
        Estimation gratuite<span>Résultat sous 48h</span>
      </div>
      <button className="sticky-cta-btn" onClick={scrollToForm}>
        Estimer mon bien
      </button>
    </div>
  );
}
