// src/pages/Sell.jsx
import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import ListingCardSold from "../components/cards/ListingCardSold.jsx";
import AlreadyOwner from "../components/AlreadyOwner.jsx";
import useProperties from "../hooks/useProperties.js";
import BandCarousel from "../components/BandCarousel.jsx";
import SellHero from "../components/sell/SellHero";

import { useRevealOnce } from "../hooks/useRevealOnce.js";
import { hasTag } from "../utils/data.js";

/* ─── Données des sections ─── */

const constatCards = [
  {
    title: "Surexposition trop rapide",
    desc: "Un bien visible partout perd sa valeur perçue.",
    img: "/img/gary/extcbg1.jpg",
  },
  {
    title: "Signaux irréversibles",
    desc: "Le marché n'oublie pas un bien « qui ne se vend pas ».",
    img: "/img/gary/extcbg21.jpg",
  },
  {
    title: "Prix mal testés",
    desc: "Un prix public mal calibré crée un signal négatif durable.",
    img: "/img/gary/exther9.jpg",
  },
  {
    title: "Confusion stratégique",
    desc: "La visibilité n'est pas synonyme d'efficacité.",
    mobileImg: "/img/gary/extlcy2.jpg",
  },
];

const philosophiePoints = [
  {
    text: "La publicité n'est jamais un réflexe",
    img: "/img/gary/garymontalegre03.jpg",
  },
  {
    text: <>L'information marché est un actif<br/>stratégique</>,
    img: "/img/gary/garymontalegre29.jpg",
  },
  {
    text: "La relation vendeur prime sur la pression",
    img: "/img/gary/intgvac4.jpg",
  },
  {
    text: "Chaque bien suit une stratégie sur mesure",
    img: "/img/gary/intver25.jpg",
  },
];

const methodeSteps = [
  { num: 1, title: "Compréhension", desc: "Cadrage & analyse" },
  { num: 2, title: "Test marché", desc: "Validation maîtrisée" },
  { num: 3, title: "Ouverture", desc: "Progressive & ciblée" },
  { num: 4, title: "Ajustement", desc: "Basé sur les faits" },
];

