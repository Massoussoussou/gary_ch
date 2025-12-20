// src/components/USPSection.jsx
// USP plein écran — variante "Buy Intro" (acquéreurs) — STYLE LUXE
// - Image STICKY réduite (cadre type tirage photo avec passe-partout)
// - Icônes: pastilles fines (anneau) + accent orange sur l’actif (pas de gros aplats)
// - Zéro secousse: ratio fixe, container de largeur bornée
// - Props: items: { key, title, desc, image, Icon }[]

import { useMemo, useState, useCallback, useEffect } from "react";

export default function USPSection({
  items = [],
  title = "Les bonnes raisons d’acheter",
  subtitle = "avec GARY",
  className = "",
  stickyTopClass = "top-24", // ajuste selon la hauteur de ton header
}) {
  const safeItems = items?.length ? items : DEFAULT_BUY_USPS;
  const [active, setActive] = useState(safeItems[0]?.key);

  const current = useMemo(
    () => safeItems.find((i) => i.key === active) ?? safeItems[0],
    [active, safeItems]
  );

  const onKey = useCallback(
    (e) => {
      if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
      e.preventDefault();
      const idx = safeItems.findIndex((i) => i.key === current.key);
      const nextIdx =
        e.key === "ArrowRight"
          ? (idx + 1) % safeItems.length
          : (idx - 1 + safeItems.length) % safeItems.length;
      setActive(safeItems[nextIdx].key);
    },
    [current, safeItems]
  );

  useEffect(() => {
    if (!safeItems.some((i) => i.key === active)) {
      setActive(safeItems[0]?.key);
    }
  }, [safeItems, active]);

  return (
    <section
      className={[
        "w-full bg-white selection:bg-[#FF4A3E]/20",
        className,
      ].join(" ")}
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div
          className="grid min-h-screen grid-cols-1 gap-10 py-14 md:grid-cols-12 md:gap-12 md:py-20"
          onKeyDown={onKey}
        >
          {/* Colonne gauche : titre + icônes + éditorial */}
          <div className="flex flex-col md:col-span-6 lg:col-span-5">
            <header className="mb-8 md:mb-12">
              <h2 className="text-[40px] leading-[1.05] tracking-tight text-neutral-900 md:text-6xl">
                {title}
                <span className="block text-base uppercase tracking-[0.18em] text-neutral-500 md:text-lg">
                  {subtitle}
                </span>
              </h2>
              <div className="mt-5 h-px w-24 bg-neutral-200 md:w-28" />
            </header>

            {/* Pastilles fines (anneau) */}
            <div
              role="tablist"
              aria-label="Avantages acheteurs"
              className="mb-7 flex flex-wrap items-center gap-5 md:gap-7"
            >
              {safeItems.map(({ key, title, Icon }) => {
                const selected = key === current.key;
                return (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={selected}
                    aria-label={title}
                    title={title}
                    onClick={() => setActive(key)}
                    className={[
                      "group relative flex h-16 w-16 items-center justify-center rounded-full md:h-20 md:w-20",
                      "outline-none transition-all duration-200",
                      "ring-1 ring-neutral-200 hover:ring-neutral-300 focus-visible:ring-2 focus-visible:ring-[#FF4A3E]",
                      selected ? "ring-2 ring-[#FF4A3E]" : "",
                    ].join(" ")}
                  >
                    <Icon
                      className={[
                        "h-7 w-7 md:h-8 md:w-8 transition-transform duration-200",
                        selected ? "scale-105 text-neutral-900" : "text-neutral-700 group-hover:text-neutral-900",
                      ].join(" ")}
                      aria-hidden="true"
                    />
                    {selected && (
                      <span className="pointer-events-none absolute -bottom-2 h-1.5 w-1.5 rounded-full bg-[#FF4A3E]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Éditorial court */}
            <div aria-live="polite">
              <h3 className="text-2xl font-medium text-neutral-900 md:text-[28px]">
                {current.title}
              </h3>
              <p className="mt-4 max-w-prose text-[17px] leading-relaxed text-neutral-700 md:text-lg">
                {current.desc}
              </p>
              {/* CTA discret */}
              <a
                href="/process"
                className="mt-6 inline-flex text-base font-medium text-[#FF4A3E] underline-offset-4 hover:underline"
              >
                Notre process d’achat
              </a>
            </div>
          </div>

          {/* Colonne droite : image sticky RÉDUITE avec cadre luxe */}
          <div className="relative md:col-span-6 lg:col-span-7">
            <div className={`sticky ${stickyTopClass}`}>
              {/* largeur bornée + alignée à droite => image visuellement plus petite */}
              <div className="ml-auto w-[78%] max-w-[560px] lg:max-w-[640px]">
                <figure className="relative overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] ring-1 ring-black/5">
                  {/* Passe-partout (cadre blanc interne) */}
                  <div className="p-3 sm:p-4">
                    {/* Ratio fixe = zéro CLS */}
                    <div className="relative aspect-[5/7] md:aspect-[4/6]">
                      <img
                        key={current.image}
                        src={current.image}
                        alt={current.title}
                        className="absolute inset-0 h-full w-full rounded-[12px] object-cover opacity-0 transition-opacity duration-300 will-change-[opacity]"
                        onLoad={(e) => (e.currentTarget.style.opacity = 1)}
                        sizes="(min-width: 1024px) 35vw, (min-width: 768px) 55vw, 100vw"
                        loading="lazy"
                      />
                      {/* Liseré fin autour de l’image pour un rendu “tirage” */}
                      <div className="pointer-events-none absolute inset-0 rounded-[12px] ring-1 ring-black/10" />
                      {/* Voile très léger pour lisibilité si texte overlay ailleurs */}
                      <div className="pointer-events-none absolute inset-0 rounded-[12px] bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                    </div>
                  </div>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------
   Contenu par défaut (Buy Intro)
--------------------------------*/
import {
  Binoculars,
  LineChart,
  CalendarClock,
  FileText,
  Handshake,
} from "lucide-react";

export const DEFAULT_BUY_USPS = [
  {
    key: "early",
    title: "Accès avant-première",
    desc:
      "Biens en pré-commercialisation et off-market: recevez les dossiers avant la mise en ligne.",
    image: "/public/usp/earlyaccess.jpeg",
    Icon: Binoculars,
  },
  {
    key: "fairprice",
    title: "Prix justes, fondés sur la donnée",
    desc:
      "Études de marché, historiques et comparables récents pour payer le bon prix — pas le hasard.",
    image: "/public/usp/buy-data-pricing.jpeg",
    Icon: LineChart,
  },
  {
    key: "flow",
    title: "Parcours clé en main",
    desc:
      "Financement, notaire, rénovation: un seul interlocuteur, 4 étapes claires jusqu’à la remise des clés.",
    image: "/public/usp/buy-turnkey.jpeg",
    Icon: Handshake,
  },
  {
    key: "visits",
    title: "Visites intelligentes",
    desc:
      "Créneaux sous 48h, compte-rendu en 24h, dossiers complets avant la visite pour décider vite.",
    image: "/public/usp/buy-smart-visits.jpeg",
    Icon: CalendarClock,
  },
  {
    key: "transparency",
    title: "Transparence totale",
    desc:
      "Diagnostics, charges, travaux: tout est partagé en amont pour zéro mauvaise surprise.",
    image: "/public/usp/buy-transparency.jpeg",
    Icon: FileText,
  },
];
