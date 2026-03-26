import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useLocale } from "../hooks/useLocale.js";
import team from "../data/team.json";
import CTAFuturaGlow, { PhoneIcon } from "../components/cta/CTAFuturaGlow.jsx";
import TeamPhotoInteractive from "../components/TeamPhotoInteractive.jsx";
import GoogleReviews from "../components/GoogleReviews.jsx";

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
function getSponsors(t) {
  return [
    {
      name: "divorce.ch",
      src: "/sponsors/divorce-ch.jpeg",
      url: "https://www.divorce.ch",
      subtitle: t("about.sponsor_1_subtitle"),
      short: t("about.sponsor_1_short"),
      long: t("about.sponsor_1_long"),
    },
    {
      name: "Mise en Voix",
      src: "/sponsors/mise-en-voix.jpeg",
      url: "https://www.mise-en-voix.ch",
      subtitle: t("about.sponsor_2_subtitle"),
      short: t("about.sponsor_2_short"),
      long: t("about.sponsor_2_long"),
    },
    {
      name: "Planifique",
      src: "/sponsors/planifique.jpeg",
      url: "https://www.planifique.fr",
      subtitle: t("about.sponsor_3_subtitle"),
      short: t("about.sponsor_3_short"),
      long: t("about.sponsor_3_long"),
    },
    {
      name: "Plus Groupe",
      src: "/sponsors/plus-financement.jpeg",
      url: "https://plus-group.ch",
      subtitle: t("about.sponsor_4_subtitle"),
      short: t("about.sponsor_4_short"),
      long: t("about.sponsor_4_long"),
    },
    {
      name: "CCIG",
      src: "/sponsors/ccig.png",
      url: "https://www.ccig.ch",
      subtitle: t("about.sponsor_5_subtitle"),
      short: t("about.sponsor_5_short"),
      long: t("about.sponsor_5_long"),
    },
    {
      name: "TC Veyrier Grand-Donzel",
      src: "/sponsors/veyrier-grand-donzel.jpeg",
      url: "https://www.tcvgd.ch",
      subtitle: t("about.sponsor_6_subtitle"),
      short: t("about.sponsor_6_short"),
      long: t("about.sponsor_6_long"),
    },
    {
      name: "On the Water",
      src: "/sponsors/on-the-water.jpeg",
      url: "https://on-the-water.ch",
      subtitle: t("about.sponsor_7_subtitle"),
      short: t("about.sponsor_7_short"),
      long: t("about.sponsor_7_long"),
    },
  ];
}

/* ========== Popup modal partenaire ========== */
function SponsorModal({ sponsor, onClose, t }) {
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
            aria-label={t("aria.close")}
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
                  <span className="relative z-10">{t("about.visit_website")}</span>
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
function SponsorCard({ sponsor, index, seen, t }) {
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
              <span className="text-white text-[12px] uppercase tracking-[0.12em] font-semibold">{t("about.see_more")}</span>
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
                maxHeight: hovered ? "600px" : "0px",
                opacity: hovered ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease 0.08s",
              }}
            >
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#FF4A3E] font-semibold mb-2">{sponsor.subtitle}</p>
              {sponsor.short && <p className="text-gray-600 text-[15px] leading-relaxed mb-3 break-words">{sponsor.short}</p>}
              <span className="inline-flex items-center gap-1.5 text-[#FF4A3E] text-sm font-medium mt-1">
                {t("about.see_more")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          )}
        </div>
      </div>

      {modalOpen && <SponsorModal sponsor={sponsor} onClose={() => setModalOpen(false)} t={t} />}
    </>
  );
}

