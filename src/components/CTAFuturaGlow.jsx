// src/components/CTAFuturaGlow.jsx
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
/**
 * CTA ORANGE — "Logo Rise & Split"
 *
 * Effet:
 * - Au hover: le texte monte et s’efface (d’un trait).
 * - Le logo GARY vient du bas, puis se coupe en 2 (GA | RY).
 * - Une icône blanche apparaît au centre.
 * - Au mouseleave: icône descend, GA|RY se referment, logo descend, texte revient.
 */
export default function CTAFuturaGlow({
  to = "/acheter",
  onClick,
  label = "Acheter",
  Icon = HouseIcon,
  garyLogoSrc = "/Logo/logo-gary.png",

  // Offsets & tailles par défaut
  iconOffsetX = "7px",
  iconOffsetY = "-3px",
  iconSizeEm = 4.2,
  logoOffsetY = "-0.3%",
  splitDist = "22%",
  clipLeftRight = "49.8%", // GA
  clipRightLeft = "50.6%", // RY

  timings = {
    label: 520,
    logoIn: 480,
    split: 420,
    icon: 300,
    delayLogo: 120,
    delaySplit: 420,
    delayIcon: 520,
  },

  minWidth = 260,
  className = "",
  textSize = "text-[clamp(1.15rem,2.05vw,1.55rem)] font-semibold tracking-wide",
}) {
  const nav = useNavigate();
  const handleClick = () =>
    typeof onClick === "function" ? onClick() : nav(to);

  const {
    label: LABEL_DUR,
    logoIn: LOGO_IN_DUR,
    split: SPLIT_DUR,
    icon: ICON_DUR,
    delayLogo: DELAY_LOGO,
    delaySplit: DELAY_SPLIT,
    delayIcon: DELAY_ICON,
  } = timings;

  // États pour animer
  const [isActive, setIsActive] = useState(false); // remplace :hover
  const [isLeaving, setIsLeaving] = useState(false);
  const leaveTimerRef = useRef(null);

  // Reverse timings
  const R_DELAY_ICON = 0;
  const R_DELAY_SPLIT = 80;
  const R_DELAY_LOGO = R_DELAY_SPLIT + SPLIT_DUR - 120
  const R_DELAY_LABEL = R_DELAY_LOGO + 120
  const REVERSE_TOTAL = R_DELAY_LABEL + LABEL_DUR + 160;

  const clearLeaveTimer = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  const onEnter = () => {
    clearLeaveTimer();
    setIsLeaving(false);
    setIsActive(true); // équivalent "hover"
  };

  const onLeave = () => {
    setIsActive(false);   // on coupe l’anim "hover"
    setIsLeaving(true);   // on lance le reverse
    clearLeaveTimer();
    leaveTimerRef.current = setTimeout(() => {
      setIsLeaving(false);
    }, REVERSE_TOTAL);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      aria-label={label}
      className={[
        "cta-logo-rise relative inline-flex items-center justify-center w-full sm:w-auto",
        isActive ? "is-active" : "",
        isLeaving ? "is-leaving" : "",
        `min-w-[${minWidth}px]`,
        "px-[clamp(28px,4.4vw,56px)] py-[clamp(16px,2.4vw,22px)]",
        "rounded-none select-none overflow-hidden",
        "bg-[#FF4A3E] text-white border border-[#FF4A3E]",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70",
        "active:translate-y-px",
        className,
      ].join(" ")}
      style={{
        ["--orange"]: "#FF4A3E",
        ["--ease-out"]: "cubic-bezier(.25,.85,.15,1)",

        ["--label-dur"]: `${LABEL_DUR}ms`,
        ["--logo-in-dur"]: `${LOGO_IN_DUR}ms`,
        ["--split-dur"]: `${SPLIT_DUR}ms`,
        ["--icon-dur"]: `${ICON_DUR}ms`,
        ["--delay-logo"]: `${DELAY_LOGO}ms`,
        ["--delay-split"]: `${DELAY_SPLIT}ms`,
        ["--delay-icon"]: `${DELAY_ICON}ms`,

        ["--r-delay-icon"]: `${R_DELAY_ICON}ms`,
        ["--r-delay-split"]: `${R_DELAY_SPLIT}ms`,
        ["--r-delay-logo"]: `${R_DELAY_LOGO}ms`,
        ["--r-delay-label"]: `${R_DELAY_LABEL}ms`,

        ["--clip-left-right"]: clipLeftRight,
        ["--clip-right-left"]: clipRightLeft,
        ["--split-dist"]: splitDist,

        ["--icon-off-x"]: iconOffsetX,
        ["--icon-off-y"]: iconOffsetY,
        ["--logo-offset-y"]: logoOffsetY,

        background: "var(--orange)",
      }}
    >
      {/* Texte de base */}
      <span className={`cta2__label relative z-[7] ${textSize}`}>
        {label}
      </span>

      {/* Calque logo & icône */}
      <span
        aria-hidden
        className="absolute inset-0 z-[6] pointer-events-none flex items-center justify-center"
      >
        {/* Logo plein */}
        <img
          src={garyLogoSrc}
          alt=""
          className="cta2__gary-full"
          style={{
            position: "absolute",
            height: "58%",
            objectFit: "contain",
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.15))",
          }}
        />

        {/* GA */}
        <img
          src={garyLogoSrc}
          alt=""
          className="cta2__gary-left"
          style={{
            position: "absolute",
            height: "58%",
            objectFit: "contain",
            clipPath: "inset(0 var(--clip-left-right) 0 0)",
            zIndex: 6,
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.15))",
          }}
        />

        {/* RY */}
        <img
          src={garyLogoSrc}
          alt=""
          className="cta2__gary-right"
          style={{
            position: "absolute",
            height: "58%",
            objectFit: "contain",
            clipPath: "inset(0 0 0 var(--clip-right-left))",
            zIndex: 5,
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.15))",
          }}
        />

        {/* Icône */}
        <span
          className="cta2__icon"
          style={{
            position: "absolute",
            left: "calc(50% + var(--icon-off-x))",
            transform: "translate(-50%, -50%)",
            willChange: "top, opacity",
            backfaceVisibility: "hidden",
          }}
        >
          <Icon
            style={{
              width: `${iconSizeEm}em`,
              height: `${iconSizeEm}em`,
              color: "white",
            }}
          />
        </span>
      </span>

      <style>{`
      /* ===== ÉTATS DE BASE ===== */

      .cta-logo-rise .cta2__label {
        display: inline-block;
        transform: translateY(0);
        opacity: 1;
      }

      .cta-logo-rise .cta2__gary-full {
        opacity: 0;
        transform: translateY(calc(28% + var(--logo-offset-y)));
      }

      .cta-logo-rise .cta2__gary-left,
      .cta-logo-rise .cta2__gary-right {
        opacity: 0;
        transform: translate3d(0, var(--logo-offset-y), 0);
      }

      .cta-logo-rise .cta2__icon {
        opacity: 0;
        top: calc(50% + 18% + var(--icon-off-y));
      }

      /* ===== FORWARD (ÉTAT ACTIF) ===== */

      .cta-logo-rise.is-active .cta2__label {
        animation: cta2-label-up var(--label-dur) var(--ease-out) forwards;
        will-change: transform, opacity;
      }
      @keyframes cta2-label-up {
        0%   { transform: translateY(0);     opacity: 1; }
        100% { transform: translateY(-100%); opacity: 0; }
      }

      .cta-logo-rise.is-active .cta2__gary-full {
        animation:
          cta2-gary-rise var(--logo-in-dur) var(--ease-out) var(--delay-logo) forwards,
          cta2-gary-hide 1ms linear var(--delay-split) forwards;
      }
      @keyframes cta2-gary-rise {
        0%   { opacity: 0; transform: translateY(calc(28% + var(--logo-offset-y))); }
        100% { opacity: 1; transform: translateY(var(--logo-offset-y)); }
      }
      @keyframes cta2-gary-hide { to { opacity: 0; } }
      

      .cta-logo-rise.is-active .cta2__gary-left {
        transform: translate3d(0, var(--logo-offset-y), 0);
        animation: cta2-left-split var(--split-dur) var(--ease-out) var(--delay-split) forwards;
        will-change: transform;
        backface-visibility: hidden;
      }

      .cta-logo-rise.is-active .cta2__gary-right {
        transform: translate3d(0, var(--logo-offset-y), 0);
        animation: cta2-right-split var(--split-dur) var(--ease-out) var(--delay-split) forwards;
        will-change: transform;
        backface-visibility: hidden;
      }

      @keyframes cta2-left-split {
        0%   { opacity: 1; transform: translate3d(0, var(--logo-offset-y), 0); }
        100% { opacity: 1; transform: translate3d(calc(-1 * var(--split-dist)), var(--logo-offset-y), 0); }
      }
      @keyframes cta2-right-split {
        0%   { opacity: 1; transform: translate3d(0, var(--logo-offset-y), 0); }
        100% { opacity: 1; transform: translate3d(var(--split-dist), var(--logo-offset-y), 0); }
      }

      .cta-logo-rise.is-active .cta2__icon {
        animation: cta2-icon-in var(--icon-dur) var(--ease-out) var(--delay-icon) forwards;
        top: calc(50% + var(--icon-off-y));
      }
      @keyframes cta2-icon-in {
        0%   { opacity: 0; top: calc(50% + 18% + var(--icon-off-y)); }
        100% { opacity: 1; top: calc(50% + var(--icon-off-y)); }
      }

      /* ===== REVERSE (LEAVE) =====
         1) Icône descend et disparaît
         2) GA|RY se referment puis disparaissent
         3) Logo complet enchaîne directement en descente (sans micro-disparition avant)
         4) Texte revient
      */

      .cta-logo-rise.is-leaving .cta2__icon {
        opacity: 1;
        top: calc(50% + var(--icon-off-y));
        animation: cta2-icon-out var(--icon-dur) var(--ease-out) var(--r-delay-icon) forwards;
      }
      @keyframes cta2-icon-out {
        0%   { opacity: 1; top: calc(50% + var(--icon-off-y)); }
        100% { opacity: 0; top: calc(50% + 18% + var(--icon-off-y)); }
      }

      .cta-logo-rise.is-leaving .cta2__gary-left {
        opacity: 1;
        transform: translate3d(calc(-1 * var(--split-dist)), var(--logo-offset-y), 0);
        animation: cta2-left-merge-out var(--split-dur) var(--ease-out) var(--r-delay-split) forwards;
      }
      .cta-logo-rise.is-leaving .cta2__gary-right {
        opacity: 1;
        transform: translate3d(var(--split-dist), var(--logo-offset-y), 0);
        animation: cta2-right-merge-out var(--split-dur) var(--ease-out) var(--r-delay-split) forwards;
      }

      @keyframes cta2-left-merge-out {
        0%   { opacity: 1; transform: translate3d(calc(-1 * var(--split-dist)), var(--logo-offset-y), 0); }
        80%  { opacity: 1; transform: translate3d(0, var(--logo-offset-y), 0); }
        100% { opacity: 0; transform: translate3d(0, var(--logo-offset-y), 0); }
      }
      @keyframes cta2-right-merge-out {
        0%   { opacity: 1; transform: translate3d(var(--split-dist), var(--logo-offset-y), 0); }
        80%  { opacity: 1; transform: translate3d(0, var(--logo-offset-y), 0); }
        100% { opacity: 0; transform: translate3d(0, var(--logo-offset-y), 0); }
      }

      /* 🔧 Ici on enlève le "flash" :
         - on part directement de l'état VISIBLE au centre
         - et on enchaîne avec la descente + fade-out, sans phase opacity 0 au début
      */
.cta-logo-rise.is-leaving .cta2__gary-full {
  /* on laisse l'opacité telle qu'elle est pour éviter la coupure */
  transform: translateY(var(--logo-offset-y));
  animation: cta2-gary-down var(--logo-in-dur) var(--ease-out) var(--r-delay-logo) forwards;
}



@keyframes cta2-gary-down {
  0%,
  10% {
    opacity: 1;
    transform: translateY(var(--logo-offset-y));
  }
  100% {
    opacity: 0;
    transform: translateY(calc(28% + var(--logo-offset-y)));
  }
}




      .cta-logo-rise.is-leaving .cta2__label {
        transform: translateY(-100%);
        opacity: 0;
        animation: cta2-label-down var(--label-dur) var(--ease-out) var(--r-delay-label) forwards;
      }
      @keyframes cta2-label-down {
        0%   { transform: translateY(-100%); opacity: 0; }
        100% { transform: translateY(0);     opacity: 1; }
      }

      @media (prefers-reduced-motion: reduce) {
        .cta-logo-rise .cta2__label,
        .cta-logo-rise .cta2__gary-full,
        .cta-logo-rise .cta2__gary-left,
        .cta-logo-rise .cta2__gary-right,
        .cta-logo-rise .cta2__icon {
          animation: none !important;
        }
      }
      `}</style>
    </button>
  );
}

