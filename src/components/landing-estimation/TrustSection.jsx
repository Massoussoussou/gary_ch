import React, { useRef, useState, useEffect } from "react";

const testimonials = [
  {
    quote:
      "Nous avons reçu deux offres avant même que le bien ne soit publié sur les portails. La phase off-market a créé exactement l'urgence dont nous avions besoin.",
    initials: "ML",
    name: "M. & Mme L.",
    detail: "Appartement 5 pièces · Champel",
    accent: false,
  },
  {
    quote:
      "On pensait que mettre en ligne rapidement était la bonne stratégie. GARY nous a convaincus de faire l'inverse. Résultat : vendu en 6 semaines, au-dessus du prix estimé.",
    initials: "PD",
    name: "P. Dumont",
    detail: "Villa · Nyon",
    accent: true,
  },
  {
    quote:
      "Ce qui m'a convaincu, c'est d'avoir le contrôle. À chaque phase, mon courtier m'expliquait où on en était et quelles étaient les options.",
    initials: "SF",
    name: "S. Fischer",
    detail: "Appartement 4 pièces · Carouge",
    accent: false,
  },
  {
    quote:
      "J'avais déjà essayé avec une autre agence pendant 4 mois. Avec GARY, la stratégie en 3 phases a tout changé. Vendu en phase Coming Soon.",
    initials: "AR",
    name: "A. Rousseau",
    detail: "Maison mitoyenne · Meyrin",
    accent: false,
  },
];

const numbers = [
  { val: "150+", label: "Biens vendus" },
  { val: "Genève", label: "Nyon · Lausanne · Valais" },
  { val: "48h", label: "Estimation détaillée" },
  { val: "4.9★", label: "Avis Google" },
];

export default function TrustSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeIdx, setActiveIdx] = useState(1);

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
            Témoignages
          </p>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] tracking-[-0.02em] leading-[1.05] text-[#1A1A1A]">
            Ils ont vendu avec
            <br />
            la méthode GARY<span className="text-[#FF4A3E]">.</span>
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