/* ─── Variantes d'animation ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
  }),
};

/* ─── Sous-composant : Section Constat (Volta SKAI style) ─── */
function ConstatSection() {
  const sectionRef = useRef(null);
  const imgColRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      const imgCol = imgColRef.current;
      if (!section || !imgCol) return;
      const rect = section.getBoundingClientRect();
      // parallax : images scrollent ~22% plus lentement que les textes
      const offset = Math.max(0, -rect.top) * 0.22;
      imgCol.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // hauteur du bloc titre pour le spacer images
  const TITLE_H = "13rem"; // approximation label + h2

  return (
    <section ref={sectionRef} className="relative bg-[#F5F2ED]" style={{ zIndex: 2 }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">

        {/* ── Desktop : deux colonnes séparées ── */}
        <div className="hidden md:grid grid-cols-[minmax(0,5fr)_1px_minmax(0,6fr)] gap-0">

          {/* ─ Colonne gauche : titre sticky + textes ─ */}
          <div className="pr-10 lg:pr-16 pt-20 lg:pt-28 pb-24 lg:pb-32">
            {/* Titre sticky — fond solide, pas de gradient */}
            <div className="sticky top-[var(--header-h,72px)] z-10 bg-[#F5F2ED] pt-6 pb-10">
              <p className="text-[12px] uppercase tracking-[0.25em] text-[#FF4A3E] font-medium mb-5">
                Constat
              </p>
              <h2 className="font-serif text-[clamp(2.2rem,4.5vw,3.4rem)] tracking-[-0.02em] leading-[1.08] text-[#1A1A1A]">
                Ce qui fragilise les ventes aujourd'hui
              </h2>
            </div>

            {/* Items texte */}
            {constatCards.map((card, i) => (
              <div key={i} className="mt-[38vh] first:mt-[18vh]">
                <p className="text-[13px] text-neutral-400 tracking-wide mb-3">
                  {i + 1} / {constatCards.length}
                </p>
                <h3 className="font-serif text-[clamp(1.4rem,2.5vw,2rem)] tracking-[-0.01em] leading-[1.2] text-[#1A1A1A] mb-3">
                  {card.title}
                </h3>
                <p className="text-[1.05rem] lg:text-[1.15rem] text-neutral-500 leading-relaxed max-w-[38ch]">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          {/* ─ Ligne verticale ─ */}
          <div className="bg-neutral-300/60" />

          {/* ─ Colonne droite : images (scroll décalé) ─ */}
          <div className="pl-10 lg:pl-16 pt-20 lg:pt-28 pb-24 lg:pb-32 overflow-hidden">
            <div ref={imgColRef} className="will-change-transform">
              {/* Spacer = titre sticky height + premier mt */}
              <div style={{ height: "0px" }} />

              {constatCards.filter((c) => c.img).map((card, i) => (
                <div key={i} className="mt-[14vh] first:mt-0">
                  <div className="overflow-hidden rounded-sm shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
                    <img
                      src={card.img}
                      alt={card.title}
                      className="w-full aspect-[4/3] object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile : empilé ── */}
        <div className="md:hidden py-16">
          <p className="text-[12px] uppercase tracking-[0.25em] text-[#FF4A3E] font-medium mb-4">
            Constat
          </p>
          <h2 className="font-serif text-[clamp(1.8rem,8vw,2.6rem)] tracking-[-0.02em] leading-[1.1] text-[#1A1A1A] mb-12">
            Ce qui fragilise les ventes aujourd'hui
          </h2>

          {constatCards.map((card, i) => (
            <div key={i} className="mb-14 last:mb-0">
              {(card.img || card.mobileImg) && (
                <div className="overflow-hidden rounded-sm shadow-[0_4px_24px_rgba(0,0,0,0.06)] mb-5">
                  <img
                    src={card.img || card.mobileImg}
                    alt={card.title}
                    className="w-full aspect-[4/3] object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <p className="text-[12px] text-neutral-400 tracking-wide mb-2">
                {i + 1} / {constatCards.length}
              </p>
              <h3 className="font-serif text-[1.4rem] leading-[1.2] text-[#1A1A1A] mb-2">
                {card.title}
              </h3>
              <p className="text-[1rem] text-neutral-500 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ─── Sous-composant : Section Philosophie ─── */
function PhilosophieSection() {
  const [ref, shown] = useRevealOnce();

  return (
    <section className="relative bg-[#EFECE7] py-20 md:py-28" style={{ zIndex: 2 }}>
      <div ref={ref} className="max-w-[1500px] mx-auto px-6 md:px-8 lg:px-12">

        {/* Deux colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10 lg:gap-16 items-start">

          {/* Gauche — label + titre + texte */}
          <div>
            <motion.p
              initial="hidden"
              animate={shown ? "visible" : "hidden"}
              variants={fadeUp}
              className="text-[12px] uppercase tracking-[0.25em] text-[#FF4A3E] font-medium mb-5"
            >
              Philosophie
            </motion.p>
            <motion.h2
              initial="hidden"
              animate={shown ? "visible" : "hidden"}
              variants={fadeUp}
              custom={1}
              className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] tracking-[-0.02em] leading-[1.1] text-[#1A1A1A] mb-10"
            >
              Progressivité, contrôle, information
            </motion.h2>

            <motion.p
              initial="hidden"
              animate={shown ? "visible" : "hidden"}
              variants={fadeUp}
              custom={2}
              className="text-[clamp(1.2rem,2.2vw,1.5rem)] font-light leading-[1.7] text-[#0F1115]"
            >
              Nous ne cherchons pas à vendre vite.
              <br />
              <span className="text-[#FF4A3E] font-normal">
                Nous cherchons à vendre juste.
              </span>
            </motion.p>
            <motion.p
              initial="hidden"
              animate={shown ? "visible" : "hidden"}
              variants={fadeUp}
              custom={3}
              className="mt-5 text-[1.05rem] text-neutral-500 leading-relaxed"
            >
              En protégeant la valeur du bien et la position du propriétaire.
            </motion.p>
          </div>

          {/* Droite — tableau lignes avec points + hover image */}
          <div className="lg:mt-0">
            <div className="border-t border-neutral-400/40">
              {philosophiePoints.map((point, i) => (
                <div
                  key={i}
                  className="group relative border-b border-neutral-400/40 cursor-default
                             transition-all duration-600 overflow-hidden"
                  style={{
                    opacity: shown ? 1 : 0,
                    transform: shown ? "translateY(0)" : "translateY(24px)",
                    transitionDelay: `${i * 0.12}s`,
                  }}
                >
                  <div className="flex items-center gap-5 py-8 md:py-10 transition-all duration-500
                                  lg:group-hover:py-12 lg:group-hover:py-14">
                    <span className="w-[10px] h-[10px] rounded-full bg-[#FF4A3E] shrink-0
                                     transition-transform duration-300 lg:group-hover:scale-125" />
                    <span className="font-serif text-[clamp(1.3rem,2.5vw,1.8rem)] tracking-[-0.01em]
                                     leading-[1.25] text-[#1A1A1A] flex-1">
                      {point.text}
                    </span>
                    {/* Image au hover — desktop uniquement */}
                    <div className="hidden lg:block w-0 group-hover:w-[200px]
                                    h-[115px] shrink-0
                                    overflow-hidden rounded-sm
                                    transition-all duration-500 opacity-0 group-hover:opacity-100">
                      <img
                        src={point.img}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  {/* Image visible directement — mobile/tablette */}
                  <div className="lg:hidden overflow-hidden rounded-sm mb-6 -mt-2">
                    <img
                      src={point.img}
                      alt=""
                      className="w-full aspect-[16/9] object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─── Sous-composant : Section Méthode (ligne qui se trace au scroll) ─── */
function MethodeSection() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const start = window.innerHeight * 0.85;
      const end = window.innerHeight * 0.35;
      const raw = (start - rect.top) / (start - end);
      setProgress(Math.max(0, Math.min(1, raw)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const total = methodeSteps.length;

  return (
    <section ref={sectionRef} className="relative bg-white py-28 md:py-40" style={{ zIndex: 2 }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Header */}
        <p className="text-[12px] uppercase tracking-[0.25em] text-[#FF4A3E] font-medium mb-5">
          Méthode
        </p>
        <h2 className="font-serif text-[clamp(2.2rem,5vw,3.4rem)] tracking-[-0.02em] leading-[1.1] mb-24 md:mb-32">
          Une approche en phases
        </h2>

        {/* Timeline desktop */}
        <div className="hidden md:block relative">
          {/* Ligne de fond (grise) avec pointe de flèche */}
          <div className="absolute top-[8px] left-0 h-[2px] bg-neutral-200" style={{ right: "6px" }} />
          <div
            className="absolute border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-neutral-200"
            style={{ top: "3px", right: 0 }}
          />
          {/* Ligne active (orange) */}
          <div
            className="absolute top-[8px] left-0 h-[2px] bg-[#FF4A3E] origin-left"
            style={{
              width: `${Math.min(progress * 100, 100)}%`,
              transition: "width 0.1s linear",
            }}
          />
          {/* Pointe de flèche orange */}
          <div
            className="absolute border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-[#FF4A3E] transition-opacity duration-500"
            style={{ top: "3px", right: 0, opacity: progress >= 0.97 ? 1 : 0 }}
          />

          {/* Points + textes */}
          <div className="relative grid grid-cols-4 gap-10 lg:gap-14">
            {methodeSteps.map((step, i) => {
              const threshold = i / (total - 1);
              const visible = progress >= threshold - 0.02;
              const dotFilled = progress >= threshold;

              return (
                <div key={step.num} className="flex flex-col items-start">
                  {/* Dot simple */}
                  <div
                    className="relative z-10 w-[18px] h-[18px] rounded-full border-2
                               transition-all duration-500"
                    style={{
                      borderColor: dotFilled ? "#FF4A3E" : "#D4D4D4",
                      backgroundColor: dotFilled ? "#FF4A3E" : "white",
                      transform: dotFilled ? "scale(1)" : "scale(0.7)",
                    }}
                  />

                  {/* Texte */}
                  <div
                    className="mt-8 transition-all duration-700"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(20px)",
                    }}
                  >
                    <h4 className="font-serif text-[clamp(1.3rem,2vw,1.7rem)] tracking-[-0.01em] leading-[1.2] text-[#1A1A1A] mb-2">
                      {step.title}
                    </h4>
                    <p className="text-[1rem] lg:text-[1.1rem] text-neutral-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline mobile (verticale) */}
        <div className="md:hidden relative pl-10">
          {/* Ligne de fond verticale */}
          <div className="absolute top-0 bottom-0 left-[8px] w-[2px] bg-neutral-200" />
          {/* Ligne active verticale */}
          <div
            className="absolute top-0 left-[8px] w-[2px] bg-[#FF4A3E]"
            style={{
              height: `${Math.min(progress * 100, 100)}%`,
              transition: "height 0.1s linear",
            }}
          />

          <div className="space-y-16">
            {methodeSteps.map((step, i) => {
              const threshold = i / (total - 1);
              const visible = progress >= threshold - 0.05;
              const dotFilled = progress >= threshold;

              return (
                <div key={step.num} className="relative">
                  {/* Dot simple */}
                  <div
                    className="absolute -left-10 top-[3px] w-[16px] h-[16px] rounded-full border-2
                               transition-all duration-500 z-10"
                    style={{
                      borderColor: dotFilled ? "#FF4A3E" : "#D4D4D4",
                      backgroundColor: dotFilled ? "#FF4A3E" : "white",
                    }}
                  />

                  {/* Texte */}
                  <div
                    className="transition-all duration-700"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(12px)",
                    }}
                  >
                    <h4 className="font-serif text-[1.3rem] leading-[1.2] text-[#1A1A1A] mb-2">
                      {step.title}
                    </h4>
                    <p className="text-[1rem] text-neutral-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Citation */}
        <p
          className="mt-20 md:mt-28 text-center text-[1.1rem] md:text-[1.25rem]
                     italic text-neutral-500 max-w-2xl mx-auto
                     pt-10 border-t border-neutral-200 transition-opacity duration-700"
          style={{ opacity: progress > 0.9 ? 1 : 0 }}
        >
          "Nous observons, testons et écoutons avant que le marché ne juge publiquement."
        </p>
      </div>
    </section>
  );
}

/* ─── Page principale ─── */
export default function Sell() {
  const { data } = useProperties();

  const vendus = useMemo(
    () => data.filter((d) => hasTag(d, /vendu/i) || d.vendu),
    [data]
  );

  return (
    <main className="text-[#0F1115] overflow-x-clip">
      {/* HERO */}
      <SellHero />

      {/* CONSTAT */}
      <ConstatSection />

      {/* PHILOSOPHIE */}
      <PhilosophieSection />

      {/* MÉTHODE */}
      <MethodeSection />

      {/* DÉJÀ VENDU */}
      {vendus.length > 0 && (
        <section className="relative py-24 bg-white" style={{ zIndex: 2 }}>
          <BandCarousel
            title="Déjà vendu"
            items={vendus}
            renderItem={ListingCardSold}
          />
        </section>
      )}

      <div className="relative" style={{ zIndex: 2 }}>
        <AlreadyOwner toEstimate="/estimer" toSell="/contact" />
      </div>
    </main>
  );
}