/** Icône maison */
export function HouseIcon({ style, className = "", strokeWidth = 1 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      style={{ color: "white", ...style }}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11.5l9-7 9 7" />
      <path d="M5.5 10.5V20h13V10.5" />
      <path d="M9.5 20v-5.2a1.3 1.3 0 0 1 1.3-1.3h2.4a1.3 1.3 0 0 1 1.3 1.3V20" />
    </svg>
  );
}

/** Clé */
export function KeyIcon({ style, className = "", strokeWidth = 1 }) {
  const angleDeg = -45;
  const yOffset = 3.2;
  const xOffset = 1.6;
  const shaftEndX = 23;

  const tooth1X = shaftEndX - 2.2;
  const tooth2X = shaftEndX;

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      style={{ color: "white", ...style }}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    >
      <g transform={`translate(${xOffset},${yOffset})`}>
        <g transform={`rotate(${angleDeg} 12 12)`}>
          <circle cx="8.5" cy="8.5" r="3.4" />
          <path d={`M12 8.5H${shaftEndX}`} />
          <path d={`M${tooth1X} 8.5V12`} />
          <path d={`M${tooth2X} 8.5V12`} />
        </g>
      </g>
    </svg>
  );
}

/** Calculatrice */
export function CalculatorIcon({ style, className = "", strokeWidth = 1 }) {
  const shiftLeft = 1.0;
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      style={{ color: "white", ...style }}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    >
      <rect x="5.6" y="3.6" width="12.8" height="16.8" rx="2.1" />
      <rect x="7.8" y="6.2" width="8.4" height="3.0" rx="0.7" />
      <path d={`M${8.2 - shiftLeft} 12h2.2 M${11.9 - shiftLeft} 12h2.2 M${15.6 - shiftLeft} 12h2.2`} />
      <path d={`M${8.2 - shiftLeft} 15h2.2 M${11.9 - shiftLeft} 15h2.2 M${15.6 - shiftLeft} 15h2.2`} />
      <path d={`M${8.2 - shiftLeft} 18h2.2 M${11.9 - shiftLeft} 18h2.2 M${15.6 - shiftLeft} 18h2.2`} />
    </svg>
  );
}

