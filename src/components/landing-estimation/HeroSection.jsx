import React from "react";

export default function HeroSection() {
  return (
    <div className="hero-content">
      <div className="hero-eyebrow">Estimation immobilière</div>
      <h1>Ne mettez pas votre bien en ligne.<em>Orchestrez sa vente.</em></h1>
      <p className="hero-sub">
        Notre méthode de vente en 3 phases crée la compétition entre acquéreurs
        à chaque étape. Résultat : un prix de vente optimisé et un processus que
        vous maîtrisez.
      </p>
      <div className="hero-stats">
        <div className="hero-stat">
          <div className="num">3</div>
          <div className="label">Phases de vente</div>
        </div>
        <div className="hero-stat">
          <div className="num">48h</div>
          <div className="label">Estimation détaillée</div>
        </div>
        <div className="hero-stat">
          <div className="num">100%</div>
          <div className="label">Gratuit & sans engagement</div>
        </div>
      </div>
    </div>
  );
}
