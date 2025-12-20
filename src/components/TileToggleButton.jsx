// src/components/TileToggleButton.jsx

export default function TileToggleButton({
  isTileVisible = true,
  onToggle,
  className = "",
  minWidth = 170, // bouton plus petit
}) {
  const label = isTileVisible ? "Cacher la tuile" : "Afficher la tuile";
  const isActive = !isTileVisible; // actif = tuile cachée

  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        "tile-toggle-cta inline-flex items-center justify-center",
        `min-w-[${minWidth}px]`,
        "px-[clamp(18px,2.6vw,26px)] py-[clamp(8px,1.6vw,12px)]",
        "rounded-full overflow-hidden",
        "bg-white",
        "select-none",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/25",
        "active:translate-y-px",
        isActive ? "tile-toggle-cta--active" : "",
        className,
      ].join(" ")}
    >
      {/* Calque de remplissage orange (animation type CTAWhiteSweep) */}
      <span
        aria-hidden
        className="absolute inset-0 pointer-events-none tile-toggle-cta__fill"
      />

      {/* Contenu (texte) */}
      <span className="relative z-[1] inline-flex items-center gap-2 tile-toggle-cta__content">
        <span className="tracking-wide text-[clamp(0.95rem,1.7vw,1.25rem)] font-medium">
          {label}
        </span>
      </span>

      <style>{`
        .tile-toggle-cta {
          --gary-orange: #FF4A3E;
          --ease-sweep: cubic-bezier(.25,.85,.15,1);
        }

        /* Calque orange qui balaie du bas vers le haut */
        .tile-toggle-cta__fill {
          position: absolute;
          inset: -1px;
          background: var(--gary-orange);
          transform-origin: bottom center;
          transform: scaleY(0);
          transition:
            transform 420ms var(--ease-sweep),
            opacity 420ms var(--ease-sweep);
          opacity: 1;
        }

        /* Texte noir par défaut */
        .tile-toggle-cta__content {
          color: #111111;
          transition: color 420ms var(--ease-sweep);
        }

        /* ÉTAT ACTIF (tuile cachée) : toujours rempli orange + texte blanc */
        .tile-toggle-cta--active .tile-toggle-cta__fill {
          transform: scaleY(1);
        }

        .tile-toggle-cta--active .tile-toggle-cta__content {
          color: #FFFFFF;
        }

        @media (prefers-reduced-motion: reduce) {
          .tile-toggle-cta__fill,
          .tile-toggle-cta__content {
            transition: none !important;
          }
        }
      `}</style>
    </button>
  );
}
