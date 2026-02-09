import { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import articlesData from "../data/actualites.json";
import CTAFuturaGlow from "../components/cta/CTAFuturaGlow.jsx";
import CTAWhiteSweep from "../components/cta/CTAWhiteSweep.jsx";
import { useRevealOnce } from "../hooks/useRevealOnce.js";
import { pickVideoSrcSimple } from "../utils/video.js";

/* ========== Données réelles depuis GARY.ch ========== */
const articles = articlesData;

const categoryColors = {
  Article: "bg-black/80 text-white",
  Podcast: "bg-[#FF4A3E] text-white",
  Video: "bg-[#1a1a2e] text-white",
  Presse: "bg-[#2563eb] text-white",
};

/* ========== Composant bandeau article ========== */
function ArticleBand({ article }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/actualites/${article.id}`}
      className="relative w-full overflow-hidden cursor-pointer block"
      style={{ height: "clamp(170px, 24vw, 240px)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Titre + date + catégorie — z-10, en dessous de l'image */}
      <div
        className="absolute top-0 right-0 h-full flex flex-col justify-center px-8 md:px-12"
        style={{ width: "60%", zIndex: 10 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-medium ${
              categoryColors[article.category] || "bg-black/10 text-black"
            }`}
          >
            {article.category}
          </span>
          <span className="text-[13px] text-black/50">{article.date}</span>
        </div>
        <h2 className="text-lg md:text-2xl font-serif leading-snug text-black/90 line-clamp-3">
          {article.title}
        </h2>
      </div>

      {/* Image — z-20, glisse par-dessus le titre au hover */}
      <div
        className="absolute top-0 left-0 h-full will-change-transform"
        style={{
          zIndex: 20,
          width: "40%",
          transition: "left 500ms ease, width 500ms ease",
          left: hovered ? "40%" : "0",
          ...(hovered && { width: "60%" }),
        }}
      >
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Description — zone gauche 40%, z-30 au-dessus de tout, apparaît au hover */}
      <div
        className="absolute top-0 left-0 h-full flex flex-col justify-center px-8 md:px-12"
        style={{
          width: "40%",
          zIndex: 30,
          transition: "opacity 500ms ease, transform 500ms ease",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(-20px)",
          pointerEvents: hovered ? "auto" : "none",
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-medium ${
              categoryColors[article.category] || "bg-black/10 text-black"
            }`}
          >
            {article.category}
          </span>
        </div>
        <h3 className="text-sm md:text-base font-semibold text-black/85 mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-[13px] md:text-sm leading-relaxed text-black/65 line-clamp-4">
          {article.description}
        </p>
      </div>
    </Link>
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

  /* scroll vers la liste d'articles */
  const articlesRef = useRef(null);
  const scrollToArticles = () => {
    articlesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* reveal animations */
  const [listRef, listShown] = useRevealOnce({ threshold: 0.08 });

  return (
    <main className="min-h-screen text-[#0F1115] overflow-x-clip">
      {/* ====== 1) HERO FULL SCREEN ====== */}
      <section className="relative isolate min-h-[100svh] flex items-center overflow-x-clip">
        <div className="absolute inset-0">
          <div className="sticky top-0 h-[100svh] -z-10">
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
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-8 py-14 sm:py-16 md:py-28">
          <div className="relative flex justify-center md:justify-start">
            <div className="relative w-full max-w-[92vw] sm:max-w-[min(900px,84vw)] mx-auto md:mx-0">
              <div className="absolute -inset-y-5 -inset-x-4 sm:-inset-y-6 sm:-inset-x-6 md:-inset-y-6 md:-left-6 md:-right-6 bg-white/55 backdrop-blur-sm rounded-3xl md:rounded-none shadow-[0_22px_70px_-45px_rgba(0,0,0,0.45)] md:shadow-none" />

              <div className="relative text-center px-3 sm:px-0 py-5 sm:py-0">
                <p className="text-[12px] md:text-[13px] uppercase tracking-[0.2em] text-neutral-600 mb-3">
                  Actualités
                </p>

                <h1 className="font-serif tracking-[-0.03em] leading-[0.95] md:leading-[0.9] text-[clamp(2.6rem,11vw,4.2rem)] md:text-[clamp(4.2rem,10vw,7.6rem)]">
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
      </section>

      {/* ====== 2) LISTE DES ARTICLES ====== */}
      <section
        ref={(node) => {
          articlesRef.current = node;
          listRef.current = node;
        }}
        className={`bg-white transition-all duration-[1000ms] ${
          listShown
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
      >
        <div className="border-t border-black/10">
          {articles.map((article, i) => (
            <div key={article.id}>
              <ArticleBand article={article} />
              {i < articles.length - 1 && (
                <div className="border-b border-black/8 mx-6 md:mx-12" />
              )}
            </div>
          ))}
        </div>

        {/* Espacement bas */}
        <div className="h-20" />
      </section>
    </main>
  );
}