/** Villa */
export function VillaIcon({ style, className = "", strokeWidth = 1 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      style={{ color: "white", ...style }}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      shapeRendering="geometricPrecision"
    >
      <path
        d="
        M3.2 11.8
        L9.05 8.35
        C9.75 7.95 10.65 7.95 11.35 8.35
        L20.8 11.8
        V18.8
        C20.8 19.35 20.35 19.8 19.8 19.8
        H4.2
        C3.65 19.8 3.2 19.35 3.2 18.8
        Z
      "
      />
      <path
        d="
        M10.7 13.7
        H13.3
        A0.6 0.6 0 0 1 13.9 14.3
        V18.2
        A0.6 0.6 0 0 1 13.3 18.8
        H10.7
        A0.6 0.6 0 0 1 10.1 18.2
        V14.3
        A0.6 0.6 0 0 1 10.7 13.7
        Z
      "
      />
      <path d="M6.7 14.6 H8.7" />
      <path d="M6.7 16.7 H8.7" />
      <path d="M15.3 14.6 H17.3" />
      <path d="M15.3 16.7 H17.3" />
    </svg>
  );
}

/** Info */
export function InfoIcon({ style, className = "", strokeWidth = 1.9 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      style={{ color: "white", ...style }}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    >
      <circle cx="12" cy="12" r="9.1" />
      <path d="M12 8h.01" />
      <path d="M11.4 12h1.2v4.2h1.2" />
    </svg>
  );
}

