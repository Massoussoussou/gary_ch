// src/pages/Sell.jsx
import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ListingCardSold from "../components/cards/ListingCardSold.jsx";
import AlreadyOwner from "../components/AlreadyOwner.jsx";
import useProperties from "../hooks/useProperties.js";
import BandCarousel from "../components/BandCarousel.jsx";
import SellHero from "../components/sell/SellHero";
import StickyCTA from "../components/sell/StickyCTA";

import { useRevealOnce } from "../hooks/useRevealOnce.js";
import { hasTag } from "../utils/data.js";

/* ─── Hook : compteur animé ─── */
function useCountUp(target, duration = 2200, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) { setValue(0); return; }
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(eased * target);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return value;
}

/* ─── Section Proof — chiffres + texte + CTA ─── */
const PROOF_STATS = [
  { value: 50, suffix: "%", label: "vendus avant publication" },
  { value: 8, suffix: " sem.", label: "délai moyen de vente" },
  { value: 500, suffix: "K", label: "portée mensuelle disponible" },
];

function ProofSection() {
  const sectionRef = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || seen) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSeen(true); },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [seen]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#FAF6F0] pt-20 md:pt-28 pb-10 md:pb-14"
      style={{ zIndex: 2 }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Trait orange animé */}
        <div className="flex justify-center mb-8">
          <div
            className="h-[2px] bg-[#FF4A3E]"
            style={{
              width: seen ? "60px" : "0px",
              transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>

        {/* Texte principal */}
        <p
          className="text-center font-serif text-[clamp(1.6rem,4vw,2.8rem)] leading-[1.3] text-gray-900 max-w-[800px] mx-auto mb-16 md:mb-20"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          La moitié de nos biens trouvent acquéreur{" "}
          <span className="text-[#FF4A3E]">avant même d'être publiés</span>.
          Et quand une diffusion plus large est nécessaire, notre réseau génère
          plus de <span className="text-[#FF4A3E]">500&nbsp;000 vues par mois</span>.
        </p>

        {/* 3 stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-12 gap-x-8 md:gap-x-16 mb-16 md:mb-20">
          {PROOF_STATS.map((stat, i) => {
            const count = useCountUp(stat.value, 2200, seen);
            const delay = i * 0.15;
            return (
              <div
                key={i}
                className="flex flex-col items-center text-center"
                style={{
                  opacity: seen ? 1 : 0,
                  transform: seen ? "translateY(0)" : "translateY(30px)",
                  transition: `opacity 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
                }}
              >
                <span
                  className="font-sans font-bold text-[36px] sm:text-[52px] md:text-[72px] lg:text-[88px] leading-none tracking-tight text-[#FF4A3E]"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {Math.round(count)}{stat.suffix}
                </span>
                <p
                  className="mt-3 text-[14px] md:text-[17px] uppercase tracking-[0.12em] text-gray-600 leading-relaxed"
                  style={{
                    opacity: seen ? 1 : 0,
                    transition: `opacity 0.6s ease-out ${delay + 0.4}s`,
                  }}
                >
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Estimer */}
        <div
          className="flex flex-col items-center"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease-out 0.5s, transform 0.7s ease-out 0.5s",
          }}
        >
          <Link
            to="/estimer"
            className="group inline-flex items-center gap-3 bg-[#FF4A3E] text-white px-14 py-5 text-[15px] font-medium uppercase tracking-[0.15em] transition-all duration-300 hover:brightness-110 hover:shadow-lg hover:shadow-[#FF4A3E]/25"
          >
            Estimer mon bien
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="mt-3 text-[13px] text-neutral-900 tracking-wide">
            Sans engagement — résultat sous 48h
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Données des sections ─── */

const constatCards = [
  {
    title: "Surexposition immédiate",
    desc: <>Votre bien est vu par tout le monde en 48h.<br/>Passé ce pic, il est <span className="text-[#FF4A3E]">perçu comme invendu</span>.<br/>Les acquéreurs négocient à la baisse.</>,
    img: "/img/gary/extcbg1.webp",
  },
  {
    title: "Prix mal positionné",
    desc: <>Sans analyse des comparables récents,<br/>le prix est souvent trop haut puis <span className="text-[#FF4A3E]">baissé publiquement</span>,<br/>ce qui affaiblit votre position.</>,
    img: "/img/gary/extcbg21.webp",
  },
  {
    title: "Aucune stratégie de diffusion",
    desc: <>Publier partout en même temps<br/>n'est pas une stratégie. Résultat :<br/>des <span className="text-[#FF4A3E]">visites non qualifiées</span> et un bien qui stagne.</>,
    img: "/img/gary/exther9.webp",
  },
];

const philosophiePoints = [
  {
    text: "Estimations factuelles",
    desc: "Pas un chiffre sorti d'un algorithme. Une analyse des ventes récentes dans votre quartier, un positionnement prix argumenté, et un dossier complet que vous pouvez partager avec votre notaire ou conseiller financier.",
    img: "/img/gary/ExtBlv-8.webp",
  },
  {
    text: "Diffusion contrôlée",
    desc: "Votre bien est présenté d'abord à un cercle restreint d'acquéreurs qualifiés, puis élargi progressivement aux portails. Chaque étape est validée avec vous. C'est cette séquence qui protège votre prix.",
    img: "/img/gary/ExtVer-6.webp",
  },
  {
    text: <>Accès discret aux bons<br/>acquéreurs</>,
    desc: "Nous ne publions pas pour attirer la masse. Nous activons notre réseau d'acquéreurs qualifiés qui cherchent exactement votre type de bien. Discrétion garantie.",
    img: "/img/gary/maison35.webp",
  },
];

const parcoursSteps = [
  {
    num: 1,
    title: "La rencontre",
    tag: "Sans engagement",
    desc: "Nous visitons votre bien et écoutons votre situation : délais, attentes, contraintes. Pas de pitch commercial, pas d'engagement. Juste une conversation honnête pour comprendre ce que vous cherchez vraiment.",
    img: "/img/gary/garymontalegre03.jpg",
  },
  {
    num: 2,
    title: "L'estimation",
    tag: "Dossier complet remis",
    desc: "Analyse des ventes récentes dans votre quartier, évaluation des points forts et axes d'amélioration. Vous recevez un dossier complet avec une fourchette de prix argumentée.",
    img: "/img/gary/garymontalegre29.jpg",
  },
  {
    num: 3,
    title: "La stratégie",
    tag: "Plan de diffusion sur mesure",
    desc: "Nous définissons ensemble à qui montrer votre bien en premier, à quel prix, et dans quel ordre. C'est cette séquence qui protège votre prix.",
    img: "/img/gary/intver25.jpg",
  },
  {
    num: 4,
    title: "La mise en marché",
    tag: "Diffusion progressive et contrôlée",
    desc: "Photographie professionnelle, microsite dédié, brochure de présentation. Votre bien est d'abord proposé en exclusivité, puis élargi progressivement. Chaque étape est validée avec vous.",
    img: "/img/gary/extver5.jpg",
  },
  {
    num: 5,
    title: "La vente et au-delà",
    tag: "Accompagnement complet",
    desc: "Négociation des offres, coordination avec le notaire, accompagnement jusqu'à la remise des clés. Nous restons votre interlocuteur unique du premier appel au dernier acte.",
    img: "/img/gary/intgvac4.jpg",
  },
];

const livrables = [
  { title: "Dossier d'estimation", desc: "Comparables récents, positionnement prix, analyse du quartier. Un document que vous pouvez partager avec votre notaire." },
  { title: "Microsite dédié", desc: "Une page web élégante consacrée à votre bien. Photos HD, plan, situation — partageable en un lien." },
  { title: "Photographie pro", desc: "Shooting professionnel. Chaque image valorise les volumes, la lumière, les vues." },
  { title: "Brochure de présentation", desc: "Document imprimé et numérique de qualité pour les acquéreurs qualifiés." },
  { title: "Marketing & vidéo", desc: "Réseaux sociaux, vidéo lifestyle professionnelle, buzz ciblé. Votre bien est mis en scène pour toucher les bons acquéreurs, au bon moment." },
  { title: "Accompagnement notarial", desc: "De la promesse à l'acte authentique, nous coordonnons chaque étape avec votre notaire." },
];

const temoignages = [
  {
    name: "Sophie M.",
    text: "GARY a vendu notre appartement en 3 semaines, au-dessus du prix estimé. Un accompagnement irréprochable du début à la fin.",
    stars: 5,
  },
  {
    name: "Laurent D.",
    text: "Professionnalisme et discrétion. Notre villa a été présentée uniquement à des acquéreurs qualifiés. Résultat : une vente rapide sans négociation.",
    stars: 5,
  },
  {
    name: "Marie-Claire B.",
    text: "Le dossier d'estimation était d'une qualité remarquable. Nous avons pu prendre notre décision en toute confiance.",
    stars: 5,
  },
];

