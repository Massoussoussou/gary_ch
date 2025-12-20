// src/components/sell/StepTabs.jsx
import React from "react";
import { motion } from "framer-motion";

/* === Icônes fallback fournies === */
const FallbackIcons = [
  function HomeIcon(props) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" {...props}>
        <path d="M3 11.5l9-7 9 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.5 10.5V20h13V10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M9.5 20v-5.2a1.3 1.3 0 0 1 1.3-1.3h2.4a1.3 1.3 0 0 1 1.3 1.3V20" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    );
  },
  function CameraIcon(props) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" {...props}>
        <rect x="3" y="6.5" width="18" height="12" rx="2.2" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M8.2 6.5l.9-1.7a1.6 1.6 0 0 1 1.4-.8h3a1.6 1.6 0 0 1 1.4.8l.9 1.7" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="12" cy="12.5" r="3.8" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    );
  },
  function HandshakeIcon(props) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" {...props}>
        <path d="M7 14l4.5-3.5a2 2 0 0 1 2.6.1L17 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M2.5 12l4.2-3.8a3 3 0 0 1 3.9 0L12 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M21.5 12l-3.8-3.5a3 3 0 0 0-4 0l-.6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M9.5 14.5l1.3 1.2a2 2 0 0 0 2.8 0L15 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    );
  },
  function ClipboardIcon(props) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" {...props}>
        <rect x="6.2" y="4.5" width="11.6" height="16.5" rx="1.8" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M9 4.5h6a1 1 0 0 1 1 1v.7a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M9 11h6M9 14.5h6M9 18h3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    );
  },
  function KeyIcon(props) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" {...props}>
        <circle cx="8.5" cy="11.5" r="3.8" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M12.2 11.5h6.8l-1.6 2h-1.4l-.9 1.2h-1.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  },
];

export default function StepTabs({ steps, active, onChange }) {
  return (
    <div className="flex items-center flex-wrap gap-y-4 gap-x-8 md:gap-x-14 lg:gap-x-16 xl:gap-x-20">
      {steps.map((s, idx) => {
        const selected = idx === active;
        const IconMaybe = s?.icon;

        // Rendu robuste: composant, élément JSX, URL, ou fallback
        const renderIcon = () => {
          if (React.isValidElement(IconMaybe)) {
            return React.cloneElement(IconMaybe, {
              className: [
                "w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10",
                "transition-colors duration-200",
                selected ? "text-white" : "text-black/70 group-hover:text-white",
                IconMaybe.props.className || "",
              ].join(" "),
              stroke: IconMaybe.props.stroke ?? "currentColor",
              fill: IconMaybe.props.fill ?? "none",
              "aria-hidden": true,
            });
          }
          if (typeof IconMaybe === "function") {
            const Icon = IconMaybe;
            return (
              <Icon
                aria-hidden="true"
                className={[
                  "w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10",
                  "transition-colors duration-200",
                  selected ? "text-white" : "text-black/70 group-hover:text-white",
                ].join(" ")}
                stroke="currentColor"
                fill="none"
              />
            );
          }
          if (typeof IconMaybe === "string") {
            return (
              <img
                src={IconMaybe}
                alt=""
                aria-hidden="true"
                className={[
                  "w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 object-contain",
                  "transition-opacity",
                  selected ? "opacity-100" : "opacity-80 group-hover:opacity-100",
                ].join(" ")}
                loading="eager"
                decoding="async"
              />
            );
          }
          // Fallback
          const Fbk = FallbackIcons[idx % FallbackIcons.length];
          return (
            <Fbk
              aria-hidden="true"
              className={[
                "w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10",
                "transition-colors duration-200",
                selected ? "text-white" : "text-black/70 group-hover:text-white",
              ].join(" ")}
            />
          );
        };

        return (
          <motion.button
            key={s?.id ?? idx}
            onClick={() => onChange?.(idx)}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.985 }}
            type="button"
            aria-label={s?.title ?? `Étape ${idx + 1}`}
            aria-pressed={selected}
            className="group relative outline-none"
          >
            {/* Conteneur circulaire : vrai contour + clipping */}
            <span
              className={[
                "block relative rounded-full overflow-hidden",
                "w-[64px] h-[64px] md:w-[72px] md:h-[72px] lg:w-[80px] lg:h-[80px]",
                "border",
                selected ? "border-[#FF4A3E]" : "border-black/15 group-hover:border-[#FF4A3E]",
                "bg-white shadow-[0_6px_16px_rgba(0,0,0,0.06)]",
              ].join(" ")}
            >
              {/* Remplissage radial depuis le centre (scale 0 -> 100) */}
              <span
                aria-hidden
                className={[
                  "absolute inset-0 rounded-full bg-[#FF4A3E] z-0",
                  selected ? "scale-100" : "scale-0 group-hover:scale-100",
                  "transform will-change-transform origin-center",
                  "transition-transform duration-[380ms] ease-out",
                ].join(" ")}
              />

              {/* Icône centrée — au-dessus du fond orange */}
              <span className="absolute inset-0 grid place-items-center z-[1]">
                {renderIcon()}
              </span>
            </span>

            <span className="sr-only">{s?.title}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
