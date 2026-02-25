import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import articlesData from "../data/actualites.json";
import CTAFuturaGlow from "../components/cta/CTAFuturaGlow.jsx";
import CTAWhiteSweep from "../components/cta/CTAWhiteSweep.jsx";
import { pickVideoSrcSimple } from "../utils/video.js";

/* ========== Données réelles depuis GARY.ch (exclut les articles Presse) ========== */
const articles = articlesData.filter((a) => a.category !== "Presse");

const categoryColors = {
  Article: "bg-neutral-900 text-white",
  Podcast: "bg-[#FF4A3E] text-white",
  Video: "bg-[#1a1a2e] text-white",
  Presse: "bg-[#2563eb] text-white",
};

/* easing premium — identique au reste du site */
const EASE_SMOOTH = [0.22, 1, 0.36, 1];

/* ========== Séparateur animé (lignes qui se dessinent du centre) ========== */
function AnimatedDivider({ label }) {
  return (
    <div className="flex items-center gap-4 mb-12 md:mb-16 overflow-hidden">
      <motion.div
        className="h-px flex-1 bg-neutral-200 origin-right"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE_SMOOTH }}
      />
      <motion.span
        className="text-[12px] uppercase tracking-[0.2em] text-neutral-400 shrink-0"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: EASE_SMOOTH, delay: 0.3 }}
      >
        {label}
      </motion.span>
      <motion.div
        className="h-px flex-1 bg-neutral-200 origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE_SMOOTH }}
      />
    </div>
  );
}

/* ========== Article vedette (premier article) ========== */
function FeaturedCard({ article }) {
  const imgRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ["start end", "end start"],
  });
  /* parallax subtil : l'image se décale de -30px à +30px */
  const imgY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.8, ease: EASE_SMOOTH }}
    >
      <Link
        to={`/actualites/${article.id}`}
        className="group block md:grid md:grid-cols-12 md:gap-10 items-center"
      >
        {/* Image — reveal clip-path + parallax */}
        <motion.div
          ref={imgRef}
          className="relative overflow-hidden aspect-[3/2] md:aspect-[16/10] md:col-span-7"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          whileInView={{ clipPath: "inset(0 0 0% 0)" }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 1, ease: EASE_SMOOTH, delay: 0.15 }}
        >
          <motion.img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-[transform] duration-[1.2s] ease-out group-hover:scale-[1.04] will-change-transform"
            style={{ y: imgY, scale: 1.08 }}
            loading="lazy"
          />

          {/* Overlay hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

          <span
            className={`absolute top-5 left-5 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] font-medium ${
              categoryColors[article.category] || "bg-black/10 text-black"
            }`}
          >
            {article.category}
          </span>
        </motion.div>

        {/* Texte */}
        <motion.div
          className="pt-6 md:pt-0 md:col-span-5"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.7, ease: EASE_SMOOTH, delay: 0.4 }}
        >
          <p className="text-[12px] tracking-[0.15em] uppercase text-neutral-400 mb-4">
            {article.date}
          </p>
          <h2 className="font-serif text-[24px] md:text-[32px] leading-[1.15] text-neutral-900 group-hover:text-[#FF4A3E] transition-colors duration-300">
            {article.title}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-neutral-500 line-clamp-3 md:line-clamp-4">
            {article.description}
          </p>
          <span className="inline-flex items-center gap-2 mt-6 text-[13px] uppercase tracking-[0.15em] text-neutral-900 group-hover:text-[#FF4A3E] transition-colors duration-300">
            Lire l'article
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* ========== Carte article standard ========== */
function ArticleCard({ article, index }) {
  const stagger = (index % 3) * 0.1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6%" }}
      transition={{ duration: 0.7, ease: EASE_SMOOTH, delay: stagger }}
      className="group/card"
    >
      <Link
        to={`/actualites/${article.id}`}
        className="group block transition-transform duration-500 ease-out hover:-translate-y-1"
      >
        {/* Image — reveal clip-path + overlay hover */}
        <motion.div
          className="relative overflow-hidden aspect-[3/2]"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          whileInView={{ clipPath: "inset(0 0 0% 0)" }}
          viewport={{ once: true, margin: "-3%" }}
          transition={{ duration: 0.9, ease: EASE_SMOOTH, delay: stagger + 0.1 }}
        >
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />


          {/* Overlay avec "Lire" */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-500">
            <span className="text-white text-[13px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-2">
              Lire
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>

          <span
            className={`absolute top-4 left-4 px-3 py-1 text-[11px] uppercase tracking-[0.15em] font-medium ${
              categoryColors[article.category] || "bg-black/10 text-black"
            }`}
          >
            {article.category}
          </span>
        </motion.div>

        {/* Texte — minimal */}
        <div className="pt-5 pb-2">
          <p className="text-[12px] tracking-[0.12em] uppercase text-neutral-400 mb-2">
            {article.date}
          </p>
          <h2 className="font-serif text-[18px] md:text-[20px] leading-snug text-neutral-900 line-clamp-2 group-hover:text-[#FF4A3E] transition-colors duration-300">
            {article.title}
          </h2>
        </div>
      </Link>
    </motion.div>
  );
}