/** Phone */
export function PhoneIcon({
  className = "",
  style,
  strokeWidth = 1,
  angle = -22,
  inCircle = false,
  variant = "outline",
}) {
  const d =
    "M3.6 6.6c1.5 2.7 3.5 5.1 5.9 7 2.5 1.9 4.9 3.1 7.6 3.7 1 .2 1.9-.3 2.3-1.2l.5-1.2c.3-.7.1-1.5-.5-2l-2-1.6c-.5-.4-1.2-.5-1.8-.2l-1 .5c-.5.2-1 .2-1.4-.2l-3.1-3.1c-.4-.4-.4-1 0-1.4l.5-1c.3-.6.2-1.3-.2-1.8l-1.6-2c-.5-.6-1.3-.8-2-.5l-1.2.5c-.9.4-1.4 1.3-1.2 2.3Z";

  const common = {
    className,
    style: { color: "currentColor", ...style },
    viewBox: "0 0 24 24",
    "aria-hidden": "true",
  };

  if (variant === "filled") {
    return (
      <svg {...common}>
        {inCircle && (
          <circle
            cx="12"
            cy="12"
            r="9.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
        )}
        <g transform={`rotate(${angle} 12 12)`}>
          <path d={d} fill="currentColor" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      {...common}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      shapeRendering="geometricPrecision"
      vectorEffect="non-scaling-stroke"
    >
      {inCircle && <circle cx="12" cy="12" r="9.5" />}
      <g transform={`rotate(${angle} 12 12)`}>
        <path d={d} fill="currentColor" opacity="0.001" pointerEvents="none" />
        <path d={d} />
      </g>
    </svg>
  );
}
