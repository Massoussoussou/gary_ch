import React from "react";

const phases = [
  {
    num: "Phase 1",
    big: "01",
    title: "Off-Market",
    desc: "Votre bien est présenté exclusivement à un cercle restreint d'acquéreurs qualifiés. La rareté crée la valeur et les premières offres arrivent avant toute publication.",
    tag: "Crée l'exclusivité",
  },
  {
    num: "Phase 2",
    big: "02",
    title: "Coming Soon",
    desc: "La visibilité s'élargit progressivement. Les acquéreurs qui n'ont pas agi en phase 1 réalisent que la fenêtre d'opportunité se referme.",
    tag: "Amplifie la demande",
  },
  {
    num: "Phase 3",
    big: "03",
    title: "Public",
    desc: "Publication sur tous les portails. Votre bien arrive sur le marché avec un historique de demandes déjà constitué et une dynamique de prix favorable.",
    tag: "Maximise le prix",
  },
];

export default function MethodSection() {
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
    <section className="method">
      <div className="method-inner">
        <div className="method-header">
          <div className="method-eyebrow">Notre approche exclusive</div>
          <h2>Une stratégie en 3 phases pour vendre au meilleur prix</h2>
          <p>
            La plupart des agences publient votre bien immédiatement sur tous les
            portails. Nous faisons l'inverse : une diffusion séquentielle qui crée
            l'urgence à chaque étape.
          </p>
        </div>
        <div className="phases">
          {phases.map((p) => (
            <div className="phase-card" key={p.big}>
              <div className="phase-big-num">{p.big}</div>
              <div className="phase-num-wrap">
                <span className="phase-num">{p.num}</span>
                <div className="phase-num-line" />
              </div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="phase-tag">{p.tag}</div>
            </div>
          ))}
        </div>
        <div className="method-cta-wrap">
          <p>Chaque bien est différent. Chaque stratégie aussi.</p>
          <div className="big">
            Découvrez quelle approche maximise la valeur de votre bien lors de
            votre estimation personnalisée.
          </div>
          <button className="method-cta" onClick={scrollToForm}>
            Demander mon estimation
          </button>
        </div>
      </div>
    </section>
  );
}
