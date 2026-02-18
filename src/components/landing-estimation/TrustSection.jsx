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
      </div>

      {/* Trust strip — style TrustStrip avec les données originales */}
      <div className="w-full px-[min(6vw,72px)] py-8 md:py-12">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full items-start justify-items-center gap-y-6">
          {numbers.map((n, i) => (
            <li key={i} className="py-4 text-center w-full">
              <div className="text-5xl md:text-6xl font-serif font-bold tracking-tight">
                {n.val}
              </div>
              <div className="mt-3 text-xs md:text-sm uppercase tracking-wide text-zinc-600">
                {n.unit}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
