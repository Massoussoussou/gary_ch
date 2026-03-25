// src/components/sell/SellTrustStrip.jsx
// → même gabarit/typo/espaces que TrustStrip.jsx (BuyIntro)
import { useLocale } from "../../hooks/useLocale.js";

export default function SellTrustStrip({
  // Données GARY
  sold = 75,          // biens vendus
  certs = 1,          // certifications
  rating = 4.9,       // note moyenne
  reviewsCount = 75,  // nb d'avis
  expYears = 50,      // années d'expérience combinée
  // Options d'affichage identiques au TrustStrip
  size = "xl",
  panel = false,
  reviewsLabel = "RealAdvisor",
  reviewsUrl = "https://realadvisor.ch/fr/agences-immobilieres/agence-gary",
}) {
  const { t } = useLocale();
  const fmt = (n) => new Intl.NumberFormat("fr-FR").format(n);

  // → mêmes échelles que dans TrustStrip.jsx
  const S = size === "xl"
    ? { py: "py-8 md:py-12", h1: "text-6xl md:text-7xl", h2: "text-5xl md:text-6xl" }
    : { py: "py-6 md:py-8",  h1: "text-5xl md:text-6xl",  h2: "text-4xl md:text-5xl" };

  // → même option "panel" que ton TrustStrip
  const wrapCls = panel
    ? "bg-white/80 supports-[backdrop-filter]:bg-white/65 backdrop-blur-md border-y border-black/10"
    : "bg-transparent";

  return (
    <section aria-label={t("trust.aria_label_sell")} className={wrapCls}>
      <div className="w-full px-[min(6vw,72px)]">
        {/* grille identique (pas de divide, seulement des gaps) */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full items-start justify-items-center gap-y-6">
          {/* 1 — Biens vendus */}
          <li className={`${S.py} text-center w-full`}>
            <div className={S.h1}>{fmt(sold)}</div>
            <div className="mt-3 text-xs md:text-sm uppercase tracking-wide text-zinc-600">
              {t("trust.properties_sold")}
            </div>
            <div className="mt-1 text-[12px] text-zinc-500">{t("trust.last_12_months")}</div>
          </li>

          {/* 2 — Certification */}
          <li className={`${S.py} text-center w-full`}>
            <div className={S.h2}>{fmt(certs)}</div>
            <div className="mt-3 text-xs md:text-sm uppercase tracking-wide text-zinc-600">
              {t("trust.certification")}
            </div>
            <div className="mt-1 text-[12px] text-zinc-500">{t("trust.official")}</div>
          </li>

          {/* 3 — Avis (même rendu étoile + chiffre que TrustStrip) */}
          <li className={`${S.py} text-center w-full`}>
            <div className="flex items-center justify-center gap-3">
              <span aria-hidden="true" className="text-4xl md:text-5xl leading-none" style={{ color: "#FF4A3E" }}>
                ★
              </span>
              <span className={S.h1}>
                {rating.toFixed(1)}
                <span className="sr-only"> {t("trust.out_of_5")}</span>
              </span>
            </div>
            <div className="mt-3 text-xs md:text-sm uppercase tracking-wide text-zinc-600">
              {t("trust.avg_rating")}
            </div>
            <div className="mt-1 text-[12px] text-zinc-500">({fmt(reviewsCount)} {t("trust.reviews")})</div>

            <div className="mt-4">
              {reviewsUrl ? (
                <a
                  href={reviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-2 underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E] focus-visible:ring-offset-2 focus-visible:ring-offset-white text-zinc-800"
                  title={t("trust.see_reviews_on", { platform: reviewsLabel })}
                  aria-label={t("trust.see_reviews_on", { platform: reviewsLabel })}
                >
                  {t("trust.see_reviews_link", { platform: reviewsLabel })}

                </a>
              ) : null}
            </div>
          </li>

          {/* 4 — Expérience combinée */}
          <li className={`${S.py} text-center w-full`}>
            <div className={S.h2}>
              +{fmt(expYears)}
            </div>
            <div className="mt-3 text-xs md:text-sm uppercase tracking-wide text-zinc-600">
              {t("trust.years_experience")}
            </div>
            <div className="mt-1 text-[12px] text-zinc-500">{t("trust.team_combined")}</div>
          </li>
        </ul>
      </div>
    </section>
  );
}
