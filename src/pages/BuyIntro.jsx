// src/pages/BuyIntro.jsx
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* Données & composants */
import useProperties from "../hooks/useProperties.js";
import BandCarousel from "../components/BandCarousel.jsx";
import FiltersBarCompact from "../components/FiltersBarCompact.jsx";
import TrustStrip from "../components/TrustStrip.jsx";
import ProcessSteps from "../components/ProcessSteps.jsx";
import ToolsBudgetCalc from "../components/ToolsBudgetCalc.jsx";
import ToolsAlerts from "../components/ToolsAlerts.jsx";
import AlreadyOwner from "../components/AlreadyOwner.jsx";
import WeekCardV1 from "../components/cards/WeekCardV1.jsx";
import ListingCardSold from "../components/cards/ListingCardSold.jsx";
import CTAFuturaGlow from "../components/cta/CTAFuturaGlow.jsx";
import CTAWhiteSweep from "../components/cta/CTAWhiteSweep.jsx";
import BeigeOrnament from "../components/common/BeigeOrnament.jsx";

/* Hooks et utils partagés */
import { useRevealOnce } from "../hooks/useRevealOnce.js";
import {
  hasTag,
  isRecent,
  deriveFacets,
  normalizeListingData,
  coerceNum,
} from "../utils/data.js";
import { toQS } from "../utils/queryString.js";
import { pickVideoSrcSimple } from "../utils/video.js";

