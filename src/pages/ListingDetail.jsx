// src/pages/ListingDetail.jsx
import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import useProperties from "../hooks/useProperties.js";
import TileToggleButton from "../components/TileToggleButton.jsx";

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
  const { data, loading, error } = useProperties();
  const item = pickByIdOrSlug(data, id);

  const [isReady, setIsReady] = useState(false);
  const [isTileVisible, setIsTileVisible] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prevImage, setPrevImage] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [tileOffset, setTileOffset] = useState(0);
  const tileRef = useRef(null);

  const TRANSITION_MS = 700;
  const AUTO_ADVANCE_MS = 5000; // durée du tracé avant passage auto à la suivante
  const [autoKey, setAutoKey] = useState(0); // reset l'animation quand on change d'image

  // images du bien (safe même si item est null)
  const images = Array.isArray(item?.images) ? item.images : [];
  const heroIdx = Number.isFinite(item?.heroIdx) ? item.heroIdx : 0;
  const initialIdx =
    images.length > 0
      ? Math.min(Math.max(heroIdx, 0), images.length - 1)
      : 0;

  const totalImages = images.length;
  const heroImg = totalImages > 0 ? images[currentImageIndex] : "";

  // adresse et agent (safe même si item est null)
  const coords = item?.coordsFake || null;
  const address = `${item?.ville || ""}${
    item?.canton ? ", " + item.canton : ""
  }${item?.pays ? ", " + item.pays : ""}`.trim();
  const mapQuery = coords
    ? `${coords.lat},${coords.lng}`
    : address;

  const agent = useMemo(() => {
    if (item?.agentSlug) {
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

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    setCurrentImageIndex(initialIdx);
    setPrevImage(null);
    setIsTransitioning(false);
  }, [id, initialIdx]);

  // Parallax tuile : monte à 40% de la vitesse du scroll
  useEffect(() => {
    const onScroll = () => setTileOffset(window.scrollY * 0.4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handlePrev = () => {
    if (totalImages < 2 || isTransitioning) return;
    setPrevImage(heroImg);
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    setAutoKey((k) => k + 1);
    setTimeout(() => {
      setIsTransitioning(false);
      setPrevImage(null);
    }, TRANSITION_MS);
  };

  const handleNext = useCallback(() => {
    if (totalImages < 2 || isTransitioning) return;
    setPrevImage(heroImg);
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    setAutoKey((k) => k + 1);
    setTimeout(() => {
      setIsTransitioning(false);
      setPrevImage(null);
    }, TRANSITION_MS);
  }, [totalImages, isTransitioning, heroImg]);

  // Aller à une image précise (clic miniature) — pas de délai
  const goToImage = useCallback((idx) => {
    if (idx === currentImageIndex) return;
    setPrevImage(null);
    setIsTransitioning(false);
    setCurrentImageIndex(idx);
    setAutoKey((k) => k + 1);
  }, [currentImageIndex]);

  // Auto-advance : quand le tracé orange finit, passe à la suivante
  useEffect(() => {
    if (totalImages < 2) return;
    const timer = setTimeout(() => {
      handleNext();
    }, AUTO_ADVANCE_MS + TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [currentImageIndex, autoKey, totalImages]);

  // Early returns APRÈS tous les hooks
  if (loading) {
    return (
      <main className="page-bg min-h-screen text-text flex items-center justify-center">
        <p className="text-sm text-neutral-500 animate-pulse">Chargement…</p>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="page-bg min-h-screen text-text flex items-center justify-center">
        <p className="text-sm md:text-base text-neutral-600">
          Annonce introuvable.
        </p>
      </main>
    );
  }


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
        .listing-hero.is-visible .listing-title,
        .listing-spacer.is-visible .listing-title {
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

        /* show/hide smooth de la tuile + miniatures */
        .listing-tile {
          pointer-events: none;
        }
        .listing-tile--visible {
          pointer-events: auto;
        }

        /* Tuile infos */
        .listing-tile > .listing-tile-info {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.3s ease-out, transform 0.3s ease-out;
        }
        .listing-tile--visible > .listing-tile-info {
          opacity: 1;
          transform: translateY(0);
        }

        /* Miniatures : cascade avec délai progressif */
        .listing-tile .listing-thumb {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.25s ease-out, transform 0.25s ease-out;
        }
        .listing-tile--visible .listing-thumb {
          opacity: 1;
          transform: translateY(0);
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
        /* === MINIATURES === */
        .listing-thumbs {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .listing-thumb {
          position: relative;
          width: 110px;
          height: 110px;
          border-radius: 0;
          overflow: hidden;
          cursor: pointer;
          flex-shrink: 0;
          border: 2.5px solid transparent;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.25s ease;
        }
        .listing-thumb:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }

        .listing-thumb--active {
          border-color: #FF4A3E;
        }

        .listing-thumb__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        @media (max-width: 768px) {
          .listing-thumb {
            width: 80px;
            height: 80px;
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
/* Wrapper de la tuile — positionné dans le spacer hero */
.listing-tile-wrapper {
  position: absolute;
  z-index: 40;
  left: clamp(20px, 6vw, 58px);
  bottom: clamp(40px, 6vh, 100px);
}

      `}</style>

      {/* IMAGE HERO FIXÉE — reste en place pendant le scroll */}
      <div className="fixed inset-0" style={{ zIndex: 0 }}>
        <div className={["listing-hero", isReady ? "is-visible" : ""].join(" ")} style={{ position: "absolute", inset: 0 }}>
          {/* Images empilées + wipe */}
          <div className="absolute inset-0 overflow-hidden">
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

          {/* BOUTONS CARROUSEL GAUCHE / DROITE */}
          {totalImages > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="listing-hero__nav-btn absolute z-20 left-4 md:left-6 top-1/2 -translate-y-1/2"
                aria-label="Image précédente"
              >
                <span className="listing-hero__nav-icon listing-hero__nav-icon--prev">‹</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="listing-hero__nav-btn absolute z-20 right-4 md:right-6 top-1/2 -translate-y-1/2"
                aria-label="Image suivante"
              >
                <span className="listing-hero__nav-icon listing-hero__nav-icon--next">›</span>
              </button>
            </>
          )}

          {/* Petit texte + flèche animée "Détails du bien" */}
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

        </div>
      </div>

      {/* SPACER hero — prend la hauteur de l'écran */}
      <section className={`listing-spacer ${isReady ? "is-visible" : ""} relative w-full pointer-events-none`} style={{ zIndex: 1, height: "calc(100vh - var(--header-h, 72px))" }}>
        {/* Tuile + miniatures avec parallax */}
        <div
          ref={tileRef}
          className="listing-tile-wrapper pointer-events-auto"
          style={{ transform: `translateY(${tileOffset}px)` }}
        >
          <div className={[
            "listing-tile flex items-end gap-5",
            isTileVisible ? "listing-tile--visible" : "",
          ].join(" ")}>
            {/* Tuile infos */}
            <div
              className={[
                "listing-tile-info",
                "relative bg-white/65 backdrop-blur-md shadow-[0_18px_40px_rgba(15,23,42,0.35)]",
                "px-8 py-5 md:px-10 md:py-6",
                "max-w-[min(42rem,82vw)]",
              ].join(" ")}
            >
              <p className="text-[13px] md:text-[14px] uppercase tracking-[0.2em] text-neutral-700 mb-2">
                {item.ville}
                {item.canton ? `, ${item.canton}` : ""}
              </p>
              <h1
                className="listing-title proj-serif tracking-[-0.03em] leading-[0.98] text-[clamp(2.3rem,3.8vw,3.2rem)]"
              >
                {item.titre}
              </h1>
            </div>

            {/* Miniatures */}
            {totalImages > 1 && (
              <div className="listing-thumbs hidden md:flex">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToImage(idx)}
                    className={`listing-thumb ${idx === currentImageIndex ? "listing-thumb--active" : ""}`}
                    aria-label={`Photo ${idx + 1}`}
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  >
                    <img
                      src={src}
                      alt={`Miniature ${idx + 1}`}
                      className="listing-thumb__img"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BOUTON CACHER / AFFICHER LA TUILE — même parallax que la tuile */}
        <div
          className="absolute z-30 right-6 md:right-10 bottom-6 md:bottom-8 pointer-events-auto"
          style={{ transform: `translateY(${tileOffset}px)` }}
        >
          <TileToggleButton
            isTileVisible={isTileVisible}
            onToggle={() => setIsTileVisible((v) => !v)}
          />
        </div>
      </section>

      {/* === CONTENU PRINCIPAL — passe par-dessus le hero === */}
      <section className="relative bg-white w-full px-[clamp(20px,6vw,140px)] py-[clamp(60px,12vh,160px)] grid grid-cols-1 lg:grid-cols-2 gap-[clamp(40px,6vw,80px)]" style={{ zIndex: 2 }}>
        {/* DESCRIPTION (à gauche) — rendue en HTML */}
        <div
          className="
            opacity-0 translate-y-[20px]
            animate-[listingFade_0.8s_0.2s_forwards_ease-out]
            text-black
            max-w-[680px]
            leading-[1.6]
            text-[clamp(1rem,1.4vw,1.15rem)]
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2
            [&_li]:mb-1
            [&_b]:font-semibold [&_strong]:font-semibold
            [&_p]:mb-3
          "
          dangerouslySetInnerHTML={{ __html: item.descriptionHtml || item.description || "" }}
        />

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
      <section className="detail-bottom relative bg-white" style={{ zIndex: 2 }}>
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
