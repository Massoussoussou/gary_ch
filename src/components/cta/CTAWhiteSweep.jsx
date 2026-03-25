// src/components/CTAWhiteSweep.jsx
import { useNavigate } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale.js";

export default function CTAWhiteSweep({
  to = "/acheter",
  onClick,
  label,
  Icon, // optionnel
  minWidth = 260,
  className = "",
}) {
  const { t } = useLocale();
  const nav = useNavigate();
  const resolvedLabel = label ?? t("cta.see_properties");
  const handleClick = () =>
    typeof onClick === "function" ? onClick() : nav(to);

  return (
    <button
      onClick={handleClick}
      className={[
        "cta-white-sweep relative inline-flex items-center justify-center",
        "px-[clamp(28px,4.4vw,56px)] py-[clamp(16px,2.4vw,22px)]",

        `min-w-[${minWidth}px]`,
        // plus de border, juste un bloc blanc
        "rounded-none overflow-hidden",
        "bg-white text-black",
        "select-none",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/25",
        "active:translate-y-px",
        className,
      ].join(" ")}
    >
      {/* Calque de remplissage orange */}
      <span
        aria-hidden
        className="absolute inset-0 pointer-events-none cta-white-sweep__fill"
      />

      {/* Contenu (texte + icône éventuelle) */}
      <span className="relative z-[1] inline-flex items-center gap-2 cta-white-sweep__content">
        {/* plus gros et plus gras, comme le CTA principal */}
        <span className="tracking-wide text-[clamp(1.15rem,2.05vw,1.55rem)]">
          {resolvedLabel}
        </span>
        {Icon && (
          <Icon
            className="w-4 h-4 md:w-5 md:h-5"
            style={{ color: "currentColor" }}
          />
        )}
      </span>

      <style>{`
        .cta-white-sweep {
          --gary-orange: #FF4A3E;
          --ease-sweep: cubic-bezier(.25,.85,.15,1); /* rapide au début, ralenti à la fin */
        }

        /* Calque orange qui monte du bas vers le haut */
        .cta-white-sweep__fill {
          /* on déborde légèrement pour couvrir bien tout le bas */
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

        /* Contenu noir par défaut */
        .cta-white-sweep__content {
          color: #111111;
          transition: color 420ms var(--ease-sweep);
        }

        /* HOVER / FOCUS : remplissage orange + texte blanc */
        .cta-white-sweep:hover .cta-white-sweep__fill,
        .cta-white-sweep:focus-visible .cta-white-sweep__fill {
          transform: scaleY(1);
        }

        .cta-white-sweep:hover .cta-white-sweep__content,
        .cta-white-sweep:focus-visible .cta-white-sweep__content {
          color: #FFFFFF;
        }

        @media (prefers-reduced-motion: reduce) {
          .cta-white-sweep__fill,
          .cta-white-sweep__content {
            transition: none !important;
          }
        }
      `}</style>
    </button>
  );
}
