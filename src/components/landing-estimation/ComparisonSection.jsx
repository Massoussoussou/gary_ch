import React from "react";

const classicItems = [
  "Publication immédiate sur tous les portails",
  "Visites massives dès la première semaine",
  "L'intérêt retombe après quelques semaines",
  "Pression à la baisse sur le prix",
  "Le vendeur subit le calendrier",
];

const garyItems = [
  "Diffusion progressive et contrôlée",
  "Chaque phase génère une nouvelle vague de demandes",
  "L'intérêt se renouvelle à chaque étape",
  "Compétition entre acquéreurs → prix optimisé",
  "Le vendeur décide du rythme",
];

export default function ComparisonSection() {
  return (
    <section className="comparison">
      <div className="comparison-inner">
        <div className="comparison-header">
          <h2>Pourquoi cette méthode change tout</h2>
          <p>Deux approches. Deux résultats très différents.</p>
        </div>
        <div className="comp-grid">
          <div className="comp-col classic">
            <h3>Approche classique</h3>
            {classicItems.map((text, i) => (
              <div className="comp-item" key={i}>
                <div className="comp-icon">&rarr;</div>
                <div className="comp-text">{text}</div>
              </div>
            ))}
          </div>
          <div className="comp-col gary">
            <h3>Méthode GARY</h3>
            {garyItems.map((text, i) => (
              <div className="comp-item" key={i}>
                <div className="comp-icon">&#10022;</div>
                <div className="comp-text">{text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
