// src/pages/ListingDetail.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import data from "../data/listings.json";
import TileToggleButton from "../components/TileToggleButton.jsx";

// ⬇︎ on ajoute ça
import team from "../data/team.json";
import "../styles/projet.css";


// même logique qu'avant : id OU slug
function pickByIdOrSlug(list, idOrSlug) {
  if (!idOrSlug) return list?.[0];
  return (
    list.find((d) => String(d.id) === String(idOrSlug)) ||
    list.find((d) => String(d.slug) === String(idOrSlug)) ||
    list?.[0]
  );
}

// formatage prix (garde-le, peut servir plus tard)
function fmtPrice(amount, currency = "CHF") {
  if (typeof amount !== "number") return "";
  const withSep = amount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  return `${withSep} ${currency || "CHF"}`;
}

export default function ListingDetail() {
  const { id } = useParams();
  const item = pickByIdOrSlug(data, id);

  const [isReady, setIsReady] = useState(false);
  const [isTileVisible, setIsTileVisible] = useState(true);

  if (!item) {
    return (
      <main className="page-bg min-h-screen text-text flex items-center justify-center">
        <p className="text-sm md:text-base text-neutral-600">
          Annonce introuvable.
        </p>
      </main>
    );
  }

  // images du bien
  const images = Array.isArray(item.images) ? item.images : [];
  const heroIdx = Number.isFinite(item.heroIdx) ? item.heroIdx : 0;
  const initialIdx =
    images.length > 0
      ? Math.min(Math.max(heroIdx, 0), images.length - 1)
      : 0;

  const [currentImageIndex, setCurrentImageIndex] = useState(initialIdx);

    const [prevImage, setPrevImage] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const TRANSITION_MS = 700; // durée de l'anim (ms)


  useEffect(() => {
    setIsReady(true);
  }, []);

 

    useEffect(() => {
    setCurrentImageIndex(initialIdx);
    setPrevImage(null);
    setIsTransitioning(false);
  }, [id, initialIdx]);




  const totalImages = images.length;
  const heroImg = totalImages > 0 ? images[currentImageIndex] : "";



      const handlePrev = () => {
    if (totalImages < 2 || isTransitioning) return;

    // image actuelle = carte du dessus
    setPrevImage(heroImg);
    setIsTransitioning(true);

    // nouvelle image en dessous
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);

    // fin de l'anim
    setTimeout(() => {
      setIsTransitioning(false);
      setPrevImage(null);
    }, TRANSITION_MS);
  };

  const handleNext = () => {
    if (totalImages < 2 || isTransitioning) return;

    setPrevImage(heroImg);
    setIsTransitioning(true);

    setCurrentImageIndex((prev) => (prev + 1) % totalImages);

    setTimeout(() => {
      setIsTransitioning(false);
      setPrevImage(null);
    }, TRANSITION_MS);
  };

  // ⬇︎ AJOUT : adresse et agent comme sur ProjetNeufDetail
  const coords = item.coordsFake || null;

  const address = `${item.ville || ""}${
    item.canton ? ", " + item.canton : ""
  }${item.pays ? ", " + item.pays : ""}`.trim();

  const mapQuery = coords
    ? `${coords.lat},${coords.lng}`
    : address;

  const agent = useMemo(() => {
    if (item.agentSlug) {
      const found = (team || []).find((t) => t.slug === item.agentSlug);
      if (found) return found;
    }
    return (team || [])[0] || {
      name: "Conseiller GARY",
      role: "Conseiller immobilier",
      email: "contact@gary.ch",
      phone: "+41 22 557 07 00",
      photo:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=1000&auto=format&fit=crop",
    };
  }, [item]);


  return (
    <main className="page-bg text-text">
      <style>{`
        .proj-serif {
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
        }

        .listing-hero {
          position: relative;
        }

        /* anim titre façon ProjetNeufDetail */
        .listing-title {
          opacity: 0;
        }
        .listing-hero.is-visible .listing-title {
          animation: reveal-left .9s cubic-bezier(.22, 1, .36, 1) both .12s;
        }

               /* === Effet paquet de cartes fluide sans barre === */
        .listing-hero__image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform-origin: center center;
          will-change: transform, opacity, clip-path;
          transition: none;
        }

        .listing-hero__image--in {
          z-index: 1;
        }

        .listing-hero__image--out {
          z-index: 2;
        }

        /* Pas d'anim si on ne change pas */
        .listing-hero__image--in:not(.is-animating),
        .listing-hero__image--out:not(.is-animating) {
          opacity: 1;
          transform: scale(1);
          clip-path: inset(0 0 0 0);
        }

        /* === Animation : l’ancienne image glisse/disparaît de droite vers gauche === */
        .listing-hero__image--out.is-animating {
          animation: cardSlideOut 0.7s cubic-bezier(.22,.61,.36,1) forwards;
        }

        /* === La nouvelle image apparaît dans le même mouvement (de droite à gauche) === */
        .listing-hero__image--in.is-animating {
          animation: cardSlideIn 0.7s cubic-bezier(.22,.61,.36,1) forwards;
        }

        @keyframes cardSlideOut {
          0% {
            opacity: 1;
            transform: scale(1);
            clip-path: inset(0 0 0 0);
          }
          40% {
            transform: scale(1.02);
          }
          100% {
            opacity: 0;
            transform: scale(1.03);
            clip-path: inset(0 100% 0 0); /* efface progressivement de droite à gauche */
          }
        }

        @keyframes cardSlideIn {
          0% {
            opacity: 0;
            transform: scale(1.03);
            clip-path: inset(0 0 0 100%); /* apparait de droite à gauche */
          }
          60% {
            opacity: 1;
            transform: scale(1.01);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            clip-path: inset(0 0 0 0);
          }
        }


        
        @keyframes reveal-left {
          0% {
            clip-path: inset(-0.22em 100% -0.22em 0);
            opacity: 0;
            transform: translateX(-0.6em);
          }
          70% {
            opacity: 1;
          }
          100% {
            clip-path: inset(-0.22em 0 -0.22em 0);
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* show/hide smooth de la tuile */
        .listing-tile {
          opacity: 0;
          transform: translateY(10px);
          pointer-events: none;
          transition:
            opacity 0.35s ease-out,
            transform 0.35s ease-out;
        }
        .listing-tile--visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .listing-hero__nav-btn {
          width: 80px;
          height: 80px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.85);
          background: radial-gradient(circle at center, rgba(15,23,42,0.88), rgba(15,23,42,0.25));
          color: #ffffff;
          font-size: 32px;
          line-height: 0; /* IMPORTANT pour virer la marge du texte */
          backdrop-filter: blur(10px);
          box-shadow: 0 14px 34px rgba(15,23,42,0.5);
          transition:
            background-color 0.18s ease-out,
            box-shadow 0.18s ease-out,
            border-color 0.18s ease-out,
            opacity 0.18s ease-out;
        }

        /* Icône de flèche à l'intérieur du bouton */
        .listing-hero__nav-icon {
          display: inline-block;
          line-height: 1;
        }

        /* Décalages MANUELS (à ajuster à l’œil) */
        .listing-hero__nav-icon--prev {
          transform: translate(-0.5px, -1px);   /* vers la droite + un poil vers le bas */
        }

        .listing-hero__nav-icon--next {
          transform: translate(-0.5px, -1px);  /* vers la gauche + un poil vers le bas */
        }


        .listing-hero__nav-btn:hover {
          background: #FF4A3E;
          border-color: #FF4A3E;
          box-shadow: 0 18px 42px rgba(0,0,0,0.6);
        }
        .listing-hero__nav-btn:active {
          box-shadow: 0 10px 26px rgba(0,0,0,0.45);
        }
        .listing-hero__nav-btn[disabled] {
          opacity: 0.3;
          cursor: default;
          box-shadow: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .listing-tile,
          .listing-hero__nav-btn {
            transition: none !important;
          }
        }
                /* petite anim de flèche vers le bas (comme About) */
      @keyframes nudge {
        0%   { transform: translateY(0);    opacity: 0.9; }
        50%  { transform: translateY(9px);  opacity: 1; }
        100% { transform: translateY(0);    opacity: 0.9; }
      }
@keyframes listingFade {
  0% {
    opacity: 0;
    transform: translateY(24px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Wrapper de la tuile (positionnement différent Mac / grand écran) */
.listing-tile-wrapper {
  position: absolute;
  z-index: 40; /* au-dessus du carrousel, au cas où */
  left: clamp(-18px, 6vw, 58px);

  /* Par défaut : valeur adaptée aux écrans plus petits (ex : Mac) */
  top: clamp(530px, 36vh, 720px);
  /* tu pourras jouer sur 420px / 26vh pour la remonter / descendre */
}

/* Très grands écrans (ton gros écran PC) : on retrouve l’ancienne position */
@media (min-width: 1700px) {
  .listing-tile-wrapper {
    top: clamp(650px, 22vh, 1450px);
  }
}

      `}</style>

      

      {/* HERO PLEIN ÉCRAN (carrousel) */}
      <section
        className={[
          "listing-hero",
          isReady ? "is-visible" : "",
          "relative w-full h-[calc(100vh-var(--header-h,72px))]",
        ].join(" ")}
      >

        <Link
  to="/acheter/catalogue"
  className="close-back-btn"
  aria-label="Revenir à la page Listings"
  title="Revenir aux annonces"
>
  <svg className="close-back-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M6 6 L18 18 M18 6 L6 18"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
</Link>

               {/* Images empilées + wipe vertical */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Image en dessous (nouvelle carte) */}
          {heroImg && (
            <img
              key={heroImg}
              src={heroImg}
              alt={item.titre}
              className={[
                "listing-hero__image",
                "listing-hero__image--in",
                isTransitioning ? "is-animating" : "",
              ].join(" ")}
              loading="eager"
            />
          )}

          {/* Image du dessus (ancienne carte) */}
          {prevImage && (
            <img
              src={prevImage}
              alt={item.titre}
              className={[
                "listing-hero__image",
                "listing-hero__image--out",
                isTransitioning ? "is-animating" : "",
              ].join(" ")}
            />
          )}



          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>

  
        <div className="listing-tile-wrapper">


          <div
            className={[
              "listing-tile",
              isTileVisible ? "listing-tile--visible" : "",
              "relative bg-white/65 backdrop-blur-md shadow-[0_18px_40px_rgba(15,23,42,0.35)]",
              "px-8 py-5 md:px-10 md:py-6",
              "max-w-[min(42rem,82vw)]",
            ].join(" ")}
          >
            {/* localisation (on la garde) */}
            <p className="text-[13px] md:text-[14px] uppercase tracking-[0.2em] text-neutral-700 mb-2">
              {item.ville}
              {item.canton ? `, ${item.canton}` : ""}
            </p>

            {/* titre animé */}
            <h1
              className="
                listing-title proj-serif
                tracking-[-0.03em]
                leading-[0.98]
                text-[clamp(2.3rem,3.8vw,3.2rem)]
              "
            >
              {item.titre}
            </h1>
          </div>
        </div>

        {/* BOUTONS CARROUSEL GAUCHE / DROITE */}
        {totalImages > 1 && (
          <>
            {/* gauche */}
<button
  type="button"
  onClick={handlePrev}
  className="
    listing-hero__nav-btn
    absolute z-20
    left-4 md:left-6
    top-1/2 -translate-y-1/2
  "
  aria-label="Image précédente"
>
  <span className="listing-hero__nav-icon listing-hero__nav-icon--prev">
    ‹
  </span>
</button>

{/* droite */}
<button
  type="button"
  onClick={handleNext}
  className="
    listing-hero__nav-btn
    absolute z-20
    right-4 md:right-6
    top-1/2 -translate-y-1/2
  "
  aria-label="Image suivante"
>
  <span className="listing-hero__nav-icon listing-hero__nav-icon--next">
    ›
  </span>
</button>

          </>
        )}
                {/* Petit texte + flèche animée "Détails du bien" au centre bas */}
        <div className="absolute inset-x-0 bottom-10 flex flex-col items-center justify-center pointer-events-none">
          <span className="mb-2 text-[11px] md:text-[12px] uppercase tracking-[0.25em] text-white/80">
            Détails du bien
          </span>

          <svg
            viewBox="0 0 64 36"
            width="76"
            height="44"
            className="md:w-[88px] md:h-[50px] animate-[nudge_1.8s_ease-in-out_infinite]"
            style={{ filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.6))" }}
            aria-hidden="true"
          >
            <path
              d="M16 12 L32 28 L48 12"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>


        {/* BOUTON CACHER / AFFICHER LA TUILE — EN BAS À DROITE DU HERO */}
        <TileToggleButton
          isTileVisible={isTileVisible}
          onToggle={() => setIsTileVisible((v) => !v)}
          className="absolute z-30 right-6 md:right-10 bottom-6 md:bottom-8"
        />
      </section>


      {/* === CONTENU PRINCIPAL : DESCRIPTION + SPECS === */}
      <section className="relative w-full px-[clamp(20px,6vw,140px)] py-[clamp(60px,12vh,160px)] grid grid-cols-1 lg:grid-cols-2 gap-[clamp(40px,6vw,80px)]">
        {/* DESCRIPTION (à gauche) */}
        <div
          className="
            opacity-0 translate-y-[20px]
            animate-[listingFade_0.8s_0.2s_forwards_ease-out]
            text-black
            max-w-[680px]
            leading-[1.6]
            text-[clamp(1rem,1.4vw,1.15rem)]
          "
        >
          {item.description}
        </div>

        {/* SPECS (à droite) */}
        <div
          className="
            opacity-0 translate-y-[20px]
            animate-[listingFade_0.8s_0.35s_forwards_ease-out]
            flex flex-col gap-3
            text-black
            text-[clamp(0.9rem,1.3vw,1.1rem)]
          "
        >
          <div>
            <strong>Localisation :</strong>{" "}
            {item.ville}
            {item.canton ? `, ${item.canton}` : ""}
            {item.pays ? `, ${item.pays}` : ""}
          </div>

          {item.type && (
            <div>
              <strong>Type :</strong> {item.type}
            </div>
          )}

          {item.surface_m2 != null && (
            <div>
              <strong>Surface :</strong> {item.surface_m2} m²
            </div>
          )}

          {item.pieces != null && (
            <div>
              <strong>Pièces :</strong> {item.pieces}
            </div>
          )}

          {item.chambres != null && (
            <div>
              <strong>Chambres :</strong> {item.chambres}
            </div>
          )}

          {item.sdb != null && (
            <div>
              <strong>Salles de bain :</strong> {item.sdb}
            </div>
          )}

          {item.prix != null && (
            <div>
              <strong>Prix :</strong> {fmtPrice(item.prix, item.devise)}
            </div>
          )}
        </div>
      </section>

            {/* ======= BAS DE PAGE : CARTE (gauche) + AGENT (droite) ======= */}
      <section className="detail-bottom">
        <div className="detail-bottom__map">
          <div className="detail-map__inner">
            {address && (
              <div className="map-address">
                <span className="map-address-icon" aria-hidden>
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M12 2a7 7 0 0 0-7 7c0 4.1 5.1 9.3 6.5 10.7a1 1 0 0 0 1.4 0C13.9 18.3 19 13.1 19 9a7 7 0 0 0-7-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span className="map-address-text">{address}</span>
              </div>
            )}

            <iframe
              title={`Carte - ${item.titre || "Adresse"}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                mapQuery || ""
              )}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <aside className="detail-bottom__agent">
          <div className="agent-card enhanced">
            <div className="agent-media">
              <img src={agent.photo} alt={agent.name} loading="lazy" />
            </div>

            <div className="agent-info">
              <div className="agent-top">
                <h3 className="agent-name">{agent.name}</h3>
                {agent.role && <div className="agent-role">{agent.role}</div>}
              </div>

              {agent.quote && (
                <div className="agent-quote">“{agent.quote}”</div>
              )}

              <div className="agent-contacts">
                {agent.phone && (
                  <a className="agent-chip" href={`tel:${agent.phone}`}>
                    {agent.phone}
                  </a>
                )}
                {agent.email && (
                  <a className="agent-chip" href={`mailto:${agent.email}`}>
                    {agent.email}
                  </a>
                )}
              </div>

              <div className="agent-actions">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/contact";
                  }}
                  className="group inline-flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 rounded-xl text-[15px] text-white shadow-lg transition hover:shadow-xl"
                  style={{ backgroundColor: "#FF4A3E" }}
                >
                  Contacter
                  <span
                    aria-hidden
                    className="inline-block translate-x-0 transition-transform duration-200 ease-out group-hover:translate-x-1"
                  >
                    →
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Logo GARY sous la fiche vendeur */}
          <div className="detail-agent-logo">
            <img
              src="/Logo/logo-gary-orange.png"
              alt="Logo GARY"
              loading="lazy"
            />
          </div>
        </aside>
      </section>





    </main>
  );
}