/* ---------- composant principal ---------- */
export default function BuyIntro() {
  const navigate = useNavigate();
  const { data, loading } = useProperties();
  const facets = useMemo(() => deriveFacets(data), [data]);

  /* sections data */
  const weekItem = useMemo(() => {
    const bySpotlight = data.find(
      (d) => String(d.spotlight || "").toLowerCase() === "xxl"
    );
    if (bySpotlight) return bySpotlight;
    const byTag = data.find((d) => hasTag(d, /feature|semaine|week/i));
    if (byTag) return byTag;
    return (
      [...data].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      )[0] || data[0]
    );
  }, [data]);

  const nouveautes = useMemo(
    () => data.filter((d) => hasTag(d, /nouveau/i) || isRecent(d)),
    [data]
  );
  const exclusivites = useMemo(
    () => data.filter((d) => hasTag(d, /exclu/i)),
    [data]
  );
  const vendus = useMemo(
    () => data.filter((d) => hasTag(d, /vendu/i) || d.vendu),
    [data]
  );
  const available = useMemo(
    () => data.filter((d) => !(hasTag(d, /vendu/i) || d.vendu)),
    [data]
  );

  /* recherche */
  const [resultCount, setResultCount] = useState(available.length);
  const filtersRef = useRef({});

  function filterListings(items, f = {}) {
    return items.filter((it) => {
      if (
        f.city &&
        String(it.ville || "").toLowerCase() !== String(f.city).toLowerCase()
      )
        return false;
      if (
        f.type &&
        String(it.type || "").toLowerCase() !== String(f.type).toLowerCase()
      )
        return false;
      const pMin = coerceNum(f.priceMin),
        pMax = coerceNum(f.priceMax);
      const price = +(+it.prix || 0);
      if (pMin != null && price < pMin) return false;
      if (pMax != null && price > pMax) return false;
      const surfMin = coerceNum(f.surfaceMin),
        surfMax = coerceNum(f.surfaceMax);
      const surf = +(+it.surface_m2 || 0);
      if (surfMin != null && surf < surfMin) return false;
      if (surfMax != null && surf > surfMax) return false;
      const chambres = +(
        it.chambres ??
        it.nb_chambres ??
        it.bedrooms ??
        it.pieces ??
        0
      );
      const sdb = +(it.sdb ?? it.salles_de_bain ?? it.bathrooms ?? 0);
      if (coerceNum(f.chambresMin) != null && chambres < +f.chambresMin)
        return false;
      if (coerceNum(f.sdbMin) != null && sdb < +f.sdbMin) return false;
      return true;
    });
  }

  function handleFiltersChange(partial) {
    filtersRef.current = { ...filtersRef.current, ...partial };
    const n = filterListings(available, filtersRef.current).length;
    setResultCount(n);
  }

  const goCatalogue = (qs = "") => navigate(`/acheter/catalogue${qs}`);

  /* reveals */
  const [filtRef, filtShown] = useRevealOnce({ threshold: 0.01 });
  const [weekRef, weekShown] = useRevealOnce({ threshold: 0.12 });
  const [exRef, exShown] = useRevealOnce();
  const [newRef, newShown] = useRevealOnce();
  const [vendRef, vendShown] = useRevealOnce();
  const [procRef, procShown] = useRevealOnce();
  const [calcRef, calcShown] = useRevealOnce();
  const [alertsRef, alertsShown] = useRevealOnce();

  const [ready, setReady] = useState(false);
  const src = useMemo(() => {
    try {
      return pickVideoSrcSimple() || "/media/buy/hero24.mp4";
    } catch {
      return "/media/buy/hero24.mp4";
    }
  }, []);

  /* actions */
  const handleCreateAlert = async (payload) => {
    await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  return (
    <main className="min-h-screen text-[#0F1115] overflow-x-clip">
      {/* 1) HERO FULL SCREEN */}
      <section className="relative isolate min-h-[100svh] flex items-center overflow-x-clip">
        <div className="absolute inset-0">
          <div className="sticky top-0 h-[100svh] -z-10">
            <img
              src="/media/hero-poster.webp"
              alt=""
              width="1920"
              height="1080"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
              fetchpriority="high"
              decoding="async"
            />

            <video
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/media/hero-poster.webp"
              onLoadedData={() => setReady(true)}
              onCanPlay={() => setReady(true)}
              onError={(e) => console.warn("Video error", e)}
              aria-hidden="true"
            >
              <source
                src={src}
                type={src.endsWith(".webm") ? "video/webm" : "video/mp4"}
              />
              <source
                src={
                  src.endsWith(".webm")
                    ? src.replace(".webm", ".mp4")
                    : src.replace(".mp4", ".webm")
                }
                type={src.endsWith(".webm") ? "video/mp4" : "video/webm"}
              />
            </video>

            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-transparent md:from-white/55 md:via-white/25 md:to-transparent" />
              <div className="absolute inset-0 md:bg-gradient-to-r md:from-white/55 md:via-white/25 md:to-transparent" />
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-8 py-14 sm:py-16 md:py-28">
          <div className="relative flex justify-center md:justify-start">
            <div className="relative w-full max-w-[92vw] sm:max-w-[min(900px,84vw)] mx-auto md:mx-0">
              <div className="absolute -inset-y-5 -inset-x-4 sm:-inset-y-6 sm:-inset-x-6 md:-inset-y-6 md:-left-6 md:-right-6 bg-white/55 backdrop-blur-sm rounded-3xl md:rounded-none shadow-[0_22px_70px_-45px_rgba(0,0,0,0.45)] md:shadow-none" />

              <div className="relative text-center px-3 sm:px-0 py-5 sm:py-0">
                <p className="text-[12px] md:text-[13px] uppercase tracking-[0.2em] text-neutral-600 mb-3">
                  Acheter
                </p>

                <h1 className="font-serif tracking-[-0.03em] leading-[0.95] md:leading-[0.9] text-[clamp(2.6rem,11vw,4.2rem)] md:text-[clamp(4.2rem,10vw,7.6rem)]">
                  L'immobilier d'exception
                  <span className="text-[#FF4A3E]">,</span>
                  <br />
                  <span className="block">simplement.</span>
                </h1>

                <p className="mt-5 text-[clamp(1.05rem,2.1vw,1.4rem)] text-neutral-900/90 max-w-[52ch] mx-auto">
                  Sélection stricte, visites en 48h, data-pricing et
                  accompagnement clé en main.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <CTAFuturaGlow
                    label="Voir les annonces"
                    to="/acheter/catalogue"
                    minWidth={260}
                  />
                  <CTAWhiteSweep to="/contact" label="Contacter GARY" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2) Recherche + Trust */}
      <section className="relative isolate overflow-x-clip">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-10 md:h-12 bg-gradient-to-b from-white to-[#FAF6F0]" />
          <div className="absolute inset-x-0 bottom-0 h-10 md:h-12 bg-gradient-to-t from-white to-[#FAF6F0]" />
          <div className="absolute inset-x-0 top-10 bottom-10 bg-[#FAF6F0]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-8">
          <div ref={filtRef} className="py-0" />
          <div
            className={`pt-8 pb-6 md:pt-10 md:pb-8 transition-[clip-path,opacity,transform] duration-[900ms] delay-100 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${filtShown ? "opacity-100 [clip-path:inset(0_0%_0_0%)]" : "opacity-0 [clip-path:inset(0_50%_0_50%)]"}`}
          >
            <div className="mx-auto w-full max-w-[min(1360px,100%)] md:max-w-[min(1440px,100%)]">
              <div className="px-4 md:px-6 py-4 md:py-6">
                <FiltersBarCompact
                  size="2xl"
                  facets={facets}
                  onSearch={(filters) => goCatalogue(toQS(filters))}
                  onChange={handleFiltersChange}
                  resultCount={resultCount}
                />
              </div>
            </div>
          </div>
        </div>

        <div id="filters-under-hero" className="relative">
          <div className="mt-6 md:mt-8">
            <TrustStrip
              size="xl"
              reviewsLabel="RealAdvisor"
              reviewsUrl="https://realadvisor.ch/fr/agences-immobilieres/agence-gary"
              rating={5}
              reviewsCount={75}
            />
          </div>
        </div>
      </section>

      {/* 3) Maison de la semaine */}
      <div
        ref={weekRef}
        className={`transition-all duration-[1000ms] ${
          weekShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <WeekCardV1
          item={weekItem}
          mode="split"
          bg="slideshow"
          bgOpacity={0.65}
          bgBlur={4}
          overlay="light"
          bgIntervalMs={9000}
        />
      </div>

      {/* 4) Exclusivités */}
      <section
        ref={exRef}
        className={`relative pt-12 pb-8 md:pt-16 md:pb-10 bg-white transition-all duration-[1200ms] ${
          exShown ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
        }`}
      >
        <BeigeOrnament className="opacity-30" />
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <BandCarousel
            title="Exclusivités"
            items={exclusivites}
            cta="Voir tout"
            onCta={() => goCatalogue("")}
          />
        </div>
      </section>

      {/* 5) Nouveautés */}
      <section
        ref={newRef}
        className={`relative pt-6 md:pt-8 pb-24 md:pb-28 bg-[#FAF6F0] transition-all duration-[1200ms] ${
          newShown ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
        }`}
      >
        <BeigeOrnament />
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <BandCarousel
            title="Nouveautés"
            items={nouveautes}
            cta="Voir tout"
            onCta={() => goCatalogue("?sort=recent")}
          />
        </div>
      </section>

      {/* 9) Ventes réalisées */}
      <section
        ref={vendRef}
        className={`relative py-24 bg-white transition-all duration-700 ${vendShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <BandCarousel
            title="Déjà vendu"
            items={vendus}
            cta="Voir nos ventes"
            onCta={() => navigate("/ventes")}
            renderItem={ListingCardSold}
          />
          <div className="mt-6 grid grid-cols-3 gap-3 md:gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-medium tabular-nums">
                +{vendus.length}
              </div>
              <div className="text-sm text-zinc-600">biens déjà vendus</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-medium tabular-nums">
                48h
              </div>
              <div className="text-sm text-zinc-600">délai moyen visite</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-medium tabular-nums">
                30%
              </div>
              <div className="text-sm text-zinc-600">off-market</div>
            </div>
          </div>
        </div>
      </section>

      {/* 12) Process */}
      <section
        ref={procRef}
        className={`relative py-24 bg-[#FAF6F0] transition-all duration-700 ${procShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <BeigeOrnament />
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <ProcessSteps
            steps={[
              {
                title: "Définir le besoin",
                desc: "Critères, zone, budget, priorités.",
              },
              {
                title: "Visiter",
                desc: "Créneaux en 48h, compte-rendu clair.",
              },
              { title: "Offrir", desc: "Comparables & analyse de prix." },
              { title: "Financer", desc: "Pré-accord indicatif 24/48h." },
              {
                title: "Signer",
                desc: "Accompagnement jusqu'à la remise des clés.",
              },
            ]}
            imageUrl="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600"
            onCallClick={() => {}}
          />
        </div>
      </section>

      {/* 13) Calculette */}
      <section
        ref={calcRef}
        aria-label="Outils d'achat – calculette"
        className={`relative py-24 bg-white transition-all duration-700 ${calcShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <ToolsBudgetCalc
            currency="CHF"
            defaultIncomeMonthly={9000}
            defaultDownPayment={200000}
            defaultRate={2.5}
            defaultYears={25}
            onSearch={(budgetMax) =>
              goCatalogue(toQS({ priceMax: Math.round(budgetMax) }))
            }
          />
        </div>
      </section>

      {/* 15) Newsletter / Alertes */}
      <section
        ref={alertsRef}
        className={`relative py-24 bg-white transition-all duration-700 ${alertsShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <ToolsAlerts
            zonesOptions={["Genève", "Coppet", "Nyon", "Lausanne", "Montreux"]}
            typeOptions={["Appartement", "Maison", "Villa", "Attique", "Loft"]}
            onCreateAlert={handleCreateAlert}
            defaultCollapsed={true}
          />
        </div>
      </section>

      {/* 16) Pont vers VENTE */}
      <AlreadyOwner toEstimate="/estimer" toSell="/vendre" />
    </main>
  );
}
