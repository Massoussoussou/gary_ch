// src/components/TrustStrip.jsx
// Version "sans lignes" : aucune bordure ni séparateur, grands espacements.

export default function TrustStrip({
  rating = 4.9,
  reviewsCount = 75,
  reviewsLabel = "RealAdvisor",
  reviewsUrl = "https://realadvisor.ch/fr/agences-immobilieres/agence-gary",
  panel = false,   // NEW: affiche un voile/bloc blanc élégant
  size = "xl",     // NEW: plus grand par défaut
}) {
  const safeRating =
    typeof rating === "number" && rating >= 0 && rating <= 5 ? rating : 0;

    const S = size === "xl"
  ? { py: "py-8 md:py-12", h1: "text-6xl md:text-7xl", h2: "text-5xl md:text-6xl" }
  : { py: "py-6 md:py-8",  h1: "text-5xl md:text-6xl",  h2: "text-4xl md:text-5xl" };

    const wrapCls = panel
    ? "bg-white/80 supports-[backdrop-filter]:bg-white/65 backdrop-blur-md border-y border-black/10"
    : "bg-transparent";


  return (
    <section
      aria-label="Indices de confiance"
      className={wrapCls}
    >
      <div className="w-full px-[min(6vw,72px)]">
        {/* Plus de divide-x / divide-y : on utilise des gaps */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full
               items-start justify-items-center gap-y-6">
          {/* Bloc 1 : Note moyenne */}
          <li className={`${S.py} text-center w-full`}>
            <div className="flex items-center justify-center gap-3">
              <span
                aria-hidden="true"
                className="text-4xl md:text-5xl leading-none"
                style={{ color: "#FF4A3E" }}
              >
                ★
              </span>
              <span className={S.h1}>
                {safeRating.toFixed(1)}
                <span className="sr-only"> sur 5</span>
              </span>
            </div>
            <div className="mt-3 text-xs md:text-sm uppercase tracking-wide text-zinc-600">
              Note moyenne / 5
            </div>
            <div className="mt-1 text-[12px] text-zinc-500">
              ({reviewsCount} avis)
            </div>
          </li>

          {/* Bloc 2 : Courtier licencié */}
          <li className={`${S.py} text-center w-full`}>
            <div className={S.h2}>
              Courtier
            </div>
            <div className="mt-3 text-xs md:text-sm uppercase tracking-wide text-zinc-600">
              licencié
            </div>
            <div className="mt-1 text-[12px] text-zinc-500">
              Conformité & transparence
            </div>
          </li>

          {/* Bloc 3 : Dossiers complets */}
          <li className={`${S.py} text-center w-full`}>
            <div className={S.h2}>
              Dossiers
            </div>
            <div className="mt-3 text-xs md:text-sm uppercase tracking-wide text-zinc-600">
              complets
            </div>
            <div className="mt-1 text-[12px] text-zinc-500">
              Plans, diagnostics, historique
            </div>
          </li>

          {/* Bloc 4 : Avis externes (RealAdvisor par défaut) */}
          <li className={`${S.py} text-center w-full`}>
            <div className={S.h2}>
              Avis vérifiés
            </div>
            <div className="mt-2 text-xs md:text-sm uppercase tracking-wide text-zinc-600">
              {reviewsLabel}
            </div>

            <div className="mt-4">
              {reviewsUrl ? (
                <a
                  href={reviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  title={`Voir les avis de GARY.ch sur ${reviewsLabel} (nouvel onglet)`}
                  aria-label={`Voir les avis de GARY.ch sur ${reviewsLabel} (nouvel onglet)`}
                  className="inline-flex items-center gap-2 underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E] focus-visible:ring-offset-2 focus-visible:ring-offset-white text-zinc-800"
                >
                  Voir les avis sur {reviewsLabel}
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M12.293 3.293a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L14 6.414V14a1 1 0 11-2 0V6.414L9.707 7.707A1 1 0 018.293 6.293l3-3z" />
                  </svg>
                </a>
              ) : (
                <span className="text-zinc-500 text-sm">
                  Lien d’avis indisponible
                </span>
              )}
            </div>

            <div className="mt-1 text-[12px] text-zinc-500">
              Indice indépendant, mis à jour par la plateforme
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