const faqItems = [
  {
    q: "Combien coûte une estimation ?",
    a: "L'estimation est gratuite et sans engagement. Nous vous remettons un dossier complet avec analyse des comparables, positionnement prix et recommandations. Vous décidez ensuite librement si vous souhaitez poursuivre avec nous.",
  },
  {
    q: "En combien de temps se vend un bien ?",
    a: "En moyenne, nos mandats se vendent en 8 semaines. Mais chaque situation est différente. La moitié de nos biens trouvent acquéreur avant même d'être publiés sur les portails, grâce à notre réseau d'acquéreurs qualifiés.",
  },
  {
    q: "Quelle est votre commission ?",
    a: "Nous pratiquons une commission alignée avec le marché suisse du prestige. Le taux exact est discuté lors de notre première rencontre et dépend du type de mandat et de la stratégie retenue. Pas de frais cachés, pas de surprise.",
  },
  {
    q: "Dois-je faire des travaux avant de vendre ?",
    a: "Pas nécessairement. Lors de notre visite, nous identifions les améliorations à fort impact (et celles qui ne valent pas l'investissement). Parfois un home staging léger suffit. Nous vous conseillons honnêtement sur ce qui a un vrai retour.",
  },
  {
    q: "Quelle différence avec une grande agence ?",
    a: "Dans une grande agence, votre bien est un dossier parmi des centaines. Chez GARY, chaque courtier accompagne un nombre limité de mandats à la fois. Vous avez un interlocuteur unique, joignable, qui connaît votre bien comme s'il était le sien.",
  },
  {
    q: "Puis-je vendre sans publier sur les portails ?",
    a: "Absolument. Certains de nos biens se vendent exclusivement via notre réseau d'acquéreurs qualifiés, sans jamais apparaître en ligne. C'est ce qu'on appelle une vente off-market. Si la discrétion est importante pour vous, c'est une option que nous maîtrisons parfaitement.",
  },
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

/* ─── Sous-composant : Section Constat — cercle "tourner en rond" ─── */
function ConstatSection() {
  const sectionRef = useRef(null);
  const circleRef = useRef(null);
  const [seen, setSeen] = useState(false);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || seen) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSeen(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [seen]);

  // Ligne verticale qui grandit au scroll depuis le bas du cercle
  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const circle = circleRef.current;
        if (!circle) return;
        const rect = circle.getBoundingClientRect();
        const circleBottom = rect.bottom;
        const viewH = window.innerHeight;
        const progress = Math.max(0, (viewH * 0.7 - circleBottom) / (viewH * 0.5));
        setLineHeight(Math.min(progress * 600, 600));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(rafId); };
  }, []);

  return (
    <>
    {/* Titre + paragraphe sur fond uni */}
    <section
      id="constat"
      className="relative bg-[#F5F2ED] pt-16 md:pt-24 pb-16 md:pb-24"
      style={{ zIndex: 2 }}
    >
      <div className="max-w-[900px] mx-auto px-6 md:px-10 text-center">
        <p className="text-[12px] uppercase tracking-[0.25em] text-[#FF4A3E] font-medium mb-5">
          Le constat
        </p>
        <h2 className="font-serif text-[clamp(2rem,5vw,3.2rem)] tracking-[-0.02em] leading-[1.1] text-[#1A1A1A] mb-5">
          Ce qui fait perdre de l'argent aux vendeurs<span className="text-[#FF4A3E]">.</span>
        </h2>
        <p className="text-[1rem] md:text-[1.1rem] text-neutral-500 leading-relaxed max-w-[580px] mx-auto">
          La plupart des agences publient votre bien sur tous les portails dès le premier jour. C'est la méthode standard.{" "}
          <span className="text-[#FF4A3E]">C'est aussi celle qui vous coûte le plus cher.</span>
        </p>
      </div>
    </section>

    {/* Cercle sur image de fond */}
    <section
      ref={sectionRef}
      className="relative pt-20 md:pt-28 pb-20 md:pb-32 overflow-visible"
      style={{ zIndex: 2 }}
    >
      <img
        src="/img/gary/extani1611.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-white/85" />

      <div className="relative max-w-[900px] mx-auto px-6 md:px-10 text-center">
        <div>
        <div className="flex justify-center">
          <div
            ref={circleRef}
            data-circle
            className="relative"
            style={{
              width: "min(640px, 90vw)",
              height: "min(640px, 90vw)",
              opacity: seen ? 1 : 0,
              transform: seen ? "scale(1)" : "scale(0.6)",
              transition: "opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full" style={{ overflow: "visible" }}>
              {/* Bordure épaisse */}
              <circle cx="100" cy="100" r="80" fill="none" stroke="#FF4A3E" strokeWidth="7" />
              {/* Flèches blanches tournantes */}
              <g className="animate-[constat-spin_20s_linear_infinite]" style={{ transformOrigin: "100px 100px" }}>
                {Array.from({ length: 6 }).map((_, i) => {
                  const angle = (i * 360) / 6;
                  const rad = (angle * Math.PI) / 180;
                  const x = 100 + 79.5 * Math.cos(rad);
                  const y = 100 + 79.5 * Math.sin(rad);
                  return (
                    <text
                      key={i}
                      x={x}
                      y={y}
                      fill="white"
                      fontSize="9"
                      fontWeight="800"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${angle + 90} ${x} ${y})`}
                    >
                      ›
                    </text>
                  );
                })}
              </g>

              {/* Texte central dans le cercle — plus bas sur mobile */}
              <text x="100" y="95" textAnchor="middle" fill="#FF4A3E" fontSize="32" fontWeight="700" fontFamily="sans-serif"
                className="lg:![dominant-baseline:auto]"
                style={{ opacity: seen ? 1 : 0, transition: "opacity 0.6s ease-out 0.4s" }}
              >73%</text>
              <text x="100" y="113" textAnchor="middle" fill="#1A1A1A" fontSize="6.5" fontFamily="sans-serif"
                style={{ opacity: seen ? 1 : 0, transition: "opacity 0.6s ease-out 0.6s" }}
              >des biens au-delà de 90 jours</text>
              <text x="100" y="122" textAnchor="middle" fill="#FF4A3E" fontSize="6.5" fontWeight="400" fontFamily="sans-serif"
                style={{ opacity: seen ? 1 : 0, transition: "opacity 0.6s ease-out 0.6s" }}
              >subissent une décote</text>

              {/* Traits + points — desktop uniquement */}
              <g className="hidden lg:block">
              {(() => {
                const dots = [
                  { angle: 150, midX: 5, midY: 195, endX: -75, endY: 195 },
                  { angle: 30, midX: 195, midY: 195, endX: 275, endY: 195 },
                  { angle: -90, midX: 70, midY: -15, endX: -10, endY: -15 },
                ];
                return dots.map(({ angle, midX, midY, endX, endY }, i) => {
                  const rad = (angle * Math.PI) / 180;
                  const cx = 100 + 80 * Math.cos(rad);
                  const cy = 100 + 80 * Math.sin(rad);
                  const seg1Len = Math.sqrt((midX - cx) ** 2 + (midY - cy) ** 2);
                  const seg2Len = Math.abs(endX - midX);
                  return (
                    <g key={`trait-${i}`}>
                      <line
                        x1={cx} y1={cy} x2={midX} y2={midY}
                        stroke="#FF4A3E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeDasharray={seg1Len}
                        strokeDashoffset={seen ? 0 : seg1Len}
                        style={{
                          transition: `stroke-dashoffset 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${0.6 + i * 0.2}s`,
                        }}
                      />
                      <line
                        x1={midX} y1={midY} x2={endX} y2={endY}
                        stroke="#FF4A3E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeDasharray={seg2Len}
                        strokeDashoffset={seen ? 0 : seg2Len}
                        style={{
                          transition: `stroke-dashoffset 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${0.9 + i * 0.2}s`,
                        }}
                      />
                      <circle cx={cx} cy={cy} r="6" fill="#FF4A3E" stroke="#F5F2ED" strokeWidth="2" />
                    </g>
                  );
                });
              })()}
              </g>

            </svg>

            {/* Encart eBook — haut droite (desktop only) */}
            <Link
              to="/ressources"
              className="group/ebook absolute top-[-2%] right-[-65%] hidden lg:block w-[320px] shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 origin-center"
              style={{
                opacity: seen ? 1 : 0,
                transform: seen ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.7s ease-out 1.4s, transform 0.7s ease-out 1.4s",
                background: "#FF4A3E",
              }}
            >
              <img
                src="/ebook-cover.png"
                alt="eBook GARY — Lire le guide"
                className="w-full block"
              />
              <p className="text-center text-white py-3 text-[14px] font-medium uppercase tracking-[0.12em]">
                Lire le guide
                <span className="inline-block ml-2 transition-transform duration-300 group-hover/ebook:translate-x-1">→</span>
              </p>
            </Link>

            {/* Labels au bout du 2e trait — desktop uniquement */}
            {[
              {
                card: constatCards[0],
                style: { bottom: "6%", left: "-14%", transform: "translateX(-100%)" },
                align: "text-left items-start",
              },
              {
                card: constatCards[2],
                style: { bottom: "6%", right: "-14%", transform: "translateX(100%)" },
                align: "text-left items-start",
              },
              {
                card: constatCards[1],
                style: { top: "-4%", left: "5%", transform: "translateX(-100%)" },
                align: "text-left items-start",
              },
            ].map(({ card, style, align }, i) => (
              <div
                key={`label-${i}`}
                className={`absolute hidden lg:flex flex-col max-w-[360px] md:max-w-[420px] ${align} bg-white p-5 md:p-6`}
                style={{
                  ...style,
                  opacity: seen ? 1 : 0,
                  transition: `opacity 0.5s ease-out ${1.2 + i * 0.2}s`,
                }}
              >
                <h3 className="font-serif text-[1.5rem] md:text-[1.9rem] leading-tight text-[#1A1A1A] mb-2">
                  {card.title}
                </h3>
                <p className="text-[17px] md:text-[19px] text-neutral-600 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes constat-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        </div>

        {/* ── Mobile : cartes constat sous le cercle ── */}
        <div className="lg:hidden mt-10 flex flex-col gap-4 px-1">
          {constatCards.map((card, i) => (
            <div
              key={`m-constat-${i}`}
              className="bg-white p-5 border border-neutral-100 shadow-sm"
              style={{
                opacity: seen ? 1 : 0,
                transform: seen ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.5s ease-out ${0.6 + i * 0.15}s, transform 0.5s ease-out ${0.6 + i * 0.15}s`,
              }}
            >
              <h3 className="font-serif text-[1.25rem] leading-tight text-[#1A1A1A] mb-2">
                {card.title}
              </h3>
              <p className="text-[15px] text-neutral-600 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}

/* ─── Sous-composant : Section "Notre différence" — sticky title + parallax images ─── */
function PhilosophieSection() {
  const sectionRef = useRef(null);
  const imgColRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth < 768) return; // pas de parallax sur mobile
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const section = sectionRef.current;
        const imgCol = imgColRef.current;
        if (!section || !imgCol) return;
        const rect = section.getBoundingClientRect();
        const offset = Math.max(0, -rect.top) * 0.22;
        imgCol.style.transform = `translateY(${offset}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(rafId); };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#F5F2ED]" style={{ zIndex: 2 }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">

        {/* ── Desktop : deux colonnes séparées ── */}
        <div className="hidden md:grid grid-cols-[minmax(0,5fr)_3px_minmax(0,6fr)] gap-0">

          {/* ─ Colonne gauche : titre sticky + textes ─ */}
          <div className="pr-10 lg:pr-16 pt-20 lg:pt-28 pb-24 lg:pb-32">
            <div className="sticky top-[var(--header-h,72px)] z-10 bg-[#F5F2ED] pt-6 pb-10">
              <p className="text-[12px] uppercase tracking-[0.25em] text-[#FF4A3E] font-medium mb-5">
                Notre différence
              </p>
              <h2 className="font-serif text-[clamp(2.2rem,4.5vw,3.4rem)] tracking-[-0.02em] leading-[1.08] text-[#1A1A1A]">
                Ce que d'autres promettent,<br/>
                <span className="text-[#FF4A3E]">nous le livrons.</span>
              </h2>
              <p className="mt-5 text-[1.1rem] text-neutral-500 leading-relaxed">
                Trois engagements concrets qui changent le résultat de votre vente.
              </p>
            </div>

            {philosophiePoints.map((point, i) => (
              <div key={i} className="mt-[38vh] first:mt-[18vh]">
                <p className="text-[13px] text-neutral-400 tracking-wide mb-3">
                  {i + 1} / {philosophiePoints.length}
                </p>
                <h3 className="font-serif text-[clamp(1.4rem,2.5vw,2rem)] tracking-[-0.01em] leading-[1.2] text-[#1A1A1A] mb-3">
                  {point.text}
                </h3>
                <p className="text-[1.05rem] lg:text-[1.15rem] text-neutral-500 leading-relaxed max-w-[38ch]">
                  {point.desc}
                </p>
              </div>
            ))}
          </div>

          {/* ─ Ligne verticale (tracée par le SVG ConnectLine) ─ */}
          <div data-separator />

          {/* ─ Colonne droite : images (scroll décalé) ─ */}
          <div className="pl-10 lg:pl-16 pt-20 lg:pt-28 pb-24 lg:pb-32 overflow-hidden">
            <div ref={imgColRef} className="will-change-transform">
              {philosophiePoints.map((point, i) => (
                <div key={i} className="mt-[14vh] first:mt-0">
                  <div className="overflow-hidden rounded-sm shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
                    <img
                      src={point.img}
                      alt={typeof point.text === "string" ? point.text : ""}
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
            Notre différence
          </p>
          <h2 className="font-serif text-[clamp(1.8rem,8vw,2.6rem)] tracking-[-0.02em] leading-[1.1] text-[#1A1A1A] mb-4">
            Ce que d'autres promettent,<br/>
            <span className="text-[#FF4A3E]">nous le livrons.</span>
          </h2>
          <p className="text-[1rem] text-neutral-500 leading-relaxed mb-12">
            Trois engagements concrets qui changent le résultat de votre vente.
          </p>

          {philosophiePoints.map((point, i) => (
            <div key={i} className="mb-14 last:mb-0">
              <div className="overflow-hidden rounded-sm shadow-[0_4px_24px_rgba(0,0,0,0.06)] mb-5">
                <img
                  src={point.img}
                  alt={typeof point.text === "string" ? point.text : ""}
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
              </div>
              <p className="text-[12px] text-neutral-400 tracking-wide mb-2">
                {i + 1} / {philosophiePoints.length}
              </p>
              <h3 className="font-serif text-[1.4rem] leading-[1.2] text-[#1A1A1A] mb-2">
                {point.text}
              </h3>
              <p className="text-[1rem] text-neutral-500 leading-relaxed">
                {point.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ─── Sous-composant : Parcours — Demi-cercle + point voyageur ─── */
function ParcoursSection() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepProgress, setStepProgress] = useState(0.5);
  const total = parcoursSteps.length;

  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const scrolled = -rect.top;
        const stepH = el.offsetHeight / total;
        const rawIdx = scrolled / stepH;
        const idx = Math.max(0, Math.min(total - 1, Math.floor(rawIdx)));
        const progress = Math.max(0, Math.min(1, rawIdx - idx));
        setActiveIndex(idx);
        setStepProgress(progress);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(rafId); };
  }, [total]);

  const scrollToStep = useCallback((idx) => {
    const el = sectionRef.current;
    if (!el) return;
    const sectionTop = el.getBoundingClientRect().top + window.scrollY;
    const stepH = el.offsetHeight / total;
    window.scrollTo({ top: sectionTop + stepH * idx + stepH * 0.45, behavior: "smooth" });
  }, [total]);

  const R = 80;
  /* Le point descend chill, se bloque au milieu, puis repart chill */
  let mappedProgress;
  if (stepProgress < 0.2) {
    // Arrivée tranquille : -90° → 0°
    const t = stepProgress / 0.2;
    mappedProgress = t * 0.5;
  } else if (stepProgress < 0.8) {
    // Bloqué au milieu : reste exactement à 0°
    mappedProgress = 0.5;
  } else {
    // Départ tranquille : 0° → +90°
    const t = (stepProgress - 0.8) / 0.2;
    mappedProgress = 0.5 + t * 0.5;
  }
  const dotAngleDeg = -90 + mappedProgress * 180;
  const dotAngleRad = (dotAngleDeg * Math.PI) / 180;
  const dotX = 100 + R * Math.cos(dotAngleRad);
  const dotY = 100 + R * Math.sin(dotAngleRad);

  /* Fade in en haut, plein au milieu, fade out en bas */
  const dotOpacity = stepProgress < 0.12
    ? stepProgress / 0.12
    : stepProgress > 0.88
      ? (1 - stepProgress) / 0.12
      : 1;

  return (
    <>
    {/* ── Mobile : parcours en cartes verticales ── */}
    <section id="parcours" className="md:hidden relative bg-[#F5F2ED] py-14 px-5" style={{ zIndex: 2 }}>
      <p className="text-[12px] uppercase tracking-[0.25em] text-[#FF4A3E] mb-4">
        Votre parcours
      </p>
      <h2 className="font-serif text-[clamp(1.8rem,8vw,2.6rem)] tracking-[-0.02em] leading-[1.1] text-[#1A1A1A] mb-10">
        De la rencontre<br />à la remise des clés<span className="text-[#FF4A3E]">.</span>
      </h2>

      <div className="flex flex-col gap-8">
        {parcoursSteps.map((step, i) => (
          <div key={`m-parcours-${i}`}>
            <div className="overflow-hidden rounded-sm shadow-[0_4px_24px_rgba(0,0,0,0.06)] mb-4">
              <img
                src={step.img}
                alt={step.title}
                className="w-full aspect-[16/10] object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FF4A3E] text-white text-[13px] font-semibold shrink-0">
                {step.num}
              </span>
              <span className="text-[11px] uppercase tracking-[0.15em] text-[#FF4A3E] border border-[#FF4A3E]/30 px-3 py-1">
                {step.tag}
              </span>
            </div>
            <h3 className="font-serif text-[1.5rem] leading-[1.15] text-[#1A1A1A] mb-2">
              {step.title}
            </h3>
            <p className="text-[0.95rem] text-neutral-600 leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>

    {/* ── Desktop : parcours scroll-driven ── */}
    <section
      ref={sectionRef}
      className="relative hidden md:block"
      style={{ zIndex: 2, height: `${(total + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-[#F5F2ED]">

        {/* ── Demi-cercle collé à gauche ── */}
        <div
          className="absolute top-1/2 hidden md:block pointer-events-none"
          style={{
            left: 0,
            transform: "translate(-50%, -50%)",
            width: "clamp(520px, 74vh, 780px)",
            height: "clamp(520px, 74vh, 780px)",
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full" style={{ overflow: "visible" }}>
            {/* Bordure du cercle — même style que ConstatSection */}
            <circle cx="100" cy="100" r={R} fill="none" stroke="#FF4A3E" strokeWidth="4" />

            {/* Flèches tournantes sens horaire */}
            <g className="animate-[constat-spin_20s_linear_infinite]" style={{ transformOrigin: "100px 100px" }}>
              {Array.from({ length: 6 }).map((_, i) => {
                const a = (i * 360) / 6;
                const rad = (a * Math.PI) / 180;
                const fx = 100 + 79.5 * Math.cos(rad);
                const fy = 100 + 79.5 * Math.sin(rad);
                return (
                  <text
                    key={`arrow-${i}`}
                    x={fx}
                    y={fy}
                    fill="white"
                    fontSize="9"
                    fontWeight="800"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${a + 90} ${fx} ${fy})`}
                  >
                    ›
                  </text>
                );
              })}
            </g>

            {/* Point actif qui voyage le long de la bordure */}
            <circle
              cx={dotX}
              cy={dotY}
              r="7"
              fill="#FF4A3E"
              opacity={dotOpacity}
            />
            {/* Halo */}
            <circle
              cx={dotX}
              cy={dotY}
              r="12"
              fill="none"
              stroke="#FF4A3E"
              strokeWidth="1.5"
              opacity={dotOpacity * 0.2}
            />
          </svg>
        </div>

        {/* ── Contenu principal ── */}
        <div className="relative h-full flex items-center">
          <div className="hidden md:block shrink-0" style={{ width: "clamp(220px, 34vh, 360px)" }} />

          <div className="flex-1 min-w-0 px-6 md:px-10 lg:pr-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-8 lg:gap-14 items-center max-w-[1300px]">

              {/* Texte */}
              <div className="relative min-h-[300px]">
                {parcoursSteps.map((step, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 flex flex-col justify-center"
                    style={{
                      opacity: activeIndex === i ? 1 : 0,
                      transform: activeIndex === i
                        ? "translateY(0)"
                        : activeIndex > i
                          ? "translateY(-40px)"
                          : "translateY(40px)",
                      transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
                      pointerEvents: activeIndex === i ? "auto" : "none",
                    }}
                  >
                    <p className="text-[12px] uppercase tracking-[0.25em] text-[#FF4A3E] mb-4">
                      Votre parcours
                    </p>
                    <h2 className="font-serif text-[clamp(2.2rem,4.5vw,3.4rem)] tracking-[-0.02em] leading-[1.08] text-[#1A1A1A] mb-5">
                      {step.title}
                    </h2>
                    <span className="inline-block text-[12px] uppercase tracking-[0.15em] text-[#FF4A3E] border border-[#FF4A3E]/30 px-4 py-1.5 mb-5 w-fit">
                      {step.tag}
                    </span>
                    <p className="text-[1.05rem] lg:text-[1.1rem] text-neutral-600 leading-relaxed max-w-[480px]">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Image */}
              <div className="relative hidden lg:block translate-x-8 translate-y-6">
                {parcoursSteps.map((step, i) => (
                  <div
                    key={`img-${i}`}
                    className={i === 0 ? "relative" : "absolute inset-0"}
                    style={{
                      opacity: activeIndex === i ? 1 : 0,
                      transform: activeIndex === i ? "scale(1)" : "scale(0.96)",
                      transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
                    }}
                  >
                    <div className="overflow-hidden rounded-sm shadow-[0_16px_60px_rgba(0,0,0,0.12)]">
                      <img src={step.img} alt={step.title} className="w-full aspect-[16/10] object-cover" loading="lazy" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile dots removed — mobile uses separate card layout above */}

        {/* ── Boutons navigation sections ── */}
        <div className="absolute bottom-8 right-8 flex items-center gap-3 z-20">
          <button
            onClick={() => {
              const el = document.getElementById("constat");
              if (!el) return;
              const top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.15;
              window.scrollTo({ top, behavior: "smooth" });
            }}
            className="w-11 h-11 rounded-full border border-neutral-300 bg-white/60 backdrop-blur-sm flex items-center justify-center text-neutral-500 hover:border-[#FF4A3E] hover:text-[#FF4A3E] transition-all"
            aria-label="Section précédente"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("vendus");
              if (!el) return;
              const top = el.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({ top, behavior: "smooth" });
            }}
            className="w-11 h-11 rounded-full border border-neutral-300 bg-white/60 backdrop-blur-sm flex items-center justify-center text-neutral-500 hover:border-[#FF4A3E] hover:text-[#FF4A3E] transition-all"
            aria-label="Section suivante"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Compteur */}
        <div className="absolute bottom-8 left-6 flex items-baseline gap-2 z-20">
          <span className="font-serif text-[1.8rem] text-[#FF4A3E]">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="text-[13px] text-neutral-400">
            / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
    </>
  );
}

/* ─── Icônes livrables ─── */
function LivrableIcon({ index, small, color = "white" }) {
  const cls = small
    ? "w-8 h-8 md:w-10 md:h-10"
    : "w-14 h-14 md:w-20 md:h-20";
  const props = {
    className: cls,
    viewBox: "0 0 64 64",
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (index) {
    case 0: // Dossier d'estimation — document + barres
      return (
        <svg {...props}>
          <rect x="14" y="6" width="26" height="36" rx="2" />
          <path d="M22 18h10M22 24h10M22 30h6" />
          <rect x="34" y="28" width="16" height="18" rx="1" />
          <path d="M38 40v-6M42 40v-9M46 40v-4" />
        </svg>
      );
    case 1: // Microsite dédié — écran web
      return (
        <svg {...props}>
          <rect x="6" y="8" width="40" height="30" rx="3" />
          <path d="M6 18h40" />
          <circle cx="11" cy="13" r="1.5" fill="white" stroke="none" />
          <circle cx="17" cy="13" r="1.5" fill="white" stroke="none" />
          <circle cx="23" cy="13" r="1.5" fill="white" stroke="none" />
          <path d="M18 46h16M26 38v8" />
          <path d="M16 28h8M16 33h12" />
        </svg>
      );
    case 2: // Photographie pro — appareil photo
      return (
        <svg {...props}>
          <rect x="6" y="18" width="40" height="28" rx="3" />
          <path d="M18 18l4-8h8l4 8" />
          <circle cx="26" cy="34" r="9" />
          <circle cx="26" cy="34" r="4" />
          <circle cx="40" cy="24" r="2" fill="white" stroke="none" />
        </svg>
      );
    case 3: // Brochure — livre ouvert
      return (
        <svg {...props}>
          <path d="M32 12v34" />
          <path d="M32 12c-5-3-12-4-20-2v32c8-2 15-1 20 2" />
          <path d="M32 12c5-3 12-4 20-2v32c-8-2-15-1-20 2" />
        </svg>
      );
    case 4: // Marketing & vidéo — caméra + play
      return (
        <svg {...props}>
          <rect x="4" y="14" width="34" height="26" rx="3" />
          <polygon points="38,22 50,16 50,38 38,32" />
          <polygon points="18,24 18,34 26,29" fill="white" stroke="none" />
        </svg>
      );
    case 5: // Accompagnement notarial — poignée de main
      return (
        <svg {...props}>
          <path d="M4 32l12-12 6 2 8-8" />
          <path d="M34 14l8 8 6-2 12 12" />
          <path d="M16 22l6 6 8-2 6 6" />
          <path d="M10 44h10l4-4" />
          <path d="M42 44H34l-4-4" />
          <path d="M22 38l4 4 4-4" />
        </svg>
      );
    default:
      return null;
  }
}

/* ─── Sous-composant : Livrables + Témoignages — section combinée ─── */
function LivrablesSection() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const scrolled = -rect.top;
        const maxScroll = el.offsetHeight - window.innerHeight;
        setProgress(Math.max(0, Math.min(1, scrolled / maxScroll)));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(rafId); };
  }, []);

  /* ── Phases (550vh total) ── */
  const titleOpacity = progress < 0.04 ? 1 : Math.max(0, 1 - (progress - 0.04) / 0.07);
  const lineProgress = Math.max(0, Math.min(1, (progress - 0.07) / 0.2));
  const linesDrawn = lineProgress >= 1;
  const orangeFill = Math.max(0, Math.min(1, (progress - 0.48) / 0.06));
  const gridFade = Math.max(0, Math.min(1, (progress - 0.54) / 0.06));
  const bgFade = Math.max(0, Math.min(1, (progress - 0.54) / 0.08));
  const rawT = Math.max(0, Math.min(1, (progress - 0.56) / 0.14));
  const transformT = rawT < 1 ? 1 - Math.pow(1 - rawT, 3) : 1; // ease-out
  const temoTitle = Math.max(0, Math.min(1, (progress - 0.68) / 0.06));
  const cardContent = Math.max(0, Math.min(1, (progress - 0.72) / 0.08));
  const inTransition = progress > 0.53;

  const lerp = (a, b, t) => a + (b - a) * t;

  /* Positions de départ (cellules grille, % du conteneur sticky) */
  const cellStarts = [
    { l: 0, t: 7, w: 33.33, h: 46.5 },       // cell (1,1) = index 0
    { l: 66.66, t: 7, w: 33.33, h: 46.5 },   // cell (1,3) = index 2
    { l: 33.33, t: 53.5, w: 33.33, h: 46.5 }, // cell (2,2) = index 4
  ];
  /* Positions finales (3 cartes centrées) */
  const cardEnds = [
    { l: 8, t: 40, w: 25, h: 38 },
    { l: 37.5, t: 40, w: 25, h: 38 },
    { l: 67, t: 40, w: 25, h: 38 },
  ];

  return (
    <>
    {/* ── Mobile : livrables + témoignages en cartes ── */}
    <section className="md:hidden relative py-14 px-5 overflow-hidden" style={{ zIndex: 2 }}>
      {/* Fond photo + overlay noir */}
      <img
        src="/img/gary/extver5.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/80" />

      {/* Contenu */}
      <div className="relative z-10">
        <p className="text-[12px] uppercase tracking-[0.25em] text-white/50 mb-4">Nos livrables</p>
        <h2 className="font-serif text-[clamp(1.8rem,8vw,2.6rem)] tracking-[-0.02em] leading-[1.1] text-white mb-3">
          Pas des promesses<span className="text-[#FF4A3E]">.</span><br />
          Des livrables concrets<span className="text-[#FF4A3E]">.</span>
        </h2>
        <p className="text-[0.95rem] text-white/60 leading-relaxed mb-8">
          Chaque étape produit un document ou un outil tangible.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-14">
          {livrables.map((item, i) => (
            <div
              key={`m-liv-${i}`}
              className="bg-white/10 backdrop-blur-sm p-4 border border-white/10 flex flex-col items-center text-center"
            >
              <div className="mb-3">
                <LivrableIcon index={i} small color="#FF4A3E" />
              </div>
              <h3 className="font-serif text-[0.95rem] leading-tight text-white mb-1.5">{item.title}</h3>
              <p className="text-[0.78rem] text-white/60 leading-snug line-clamp-3">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Témoignages mobile */}
        <p className="text-[12px] uppercase tracking-[0.25em] text-[#FF4A3E] mb-3">Témoignages</p>
        <h2 className="font-serif text-[clamp(1.6rem,7vw,2.2rem)] tracking-[-0.02em] leading-[1.1] text-white mb-6">
          Ce que disent nos clients<span className="text-[#FF4A3E]">.</span>
        </h2>
        <div className="flex flex-col gap-4">
          {temoignages.map((temo, i) => (
            <div key={`m-temo-${i}`} className="bg-white/10 backdrop-blur-sm p-5 border border-white/10">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: temo.stars }).map((_, j) => (
                  <svg key={j} className="w-4 h-4" fill="#FF4A3E" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-[0.9rem] leading-relaxed text-white/90 mb-3">« {temo.text} »</p>
              <p className="text-[0.82rem] text-white/50">— {temo.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Desktop : livrables scroll-driven ── */}
    <section
      ref={sectionRef}
      className="relative hidden md:block"
      style={{ zIndex: 2, height: "550vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Image de fond → s'efface vers #F5F2ED */}
        <img
          src="/img/gary/extver5.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          style={{ opacity: 1 - bgFade }}
        />
        <div className="absolute inset-0 bg-black/25" style={{ opacity: 1 - bgFade }} />
        <div className="absolute inset-0 bg-[#F5F2ED]" style={{ opacity: bgFade }} />

        {/* Titre Livrables */}
        <div
          className="absolute left-0 right-0 bottom-0 flex items-center justify-center z-10 pointer-events-none"
          style={{ opacity: titleOpacity, top: "var(--header-h, 72px)" }}
        >
          <div className="text-center px-10 py-8 bg-white/85 backdrop-blur-sm">
            <p className="text-[12px] uppercase tracking-[0.25em] text-neutral-500 mb-4">Nos livrables</p>
            <h2 className="font-serif text-[clamp(2.4rem,5.5vw,4.2rem)] text-[#1A1A1A] tracking-[-0.02em] leading-[1.08]">
              Pas des promesses<span className="text-[#FF4A3E]">.</span><br />
              Des livrables concrets<span className="text-[#FF4A3E]">.</span>
            </h2>
            <p className="mt-4 text-[1rem] md:text-[1.1rem] text-neutral-500 leading-relaxed">
              Chaque étape produit un document ou un outil tangible.
            </p>
          </div>
        </div>

        {/* Lignes de découpe */}
        <div className="absolute bottom-0 w-[2px] bg-white/70 z-20"
          style={{ top: "var(--header-h, 72px)", left: "33.33%", transform: `scaleY(${lineProgress})`, transformOrigin: "top", opacity: 1 - gridFade }}
        />
        <div className="absolute bottom-0 w-[2px] bg-white/70 z-20"
          style={{ top: "var(--header-h, 72px)", left: "66.66%", transform: `scaleY(${lineProgress})`, transformOrigin: "bottom", opacity: 1 - gridFade }}
        />
        <div className="absolute left-0 right-0 h-[2px] bg-white/70 z-20"
          style={{ top: "calc(50% + var(--header-h, 72px) / 2)", transform: `scaleX(${Math.max(0, (lineProgress - 0.3) / 0.7)})`, transformOrigin: "left", opacity: 1 - gridFade }}
        />

        {/* Grille 3×2 hover — s'efface pendant la transition */}
        <div
          className="absolute left-0 right-0 bottom-0 z-30 grid grid-cols-3 grid-rows-2"
          style={{
            top: "var(--header-h, 72px)",
            opacity: linesDrawn ? Math.max(0, 1 - gridFade) : 0,
            pointerEvents: linesDrawn && !inTransition ? "auto" : "none",
          }}
        >
          {livrables.map((item, i) => (
            <div key={i} className="group relative flex flex-col items-center justify-center p-4 md:p-6 cursor-pointer" style={{ overflow: "clip" }}>
              <div className="absolute inset-[1px] bg-black/0 group-hover:bg-black/55 transition-all duration-500" />
              {(i === 0 || i === 2 || i === 4) && (
                <div className="absolute inset-[1px] bg-[#FF4A3E] z-[5] pointer-events-none" style={{ opacity: orangeFill }} />
              )}
              <div className="relative z-10 group-hover:opacity-0 group-hover:scale-90 transition-all duration-500">
                <LivrableIcon index={i} />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-6 z-10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 overflow-hidden">
                <LivrableIcon index={i} small />
                <h3 className="font-serif text-[1.1rem] md:text-[1.4rem] text-white leading-tight mb-1.5 text-center mt-3">{item.title}</h3>
                <p className="text-[0.8rem] md:text-[0.9rem] text-white/80 leading-snug text-center line-clamp-4">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 3 cartes orange flottantes — transition grille → témoignages */}
        <div style={{ opacity: inTransition ? 1 : 0, pointerEvents: "none" }}>
          {temoignages.map((temo, i) => {
            const s = cellStarts[i];
            const e = cardEnds[i];
            return (
              <div
                key={`float-${i}`}
                className="absolute z-40 overflow-hidden rounded-sm"
                style={{
                  left: `${lerp(s.l, e.l, transformT)}%`,
                  top: `${lerp(s.t, e.t, transformT)}%`,
                  width: `${lerp(s.w, e.w, transformT)}%`,
                  height: `${lerp(s.h, e.h, transformT)}%`,
                  boxShadow: cardContent > 0.5 ? "0 8px 40px rgba(0,0,0,0.10)" : "none",
                }}
              >
                {/* Fond blanc fixe */}
                <div className="absolute inset-0 bg-white" />
                {/* Orange qui slide vers bas-droite et se clippe en triangle */}
                <div
                  className="absolute -inset-px bg-[#FF4A3E]"
                  style={{
                    clipPath: cardContent <= 0
                      ? "polygon(-1% -1%, 101% -1%, 101% 101%, -1% 101%)"
                      : `polygon(${lerp(-1, 151, cardContent)}% -1%, 101% -1%, 101% 101%, -1% 101%, -1% ${lerp(-1, 151, cardContent)}%)`,
                  }}
                />
                {/* Contenu texte (apparaît) */}
                <div className="relative h-full flex flex-col justify-between p-7 md:p-9" style={{ opacity: cardContent }}>
                  <div>
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: temo.stars }).map((_, j) => (
                        <svg key={j} className="w-5 h-5" fill="#FF4A3E" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-[0.95rem] md:text-[1.05rem] leading-relaxed text-[#1A1A1A]">
                      « {temo.text} »
                    </p>
                  </div>
                  <p className="text-[0.9rem] text-neutral-500 mt-4">— {temo.name}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Titre Témoignages */}
        <div
          className="absolute left-0 right-0 z-50 text-center pointer-events-none"
          style={{ top: "18%", opacity: temoTitle }}
        >
          <p className="text-[12px] uppercase tracking-[0.25em] text-[#FF4A3E] mb-3">Témoignages</p>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3rem)] tracking-[-0.02em] leading-[1.1] text-[#1A1A1A]">
            Ce que disent nos clients<span className="text-[#FF4A3E]">.</span>
          </h2>
        </div>
      </div>
    </section>
    </>
  );
}

/* ─── Section carte de Genève interactive ─── */
const mapPoints = [
  { x: 15, y: 55, faq: 0 },   // Combien coûte une estimation ?
  { x: 82, y: 75, faq: 1 },   // En combien de temps se vend un bien ?
  { x: 48, y: 72, faq: 2 },   // Quelle est votre commission ?
  { x: 42, y: 47, faq: 3 },   // Dois-je faire des travaux ?
  { x: 62, y: 40, faq: 4 },   // Différence avec une grande agence ?
  { x: 85, y: 48, faq: 5 },   // Vendre sans publier sur les portails ?
];

function GenevaMapSection() {
  const containerRef = useRef(null);
  const [nearIdx, setNearIdx] = useState(null);
  const [openIdx, setOpenIdx] = useState(null);
  const [containerSize, setContainerSize] = useState({ w: 1920, h: 800 });
  const bubblePosRef = useRef({ x: 0, y: 0 });
  const transitionRef = useRef(false);
  const BUBBLE_R = 220;
  const PROXIMITY = 80;

  useEffect(() => {
    const update = () => {
      const el = containerRef.current;
      if (el) setContainerSize({ w: el.offsetWidth, h: el.offsetHeight });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const switchToPoint = (idx, cw, ch) => {
    if (transitionRef.current) return;
    transitionRef.current = true;
    // Fermer la bulle
    setNearIdx(null);
    setOpenIdx(null);
    // Rouvrir sur le nouveau point après un court délai
    setTimeout(() => {
      const pt = mapPoints[idx];
      bubblePosRef.current = { x: (pt.x / 100) * cw, y: (pt.y / 100) * ch };
      setNearIdx(idx);
      transitionRef.current = false;
    }, 280);
  };

  const onMouseMove = (e) => {
    if (transitionRef.current) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cw = rect.width;
    const ch = rect.height;

    let closest = null;
    let closestDist = Infinity;
    mapPoints.forEach((pt, i) => {
      const px = (pt.x / 100) * cw;
      const py = (pt.y / 100) * ch;
      const dist = Math.sqrt((mx - px) ** 2 + (my - py) ** 2);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    });

    // Rester actif tant qu'on est dans la bulle OU proche du point
    const inBubble = nearIdx !== null && (() => {
      const bx = bubblePosRef.current.x;
      const by = bubblePosRef.current.y;
      return Math.sqrt((mx - bx) ** 2 + (my - by) ** 2) < BUBBLE_R;
    })();

    if (closestDist < PROXIMITY && closest !== null) {
      if (nearIdx !== null && closest !== nearIdx) {
        // Switching between points — animate close then reopen
        switchToPoint(closest, cw, ch);
      } else {
        const pt = mapPoints[closest];
        bubblePosRef.current = { x: (pt.x / 100) * cw, y: (pt.y / 100) * ch };
        setNearIdx(closest);
      }
    } else if (inBubble) {
      // reste sur le point actuel
    } else {
      setNearIdx(null);
      setOpenIdx(null);
    }
  };

  const onMouseLeave = () => { setNearIdx(null); setOpenIdx(null); };

  const bubbleX = bubblePosRef.current.x;
  const bubbleY = bubblePosRef.current.y;
  const isNear = nearIdx !== null;

  return (
    <>
    {/* ── Mobile : FAQ accordéon ── */}
    <section className="md:hidden relative bg-white py-14 px-5" style={{ zIndex: 2 }}>
      <p className="text-[12px] uppercase tracking-[0.25em] text-[#FF4A3E] mb-3">
        Questions fréquentes
      </p>
      <h2 className="font-serif text-[clamp(1.8rem,8vw,2.4rem)] tracking-[-0.02em] leading-[1.1] text-[#1A1A1A] mb-2">
        Vous vous posez la question ?<br />Nous y répondons<span className="text-[#FF4A3E]">.</span>
      </h2>
      <p className="text-[0.9rem] text-neutral-500 leading-relaxed mb-8">
        Les réponses directes aux questions que se posent tous les vendeurs.
      </p>

      <div className="flex flex-col">
        {faqItems.map((item, i) => {
          const isActive = openIdx === i;
          return (
            <div key={`m-faq-${i}`} className="border-b border-neutral-100">
              <button
                onClick={() => setOpenIdx(isActive ? null : i)}
                className="w-full flex items-center justify-between py-4 text-left group"
              >
                <span className="text-[0.9rem] text-[#1A1A1A] pr-4 group-active:text-[#FF4A3E] transition-colors">
                  {item.q}
                </span>
                <span
                  className="shrink-0 w-6 h-6 flex items-center justify-center text-neutral-400 transition-transform duration-300"
                  style={{ transform: isActive ? "rotate(45deg)" : "rotate(0)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 1v12M1 7h12" />
                  </svg>
                </span>
              </button>
              <div
                className="overflow-hidden"
                style={{
                  maxHeight: isActive ? "300px" : "0",
                  opacity: isActive ? 1 : 0,
                  transition: "max-height 0.4s ease, opacity 0.3s ease",
                }}
              >
                <p className="text-[0.85rem] text-neutral-500 leading-relaxed pb-4 pr-6">
                  {item.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>

    {/* ── Desktop : carte interactive ── */}
    <section className="relative bg-white hidden md:block">
      <div className="relative z-10 text-center pt-20 -mb-40 px-4">
        <p className="text-[12px] uppercase tracking-[0.25em] text-[#FF4A3E] mb-3">
          Questions fréquentes
        </p>
        <h2 className="font-serif text-[clamp(2rem,4.5vw,3rem)] tracking-[-0.02em] leading-[1.1] text-[#1A1A1A]">
          Vous vous posez la question ?<br />Nous y répondons<span className="text-[#FF4A3E]">.</span>
        </h2>
        <p className="mt-4 text-[0.95rem] text-neutral-500 max-w-[50ch] mx-auto">
          Les réponses directes aux questions que se posent tous les vendeurs avant de se lancer.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "16/9" }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* Fade bas discret */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-30 pointer-events-none" />

        {/* Line art fond */}
        <img
          src="/media/sell/geneva-lineart.png"
          alt=""
          className="absolute inset-0 w-full h-full object-contain"
          draggable={false}
        />

        {/* Bulle réaliste */}
        <div
          className="absolute pointer-events-none z-10"
          style={{
            width: BUBBLE_R * 2,
            height: BUBBLE_R * 2,
            borderRadius: "50%",
            border: "1.5px solid #1A1A1A",
            overflow: "hidden",
            boxShadow: "0 4px 30px rgba(0,0,0,0.15)",
            left: bubbleX - BUBBLE_R,
            top: bubbleY - BUBBLE_R,
            transform: `scale(${isNear ? 1 : 0})`,
            opacity: isNear ? 1 : 0,
            transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease",
          }}
        >
          {/* Photo réaliste */}
          <div
            className="absolute top-0 left-0"
            style={{
              width: `${containerSize.w}px`,
              height: `${containerSize.h}px`,
              transform: `translate(${-bubbleX + BUBBLE_R}px, ${-bubbleY + BUBBLE_R}px)`,
            }}
          >
            <img
              src="/media/sell/geneva-real.jpg"
              alt="Vue panoramique de Genève"
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>

          {/* Overlay noir qui remplit la bulle au clic */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            style={{
              background: "radial-gradient(circle at center, #1A1A1A 0%, #1A1A1A 60%, rgba(26,26,26,0.92) 100%)",
              clipPath: openIdx !== null && nearIdx === openIdx
                ? "circle(100% at 50% 50%)"
                : "circle(0% at 50% 50%)",
              transition: "clip-path 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
              pointerEvents: openIdx !== null && nearIdx === openIdx ? "auto" : "none",
              cursor: "pointer",
            }}
            onClick={() => setOpenIdx(null)}
          >
            {openIdx !== null && nearIdx === openIdx && (() => {
              const faq = faqItems[mapPoints[openIdx].faq];
              return (
                <>
                  <p className="text-[0.85rem] uppercase tracking-[0.18em] text-[#FF4A3E] mb-2 max-w-[85%] mx-auto leading-snug"
                    style={{ animation: "fadeUp .4s ease-out .15s both" }}
                  >
                    {faq.q}
                  </p>
                  <div className="w-8 h-[1px] bg-[#FF4A3E]/40 mb-3"
                    style={{ animation: "fadeUp .4s ease-out .2s both" }}
                  />
                  <p className="text-[0.92rem] leading-relaxed text-white/80 max-w-[70%] mx-auto"
                    style={{ animation: "fadeUp .4s ease-out .25s both" }}
                  >
                    {faq.a}
                  </p>
                </>
              );
            })()}
          </div>
        </div>

        {/* Points */}
        {mapPoints.map((pt, i) => {
          const isHovered = nearIdx === i;
          const isOpen = openIdx === i;
          const liv = livrables[pt.livrable];
          return (
            <div
              key={i}
              className="absolute z-20"
              style={{ left: `${pt.x}%`, top: `${pt.y}%`, transform: "translate(-50%, -50%)" }}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="relative flex items-center justify-center cursor-pointer"
                style={{
                  height: 40,
                  width: isHovered && !isOpen ? 100 : 40,
                  borderRadius: 20,
                  background: "#1A1A1A",
                  border: "2px solid white",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
                  transition: "width 0.3s ease, opacity 0.25s ease, transform 0.25s ease",
                  overflow: "hidden",
                  opacity: isOpen ? 0 : 1,
                  transform: isOpen ? "scale(0)" : "scale(1)",
                  pointerEvents: isOpen ? "none" : "auto",
                  animation: !isHovered && !isOpen ? "dotPulse 2.5s ease-in-out infinite" : "none",
                }}
              >
                {/* Icône ? stylisée ou texte Voir → */}
                <span
                  className="text-white whitespace-nowrap"
                  style={{
                    fontSize: isHovered && !isOpen ? "0.75rem" : "1.15rem",
                    fontWeight: 500,
                    lineHeight: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "font-size 0.2s ease",
                  }}
                >
                  {isHovered && !isOpen ? "Voir →" : "?"}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
    </>
  );
}

/* ─── FAQ Section ─── */
function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className="relative bg-white py-20 md:py-28">
      <div className="max-w-[1100px] mx-auto px-5 md:px-8 grid md:grid-cols-[1fr_1.2fr] gap-12 md:gap-20 items-start">
        {/* Colonne gauche — titre sticky */}
        <div className="md:sticky md:top-32">
          <p className="text-[12px] uppercase tracking-[0.25em] text-[#FF4A3E] mb-3">
            Questions fréquentes
          </p>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] tracking-[-0.02em] leading-[1.05] text-[#1A1A1A] mb-5">
            Vous vous posez la question ?
            <br />Nous y répondons<span className="text-[#FF4A3E]">.</span>
          </h2>
          <p className="text-[0.95rem] text-neutral-500 leading-relaxed max-w-[38ch]">
            Les réponses directes aux questions que se posent tous les vendeurs avant de se lancer.
          </p>
        </div>

        {/* Colonne droite — accordéon */}
        <div className="flex flex-col">
          {faqItems.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} className="border-b border-neutral-100">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className="text-[0.95rem] md:text-[1.05rem] text-[#1A1A1A] pr-4 group-hover:text-[#FF4A3E] transition-colors">
                    {item.q}
                  </span>
                  <span
                    className="shrink-0 w-6 h-6 flex items-center justify-center text-neutral-400 transition-transform duration-300"
                    style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M7 1v12M1 7h12" />
                    </svg>
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-400 ease-in-out"
                  style={{
                    maxHeight: isOpen ? "300px" : "0",
                    opacity: isOpen ? 1 : 0,
                    transition: "max-height 0.4s ease, opacity 0.3s ease",
                  }}
                >
                  <p className="text-[0.88rem] text-neutral-500 leading-relaxed pb-5 pr-8">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Section Vendus — animation d'entrée au scroll ─── */
function VendusSection({ vendus }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setSeen(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} id="vendus" className="relative bg-white overflow-hidden" style={{ zIndex: 2 }}>
      {/* ── Mobile : même layout que page Acheter ── */}
      <div className="md:hidden">
        <div
          className="pt-14 pb-2 px-4"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <p className="text-[12px] uppercase tracking-[0.25em] text-[#FF4A3E] mb-3">
            Résultats
          </p>
          <h2 className="font-serif text-2xl tracking-[-0.02em] leading-[1.1] text-[#1A1A1A] mb-2">
            Vendus récemment<span className="text-[#FF4A3E]">.</span>
          </h2>
          <p className="text-[0.9rem] text-neutral-500 leading-relaxed">
            Des résultats concrets, pas des promesses.
          </p>
        </div>
        <BandCarousel
          title=""
          items={vendus}
          renderItem={ListingCardSold}
        />
      </div>

      {/* ── Desktop : layout actuel avec décalage gauche ── */}
      <div className="hidden md:block py-24">
        <div
          className="max-w-[1600px] mx-auto px-8 mb-10"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <p className="text-[12px] uppercase tracking-[0.25em] text-[#FF4A3E] mb-4">
            Résultats
          </p>
          <h2 className="font-serif text-[clamp(2rem,5vw,3.2rem)] tracking-[-0.02em] leading-[1.1] text-[#1A1A1A] mb-3">
            Vendus récemment<span className="text-[#FF4A3E]">.</span>
          </h2>
          <p className="text-[1.1rem] text-neutral-500 leading-relaxed">
            Des résultats concrets, pas des promesses.
          </p>
        </div>
        <div
          className="-ml-20 lg:-ml-32 xl:-ml-40"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateX(0)" : "translateX(100px)",
            transition: "opacity 0.8s ease-out 0.25s, transform 0.8s ease-out 0.25s",
          }}
        >
          <BandCarousel
            items={vendus}
            renderItem={ListingCardSold}
          />
        </div>
      </div>
    </section>
  );
}

/* ─── Compteur animé ─── */
function CountNumber({ value, active }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!active) return;
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(ease * value));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, value]);
  return <>{display}</>;
}

/* ─── Section Équipe ─── */
function EquipeSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [countUp, setCountUp] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); setTimeout(() => setCountUp(true), 600); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const stats = [
    { value: 50, suffix: "%", label: "vendus avant publication" },
    { value: 8, suffix: " sem.", label: "délai moyen de vente" },
    { value: 500, suffix: "K", label: "portée mensuelle" },
  ];

  return (
    <section ref={ref} className="relative bg-white overflow-hidden" style={{ zIndex: 2 }}>
      {/* Photo d'équipe — entière, pas coupée */}
      <div
        className="w-full"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 1s ease",
        }}
      >
        <img
          src="/team-photo.jpg"
          alt="L'équipe GARY"
          className="w-full h-auto object-contain"
          loading="lazy"
        />
      </div>

      {/* Texte en dessous */}
      <div className="bg-[#F5F2ED] py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-20 items-start">
          {/* Colonne gauche — texte */}
          <div>
            <p
              className="text-[12px] uppercase tracking-[0.3em] text-[#FF4A3E] mb-5"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
              }}
            >
              L'équipe
            </p>
            <h2
              className="font-serif text-[clamp(2.4rem,5vw,4rem)] tracking-[-0.03em] leading-[1] text-[#1A1A1A] mb-6"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
              }}
            >
              Des courtiers,<br />pas des commerciaux<span className="text-[#FF4A3E]">.</span>
            </h2>
            <p
              className="text-[1.05rem] text-neutral-600 leading-relaxed mb-8 max-w-[48ch]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
              }}
            >
              GARY est une agence à taille humaine, basée à Genève. Chaque courtier connaît son marché par cœur et accompagne un nombre limité de mandats à la fois. Votre bien n'est pas un dossier parmi d'autres — c'est une mission.
            </p>

            {/* Citation */}
            <div
              className="border-l-2 border-[#FF4A3E] pl-5"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(-20px)",
                transition: "opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s",
              }}
            >
              <p className="text-[0.95rem] italic text-neutral-500 leading-relaxed">
                « Dans notre métier, la confiance ne se décrète pas. Elle se démontre, bien par bien, étape par étape. »
              </p>
            </div>
          </div>

          {/* Colonne droite — stats */}
          <div className="grid grid-cols-3 md:grid-cols-1 gap-4 md:gap-12 md:pt-12">
            {stats.map((s, i) => (
              <div
                key={i}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.5s ease ${0.6 + i * 0.15}s, transform 0.5s ease ${0.6 + i * 0.15}s`,
                }}
              >
                <p className="font-serif text-[clamp(1.6rem,4.5vw,3.4rem)] text-[#1A1A1A] leading-none mb-1">
                  <CountNumber value={s.value} active={countUp} />{s.suffix}
                </p>
                <p className="text-[0.65rem] md:text-[0.75rem] uppercase tracking-[0.12em] text-neutral-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section CTA Final ─── */
function CTAFinalSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone.trim()) {
      window.location.href = `/contact?phone=${encodeURIComponent(phone)}`;
    }
  };

  return (
    <section ref={ref} id="cta-final-sell" className="relative min-h-screen flex items-center overflow-hidden" style={{ zIndex: 2 }}>
      {/* Image de fond — belle propriété */}
      <img
        src="/img/gary/ExtBlv-8.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[#1A1A1A]/75" />

      {/* Grain subtil */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
      />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-20 md:py-28">
        <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-20 items-center">
          {/* Texte */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <p className="text-[12px] uppercase tracking-[0.3em] text-[#FF4A3E] mb-5">
              Prochaine étape
            </p>
            <h2 className="font-serif text-[clamp(2rem,5vw,4.2rem)] tracking-[-0.03em] leading-[1.05] text-white mb-6 md:whitespace-nowrap">
              Parlons de votre bien<span className="text-[#FF4A3E]">.</span>
            </h2>
            <p className="text-[0.95rem] md:text-[1.1rem] text-white/60 leading-relaxed md:whitespace-nowrap">
              Un courtier de votre secteur vous rappelle sous 24h — sans engagement, sans pression.
            </p>
          </div>

          {/* Formulaire dans une tuile glassmorphique */}
          <div
            className="relative"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
            }}
          >
            <div className="bg-white/[0.07] backdrop-blur-md border border-white/[0.12] p-8 md:p-10">
              <p className="text-[0.85rem] text-white/80 mb-6 leading-relaxed">
                Laissez-nous votre numéro, un courtier expert de votre quartier vous contacte pour une première discussion confidentielle.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="phone-final" className="block text-[0.75rem] uppercase tracking-[0.15em] text-white/35 mb-2">
                    Téléphone
                  </label>
                  <input
                    id="phone-final"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+41 79 000 00 00"
                    className="w-full px-5 py-4 bg-white/[0.06] border border-white/15 text-[1.05rem] text-white placeholder:text-white/25 focus:outline-none focus:border-[#FF4A3E]/60 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-[#FF4A3E] text-white text-[0.9rem] font-medium uppercase tracking-[0.12em] hover:bg-[#e5382d] transition-all flex items-center justify-center gap-3"
                >
                  Être rappelé sous 24h
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </form>

              <p className="text-[0.7rem] text-white/20 mt-4 text-center">
                Gratuit · Sans engagement · Confidentiel
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Ligne courbe continue : cercle → séparateur section suivante ─── */
function ConnectLine() {
  const wrapperRef = useRef(null);
  const [pathData, setPathData] = useState("");
  const [pathLen, setPathLen] = useState(0);
  const [drawLen, setDrawLen] = useState(0);
  const pathRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const wrapperRect = wrapper.getBoundingClientRect();

      // Trouver le cercle SVG (le <circle> element)
      const circleEl = wrapper.querySelector("[data-circle]");
      // Trouver le séparateur dans PhilosophieSection
      const sepEl = wrapper.querySelector("[data-separator]");
      if (!circleEl || !sepEl) return;

      const circleRect = circleEl.getBoundingClientRect();
      const sepRect = sepEl.getBoundingClientRect();

      // Taille réelle du conteneur carré (pas le bounding rect qui inclut les overflow)
      const containerSize = parseFloat(getComputedStyle(circleEl).width);
      // Position du centre du conteneur
      const centerX = circleRect.left + circleRect.width / 2;
      const centerY = circleRect.top + circleRect.height / 2;
      // Le bas extérieur de la bordure du cercle: centre + (rayon + demi-stroke) en pixels
      // rayon = 80/200 * containerSize, demi-stroke = 3.5/200 * containerSize
      const bottomBorderY = centerY + ((80 + 3.5) / 200) * containerSize;
      const startX = centerX - wrapperRect.left;
      const startY = bottomBorderY - wrapperRect.top;

      // Point intermédiaire : haut du séparateur
      const midX = sepRect.left + sepRect.width / 2 - wrapperRect.left;
      const midY = sepRect.top - wrapperRect.top;

      // Point final : bas du séparateur
      const endY = sepRect.bottom - wrapperRect.top;

      // Courbe douce puis droite verticale
      const curveDist = midY - startY;
      const d = `M ${startX} ${startY} C ${startX} ${startY + curveDist * 0.4}, ${midX} ${startY + curveDist * 0.6}, ${midX} ${midY} L ${midX} ${endY}`;
      setPathData(d);

      // Mesurer la longueur du path
      if (pathRef.current) {
        const len = pathRef.current.getTotalLength();
        setPathLen(len);
      }
    };

    update();
    window.addEventListener("resize", update);
    const timer = setTimeout(update, 500);
    return () => { window.removeEventListener("resize", update); clearTimeout(timer); };
  }, []);

  // Animation au scroll — le trait se trace progressivement du cercle jusqu'au bas du séparateur
  useEffect(() => {
    if (!pathLen) return;
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const wrapper = wrapperRef.current;
        const circleEl = wrapper?.querySelector("[data-circle]");
        const sepEl = wrapper?.querySelector("[data-separator]");
        if (!circleEl || !sepEl) return;

        const circleBottom = circleEl.getBoundingClientRect().bottom;
        const sepBottom = sepEl.getBoundingClientRect().bottom;
        const viewH = window.innerHeight;

        const scrollStart = circleBottom - viewH * 0.7;
        const scrollEnd = sepBottom - viewH * 0.5;
        const scrollRange = scrollEnd - scrollStart;

        const progress = Math.max(0, Math.min(1, -scrollStart / Math.max(scrollRange, 1)));
        setDrawLen(progress * pathLen);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(rafId); };
  }, [pathLen]);

  return (
    <div ref={wrapperRef} className="relative">
      {/* SVG overlay pour la ligne — desktop uniquement */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
        style={{ zIndex: 10 }}
      >
        <path
          ref={pathRef}
          d={pathData}
          fill="none"
          stroke="#FF4A3E"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={pathLen || 1}
          strokeDashoffset={pathLen ? pathLen - drawLen : 1}
        />
        {/* Petit rond au départ pour fondre dans la bordure du cercle */}
        {pathData && drawLen > 0 && (() => {
          const match = pathData.match(/^M ([\d.]+) ([\d.]+)/);
          if (!match) return null;
          return <circle cx={match[1]} cy={match[2]} r="3.5" fill="#FF4A3E" />;
        })()}
      </svg>

      <ConstatSection />
      <PhilosophieSection />
    </div>
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

      {/* CHIFFRES + TEXTE */}
      <ProofSection />

      {/* CONSTAT + PHILOSOPHIE avec ligne continue */}
      <ConnectLine />

      {/* PARCOURS */}
      <ParcoursSection />

      {/* RÉSULTATS — DÉJÀ VENDU */}
      {vendus.length > 0 && <VendusSection vendus={vendus} />}

      {/* LIVRABLES */}
      <LivrablesSection />

      {/* TÉMOIGNAGES — intégrés dans LivrablesSection */}

      {/* CARTE DE GENÈVE INTERACTIVE */}
      <GenevaMapSection />

      {/* Espace blanc */}
      <div className="h-24 md:h-36 bg-white relative" style={{ zIndex: 2 }} />

      {/* ÉQUIPE */}
      <EquipeSection />

      {/* Espace */}
      <div className="h-24 md:h-36 bg-[#F5F2ED] relative" style={{ zIndex: 2 }} />

      {/* CTA FINAL */}
      <CTAFinalSection />

      {/* Sticky CTA mobile — disparaît au CTA final */}
      <StickyCTA />
    </main>
  );
}
