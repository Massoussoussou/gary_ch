import { useState } from "react";

/* ========== Données test ========== */
const articles = [
  {
    id: 1,
    title: "Marché immobilier genevois : tendances et perspectives 2025",
    description:
      "Une analyse approfondie des évolutions du marché résidentiel à Genève, entre hausse des prix et nouvelles réglementations cantonales qui transforment le paysage immobilier lémanique.",
    date: "28 janvier 2025",
    category: "Article",
    image:
      "https://images.unsplash.com/photo-1582407947092-50b8c1eb71b0?w=800&q=80",
  },
  {
    id: 2,
    title: "Podcast — Les secrets d'un investissement locatif réussi",
    description:
      "Dans cet épisode, nos experts partagent leurs conseils pour optimiser la rentabilité d'un bien locatif à Genève, de la sélection du quartier à la gestion quotidienne.",
    date: "15 janvier 2025",
    category: "Podcast",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80",
  },
  {
    id: 3,
    title: "Visite virtuelle : un penthouse d'exception aux Eaux-Vives",
    description:
      "Découvrez en vidéo ce penthouse de 280 m² offrant une vue panoramique sur le lac Léman et le jet d'eau, avec des finitions haut de gamme signées par un architecte d'intérieur renommé.",
    date: "8 janvier 2025",
    category: "Video",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  },
  {
    id: 4,
    title: "Architecture durable : les nouveaux standards à Genève",
    description:
      "Les promoteurs genevois adoptent de nouvelles normes environnementales. Tour d'horizon des matériaux et techniques qui redéfinissent la construction résidentielle dans le canton.",
    date: "22 décembre 2024",
    category: "Article",
    image:
      "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&q=80",
  },
  {
    id: 5,
    title: "Podcast — Fiscalité immobilière : ce qui change en 2025",
    description:
      "Avec notre fiscaliste partenaire, nous décryptons les nouvelles dispositions fiscales impactant les propriétaires et investisseurs immobiliers en Suisse romande.",
    date: "10 décembre 2024",
    category: "Podcast",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
  },
  {
    id: 6,
    title: "Rénovation énergétique : guide pratique pour les propriétaires",
    description:
      "Isolation, pompes à chaleur, panneaux solaires — un guide complet des travaux de rénovation énergétique éligibles aux subventions cantonales et fédérales.",
    date: "28 novembre 2024",
    category: "Article",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
  },
  {
    id: 7,
    title: "Vidéo — Dans les coulisses d'une transaction GARY",
    description:
      "Suivez pas à pas le processus de vente d'une villa à Cologny : de l'estimation initiale à la remise des clés, découvrez l'accompagnement GARY en images.",
    date: "15 novembre 2024",
    category: "Video",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    id: 8,
    title: "Quartiers en vue : Plainpalais, le renouveau culturel",
    description:
      "Longtemps considéré comme un quartier populaire, Plainpalais connaît une transformation majeure. Analyse des prix, des projets urbains et du potentiel d'investissement.",
    date: "2 novembre 2024",
    category: "Article",
    image:
      "https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=800&q=80",
  },
  {
    id: 9,
    title: "Podcast — Home staging : valoriser son bien avant la vente",
    description:
      "Comment mettre en valeur un appartement pour maximiser son prix de vente ? Nos conseils de mise en scène, du désencombrement à la décoration stratégique.",
    date: "20 octobre 2024",
    category: "Podcast",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80",
  },
  {
    id: 10,
    title: "Le marché du luxe à Genève : un segment toujours résilient",
    description:
      "Malgré les incertitudes économiques mondiales, le segment ultra-premium genevois continue d'attirer une clientèle internationale. Décryptage des facteurs de résilience.",
    date: "5 octobre 2024",
    category: "Article",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  },
];

const categoryColors = {
  Article: "bg-black/80 text-white",
  Podcast: "bg-[#FF4A3E] text-white",
  Video: "bg-[#1a1a2e] text-white",
};

/* ========== Composant bandeau article ========== */
function ArticleBand({ article }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="relative w-full overflow-hidden cursor-pointer"
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
    </article>
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
