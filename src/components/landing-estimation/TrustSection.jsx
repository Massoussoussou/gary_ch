import React from "react";

const testimonials = [
  {
    quote: "Nous avons reçu deux offres avant même que le bien ne soit publié sur les portails. La phase off-market a créé exactement l'urgence dont nous avions besoin.",
    initials: "ML",
    name: "M. & Mme L.",
    detail: "Appartement 5 pièces · Champel",
  },
  {
    quote: "On pensait que mettre en ligne rapidement était la bonne stratégie. GARY nous a convaincus de faire l'inverse. Résultat : vendu en 6 semaines, au-dessus du prix estimé.",
    initials: "PD",
    name: "P. Dumont",
    detail: "Villa · Nyon",
  },
  {
    quote: "Ce qui m'a convaincu, c'est d'avoir le contrôle. À chaque phase, mon courtier m'expliquait où on en était et quelles étaient les options.",
    initials: "SF",
    name: "S. Fischer",
    detail: "Appartement 4 pièces · Carouge",
  },
  {
    quote: "J'avais déjà essayé avec une autre agence pendant 4 mois. Avec GARY, la stratégie en 3 phases a tout changé. Vendu en phase Coming Soon.",
    initials: "AR",
    name: "A. Rousseau",
    detail: "Maison mitoyenne · Meyrin",
  },
];

const numbers = [
  { val: "150+", unit: "Biens vendus" },
  { val: "Genève", unit: "Nyon · Lausanne · Valais" },
  { val: "48h", unit: "Estimation détaillée" },
  { val: "4.9\u2605", unit: "Avis Google" },
];

export default function TrustSection() {
  return (
    <section className="trust">
      <div className="trust-inner">
        <div className="trust-header">
          <h2>Ils ont vendu avec la méthode GARY</h2>
          <p>Des résultats concrets, racontés par nos clients.</p>
        </div>
        <div className="testimonials">
          {testimonials.map((t, i) => (
            <div className="testimonial" key={i}>
              <blockquote>{t.quote}</blockquote>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.initials}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-detail">{t.detail}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="trust-numbers">
          {numbers.map((n, i) => (
            <div className="trust-num" key={i}>
              <div className="val">{n.val}</div>
              <div className="unit">{n.unit}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
