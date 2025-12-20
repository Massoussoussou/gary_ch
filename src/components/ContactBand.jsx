import React from "react";

/**
 * ContactBand — variante luxe, alignée branding GARY
 *
 * Principes luxe appliqués :
 * - Retenue (couleurs sobres, accent unique orange Gary),
 * - Typo poids modéré (pas de bold massif), tracking serré,
 * - Hairline border + ombre ambiante très douce,
 * - Rythme/respiration (padding régulier, grille stricte),
 * - CTAs calmes, hiérarchie nette (primaire discret, secondaire ghost).
 *
 * Props
 *  - onCall: () => void
 *  - onWhatsApp: () => void
 *  - stickyMobile?: boolean (bandeau bas persistant < md)
 *  - variant?: 'dark' | 'light' (par défaut 'dark')
 *  - className?: string
 */

const TOKENS = {
  orange: "#FF4A3E",        // Accent Gary
  darkBg: "#0B0B0C",        // Fond charbon
  lightBg: "#FFFFFF",       // Fond clair (si besoin)
};

function cn(...c) { return c.filter(Boolean).join(" "); }

export default function ContactBand({
  onCall,
  onWhatsApp,
  stickyMobile = false,
  variant = "dark",
  className,
}) {
  const isDark = variant === "dark";

  const shell = cn(
    "relative isolate overflow-hidden",
    isDark
      ? "bg-neutral-950 text-white border border-white/10"
      : "bg-white text-neutral-900 border border-neutral-200",
    "shadow-[0_20px_40px_-30px_rgba(0,0,0,.6)]",
    stickyMobile ? "rounded-none md:rounded-[12px]" : "rounded-[12px]",
    "px-6 md:px-8 py-5 md:py-6"
  );

  const kicker = cn(
    "text-[13px] tracking-wide",
    isDark ? "text-neutral-400" : "text-neutral-500"
  );

  const title = cn(
    "mt-0.5 font-medium tracking-[-0.01em]",
    "text-[20px] sm:text-[22px] md:text-[24px]",
    isDark ? "text-white" : "text-neutral-900"
  );

  const subtitle = cn(
    "mt-1 text-[13px] sm:text-[14px]",
    isDark ? "text-neutral-400" : "text-neutral-600"
  );

  const primaryBtn = cn(
    "inline-flex items-center justify-center gap-2",
    "rounded-[10px] px-4 py-2.5 md:px-5 md:py-3 text-[15px] font-semibold",
    // Primaire discret mais net : fond presque noir en light, orange en dark
    isDark
      ? "bg-[var(--gary-orange)] text-white hover:-translate-y-[1px] transition will-change-transform"
      : "bg-neutral-900 text-white hover:-translate-y-[1px] transition will-change-transform",
    isDark
      ? "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
      : "focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
  );

  const secondaryBtn = cn(
    "inline-flex items-center justify-center gap-2",
    "rounded-[10px] px-4 py-2.5 md:px-5 md:py-3 text-[15px] font-semibold",
    isDark
      ? "border border-white/15 text-white/90 bg-transparent hover:bg-white/10"
      : "border border-neutral-200 text-neutral-900 bg-transparent hover:bg-neutral-50",
    isDark
      ? "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
      : "focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
  );

  const stickyClasses = stickyMobile
    ? "fixed bottom-0 inset-x-0 z-50 md:static md:z-auto pb-[env(safe-area-inset-bottom)]"
    : "";

  return (
    <section
      role="region"
      aria-label="Bandeau de contact"
      className={cn("w-full", stickyClasses, className)}
      style={{ "--gary-orange": TOKENS.orange }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={shell}>
          {/* Glow cuivre TRÈS discret à droite (accent) */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 w-[40%]",
              isDark ? "opacity-35 md:opacity-45" : "opacity-25 md:opacity-35"
            )}
            style={{
              background: isDark
                ? "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,74,62,0.06) 45%, rgba(255,74,62,0.18) 100%)"
                : "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,74,62,0.05) 45%, rgba(255,74,62,0.12) 100%)",
              maskImage:
                "radial-gradient(120% 120% at 100% 50%, black 60%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(120% 120% at 100% 50%, black 60%, transparent 100%)",
            }}
          />

          <div className="flex items-start md:items-center gap-5 md:gap-8">
            {/* Bloc texte */}
            <div className="min-w-0 flex-1">
              <p className={kicker}>Service premium</p>
              <h3 className={title}>
                Un conseiller vous rappelle en{" "}
                <span
                  className="font-semibold"
                  style={{ color: TOKENS.orange }}
                >
                  10&nbsp;minutes
                </span>
              </h3>
              <p className={subtitle}>7j/7 — 9h–20h CET · Suisse &amp; International</p>
            </div>

            {/* Séparateur hairline sur desktop */}
            <div className={cn(
              "hidden md:block self-stretch w-px",
              isDark ? "bg-white/10" : "bg-neutral-200"
            )} />

            {/* CTAs */}
            <div className="flex w-auto flex-col sm:flex-row items-stretch gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onCall}
                className={primaryBtn}
                aria-label="Être rappelé par un conseiller"
              >
                <PhoneIcon />
                <span>Être rappelé</span>
              </button>

              <button
                type="button"
                onClick={onWhatsApp}
                className={secondaryBtn}
                aria-label="Nous écrire sur WhatsApp"
              >
                <WhatsAppIcon />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {stickyMobile && <div className="h-16 md:h-0" aria-hidden="true" />}
    </section>
  );
}

/* Icônes minimalistes */
function PhoneIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0" {...props}>
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.11.37 2.31.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C11.4 21 3 12.6 3 2a1 1 0 0 1 1-1h3.49a1 1 0 0 1 1 1c0 1.27.2 2.47.57 3.58a1 1 0 0 1-.24 1.01l-2.2 2.2Z" fill="currentColor" />
    </svg>
  );
}

function WhatsAppIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0" {...props}>
      <path d="M20.52 3.48A11.94 11.94 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.19 1.6 6.02L0 24l6.14-1.6A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52ZM12 21.82c-1.88 0-3.7-.5-5.3-1.44l-.38-.22-3.63.95.97-3.54-.25-.41A9.8 9.8 0 0 1 2.18 12C2.18 6.58 6.58 2.18 12 2.18c2.62 0 5.08 1.02 6.94 2.88A9.77 9.77 0 0 1 21.82 12c0 5.42-4.4 9.82-9.82 9.82Zm5.54-7.38c-.3-.15-1.77-.88-2.05-.98-.28-.1-.48-.15-.67.15-.2.3-.77.98-.95 1.17-.18.2-.35.22-.65.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.47.13-.62.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.67-1.6-.92-2.2-.24-.58-.5-.5-.67-.5-.17 0-.37-.02-.57-.02-.2 0-.53.08-.82.38-.28.3-1.07 1.05-1.07 2.57 0 1.52 1.1 2.98 1.25 3.18.15.2 2.16 3.3 5.23 4.63.73.32 1.3.5 1.74.64.73.23 1.4.2 1.93.12.59-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.07-.12-.27-.2-.57-.35Z" fill="currentColor" />
    </svg>
  );
}
