import React from "react";

export default function FinalCTA() {
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
    <section className="final-cta">
      <div className="final-cta-inner">
        <h2>
          Prêt à découvrir la stratégie<br />
          <span>adaptée à votre bien ?</span>
        </h2>
        <p>
          Chaque estimation inclut une analyse de marché détaillée et une
          recommandation personnalisée sur la stratégie de diffusion optimale.
        </p>
        <button className="final-cta-btn" onClick={scrollToForm}>
          Demander mon estimation gratuite
        </button>
        <div className="final-cta-note">
          Gratuit · Sans engagement · Résultat sous 48h
        </div>
      </div>
    </section>
  );
}
