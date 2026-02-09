import { useState } from "react";
import { Link } from "react-router-dom";
import articlesData from "../data/actualites.json";

/* ========== Données réelles depuis GARY.ch ========== */
const articles = articlesData;

const categoryColors = {
  Article: "bg-black/80 text-white",
  Podcast: "bg-[#FF4A3E] text-white",
  Video: "bg-[#1a1a2e] text-white",
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
  return (
    <section className="min-h-screen bg-white">
      {/* En-tête */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10 md:pt-24 md:pb-14">
        <h1 className="text-4xl md:text-6xl font-serif text-black/90">
          Actualités
        </h1>
        <p className="mt-4 text-base md:text-lg text-black/55 max-w-xl">
          Retrouvez les dernières nouvelles, analyses et contenus de GARY.
        </p>
      </div>

      {/* Liste des bandeaux */}
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
  );
}
