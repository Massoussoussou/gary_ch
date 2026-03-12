import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import team from "../data/team.json";
import CTAFuturaGlow, { PhoneIcon } from "../components/cta/CTAFuturaGlow.jsx";

/* ========== Hook : détecte mobile (< 768px) ========== */
function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const h = (e) => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}

/* ========== Hook : déclenche une seule fois quand l'élément est visible ========== */
function useInViewOnce(options = { threshold: 0.35 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (!ref.current || seen) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setSeen(true);
    }, options);
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [seen, options]);

  return [ref, seen];
}

/* ========== Hook : compteur animé (incrémente de 0 à target) ========== */
function useCountUp(target, duration = 2000, start = false) {
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


/* ========== Sponsors / Partenaires ========== */
const SPONSORS = [
  {
    name: "divorce.ch",
    src: "/sponsors/divorce-ch.jpeg",
    url: "https://www.divorce.ch",
    subtitle: "Transition de vie",
    short: "divorce.ch simplifie les démarches de divorce en Suisse. Nos activités sont complémentaires dans l'accompagnement de nos clients lors de périodes de transition.",
    long: "divorce.ch est une plateforme suisse spécialisée dans la simplification des démarches liées au divorce, grâce à des outils digitaux accessibles et un accompagnement structuré sur les aspects administratifs et juridiques de la séparation.\n\nBien que nous ne collaborions pas directement, nos activités s'adressent parfois à une clientèle confrontée aux mêmes étapes de vie. Lors d'une séparation, les questions liées au logement et au patrimoine immobilier deviennent fréquemment centrales. Dans ce contexte, nos approches se complètent naturellement : Gary accompagne les clients dans la vente de leur bien immobilier, tandis que divorce.ch facilite et clarifie les démarches administratives liées au processus de divorce.",
  },
  {
    name: "Mise en Voix",
    src: "/sponsors/mise-en-voix.jpeg",
    url: "https://www.mise-en-voix.ch",
    subtitle: "Association locale",
    short: null,
    long: "Mise en Voix est une association culturelle basée à Cologny qui met à l'honneur l'art de la voix et l'univers de l'opéra à travers différents projets artistiques et rencontres. En réunissant artistes, passionnés et partenaires, l'association contribue à faire vivre la scène culturelle de la région genevoise.",
  },
  {
    name: "Planifique",
    src: "/sponsors/planifique.jpeg",
    url: "https://www.planifique.fr",
    subtitle: "Planification financière et prévoyance",
    short: "Planifique accompagne particuliers et entrepreneurs dans la planification financière et la gestion de leur patrimoine. Un partenariat fondé sur une vision commune de l'investissement à long terme.",
    long: "Planifique est une société spécialisée dans la planification financière et la structuration patrimoniale. Elle accompagne particuliers et entrepreneurs dans la gestion de leurs finances, la prévoyance et la mise en place de stratégies d'investissement durables.\n\nL'immobilier occupant souvent une place centrale dans une stratégie patrimoniale, ce partenariat s'inscrit dans une logique complémentaire. Tandis que Gary accompagne ses clients dans la vente et la valorisation de biens immobiliers, Planifique apporte une expertise en planification financière afin d'aider les clients à structurer et à optimiser leur vision patrimoniale sur le long terme.",
  },
  {
    name: "Plus Groupe",
    src: "/sponsors/plus-financement.jpeg",
    url: "https://plus-group.ch",
    subtitle: "Financement immobilier",
    short: "Plus Groupe accompagne les clients dans la recherche du financement le plus adapté lors de l'achat d'un bien immobilier. Un partenaire clé dans la structuration d'un projet immobilier.",
    long: "Plus Groupe accompagne les particuliers dans la recherche des meilleures solutions de financement lors de l'acquisition d'un bien immobilier. Grâce à leur réseau et à leur expertise, ils analysent les différentes offres du marché afin d'orienter les clients vers la banque et les conditions de financement les plus adaptées à leur situation.\n\nDans le cadre d'un projet immobilier, le financement représente une étape essentielle. Notre partenariat repose donc sur une approche complémentaire : Gary accompagne les clients dans la recherche, la vente et la valorisation de biens immobiliers, tandis que Plus Groupe les guide dans le choix de la solution bancaire et du financement le plus avantageux pour concrétiser leur achat.",
  },
  {
    name: "CCIG",
    src: "/sponsors/ccig.png",
    url: "https://www.ccig.ch",
    subtitle: "Réseau économique et entrepreneurial",
    short: "La CCIG soutient le développement économique et entrepreneurial à Genève. Un réseau qui rassemble et accompagne les entreprises de la région.",
    long: "La Chambre de commerce, d'industrie et des services de Genève (CCIG) joue un rôle central dans le dynamisme économique du canton. Elle rassemble un large réseau d'entreprises et d'entrepreneurs et favorise les échanges, les opportunités de collaboration et le développement économique local.\n\nEn tant qu'entreprise active dans la région, Gary fait partie de cet écosystème entrepreneurial. Cette affiliation permet de s'inscrire dans un réseau solide d'acteurs économiques genevois et de contribuer au développement et au rayonnement du tissu économique local.",
  },
  {
    name: "TC Veyrier Grand-Donzel",
    src: "/sponsors/veyrier-grand-donzel.jpeg",
    url: "https://www.tcvgd.ch",
    subtitle: "Partenaire sportif",
    short: "Le TC Veyrier Grand-Donzel est un club de tennis actif dans la région genevoise. Nous sommes fiers de soutenir le club à travers notre sponsoring et de promouvoir les valeurs du sport.",
    long: "Le TC Veyrier Grand-Donzel est un club de tennis situé dans la région genevoise qui rassemble passionnés et sportifs de tous âges autour de la pratique du tennis. Le club contribue activement à la vie sportive locale et au développement du sport dans la région.\n\nÀ travers notre sponsoring, Gary est fier de soutenir cette initiative sportive. Nous attachons une grande importance aux valeurs que transmet le sport, telles que la discipline, le respect et le dépassement de soi, des principes qui résonnent également dans notre approche professionnelle.",
  },
  {
    name: "On the Water",
    src: "/sponsors/on-the-water.jpeg",
    url: "https://on-the-water.ch",
    subtitle: "Événementiel, festival",
    short: "On the Water est un événement musical unique organisé sur le lac Léman. Nous sommes fiers de soutenir cette initiative locale à travers notre sponsoring.",
    long: "On the Water est un événement genevois unique organisé sur le lac Léman, où une scène flottante accueille des DJs sur un catamaran au cœur de la rade de Genève. Le public profite de la musique directement depuis l'eau, à bord de bateaux ou d'embarcations, pour une expérience estivale originale au plus près du lac.\n\nGARY soutient cet événement à travers son sponsoring, notamment avec la présence de notre logo sur les gilets de sauvetage utilisés lors de l'événement. Au-delà de la visibilité, ce soutien participe également à promouvoir la sécurité sur l'eau, un élément essentiel lors de ce type de rassemblement nautique. Par ce partenariat, nous sommes heureux de contribuer à une initiative locale qui valorise la vie autour du lac Léman.",
  },
];

/* ========== Popup modal partenaire ========== */
function SponsorModal({ sponsor, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    if (window.__lenis) window.__lenis.stop();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      if (window.__lenis) window.__lenis.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[120]" data-lenis-prevent>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-6" onClick={onClose}>
        <div
          className="relative bg-white w-full max-w-[640px] max-h-[85vh] overflow-y-auto shadow-2xl"
          style={{ animation: "sponsorIn 0.35s cubic-bezier(0.22, 1, 0.36, 1)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Fermer"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8 md:p-12">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img src={sponsor.src} alt={sponsor.name} className="h-24 md:h-32 w-auto object-contain" />
            </div>

            {/* Name + subtitle */}
            <h4 className="text-2xl md:text-3xl font-serif text-gray-900 text-center mb-2">{sponsor.name}</h4>
            <p className="text-sm uppercase tracking-[0.15em] text-[#FF4A3E] text-center mb-8">{sponsor.subtitle}</p>

            {/* Long text */}
            <div className="text-gray-600 text-base md:text-lg leading-relaxed space-y-4">
              {sponsor.long.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Bouton vers le site */}
            {sponsor.url && (
              <div className="mt-10 flex justify-center">
                <a
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] overflow-hidden"
                  style={{ transition: "box-shadow 0.4s ease" }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,74,62,0.35)"}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
                >
                  <span className="absolute -inset-1 bg-[#FF4A3E] translate-y-[110%] group-hover/btn:translate-y-0 transition-transform duration-[0.4s] ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  <span className="relative z-10">Visiter le site</span>
                  <svg className="relative z-10 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes sponsorIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
}

/* ========== Carte sponsor avec hover ========== */
function SponsorCard({ sponsor, index, seen }) {
  const [hovered, setHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      {/* Wrapper fixe dans le grid — la carte absolue grandit par-dessus */}
      <div
        className="relative"
        style={{
          height: isMobile ? "auto" : "320px",
          zIndex: hovered ? 20 : 1,
          opacity: seen ? 1 : 0,
          transform: seen ? "translateY(0)" : "translateY(15px)",
          transition: `opacity 0.6s ease-out ${0.15 + index * 0.08}s, transform 0.6s ease-out ${0.15 + index * 0.08}s`,
        }}
        onMouseEnter={() => !isMobile && setHovered(true)}
        onMouseLeave={() => !isMobile && setHovered(false)}
        onClick={() => setModalOpen(true)}
      >
        <div
          className={`${isMobile ? "relative" : "absolute top-0 left-0 right-0"} bg-white shadow-md cursor-pointer flex flex-col`}
          style={{
            transition: "box-shadow 0.3s ease",
            boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.15)" : undefined,
          }}
        >
          {/* Logo — grand, monte un peu au hover */}
          <div className="flex items-center justify-center p-8 md:p-12">
            <img
              src={sponsor.src}
              alt={sponsor.name}
              className="w-auto max-w-full object-contain"
              style={{
                height: isMobile ? "80px" : "120px",
                transform: hovered ? "translateY(-8px)" : "translateY(0)",
                transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              loading="lazy"
            />
          </div>

          {/* Mobile: bandeau noir "Voir plus" */}
          {isMobile && (
            <div className="bg-[#1a1a1a] py-3 flex items-center justify-center gap-2">
              <span className="text-white text-[12px] uppercase tracking-[0.12em] font-semibold">Voir plus</span>
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          )}

          {/* Desktop: Texte court + bouton — apparaît au hover, pousse la carte vers le bas */}
          {!isMobile && (
            <div
              className="px-8 md:px-10 pb-7"
              style={{
                maxHeight: hovered ? "400px" : "0px",
                opacity: hovered ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease 0.08s",
              }}
            >
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#FF4A3E] font-semibold mb-2">{sponsor.subtitle}</p>
              {sponsor.short && <p className="text-gray-600 text-[15px] leading-relaxed mb-3">{sponsor.short}</p>}
              <span className="inline-flex items-center gap-1.5 text-[#FF4A3E] text-sm font-medium mt-1">
                Voir plus
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          )}
        </div>
      </div>

      {modalOpen && <SponsorModal sponsor={sponsor} onClose={() => setModalOpen(false)} />}
    </>
  );
}

/* ========== Section 7 — Partenaires (fond beige) ========== */
function SponsorsSection() {
  const [ref, seen] = useInViewOnce({ threshold: 0.15 });

  return (
    <section ref={ref} className="relative z-10 w-full py-20 md:py-28 bg-[#FAF6F0]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
        {/* Trait décoratif */}
        <div className="flex justify-center mb-6">
          <div
            className="h-[2px] bg-[#FF4A3E]"
            style={{
              width: seen ? "60px" : "0px",
              transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>

        <h3
          className="text-center font-serif text-3xl md:text-5xl tracking-wide mb-14 md:mb-20 text-gray-900"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(15px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          Nos <span className="text-[#FF4A3E]">partenaires</span>
        </h3>

        {/* Ligne 1 — 3 sponsors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          {SPONSORS.slice(0, 3).map((s, i) => (
            <SponsorCard key={s.name} sponsor={s} index={i} seen={seen} />
          ))}
        </div>

        {/* Ligne 2 — 3 sponsors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          {SPONSORS.slice(3, 6).map((s, i) => (
            <SponsorCard key={s.name} sponsor={s} index={i + 3} seen={seen} />
          ))}
        </div>

        {/* Ligne 3 — 1 sponsor, centré */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-start-2">
            <SponsorCard sponsor={SPONSORS[6]} index={6} seen={seen} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== Chiffres clés 2025 (fond beige) ========== */
const KEY_FIGURES = [
  { value: 100, suffix: "+", label: "ventes en 2025", prefix: "", icon: "sales" },
  { value: 90, suffix: "+", label: "avis 5 étoiles sur Google", prefix: "", link: "https://www.google.com/maps/place/GARY+Real+Estate", linkText: "voir ici", icon: "star" },
  { value: 6.6, suffix: "M", label: "de vues sur nos publications", prefix: "", decimals: 1, icon: "eye" },
  { value: 40, suffix: "k+", label: "followers sur nos réseaux", prefix: "", icon: "followers" },
];

function FigureIcon({ type }) {
  const cls = "w-8 h-8 md:w-10 md:h-10 text-[#FF4A3E]/70";
  switch (type) {
    case "sales":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      );
    case "star":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      );
    case "eye":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "followers":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      );
    default:
      return null;
  }
}

function KeyFigures() {
  const [sectionRef, seen] = useInViewOnce({ threshold: 0.2 });

  return (
    <section ref={sectionRef} className="relative z-10 w-full bg-[#FAF6F0] py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Trait décoratif orange au-dessus */}
        <div className="flex justify-center mb-6">
          <div
            className="h-[2px] bg-[#FF4A3E]"
            style={{
              width: seen ? "60px" : "0px",
              transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>

        {/* Titre */}
        <h3
          className="text-center font-serif text-3xl md:text-5xl tracking-wide mb-16 md:mb-20 text-gray-900"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          Quelques chiffres de <span className="text-[#FF4A3E]">2025</span>
        </h3>

        {/* Grille de chiffres */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-14 md:gap-y-16 gap-x-8 md:gap-x-12 lg:gap-x-16">
          {KEY_FIGURES.map((fig, i) => (
            <FigureItem key={i} fig={fig} index={i} active={seen} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FigureItem({ fig, index, active }) {
  const delay = index * 0.15;
  const count = useCountUp(fig.value, 2200, active);
  const display = fig.decimals
    ? count.toFixed(count >= fig.value * 0.99 ? fig.decimals : 1)
    : Math.round(count);

  return (
    <div
      className="flex flex-col items-center text-center"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
      }}
    >
      {/* Icône */}
      <div
        className="mb-4 md:mb-5"
        style={{
          opacity: active ? 1 : 0,
          transition: `opacity 0.6s ease-out ${delay + 0.1}s`,
        }}
      >
        <FigureIcon type={fig.icon} />
      </div>

      {/* Nombre — Inter (sans-serif) gras */}
      <span
        className="font-sans font-bold text-[52px] md:text-[72px] lg:text-[88px] leading-none tracking-tight text-[#FF4A3E]"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {fig.prefix}{display}{fig.suffix}
      </span>

      {/* Label */}
      <p
        className="mt-3 text-[14px] md:text-[17px] uppercase tracking-[0.12em] text-gray-600 leading-relaxed max-w-[260px]"
        style={{
          opacity: active ? 1 : 0,
          transition: `opacity 0.6s ease-out ${delay + 0.4}s`,
        }}
      >
        {fig.label}
      </p>

      {/* Lien optionnel */}
      {fig.link && (
        <a
          href={fig.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-[12px] uppercase tracking-[0.12em] text-[#FF4A3E]/80 hover:text-[#FF4A3E] transition-colors duration-300"
          style={{
            opacity: active ? 1 : 0,
            transition: `opacity 0.6s ease-out ${delay + 0.6}s`,
          }}
        >
          {fig.linkText}
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  );
}

/* ========== Contenu partagé ========== */
const VL = { label: "Puissance", sub: "Marketing", desc: "Une mise en valeur stratégique & une diffusion digitale maximale et maîtrisée", kw: ["stratégique", "maximale"] };
const VR = { label: "Expertise", sub: "Locale", desc: "Plus de 60 ans d'expérience cumulée sur le marché immobilier romand", kw: ["60 ans", "romand"] };
function hl(t, kw) { let r = t; kw.forEach(k => { r = r.replace(k, `<span class="text-[#FF4A3E] font-medium">${k}</span>`); }); return r; }

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/* ========== Section 1 — Hero : Ligne Expansion ========== */
/* Logo GARY → trait orange se dessine → s'élargit en tuile glassmorphique → contenu */
function HeroCirclesSection() {
  const [loaded, setLoaded] = useState(false);
  const [phase, setPhase] = useState(0);
  const wrapperRef = useRef(null);

  useEffect(() => { setLoaded(true); }, []);

  /* Scroll trigger */
  useEffect(() => {
    if (phase > 0) return;
    const fire = () => {
      setPhase(1);
      setTimeout(() => setPhase(2), 500);
      setTimeout(() => setPhase(3), 750);
      setTimeout(() => setPhase(4), 850);
    };
    window.addEventListener("wheel", fire, { once: true, passive: true });
    window.addEventListener("touchmove", fire, { once: true, passive: true });
    window.addEventListener("keydown", (e) => {
      if (["ArrowDown", "ArrowUp", "Space", "PageDown"].includes(e.code)) fire();
    }, { once: true });
    return () => {
      window.removeEventListener("wheel", fire);
      window.removeEventListener("touchmove", fire);
    };
  }, [phase]);

  const [winW, setWinW] = useState(() => typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setWinW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const tileW = Math.min(1100, winW - (winW < 768 ? 32 : 64));
  const tileH = winW < 768 ? 580 : winW < 1024 ? 510 : 490;

  return (
    <div ref={wrapperRef} className="relative" style={{ height: "200vh" }}>
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-neutral-200">
        {/* Vidéo de fond */}
        <video autoPlay muted loop playsInline disablePictureInPicture
          controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <source src="/media/buy/hero24.mp4" type="video/mp4" />
        </video>

        {/* Voile lumineux */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-transparent md:from-white/55 md:via-white/25 md:to-transparent" />
          <div className="absolute inset-0 md:bg-gradient-to-r md:from-white/55 md:via-white/25 md:to-transparent" />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-36 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ zIndex: 20, opacity: loaded && phase === 0 ? 1 : 0, transition: "opacity 0.3s ease-out" }}>
          <span className="text-white text-[11px] uppercase tracking-[0.2em]">Scroll</span>
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"
            style={{ animation: "heroScrollBounce 2s ease-in-out infinite" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Logo GARY initial */}
        <img src="/Logo/logo-gary-orange.png" alt="GARY"
          className="absolute left-1/2 pointer-events-none"
          style={{
            top: "45%",
            transform: "translate(-50%, -50%)",
            width: winW < 768 ? "280px" : winW < 1024 ? "380px" : "480px",
            opacity: loaded ? (phase >= 1 ? 0 : 1) : 0,
            transition: "opacity 0.5s ease-out",
            zIndex: 8,
          }}
        />

        {/* La ligne / rectangle qui grandit */}
        <div className="absolute left-1/2" style={{
          top: "45%",
          transform: "translate(-50%, -50%)", zIndex: 7,
          width: phase >= 2 ? tileW : phase >= 1 ? tileW : 0,
          height: phase >= 2 ? tileH : phase >= 1 ? 2 : 0,
          background: phase >= 2 ? "rgba(255,255,255,0.6)" : "#FF4A3E",
          backdropFilter: phase >= 2 ? "blur(16px)" : "none",
          WebkitBackdropFilter: phase >= 2 ? "blur(16px)" : "none",
          border: phase >= 2 ? "1px solid rgba(255,255,255,0.2)" : "none",
          transition: phase >= 2
            ? `width 0.8s ${EASE}, height 0.8s ${EASE}, background 0.6s ease-out, backdrop-filter 0.6s ease-out, -webkit-backdrop-filter 0.6s ease-out, border 0.6s ease-out`
            : `width 0.7s ${EASE}, height 0.1s ease-out`,
          overflow: "hidden",
        }}>
          <div className="w-full h-full flex flex-col justify-between" style={{
            opacity: phase >= 3 ? 1 : 0, transition: "opacity 0.6s ease-out",
          }}>
            <div className="text-center pt-8 md:pt-12 px-6 md:px-10 w-full flex-1 flex flex-col justify-center">
              <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-500 mb-6" style={{ opacity: phase >= 4 ? 1 : 0, transform: phase >= 4 ? "translateY(0)" : "translateY(8px)", transition: "all 0.5s ease-out" }}>Qui sommes-nous</p>
              <div className="flex flex-col md:flex-row items-center md:items-stretch">
                <div className="flex-1 text-center px-4 md:px-8" style={{ opacity: phase >= 4 ? 1 : 0, transform: phase >= 4 ? "translateX(0)" : "translateX(-20px)", transition: "all 0.7s ease-out 0.1s" }}>
                  <h3 className="font-serif text-[clamp(1.8rem,5.5vw,3.8rem)] text-neutral-900 leading-[1.08]"><span className="text-[#FF4A3E]">{VL.label}</span><br />{VL.sub}</h3>
                  <p className="mt-4 text-neutral-600 text-[clamp(0.95rem,1.8vw,1.15rem)] leading-relaxed max-w-[360px] mx-auto" dangerouslySetInnerHTML={{ __html: hl(VL.desc, VL.kw) }} />
                </div>
                <div className="hidden md:flex items-center justify-center w-px relative my-2"><div className="w-px bg-neutral-900 origin-bottom" style={{ height: "80%", transform: phase >= 4 ? "scaleY(1)" : "scaleY(0)", transition: `transform 1.2s ${EASE} 0.3s` }} /></div>
                <div className="md:hidden flex justify-center my-6"><div className="bg-neutral-900" style={{ height: "2px", width: phase >= 4 ? "50%" : "0%", transition: `width 1.2s ${EASE} 0.3s` }} /></div>
                <div className="flex-1 text-center px-4 md:px-8" style={{ opacity: phase >= 4 ? 1 : 0, transform: phase >= 4 ? "translateX(0)" : "translateX(20px)", transition: "all 0.7s ease-out 0.2s" }}>
                  <h3 className="font-serif text-[clamp(1.8rem,5.5vw,3.8rem)] text-neutral-900 leading-[1.08]"><span className="text-[#FF4A3E]">{VR.label}</span><br />{VR.sub}</h3>
                  <p className="mt-4 text-neutral-600 text-[clamp(0.95rem,1.8vw,1.15rem)] leading-relaxed max-w-[360px] mx-auto" dangerouslySetInnerHTML={{ __html: hl(VR.desc, VR.kw) }} />
                </div>
              </div>
            </div>
            {/* CTA — Découvrir nos résultats */}
            <div className="pb-6 md:pb-8 flex justify-center" style={{ opacity: phase >= 4 ? 1 : 0, transform: phase >= 4 ? "translateY(0)" : "translateY(10px)", transition: "all 0.6s ease-out 0.4s" }}>
                <span
                  className="cursor-pointer inline-flex flex-col items-center gap-1.5 text-[12px] md:text-[13px] uppercase tracking-[0.15em] text-neutral-600 hover:text-[#FF4A3E] transition-colors duration-300"
                  onClick={() => window.scrollTo({ top: window.innerHeight * 2, behavior: "smooth" })}
                >
                  Découvrir nos résultats
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"
                    style={{ animation: "heroScrollBounce 2s ease-in-out infinite" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
            </div>
          </div>
        </div>

        {/* Gradient bas */}
        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ zIndex: 15, background: "linear-gradient(to bottom, transparent, #ffffff)", opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.8s ease-out 0.3s" }}
        />
      </div>

      <style>{`
        @keyframes heroScrollBounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}


/* ========== Données "Ce qui nous distingue" ========== */
const DISTINGUISH_POINTS = [
  { main: "Chaque courtier possède plus de 10 ans d'expérience sur le marché immobilier local", detail: "Expertise confirmée, conseils stratégiques avisés", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=600&fit=crop&q=80" },
  { main: "Une approche marketing moderne et performante", detail: "Mise en valeur sur mesure, photos et vidéos professionnelles, diffusion stratégique", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=600&fit=crop&q=80" },
  { main: "Une communauté active et fidèle de plus de 40k followers", detail: null, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&h=600&fit=crop&q=80" },
  { main: "Un réseau d'acheteurs qualifiés", detail: "Base de données de plus de 5000 clients acheteurs", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&h=600&fit=crop&q=80" },
  { main: "Un réseau de partenaires de confiance", detail: "Financements, notaires, avocats, architectes, …", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&h=600&fit=crop&q=80" },
];

/* ========== Ce qui nous distingue — Zigzag SVG courbe + images alternées ========== */

/* Sous-composant : une rangée de la timeline (grille 3 colonnes) */
function DistinguishRow({ point, index, isLeft, dotRef }) {
  const [ref, seen] = useInViewOnce({ threshold: 0.2 });
  const imgRef = useRef(null);

  /* Parallax : l'image se décale légèrement au scroll */
  useEffect(() => {
    const img = imgRef.current;
    const row = ref.current;
    if (!img || !row) return;
    const onScroll = () => {
      const rect = row.getBoundingClientRect();
      const winH = window.innerHeight;
      const offset = ((rect.top + rect.height / 2) - winH / 2) * 0.1;
      img.style.transform = `translateY(${offset}px) scale(1.12)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textBlock = (
    <div className={isLeft ? "md:text-right" : ""}>
      <div className={`flex items-center gap-3 mb-6 ${isLeft ? "md:justify-end" : ""}`}>
        <span className="md:hidden relative flex items-center justify-center">
          <span className="absolute w-9 h-9 rounded-full bg-[#FF4A3E]/15" />
          <span className="w-3.5 h-3.5 rounded-full bg-[#FF4A3E] block" />
        </span>
        <span className="text-sm md:text-base uppercase tracking-[0.2em] text-[#FF4A3E] font-semibold">
          0{index + 1}
        </span>
      </div>
      <h4 className="text-2xl md:text-3xl lg:text-[2.2rem] leading-snug text-gray-900 font-serif tracking-wide">
        {point.main}
      </h4>
      {point.detail && (
        <p className="mt-4 text-lg md:text-xl text-gray-500 leading-relaxed font-light">
          {point.detail}
        </p>
      )}
    </div>
  );

  const imageBlock = (
    <div className="overflow-hidden" style={{ height: "clamp(280px, 30vw, 440px)" }}>
      <img
        ref={imgRef}
        src={point.image}
        alt=""
        className="w-full h-full object-cover will-change-transform"
        style={{ transform: "scale(1.12)" }}
        loading="lazy"
      />
    </div>
  );

  return (
    <div ref={ref} className="relative grid grid-cols-1 md:grid-cols-[1fr_80px_1fr] gap-6 md:gap-0 items-center py-12 md:py-24">
      {/* Colonne gauche (texte ou image) */}
      <div
        className={`md:order-1 md:pr-12 ${!isLeft ? "order-2 md:order-1" : ""}`}
        style={{
          position: "relative", zIndex: 10,
          opacity: seen ? 1 : 0,
          transform: seen ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
          transition: `opacity 0.9s ease-out, transform 0.9s ${EASE}`,
        }}
      >
        {isLeft ? textBlock : imageBlock}
      </div>

      {/* Colonne centrale — couloir du trait et des points (desktop) */}
      <div className="hidden md:flex md:order-2 items-center justify-center relative" style={{ zIndex: 5 }}>
        <div
          ref={dotRef}
          className="absolute flex items-center justify-center"
          style={{ left: isLeft ? "15%" : "85%", top: "50%", transform: "translate(-50%, -50%)" }}
        >
          <span
            className="absolute w-12 h-12 rounded-full bg-[#FF4A3E]/15"
            style={{ transform: seen ? "scale(1)" : "scale(0)", transition: `transform 0.6s ${EASE} 0.1s` }}
          />
          <span
            className="w-5 h-5 rounded-full bg-[#FF4A3E] block"
            style={{ transform: seen ? "scale(1)" : "scale(0)", transition: `transform 0.5s ${EASE}` }}
          />
        </div>
      </div>

      {/* Colonne droite (image ou texte) */}
      <div
        className={`md:order-3 md:pl-12 ${!isLeft ? "order-1 md:order-3" : ""}`}
        style={{
          position: "relative", zIndex: 10,
          opacity: seen ? 1 : 0,
          transform: seen ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
          transition: `opacity 0.9s ease-out 0.2s, transform 0.9s ${EASE} 0.2s`,
        }}
      >
        {isLeft ? imageBlock : textBlock}
      </div>
    </div>
  );
}

function DistinguishZigzag({ seen }) {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const haloRef = useRef(null);
  const dotRefs = useRef([]);
  const [pathD, setPathD] = useState("");
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });

  const setDotRef = useCallback((el, i) => { dotRefs.current[i] = el; }, []);

  /* Mesure les positions des points et construit le tracé SVG courbe */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const buildPath = () => {
      const cRect = container.getBoundingClientRect();
      const w = cRect.width;
      const h = container.scrollHeight;
      setSvgSize({ w, h });

      const positions = dotRefs.current.map((el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left - cRect.left + r.width / 2, y: r.top - cRect.top + r.height / 2 };
      }).filter(Boolean);

      if (positions.length < 2) return;

      let d = `M ${positions[0].x} ${positions[0].y}`;
      for (let i = 0; i < positions.length - 1; i++) {
        const curr = positions[i];
        const next = positions[i + 1];
        const midY = (curr.y + next.y) / 2;
        d += ` C ${curr.x} ${midY}, ${next.x} ${midY}, ${next.x} ${next.y}`;
      }
      setPathD(d);
    };

    const timers = [150, 600, 1200].map((t) => setTimeout(buildPath, t));
    window.addEventListener("resize", buildPath);
    return () => { timers.forEach(clearTimeout); window.removeEventListener("resize", buildPath); };
  }, [seen]);

  /* Animation fluide du tracé SVG via rAF + lerp — avance avec le scroll */
  useEffect(() => {
    const container = containerRef.current;
    const pathEl = pathRef.current;
    const haloEl = haloRef.current;
    if (!container || !pathEl || !pathD) return;

    const totalLength = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = String(totalLength);
    pathEl.style.strokeDashoffset = String(totalLength);
    if (haloEl) {
      haloEl.style.strokeDasharray = String(totalLength);
      haloEl.style.strokeDashoffset = String(totalLength);
    }

    let rafId;
    let target = 0;
    let current = 0;

    const tick = () => {
      current += (target - current) * 0.06;
      const offset = String(totalLength - totalLength * current);
      pathEl.style.strokeDashoffset = offset;
      if (haloEl) haloEl.style.strokeDashoffset = offset;
      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const winH = window.innerHeight;
      const start = winH * 0.75;
      const end = -rect.height * 0.2;
      target = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    rafId = requestAnimationFrame(tick);

    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(rafId); };
  }, [pathD]);

  const [conclusionVisible, setConclusionVisible] = useState(false);
  const conclusionRef = useRef(null);
  useEffect(() => {
    const el = conclusionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setConclusionVisible(true); }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="mt-20 md:mt-32">
      <div className="flex justify-center mb-6">
        <div className="h-[2px] bg-[#FF4A3E]" style={{ width: seen ? "60px" : "0px", transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)" }} />
      </div>

      <h3
        className="text-center font-serif text-3xl md:text-5xl tracking-wide mb-16 md:mb-24 text-gray-900"
        style={{ opacity: seen ? 1 : 0, transform: seen ? "translateY(0)" : "translateY(15px)", transition: "opacity 0.8s ease-out, transform 0.8s ease-out" }}
      >
        Ce qui nous <span className="text-[#FF4A3E]">distingue</span>, concrètement.
      </h3>

      <div ref={containerRef} className="relative max-w-[1500px] mx-auto px-6 md:px-16 lg:px-24">
        {/* SVG courbe zigzag — dans le couloir central, derrière le contenu */}
        {pathD && svgSize.w > 0 && (
          <svg
            className="hidden md:block absolute top-0 left-0 pointer-events-none"
            style={{ width: svgSize.w, height: svgSize.h, zIndex: 2 }}
            viewBox={`0 0 ${svgSize.w} ${svgSize.h}`}
            fill="none"
          >
            <path ref={haloRef} d={pathD} stroke="#FF4A3E" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.08" />
            <path ref={pathRef} d={pathD} stroke="#FF4A3E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        )}

        {DISTINGUISH_POINTS.map((point, i) => (
          <DistinguishRow key={i} point={point} index={i} isLeft={i % 2 === 0} dotRef={(el) => setDotRef(el, i)} />
        ))}
      </div>

      <p
        ref={conclusionRef}
        className="mt-16 md:mt-20 text-center text-xl md:text-2xl leading-relaxed text-gray-700 font-light max-w-[800px] mx-auto px-6"
        style={{ opacity: conclusionVisible ? 1 : 0, transform: conclusionVisible ? "translateY(0)" : "translateY(15px)", transition: "opacity 0.8s ease-out, transform 0.8s ease-out" }}
      >
        L'ensemble réuni pour vous offrir un service <strong className="font-semibold text-[#FF4A3E]">sur mesure</strong>,
        à la hauteur de vos ambitions.
      </p>
    </div>
  );
}

/* ========== Section 2 — Notre identité (fond blanc) ========== */
function IdentitySection() {
  const [ref, seen] = useInViewOnce({ threshold: 0.05 });

  return (
    <section ref={ref} className="relative z-10 bg-white py-24 md:py-32">
      <div className="relative max-w-[1000px] mx-auto px-6 md:px-12 text-center">
        {/* Logo GARY orange — watermark derrière le texte, descend depuis le haut */}
        <img
          src="/Logo/logo-gary-orange.png"
          alt=""
          className="absolute left-0 right-0 mx-auto pointer-events-none"
          style={{
            top: "68%",
            transform: seen ? "translateY(-50%)" : "translateY(calc(-50% - 120px))",
            width: "clamp(400px, 65vw, 900px)",
            opacity: seen ? 0.08 : 0,
            transition: "opacity 1.2s ease-out 0.3s, transform 1.6s cubic-bezier(0.22, 1, 0.36, 1) 0.3s",
            zIndex: 0,
          }}
        />

        {/* Trait orange décoratif */}
        <div className="relative z-10 flex justify-center mb-6">
          <div
            className="h-[2px] bg-[#FF4A3E]"
            style={{
              width: seen ? "60px" : "0px",
              transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>

        {/* Titre */}
        <h2
          className="relative z-10 font-serif text-4xl md:text-6xl tracking-wide text-gray-900 mb-10 md:mb-12"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          Notre <span className="text-[#FF4A3E]">identité</span>
        </h2>

        {/* Texte */}
        <p
          className="relative z-10 text-xl md:text-2xl leading-relaxed text-gray-700 font-light"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(15px)",
            transition: "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
          }}
        >
          <strong className="font-semibold text-[#FF4A3E]">GARY</strong> est une agence immobilière spécialisée dans la vente d'appartements,
          de maisons et de projets neufs en suisse romande.
        </p>
        <p
          className="relative z-10 mt-4 text-xl md:text-2xl leading-relaxed text-gray-700 font-light"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(15px)",
            transition: "opacity 0.8s ease-out 0.35s, transform 0.8s ease-out 0.35s",
          }}
        >
          Véritables stratèges de la vente immobilière, notre équipe combine une connaissance fine du marché immobilier local,
          forgée par plus de <strong className="font-semibold text-[#FF4A3E]">60 ans d'expérience cumulée</strong>, à une expertise
          marketing nouvelle génération, innovante et performante.
        </p>
      </div>

      {/* Ce qui nous distingue — zigzag avec ligne SVG animée au scroll */}
      <DistinguishZigzag seen={seen} />
    </section>
  );
}

/* ========== Section 5 — Influenceurs immobilier suisse (fond beige) ========== */
const INSTA_STATS = [
  { value: "40k+", label: "Abonnés" },
  { value: "6.6M", label: "Vues sur nos publications" },
  { value: "500+", label: "Contenus publiés" },
  { value: "N°1", label: "Agence immo suisse sur les réseaux" },
];

function InfluencersSection() {
  const [ref, seen] = useInViewOnce({ threshold: 0.2 });

  return (
    <section ref={ref} className="relative z-10 bg-[#FAF6F0] py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Titre de section */}
        <div
          className="mb-14 md:mb-20"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          <div
            className="h-[2px] bg-[#FF4A3E] mb-6"
            style={{
              width: seen ? "60px" : "0px",
              transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
          <h3 className="font-serif text-3xl md:text-5xl tracking-wide text-gray-900 mb-4 leading-tight">
            Les <span className="text-[#FF4A3E]">influenceurs</span> de l'immobilier suisse
          </h3>
          <p className="text-lg md:text-xl leading-relaxed text-gray-600 font-light max-w-[600px]">
            Votre bien touche une audience que les portails n'atteignent pas.
            Nous créons le désir avant même la mise en vente.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Gauche — Grille de posts Instagram */}
          <div
            style={{
              opacity: seen ? 1 : 0,
              transform: seen ? "translateX(0)" : "translateX(-30px)",
              transition: "opacity 0.8s ease-out 0.15s, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.15s",
            }}
          >
            <div className="grid grid-cols-3 gap-1.5 overflow-hidden">
              {[
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=400&fit=crop&q=80",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop&q=80",
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=400&fit=crop&q=80",
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=400&fit=crop&q=80",
                "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=400&fit=crop&q=80",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=400&fit=crop&q=80",
              ].map((src, i) => (
                <a
                  key={i}
                  href="https://www.instagram.com/gary_realestate/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/post relative aspect-square overflow-hidden"
                >
                  <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover/post:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover/post:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white opacity-0 group-hover/post:opacity-100 transition-opacity duration-300" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Droite — Profil Instagram + stats */}
          <div
            style={{
              opacity: seen ? 1 : 0,
              transform: seen ? "translateX(0)" : "translateX(30px)",
              transition: "opacity 0.8s ease-out 0.25s, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.25s",
            }}
          >
            {/* Header profil */}
            <a
              href="https://www.instagram.com/gary_realestate/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 mb-8 hover:opacity-80 transition-opacity"
            >
              <div className="w-[72px] h-[72px] md:w-20 md:h-20 rounded-full bg-[#FF4A3E] flex items-center justify-center shrink-0 p-3">
                <img src="/Logo/logo-gary.png" alt="GARY" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-900 text-lg md:text-xl">gary_realestate</span>
                  <svg className="w-5 h-5 text-[#3897f0]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.4 14.6l-4.2-4.2 1.4-1.4 2.8 2.8 5.6-5.6 1.4 1.4-7 7z"/></svg>
                </div>
                <p className="text-gray-500 text-sm mt-0.5">GARY Real Estate</p>
              </div>
              <svg className="w-5 h-5 ml-auto text-gray-400 group-hover:text-[#FF4A3E] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            {/* Grille de stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {INSTA_STATS.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white p-5 text-center shadow-sm"
                  style={{
                    opacity: seen ? 1 : 0,
                    transform: seen ? "translateY(0)" : "translateY(12px)",
                    transition: `opacity 0.5s ease-out ${0.35 + i * 0.08}s, transform 0.5s ease-out ${0.35 + i * 0.08}s`,
                  }}
                >
                  <p className="text-2xl md:text-3xl font-bold text-[#FF4A3E] leading-none">{stat.value}</p>
                  <p className="mt-2 text-[13px] text-gray-500 uppercase tracking-[0.08em] leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Bouton */}
            <a
              href="https://www.instagram.com/gary_realestate/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.12em] text-[#FF4A3E] hover:text-[#E43E33] font-medium transition-colors"
            >
              Voir tout sur Instagram
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== Section 6 — Avis Google (fond blanc) ========== */
const GOOGLE_REVIEWS = [
  {
    name: "Sophie M.",
    rating: 5,
    text: "Une équipe au top ! Gregory et son équipe ont été d'une efficacité remarquable pour la vente de notre appartement. Résultat au-dessus de nos attentes. Je recommande vivement !",
  },
  {
    name: "Laurent D.",
    rating: 5,
    text: "Professionnalisme et réactivité. Steven a su nous accompagner tout au long du processus de vente avec beaucoup de professionnalisme. La stratégie marketing mise en place était innovante et efficace.",
  },
  {
    name: "Marie-Claire B.",
    rating: 5,
    text: "Expérience exceptionnelle avec GARY. Frédéric a trouvé des solutions là où d'autres avaient échoué. Sa connaissance du marché genevois est impressionnante. Merci pour tout !",
  },
  {
    name: "Thomas R.",
    rating: 5,
    text: "GARY a vendu notre villa en un temps record et à un prix supérieur à notre estimation. Leur approche marketing sur les réseaux sociaux a fait toute la différence. Bravo à toute l'équipe !",
  },
];

function GoogleReviewsSection() {
  const [ref, seen] = useInViewOnce({ threshold: 0.15 });

  return (
    <section ref={ref} className="relative z-10 bg-white py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Trait décoratif */}
        <div className="flex justify-center mb-6">
          <div
            className="h-[2px] bg-[#FF4A3E]"
            style={{
              width: seen ? "60px" : "0px",
              transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>

        <h3
          className="text-center font-serif text-3xl md:text-5xl tracking-wide mb-14 md:mb-20 text-gray-900"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(15px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          Ce que nos clients <span className="text-[#FF4A3E]">pensent</span> de nous
        </h3>

        {/* Avis clients */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GOOGLE_REVIEWS.map((review, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 shadow-md p-6 md:p-8"
              style={{
                opacity: seen ? 1 : 0,
                transform: seen ? "translateY(0)" : "translateY(15px)",
                transition: `opacity 0.6s ease-out ${0.2 + i * 0.12}s, transform 0.6s ease-out ${0.2 + i * 0.12}s`,
              }}
            >
              {/* Étoiles */}
              <div className="flex gap-1 mb-3">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <svg key={j} className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Texte */}
              <p className="text-gray-700 text-[15px] md:text-base leading-relaxed mb-4 italic">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Nom */}
              <p className="text-gray-900 font-semibold text-sm">{review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== Section 8 — CTA Final (vidéo plein écran au scroll) ========== */
function CTASection() {
  const wrapperRef = useRef(null);
  const overlayRef = useRef(null);
  const videoBoxRef = useRef(null);
  const contentRef = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const winH = window.innerHeight;
      const scrollable = rect.height - winH;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));

      if (rect.top < winH * 0.7) setSeen(true);

      /* Voile : 0.7 → 0.25 */
      if (overlayRef.current) {
        overlayRef.current.style.opacity = String(0.7 - progress * 0.45);
      }

      /* Vidéo : commence avec marges, finit plein écran */
      if (videoBoxRef.current) {
        const margin = (1 - progress) * 3;
        videoBoxRef.current.style.margin = `${margin}%`;
      }

      /* Contenu : opaque au début, se clarifie avec le scroll */
      if (contentRef.current) {
        contentRef.current.style.opacity = String(0.3 + progress * 0.7);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={wrapperRef} className="relative z-10" style={{ height: "200vh" }}>
      <section className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#FAF6F0]">
        {/* Vidéo de fond */}
        <div ref={videoBoxRef} className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          <video autoPlay muted loop playsInline disablePictureInPicture
            controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
            className="w-full h-full object-cover pointer-events-none"
          >
            <source src="/media/buy/hero24.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Voile — s'estompe au scroll */}
        <div ref={overlayRef} className="absolute inset-0 bg-[#FAF6F0] pointer-events-none" style={{ zIndex: 1, opacity: 0.7 }} />

        {/* Contenu centré — se clarifie au scroll */}
        <div ref={contentRef} className="relative max-w-[800px] mx-auto px-6 md:px-12 text-center" style={{ zIndex: 2, opacity: 0.3 }}>
          <h2
            className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide text-gray-900 mb-8 md:mb-10"
            style={{
              opacity: seen ? 1 : 0,
              transform: seen ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
            }}
          >
            Un projet immobilier ? <br className="hidden md:block" />
            <span className="text-[#FF4A3E]">Parlons-en.</span>
          </h2>

          <div
            className="flex justify-center"
            style={{
              opacity: seen ? 1 : 0,
              transform: seen ? "translateY(0)" : "translateY(15px)",
              transition: "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
            }}
          >
            <CTAFuturaGlow
              to="/contact"
              label="Nous contacter"
              Icon={PhoneIcon}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ========== Carte équipe avec hover ========== */
function TeamCard({ name, role, photo, quote, slug }) {
  const startX = useRef(0);

  const handleClick = (e) => {
    if (Math.abs(e.clientX - startX.current) > 5) e.preventDefault();
  };

  return (
    <Link
      to={`/equipe/${slug}`}
      className="group relative overflow-hidden shrink-0 w-[44vw] md:w-[420px] h-[36vh] md:h-[520px] border border-white/30 block"
      draggable={false}
      onMouseDown={(e) => { startX.current = e.clientX; }}
      onClick={handleClick}
    >
      <img
        src={photo}
        alt={`${name} — ${role}`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        loading="lazy"
        draggable={false}
      />

      {/* Voile sombre de base — masqué sur mobile */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-all duration-500 group-hover:opacity-0 max-md:opacity-0" />
      {/* Voile orange — toujours visible sur mobile, hover sur desktop */}
      {/* Voile orange — desktop: hover, mobile: toujours visible mais plus léger */}
      <div className="absolute inset-0 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "linear-gradient(to top, rgba(255,74,62,0.85) 0%, rgba(255,74,62,0.35) 45%, transparent 100%)" }}
      />
      <div className="absolute inset-0 md:hidden"
        style={{ background: "linear-gradient(to top, rgba(255,74,62,0.25) 0%, rgba(255,74,62,0.06) 35%, transparent 100%)" }}
      />

      {/* Infos en bas */}
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-8 z-10 transition-transform duration-500 group-hover:translate-y-[-20px] max-md:translate-y-[-10px]">
        <p className="text-white/60 text-[9px] md:text-sm uppercase tracking-[0.2em] mb-0.5 md:mb-1">{role}</p>
        <p className="text-white text-base md:text-3xl font-serif tracking-wide">{name}</p>

        {/* Citation — apparaît au hover */}
        <div className="overflow-hidden max-md:max-h-0 max-h-0 group-hover:max-h-40 transition-all duration-500 ease-out">
          <p className="text-white/80 text-sm md:text-base italic leading-relaxed mt-4">
            &ldquo;{quote}&rdquo;
          </p>
          <span
            className="inline-block mt-4 px-5 py-2 text-sm uppercase tracking-[0.15em] text-white border border-white/50
                       hover:bg-white hover:text-[#FF4A3E] transition-all duration-300"
          >
            Découvrir
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ========== Points interactifs sur la photo d'équipe ========== */
/* Chaque membre : position du point (%) + zone cliquable couvrant le corps */
const TEAM_DOTS = [
  // Jared — debout extrême gauche | zone 0→17%
  { slug: "jared-camaddo",    dotX: 13,  dotY: 46, zoneX: 0,  zoneY: 8,  zoneW: 17, zoneH: 90 },
  // Frédéric — assis gauche | zone 17→33%
  { slug: "frederic-batista",  dotX: 27,  dotY: 76, zoneX: 17, zoneY: 38, zoneW: 16, zoneH: 62 },
  // Guive — debout centre | zone 33→47%
  { slug: "guive-emami",       dotX: 41,  dotY: 43, zoneX: 33, zoneY: 5,  zoneW: 14, zoneH: 93 },
  // Grégory — assis/accroupi centre | zone 47→60%
  { slug: "gregory-autieri",   dotX: 53,  dotY: 76, zoneX: 47, zoneY: 35, zoneW: 13, zoneH: 65 },
  // Steven — assis droite | zone 60→77%
  { slug: "steven-bourg",      dotX: 68,  dotY: 78, zoneX: 60, zoneY: 38, zoneW: 17, zoneH: 62 },
  // Florie — debout droite | zone 77→100%
  { slug: "florie-autieri",    dotX: 81,  dotY: 53, zoneX: 77, zoneY: 12, zoneW: 23, zoneH: 86 },
];

function TeamMemberZone({ member, dotX, dotY, zoneX, zoneY, zoneW, zoneH, index }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  /* Position fluide du label qui suit la souris avec un léger délai */
  const labelRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const labelPos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);
  const containerRef = useRef(null);

  /* Lerp loop — le label rattrape la souris avec un facteur d'inertie */
  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      labelPos.current.x = lerp(labelPos.current.x, mousePos.current.x, 0.12);
      labelPos.current.y = lerp(labelPos.current.y, mousePos.current.y, 0.12);
      if (labelRef.current) {
        labelRef.current.style.left = `${labelPos.current.x}px`;
        labelRef.current.style.top = `${labelPos.current.y}px`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  /* Tooltip toujours en dessous de la souris */
  const yOffset = 30;

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePos.current.x = e.clientX - rect.left;
    mousePos.current.y = e.clientY - rect.top + yOffset;
  }, [yOffset]);

  const handleMouseEnter = useCallback((e) => {
    setHovered(true);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top + yOffset;
      mousePos.current = { x, y };
      labelPos.current = { x, y };
    }
  }, [yOffset]);

  if (!member) return null;

  const relDotX = ((dotX - zoneX) / zoneW) * 100;
  const relDotY = ((dotY - zoneY) / zoneH) * 100;

  return (
    <div
      ref={containerRef}
      className="absolute cursor-pointer"
      style={{
        left: `${zoneX}%`,
        top: `${zoneY}%`,
        width: `${zoneW}%`,
        height: `${zoneH}%`,
        zIndex: hovered ? 30 : 20,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={() => navigate(`/equipe/${member.slug}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") navigate(`/equipe/${member.slug}`); }}
      aria-label={`Voir le profil de ${member.name}`}
    >
      {/* Point orange — positionné sur le torse */}
      <div
        className="absolute"
        style={{
          left: `${relDotX}%`,
          top: `${relDotY}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Pulse qui respire en continu */}
        <span
          className="absolute rounded-full"
          style={{
            width: "40px",
            height: "40px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(255,74,62,0.25)",
            animation: hovered ? "none" : "teamDotPulse 2.5s ease-in-out infinite",
            opacity: hovered ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Le point lui-même — s'étend en pill au hover */}
        <span
          className="flex items-center justify-center rounded-full"
          style={{
            width: hovered ? "90px" : "18px",
            height: hovered ? "30px" : "18px",
            background: "#FF4A3E",
            boxShadow: hovered
              ? "0 0 20px rgba(255,74,62,0.6), 0 2px 8px rgba(0,0,0,0.2)"
              : "0 0 10px rgba(255,74,62,0.5), 0 2px 6px rgba(0,0,0,0.15)",
            borderRadius: hovered ? "20px" : "50%",
            transition: "width 0.4s cubic-bezier(0.22, 1, 0.36, 1), height 0.4s cubic-bezier(0.22, 1, 0.36, 1), border-radius 0.4s ease, box-shadow 0.3s ease",
            transform: "translate(-50%, -50%)",
            position: "absolute",
            left: "50%",
            top: "50%",
          }}
        >
          <span
            className="text-white font-medium tracking-wide whitespace-nowrap"
            style={{
              fontSize: "12px",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "scale(1)" : "scale(0.7)",
              transition: "opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s",
            }}
          >
            voir →
          </span>
        </span>
      </div>

      {/* Label qui suit la souris avec inertie — reveal de gauche à droite */}
      <div
        ref={labelRef}
        className="absolute pointer-events-none"
        style={{
          transform: "translate(-50%, 0%)",
          willChange: "left, top",
        }}
      >
        <span
          className="inline-block whitespace-nowrap font-semibold tracking-wide overflow-hidden"
          style={{
            fontSize: "clamp(14px, 1.3vw, 18px)",
            color: "#1a1a1a",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(6px)",
            outline: "0.5px solid rgba(255,74,62,0.4)",
            outlineOffset: "-3px",
            padding: hovered ? "10px 20px" : "10px 0px",
            maxWidth: hovered ? "300px" : "0px",
            opacity: hovered ? 1 : 0,
            transition: "max-width 1.2s cubic-bezier(0.22, 1, 0.36, 1), padding 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease",
          }}
        >
          {member.name}
        </span>
      </div>
    </div>
  );
}

function TeamPhotoSection() {
  return (
    <section className="relative z-10 overflow-hidden">
      <style>{`
        @keyframes teamDotPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          50% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
        }
      `}</style>
      <div className="relative w-full">
        {/* Desktop : bandeau panoramique avec points interactifs */}
        <img
          src="/team-photo.png"
          alt="L'équipe GARY Real Estate"
          className="hidden md:block w-full h-auto"
          loading="lazy"
        />
        {/* Mobile : photo originale complète sans points */}
        <img
          src="/team-photo.jpg"
          alt="L'équipe GARY Real Estate"
          className="md:hidden w-full h-auto"
          loading="lazy"
        />

        {/* Zones cliquables + points interactifs — desktop uniquement */}
        <div className="hidden md:block">
          {TEAM_DOTS.map((dot, i) => {
            const member = team.find((m) => m.slug === dot.slug);
            return (
              <TeamMemberZone key={dot.slug} member={member} index={i} {...dot} />
            );
          })}
        </div>

        {/* Overlay dégradé bas léger */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>
    </section>
  );
}

/* ========== PAGE ABOUT ========== */
export default function About() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const setWidthRef = useRef(0);
  const offsetRef = useRef(0);
  const lastFrameTime = useRef(0);
  const isDragging = useRef(false);
  const dragLastX = useRef(0);
  const [teamSeen, setTeamSeen] = useState(false);
  const teamSectionRef = useRef(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Détecte quand la section équipe est visible → lance le carrousel
  useEffect(() => {
    const el = teamSectionRef.current;
    if (!el || teamSeen) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setTeamSeen(true);
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [teamSeen]);

  // Calcule la largeur d'un jeu de cartes
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const compute = () => {
      const totalW = el.scrollWidth;
      const sw = totalW / 3;
      if (sw > 0) setWidthRef.current = sw;
    };
    compute();
    const t1 = setTimeout(compute, 200);
    window.addEventListener("resize", compute);
    return () => { clearTimeout(t1); window.removeEventListener("resize", compute); };
  }, []);

  // Auto-scroll permanent — démarre quand teamSeen
  useEffect(() => {
    if (!teamSeen) return;
    let raf;
    const SPEED = 30;
    offsetRef.current = setWidthRef.current || 0;
    lastFrameTime.current = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - lastFrameTime.current) / 1000, 0.1);
      lastFrameTime.current = now;

      if (!isDragging.current) {
        offsetRef.current += SPEED * dt;
      }

      const sw = setWidthRef.current;
      if (sw > 0) {
        if (offsetRef.current >= sw * 2) offsetRef.current -= sw;
        else if (offsetRef.current < 0) offsetRef.current += sw;
      }

      const el = trackRef.current;
      if (el) el.style.transform = `translateX(${-offsetRef.current}px)`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [teamSeen]);

  // Drag souris
  const onMouseDown = useCallback((e) => {
    isDragging.current = true;
    dragLastX.current = e.clientX;
    const el = containerRef.current;
    if (el) { el.style.cursor = "grabbing"; el.style.userSelect = "none"; }
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const dx = e.clientX - dragLastX.current;
    offsetRef.current -= dx;
    dragLastX.current = e.clientX;
  }, []);

  const onMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    lastFrameTime.current = performance.now();
    const el = containerRef.current;
    if (el) { el.style.cursor = "grab"; el.style.userSelect = ""; }
  }, []);

  // Touch (mobile)
  const onTouchStart = useCallback((e) => {
    isDragging.current = true;
    dragLastX.current = e.touches[0].clientX;
  }, []);

  const onTouchMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - dragLastX.current;
    offsetRef.current -= dx;
    dragLastX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    lastFrameTime.current = performance.now();
  }, []);

  const displayTeam = [...team, ...team, ...team];

  return (
    <div className="relative" style={{ minHeight: "100vh" }}>

      {/* ====== SECTION 1 — Hero + Cercles (fond sombre) ====== */}
      <HeroCirclesSection />

      {/* ====== CONTENU POST-HERO (z-10 passe au-dessus du sticky) ====== */}
      <div className="relative" style={{ zIndex: 10 }}>

        {/* ====== SECTION 2 — Notre identité (fond blanc) ====== */}
        <IdentitySection />

        {/* ====== Photo d'équipe — bandeau pleine largeur avec points interactifs ====== */}
        <TeamPhotoSection />

        {/* ====== SECTION 3 — Chiffres clés 2025 (fond beige) ====== */}
        <KeyFigures />

        {/* ====== SECTION 4 — Équipe carousel (fond blanc) ====== */}
        <section ref={teamSectionRef} className="relative bg-white py-16 md:py-24">
          <div className="flex justify-center mb-6">
            <div
              className="h-[2px] bg-[#FF4A3E]"
              style={{
                width: teamSeen ? "60px" : "0px",
                transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </div>

          <h2
            className="text-center text-gray-900 font-serif text-3xl md:text-5xl tracking-wide mb-6 md:mb-10"
            style={{
              opacity: teamSeen ? 1 : 0,
              transform: teamSeen ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
            }}
          >
            Notre <span className="text-[#FF4A3E]">équipe</span>
          </h2>

          {/* Carrousel */}
          <div
            ref={containerRef}
            className="w-full overflow-hidden py-4"
            style={{
              cursor: "grab",
              opacity: teamSeen ? 1 : 0,
              transition: "opacity 0.8s ease-out 0.15s",
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              ref={trackRef}
              className="flex gap-5 md:gap-8 px-8 md:px-20"
              style={{ willChange: "transform" }}
            >
              {displayTeam.map((m, i) => (
                <div key={`${m.slug}-${i}`} className="shrink-0">
                  <TeamCard {...m} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== SECTION 5 — Influenceurs (fond beige) ====== */}
        <InfluencersSection />

        {/* ====== SECTION 6 — Avis Google (fond blanc) ====== */}
        <GoogleReviewsSection />

        {/* ====== SECTION 7 — Partenaires (fond beige) ====== */}
        <SponsorsSection />

        {/* ====== SECTION 8 — CTA final (fond sombre) ====== */}
        <CTASection />
      </div>
    </div>
  );
}