/* ========== Hero content avec parallax ========== */
function ActuHeroContent({ scrollToArticles }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      setOffset(window.scrollY * 0.4);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-8 py-14 sm:py-16 md:py-28"
      style={{ transform: `translateY(${offset}px)` }}
    >
      <div className="relative flex justify-center md:justify-start">
        <div className="relative w-full max-w-[92vw] sm:max-w-[min(900px,84vw)] mx-auto md:mx-0">
          <div className="absolute -inset-y-5 -inset-x-4 sm:-inset-y-6 sm:-inset-x-6 md:-inset-y-6 md:-left-6 md:-right-6 bg-white/55 backdrop-blur-sm rounded-none shadow-[0_22px_70px_-45px_rgba(0,0,0,0.45)] md:shadow-none" />

          <div className="relative text-center px-3 sm:px-0 py-5 sm:py-0">
            <p className="text-[12px] md:text-[13px] uppercase tracking-[0.2em] text-neutral-600 mb-3">
              Actualités
            </p>

            <h1 className="font-serif tracking-[-0.03em] leading-[1.05] md:leading-[1] text-[clamp(2.6rem,11vw,4.2rem)] md:text-[clamp(4.2rem,10vw,7.6rem)]">
              Analyses et insights<span className="text-[#FF4A3E]">,</span>
              <br />
              <span className="block">par GARY.</span>
            </h1>

            <p className="mt-5 text-[clamp(1.05rem,2.1vw,1.4rem)] text-neutral-900/90 max-w-[52ch] mx-auto">
              Tendances du marché, conseils d'experts et coulisses de
              l'immobilier à Genève.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <CTAFuturaGlow
                label="Découvrir les articles"
                onClick={scrollToArticles}
                minWidth={260}
              />
              <CTAWhiteSweep to="/contact" label="Contacter GARY" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== Page Actualités ========== */
export default function Actualite() {
  const [ready, setReady] = useState(false);
  const src = useMemo(() => {
    try {
      return pickVideoSrcSimple() || "/media/buy/hero24.mp4";
    } catch {
      return "/media/buy/hero24.mp4";
    }
  }, []);

  const articlesRef = useRef(null);
  const scrollToArticles = () => {
    articlesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const [featured, ...rest] = articles;

  return (
    <main className="min-h-screen text-[#0F1115] overflow-x-clip">
      {/* Vidéo de fond FIXÉE */}
      <div className="fixed inset-0" style={{ zIndex: 0 }}>
        <img
          src="/media/hero-poster.webp"
          alt=""
          width="1920"
          height="1080"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
          fetchpriority="high"
          decoding="async"
        />

        <video
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/hero-poster.webp"
          onLoadedData={() => setReady(true)}
          onCanPlay={() => setReady(true)}
          onError={(e) => console.warn("Video error", e)}
          aria-hidden="true"
        >
          <source
            src={src}
            type={src.endsWith(".webm") ? "video/webm" : "video/mp4"}
          />
          <source
            src={
              src.endsWith(".webm")
                ? src.replace(".webm", ".mp4")
                : src.replace(".mp4", ".webm")
            }
            type={src.endsWith(".webm") ? "video/mp4" : "video/webm"}
          />
        </video>

        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-transparent md:from-white/55 md:via-white/25 md:to-transparent" />
          <div className="absolute inset-0 md:bg-gradient-to-r md:from-white/55 md:via-white/25 md:to-transparent" />
        </div>
      </div>

      {/* ====== 1) HERO — carré opaque avec parallax ====== */}
      <section className="relative min-h-[100svh] flex items-center overflow-x-clip" style={{ zIndex: 1 }}>
        <ActuHeroContent scrollToArticles={scrollToArticles} />
      </section>

      {/* ====== 2) ARTICLE VEDETTE ====== */}
      <section ref={articlesRef} className="relative bg-white pt-20 md:pt-28 pb-16 md:pb-20" style={{ zIndex: 2 }}>
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <AnimatedDivider label="À la une" />
          <FeaturedCard article={featured} />
        </div>
      </section>

      {/* ====== 3) GRILLE D'ARTICLES — fond légèrement teinté ====== */}
      <section className="relative bg-[#FAFAF8] py-20 md:py-28" style={{ zIndex: 2 }}>
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <AnimatedDivider label="Tous les articles" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 md:gap-y-16">
            {rest.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