/* ========== Section 7 — Partenaires (fond beige) ========== */
function SponsorsSection({ t }) {
  const [ref, seen] = useInViewOnce({ threshold: 0.15 });
  const sponsors = getSponsors(t);

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
          {t("about.partners_title_prefix")} <span className="text-[#FF4A3E]">{t("about.partners_title_highlight")}</span>
        </h3>

        {/* Ligne 1 — 3 sponsors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          {sponsors.slice(0, 3).map((s, i) => (
            <SponsorCard key={s.name} sponsor={s} index={i} seen={seen} t={t} />
          ))}
        </div>

        {/* Ligne 2 — 3 sponsors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          {sponsors.slice(3, 6).map((s, i) => (
            <SponsorCard key={s.name} sponsor={s} index={i + 3} seen={seen} t={t} />
          ))}
        </div>

        {/* Ligne 3 — 1 sponsor, centré */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-start-2">
            <SponsorCard sponsor={sponsors[6]} index={6} seen={seen} t={t} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== Chiffres clés 2025 (fond beige) ========== */
function getKeyFigures(t) {
  return [
    { value: 100, suffix: "+", label: t("about.fig_sales"), prefix: "", icon: "sales" },
    { value: 90, suffix: "+", label: t("about.fig_reviews"), prefix: "", link: "https://www.google.com/maps/place/GARY+Real+Estate", linkText: t("about.fig_reviews_link"), icon: "star" },
    { value: 6.6, suffix: "M", label: t("about.fig_views"), prefix: "", decimals: 1, icon: "eye" },
    { value: 40, suffix: "k+", label: t("about.fig_followers"), prefix: "", icon: "followers" },
  ];
}

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

function KeyFigures({ t }) {
  const [sectionRef, seen] = useInViewOnce({ threshold: 0.2 });
  const keyFigures = getKeyFigures(t);

  return (
    <section id="key-figures" ref={sectionRef} className="relative z-10 w-full bg-[#FAF6F0] py-20 md:py-28">
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
          {t("about.figures_title_prefix")} <span className="text-[#FF4A3E]">2025</span>
        </h3>

        {/* Grille de chiffres */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-14 md:gap-y-16 gap-x-8 md:gap-x-12 lg:gap-x-16">
          {keyFigures.map((fig, i) => (
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
function getVL(t) { return { label: t("about.hero_vl_label"), sub: t("about.hero_vl_sub"), desc: t("about.hero_vl_desc"), kw: t("about.hero_vl_keywords").split("|") }; }
function getVR(t) { return { label: t("about.hero_vr_label"), sub: t("about.hero_vr_sub"), desc: t("about.hero_vr_desc"), kw: t("about.hero_vr_keywords").split("|") }; }
function hl(text, kw) { let r = text; kw.forEach(k => { r = r.replace(k, `<span class="text-[#FF4A3E] font-medium">${k}</span>`); }); return r; }

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/* ========== Section 1 — Hero : Ligne Expansion ========== */
/* Logo GARY → trait orange se dessine → s'élargit en tuile glassmorphique → contenu */
function HeroCirclesSection({ t }) {
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
        {/* Vidéo de fond — pause quand hors écran */}
        <video ref={(el) => {
          if (!el) return;
          const obs = new IntersectionObserver(
            ([e]) => { e.isIntersecting ? el.play().catch(() => {}) : el.pause(); },
            { threshold: 0 }
          );
          obs.observe(el);
          el._obs = obs;
        }} autoPlay muted loop playsInline disablePictureInPicture
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
          <span className="text-white text-[11px] uppercase tracking-[0.2em]">{t("about.scroll")}</span>
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
            width: winW < 768 ? "320px" : winW < 1024 ? "440px" : "580px",
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
              <p className="uppercase tracking-[0.25em] text-neutral-500 mb-6 text-[13px] md:text-[15px]" style={{ opacity: phase >= 4 ? 1 : 0, transform: phase >= 4 ? "translateY(0)" : "translateY(8px)", transition: "all 0.5s ease-out" }}><span className="text-[#FF4A3E] font-medium tracking-[0.3em] text-[16px] md:text-[20px]">GARY</span>{t("about.hero_duality")}</p>
              <div className="flex flex-col md:flex-row items-center md:items-stretch">
                <div className="flex-1 text-center px-4 md:px-8" style={{ opacity: phase >= 4 ? 1 : 0, transform: phase >= 4 ? "translateX(0)" : "translateX(-20px)", transition: "all 0.7s ease-out 0.1s" }}>
                  <h3 className="font-serif text-[clamp(1.8rem,5.5vw,3.8rem)] text-neutral-900 leading-[1.08]"><span className="text-[#FF4A3E]">{getVR(t).label}</span><br />{getVR(t).sub}</h3>
                  <p className="mt-4 text-neutral-600 text-[clamp(0.95rem,1.8vw,1.15rem)] leading-relaxed max-w-[360px] mx-auto" dangerouslySetInnerHTML={{ __html: hl(getVR(t).desc, getVR(t).kw) }} />
                </div>
                <div className="hidden md:flex items-center justify-center w-px relative my-2"><div className="w-px bg-neutral-900 origin-bottom" style={{ height: "80%", transform: phase >= 4 ? "scaleY(1)" : "scaleY(0)", transition: `transform 1.2s ${EASE} 0.3s` }} /></div>
                <div className="md:hidden flex justify-center my-6"><div className="bg-neutral-900" style={{ height: "2px", width: phase >= 4 ? "50%" : "0%", transition: `width 1.2s ${EASE} 0.3s` }} /></div>
                <div className="flex-1 text-center px-4 md:px-8" style={{ opacity: phase >= 4 ? 1 : 0, transform: phase >= 4 ? "translateX(0)" : "translateX(20px)", transition: "all 0.7s ease-out 0.2s" }}>
                  <h3 className="font-serif text-[clamp(1.8rem,5.5vw,3.8rem)] text-neutral-900 leading-[1.08]"><span className="text-[#FF4A3E]">{getVL(t).label}</span><br />{getVL(t).sub}</h3>
                  <p className="mt-4 text-neutral-600 text-[clamp(0.95rem,1.8vw,1.15rem)] leading-relaxed max-w-[360px] mx-auto" dangerouslySetInnerHTML={{ __html: hl(getVL(t).desc, getVL(t).kw) }} />
                </div>
              </div>
            </div>
            {/* CTA — Découvrir nos résultats */}
            <div className="pb-6 md:pb-8 flex justify-center" style={{ opacity: phase >= 4 ? 1 : 0, transform: phase >= 4 ? "translateY(0)" : "translateY(10px)", transition: "all 0.6s ease-out 0.4s" }}>
                <span
                  className="cursor-pointer inline-flex flex-col items-center gap-1.5 text-[12px] md:text-[13px] uppercase tracking-[0.15em] text-neutral-600 hover:text-[#FF4A3E] transition-colors duration-300"
                  onClick={() => window.scrollTo({ top: window.innerHeight * 2, behavior: "smooth" })}
                >
                  {t("about.our_identity")}
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
function getDistinguishPoints(t) {
  return [
    { main: t("about.distinguish_1_main"), detail: t("about.distinguish_1_detail"), image: "/img/gary/distingue-01.webp" },
    { main: t("about.distinguish_2_main"), detail: t("about.distinguish_2_detail"), image: "/img/gary/distingue-02.webp" },
    { main: t("about.distinguish_3_main"), detail: null, image: "/img/gary/distingue-03.webp" },
    { main: t("about.distinguish_4_main"), detail: t("about.distinguish_4_detail"), image: "/img/gary/distingue-04.webp" },
    { main: t("about.distinguish_5_main"), detail: t("about.distinguish_5_detail"), image: "/img/gary/distingue-05.webp" },
  ];
}

/* ========== Ce qui nous distingue — Zigzag SVG courbe + images alternées ========== */

/* Image interactive réseaux sociaux (3 zones cliquables avec curseur flottant) */
const SOCIAL_ROWS = [
  { href: "https://www.instagram.com/gary_realestate/", icon: "instagram" },
  { href: "https://www.tiktok.com/@gary_realestate", icon: "tiktok" },
  { href: "https://www.linkedin.com/company/gary-real-estate/", icon: "linkedin" },
];

const SOCIAL_ICONS = {
  instagram: (
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  tiktok: (
    <svg className="w-5 h-5 text-white" viewBox="0 0 48 48" fill="currentColor">
      <path d="M34.14 11a9.94 9.94 0 01-2.46-6.52V3h-7.09v26.54a5.73 5.73 0 01-5.72 5.31 5.73 5.73 0 01-5.73-5.73 5.73 5.73 0 015.73-5.73c.6 0 1.17.1 1.71.27v-7.3a13.07 13.07 0 00-1.71-.12A12.86 12.86 0 006 29.12 12.86 12.86 0 0018.87 42a12.86 12.86 0 0012.86-12.88V14.96A16.5 16.5 0 0042 18.36v-7.1a9.97 9.97 0 01-7.86-.26z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
};

function SocialImageBlock({ imgRef, src }) {
  const containerRef = useRef(null);
  const followerRef = useRef(null);
  const [activeRow, setActiveRow] = useState(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      followerPos.current.x += (mousePos.current.x - followerPos.current.x) * 0.15;
      followerPos.current.y += (mousePos.current.y - followerPos.current.y) * 0.15;
      if (followerRef.current) {
        followerRef.current.style.transform = `translate(${followerPos.current.x}px, ${followerPos.current.y}px) translate(-50%, -50%)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    mousePos.current.x = e.clientX - rect.left;
    mousePos.current.y = e.clientY - rect.top;
  };

  return (
    <div
      ref={containerRef}
      className="overflow-hidden relative cursor-pointer"
      style={{ height: "clamp(280px, 30vw, 440px)" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setActiveRow(null)}
    >
      <img
        ref={imgRef}
        src={src}
        alt=""
        className="w-full h-full object-cover will-change-transform"
        style={{ transform: "scale(1.12)" }}
        loading="lazy"
      />
      {/* 3 zones cliquables */}
      {SOCIAL_ROWS.map((row, i) => (
        <a
          key={row.icon}
          href={row.href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-0 right-0"
          style={{ top: `${(i / 3) * 100}%`, height: "33.333%" }}
          onMouseEnter={() => setActiveRow(i)}
        />
      ))}
      {/* Curseur flottant */}
      <div
        ref={followerRef}
        className="absolute top-0 left-0 pointer-events-none z-10 transition-opacity duration-200"
        style={{ opacity: activeRow !== null ? 1 : 0 }}
      >
        <div className="w-10 h-10 rounded-full bg-[#FF4A3E] flex items-center justify-center shadow-lg">
          {activeRow !== null && SOCIAL_ICONS[SOCIAL_ROWS[activeRow].icon]}
        </div>
      </div>
    </div>
  );
}

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

  const imageBlock = index === 2 ? (
    <SocialImageBlock imgRef={imgRef} src={point.image} />
  ) : (
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

function DistinguishZigzag({ seen, t }) {
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
        {t("about.distinguish_title_prefix")} <span className="text-[#FF4A3E]">{t("about.distinguish_title_highlight")}</span>{t("about.distinguish_title_suffix")}
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

        {getDistinguishPoints(t).map((point, i) => (
          <DistinguishRow key={i} point={point} index={i} isLeft={i % 2 === 0} dotRef={(el) => setDotRef(el, i)} />
        ))}
      </div>

      <p
        ref={conclusionRef}
        className="mt-16 md:mt-20 text-center text-xl md:text-2xl leading-relaxed text-gray-700 font-light max-w-[800px] mx-auto px-6"
        style={{ opacity: conclusionVisible ? 1 : 0, transform: conclusionVisible ? "translateY(0)" : "translateY(15px)", transition: "opacity 0.8s ease-out, transform 0.8s ease-out" }}
      >
        {t("about.distinguish_conclusion_prefix")} <strong className="font-semibold text-[#FF4A3E]">{t("about.distinguish_conclusion_highlight")}</strong>{t("about.distinguish_conclusion_suffix")}
      </p>
    </div>
  );
}

/* ========== Section 2 — Notre identité (fond blanc) ========== */
function IdentitySection({ t }) {
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
          {t("about.identity_title_prefix")} <span className="text-[#FF4A3E]">{t("about.identity_title_highlight")}</span>
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
          <strong className="font-semibold text-[#FF4A3E]">GARY</strong> {t("about.identity_text_1")}
        </p>
        <p
          className="relative z-10 mt-4 text-xl md:text-2xl leading-relaxed text-gray-700 font-light"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(15px)",
            transition: "opacity 0.8s ease-out 0.35s, transform 0.8s ease-out 0.35s",
          }}
        >
          {t("about.identity_text_2_prefix")} <strong className="font-semibold text-[#FF4A3E]">{t("about.identity_text_2_highlight")}</strong>{t("about.identity_text_2_suffix")}
        </p>
      </div>

      {/* Flèche "Découvrir nos résultats" → scrolle vers les chiffres */}
      <div className="flex justify-center pt-12 pb-4">
        <span
          className="cursor-pointer inline-flex flex-col items-center gap-1.5 text-[12px] md:text-[13px] uppercase tracking-[0.15em] text-neutral-600 hover:text-[#FF4A3E] transition-colors duration-300"
          onClick={() => {
            const el = document.getElementById("key-figures");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {t("about.discover_results")}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"
            style={{ animation: "heroScrollBounce 2s ease-in-out infinite" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
    </section>
  );
}

/* ========== Section 2b — Ce qui nous distingue (fond blanc) ========== */
function DistinguishSection({ t }) {
  const [ref, seen] = useInViewOnce({ threshold: 0.05 });
  return (
    <section ref={ref} className="relative z-10 bg-white py-16 md:py-24">
      <DistinguishZigzag seen={seen} t={t} />
    </section>
  );
}

/* ========== Section 5 — Influenceurs immobilier suisse ========== */

function InfluencersSection({ t }) {
  const [ref, seen] = useInViewOnce({ threshold: 0.2 });

  return (
    <section ref={ref} className="relative z-10 bg-white py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Titre de section */}
        <div
          className="mb-10 md:mb-14"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          <div
            className="h-[2px] bg-[#FF4A3E] mb-6 mx-auto"
            style={{
              width: seen ? "60px" : "0px",
              transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
          <h3 className="font-serif text-3xl md:text-5xl tracking-wide text-gray-900 mb-4 leading-tight text-center">
            {t("about.influencers_title_prefix")} <span className="text-[#FF4A3E]">{t("about.influencers_title_highlight")}</span> {t("about.influencers_title_suffix")}
          </h3>
          <p className="text-lg md:text-xl leading-relaxed text-gray-600 font-light max-w-[600px] text-center mx-auto">
            {t("about.influencers_subtitle")}
          </p>
        </div>

        {/* Images Instagram + TikTok côte à côte */}
        <div
          className="grid grid-cols-2 gap-3 md:gap-5 max-w-[900px] mx-auto"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease-out 0.15s, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.15s",
          }}
        >
          {/* Instagram */}
          <a
            href="https://www.instagram.com/gary_realestate/"
            target="_blank"
            rel="noopener noreferrer"
            className="group/insta relative block overflow-hidden"
          >
            <img src="/img/gary/influenceurs-instagram.webp" alt="GARY Instagram" className="w-full h-auto object-cover" loading="lazy" />
            <style>{`
              @keyframes social-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
              }
              .social-btn { position: relative; overflow: hidden; }
              .social-btn::before {
                content: "";
                position: absolute;
                inset: -10%;
                background: #FF4A3E;
                border-radius: 9999px;
                transform: scale(0);
                transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
              }
              .social-btn:hover::before {
                transform: scale(1.2);
              }
              .social-btn svg { position: relative; z-index: 1; }
            `}</style>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="social-btn w-16 h-16 md:w-20 md:h-20 rounded-full bg-black flex items-center justify-center opacity-0 group-hover/insta:opacity-100 transition-opacity duration-300 pointer-events-auto cursor-pointer" style={{ animation: 'social-pulse 1.8s ease-in-out infinite' }}>
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </div>
            </div>
          </a>

          {/* TikTok */}
          <a
            href="https://www.tiktok.com/@gary_realestate"
            target="_blank"
            rel="noopener noreferrer"
            className="group/tiktok relative block overflow-hidden"
          >
            <img src="/img/gary/influenceurs-tiktok.webp" alt="GARY TikTok" className="w-full h-auto object-cover" loading="lazy" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="social-btn w-16 h-16 md:w-20 md:h-20 rounded-full bg-black flex items-center justify-center opacity-0 group-hover/tiktok:opacity-100 transition-opacity duration-300 pointer-events-auto cursor-pointer" style={{ animation: 'social-pulse 1.8s ease-in-out infinite' }}>
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" viewBox="0 0 48 48" fill="currentColor">
                  <path d="M34.14 11a9.94 9.94 0 01-2.46-6.52V3h-7.09v26.54a5.73 5.73 0 01-5.72 5.31 5.73 5.73 0 01-5.73-5.73 5.73 5.73 0 015.73-5.73c.6 0 1.17.1 1.71.27v-7.3a13.07 13.07 0 00-1.71-.12A12.86 12.86 0 006 29.12 12.86 12.86 0 0018.87 42a12.86 12.86 0 0012.86-12.88V14.96A16.5 16.5 0 0042 18.36v-7.1a9.97 9.97 0 01-7.86-.26z" />
                </svg>
              </div>
            </div>
          </a>
        </div>

        {/* Boutons sous chaque image */}
        <div
          className="grid grid-cols-2 gap-3 md:gap-5 max-w-[900px] mx-auto mt-6"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.6s ease-out 0.4s, transform 0.6s ease-out 0.4s",
          }}
        >
          <a
            href="https://www.instagram.com/gary_realestate/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.12em] text-[#FF4A3E] hover:text-[#E43E33] font-medium transition-colors"
          >
            {t("about.see_all_instagram")}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="https://www.tiktok.com/@gary_realestate"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.12em] text-[#FF4A3E] hover:text-[#E43E33] font-medium transition-colors"
          >
            {t("about.see_all_tiktok", "Voir tout sur TikTok")}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ========== Section 8 — CTA Final (vidéo plein écran au scroll) ========== */
function CTASection({ t, link }) {
  const wrapperRef = useRef(null);
  const overlayRef = useRef(null);
  const videoBoxRef = useRef(null);
  const videoRef = useRef(null);
  const contentRef = useRef(null);
  const [seen, setSeen] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    let rafId = 0;

    const update = () => {
      const rect = wrapper.getBoundingClientRect();
      const winH = window.innerHeight;
      const scrollable = rect.height - winH;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));

      if (rect.top < winH * 0.7) setSeen(true);

      if (overlayRef.current) {
        overlayRef.current.style.opacity = String(0.7 - progress * 0.45);
      }
      if (videoBoxRef.current) {
        const margin = (1 - progress) * 3;
        videoBoxRef.current.style.margin = `${margin}%`;
      }
      if (progress >= 0.95 && videoRef.current && videoRef.current.paused) {
        videoRef.current.play();
        setVideoReady(true);
      }
      if (contentRef.current) {
        contentRef.current.style.opacity = String(0.3 + progress * 0.7);
      }
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative z-10" style={{ height: "200vh" }}>
      <section className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#FAF6F0]">
        {/* Image fixe pendant le scale, vidéo lancée une fois plein écran */}
        <div ref={videoBoxRef} className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          <img
            src="/media/buy/hero24.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: videoReady ? 0 : 1, transition: "opacity 0.6s ease" }}
          />
          <video ref={videoRef} muted loop playsInline disablePictureInPicture preload="auto"
            controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: videoReady ? 1 : 0, transition: "opacity 0.6s ease" }}
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
            {t("about.cta_title")} <br className="hidden md:block" />
            <span className="text-[#FF4A3E]">{t("about.cta_title_highlight")}</span>
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
              to={link("contact")}
              label={t("about.cta_contact")}
              Icon={PhoneIcon}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ========== Carte équipe avec hover ========== */
function TeamCard({ name, role, role_en, photo, quote, quote_en, slug, t, link, lang }) {
  const displayRole = lang === "en" && role_en ? role_en : role;
  const displayQuote = lang === "en" && quote_en ? quote_en : quote;
  const startX = useRef(0);

  const handleClick = (e) => {
    if (Math.abs(e.clientX - startX.current) > 5) e.preventDefault();
  };

  return (
    <Link
      to={link("team", { slug })}
      className="group relative overflow-hidden shrink-0 w-[44vw] md:w-[420px] h-[36vh] md:h-[520px] border border-white/30 block"
      draggable={false}
      onMouseDown={(e) => { startX.current = e.clientX; }}
      onClick={handleClick}
    >
      <img
        src={photo}
        alt={`${name} — ${displayRole}`}
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
        <p className="text-white/60 text-[9px] md:text-sm uppercase tracking-[0.2em] mb-0.5 md:mb-1">{displayRole}</p>
        <p className="text-white text-base md:text-3xl font-serif tracking-wide">{name}</p>

        {/* Citation — apparaît au hover */}
        <div className="overflow-hidden max-md:max-h-0 max-h-0 group-hover:max-h-40 transition-all duration-500 ease-out">
          <p className="text-white/80 text-sm md:text-base italic leading-relaxed mt-4">
            &ldquo;{displayQuote}&rdquo;
          </p>
          <span
            className="inline-block mt-4 px-5 py-2 text-sm uppercase tracking-[0.15em] text-white border border-white/50
                       hover:bg-white hover:text-[#FF4A3E] transition-all duration-300"
          >
            {t("about.discover")}
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

function TeamMemberZone({ member, dotX, dotY, zoneX, zoneY, zoneW, zoneH, index, t, link }) {
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
      onClick={() => navigate(link("team", { slug: member.slug }))}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") navigate(link("team", { slug: member.slug })); }}
      aria-label={t("about.aria_view_profile", { name: member.name })}
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
              transition: hovered
                ? "opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s"
                : "opacity 0.05s ease, transform 0.05s ease",
            }}
          >
            {t("about.see")} →
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
            transition: hovered
              ? "max-width 1.2s cubic-bezier(0.22, 1, 0.36, 1), padding 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease"
              : "max-width 0.3s ease, padding 0.3s ease, opacity 0.2s ease",
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
      <TeamPhotoInteractive />
    </section>
  );
}

/* ========== PAGE ABOUT ========== */
export default function About() {
  const { t, lang, link } = useLocale();
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const setWidthRef = useRef(0);
  const offsetRef = useRef(0);
  const lastFrameTime = useRef(0);
  const isDragging = useRef(false);
  const dragLastX = useRef(0);
  const [teamSeen, setTeamSeen] = useState(false);
  const teamSectionRef = useRef(null);

  // scroll to top géré par ScrollToTop.jsx

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
      <HeroCirclesSection t={t} />

      {/* ====== CONTENU POST-HERO (z-10 passe au-dessus du sticky) ====== */}
      <div className="relative" style={{ zIndex: 10 }}>

        {/* ====== SECTION 2 — Notre identité (fond blanc) ====== */}
        <IdentitySection t={t} />

        {/* ====== SECTION 3 — Chiffres clés 2025 (fond beige) — avant "ce qui nous distingue" ====== */}
        <KeyFigures t={t} />

        {/* ====== SECTION 2b — Ce qui nous distingue (fond blanc) ====== */}
        <DistinguishSection t={t} />

        {/* ====== Photo d'équipe — bandeau pleine largeur avec points interactifs ====== */}
        <TeamPhotoSection />

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
            {t("about.team_title_prefix")} <span className="text-[#FF4A3E]">{t("about.team_title_highlight")}</span>
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
                  <TeamCard {...m} t={t} link={link} lang={lang} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== SECTION 5 — Influenceurs (fond beige) ====== */}
        <InfluencersSection t={t} />

        {/* ====== SECTION 6 — Avis Google (fond blanc) ====== */}
        <GoogleReviews />

        {/* ====== SECTION 7 — Partenaires (fond beige) ====== */}
        <SponsorsSection t={t} />

        {/* ====== SECTION 8 — CTA final (fond sombre) ====== */}
        <CTASection t={t} link={link} />
      </div>
    </div>
  );
}
