// src/components/ProcessSteps.jsx
import React, { useMemo, useState, useCallback, useEffect } from "react";

export default function ProcessSteps({
  title = "Processus d’achat",
  steps = [], // [{ title, desc, imageUrl }]
  imageUrl,   // fallback
  onCallClick = () => {},
  className = "",
}) {
  const safeSteps = Array.isArray(steps) ? steps : [];
  const [active, setActive] = useState(0);

  const images = useMemo(
    () => safeSteps.map(s => s?.imageUrl || imageUrl).filter(Boolean),
    [safeSteps, imageUrl]
  );

  // Préchargement léger des images suivantes pour éviter le flash au survol
  useEffect(() => {
    images.slice(0, 3).forEach((src) => {
      const im = new Image();
      im.decoding = "async";
      im.src = src;
    });
  }, [images]);

  const onEnter = useCallback((i) => setActive(i), []);
  const onKey = useCallback((e, i) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(Math.min(i + 1, safeSteps.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(Math.max(i - 1, 0)); }
  }, [safeSteps.length]);

  return (
    <section className={`w-full py-12 md:py-16 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Colonne texte */}
          <div>
            {!!title && (
              <h2 className="mb-7 text-4xl md:text-5xl font-semibold leading-tight tracking-tight font-serif">
                {title}
              </h2>
            )}

            <ol role="listbox" aria-label="Étapes du processus" className="space-y-7">
              {safeSteps.map((s, i) => {
                const isActive = i === active;
                return (
                  <li
                    key={i}
                    role="option"
                    aria-selected={isActive}
                    tabIndex={0}
                    onMouseEnter={() => onEnter(i)}
                    onFocus={() => onEnter(i)}
                    onKeyDown={(e) => onKey(e, i)}
                    className="max-w-[62ch] outline-none"
                  >
                    <div className={isActive ? "translate-x-[2px] transition-transform" : "transition-transform"}>
                      <h3
                        className={[
                          "text-[24px] sm:text-[26px] md:text-[28px] leading-snug font-medium",
                          "tracking-tight font-serif",
                          "transition-colors",
                          isActive ? "text-[#FF4A3E]" : "text-zinc-900",
                        ].join(" ")}
                      >
                        {String(i + 1).padStart(2, "0")} <span className="mx-1">—</span> {s.title}
                      </h3>
                      {s.desc && (
                        <p className="mt-1 text-[16px] leading-relaxed text-neutral-600">
                          {s.desc}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-10">
              <button
                type="button"
                onClick={onCallClick}
                className="inline-flex items-center justify-center rounded-none bg-[#FF4A3E] px-5 py-3 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-[#e44338] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E] focus-visible:ring-offset-2"
                aria-label="Planifier un appel de 10 minutes"
              >
                Planifier un appel de 10 minutes
              </button>
            </div>
          </div>

          {/* Colonne image (portrait) */}
          <figure className="relative aspect-[3/4] w-full overflow-hidden lg:sticky lg:top-20">
            {(images.length ? images : [imageUrl]).map((src, i) => (
              <img
                key={`${src}-${i}`}
                src={src}
                alt=""
                decoding="async"
                fetchpriority={i === active ? "high" : "low"}
                loading={i === active ? "eager" : "lazy"}
                className={[
                  "absolute inset-0 h-full w-full object-cover",
                  "transition-opacity duration-700 ease-out",
                  i === active ? "opacity-100" : "opacity-0",
                ].join(" ")}
              />
            ))}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
            <figcaption className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
              <div className="inline-block bg-white/75 backdrop-blur-sm px-3 py-2 rounded-none">
                <p className="text-[14px] leading-snug tracking-wide text-zinc-900">
                  {safeSteps[active]?.title}
                  <span className="mx-1">—</span>
                  <span className="text-zinc-700">
                    {safeSteps[active]?.desc || "Aperçu de l’étape sélectionnée"}
                  </span>
                </p>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
