// src/pages/BuyIntro.jsx
import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* Données & composants */
import useProperties from "../hooks/useProperties.js";
import BandCarousel from "../components/BandCarousel.jsx";
import FiltersBar from "../components/FiltersBar.jsx";
import ListingGrid from "../components/ListingGrid.jsx";
import SortMenu from "../components/SortMenu.jsx";
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
import { pickVideoSrcSimple } from "../utils/video.js";

/* ---------- Fonctions de filtrage / tri (issues de Listings.jsx) ---------- */

function matchesAtouts(equipements = [], atouts = {}) {
  const has = (needle) =>
    equipements.some((x) => x?.toString().toLowerCase().includes(needle));
  let ok = true;
  if (atouts.jardin) ok = ok && has("jardin");
  if (atouts.piscine) ok = ok && has("piscine");
  if (atouts.vue) ok = ok && has("vue");
  if (atouts.garage) ok = ok && has("garage");
  if (atouts.parkingInterieur) ok = ok && (has("parking") || has("garage"));
  if (atouts.parkingExterieur) ok = ok && has("parking");
  if (atouts.cave) ok = ok && has("cave");
  if (atouts.balconTerrasse) ok = ok && (has("balcon") || has("terrasse"));
  return ok;
}

function applyFilters(items, f) {
  let res = items;
  if (f.city) res = res.filter((i) => i.ville === f.city);
  if (f.canton) res = res.filter((i) => i.canton === f.canton);
  if (f.type) res = res.filter((i) => i.type === f.type);

  const min = parseInt(f.priceMin || "0", 10);
  const max = parseInt(f.priceMax || "0", 10);
  if (min) res = res.filter((i) => i.prix >= min);
  if (max) res = res.filter((i) => i.prix <= max);

  const piecesMin = parseInt(f.piecesMin || "0", 10);
  if (piecesMin) res = res.filter((i) => i.pieces >= piecesMin);

  const chMin = parseInt(f.chambresMin || "0", 10);
  if (chMin) res = res.filter((i) => i.chambres >= chMin);

  const sdbMin = parseInt(f.sdbMin || "0", 10);
  if (sdbMin) res = res.filter((i) => i.sdb >= sdbMin);

  const sMin = parseInt(f.surfaceMin || "0", 10);
  const sMax = parseInt(f.surfaceMax || "0", 10);
  if (sMin) res = res.filter((i) => i.surface_m2 >= sMin);
  if (sMax) res = res.filter((i) => i.surface_m2 <= sMax);

  const tMin = parseInt(f.terrainMin || "0", 10);
  if (tMin)
    res = res.filter((i) => (i.terrain_m2 ? i.terrain_m2 >= tMin : true));

  if (f.meuble) res = res.filter((i) => i.meuble);

  if (f.dispoBefore) {
    const d = f.dispoBefore;
    res = res.filter((i) => !i.dispo || i.dispo <= d);
  }

  if (f.atouts) res = res.filter((i) => matchesAtouts(i.equipements, f.atouts));

  if (Array.isArray(f.extraFeatures) && f.extraFeatures.length) {
    const want = f.extraFeatures.map((s) => s.toLowerCase());
    res = res.filter((i) => {
      const eq = (i.equipements || []).map((s) => s.toLowerCase());
      return want.every((w) => eq.some((e) => e.includes(w)));
    });
  }
  return res;
}

function sortItems(items, mode) {
  const arr = [...items];
  if (mode === "prix-asc") arr.sort((a, b) => a.prix - b.prix);
  else if (mode === "prix-desc") arr.sort((a, b) => b.prix - a.prix);
  else if (mode === "surface")
    arr.sort((a, b) => b.surface_m2 - a.surface_m2);
  else if (mode === "recent")
    arr.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  return arr;
}

function hasActiveFilters(f) {
  if (!f) return false;
  return Object.entries(f).some(([k, v]) => {
    if (v == null) return false;
    if (typeof v === "string") return v.trim() !== "";
    if (typeof v === "number") return !Number.isNaN(v) && v !== 0;
    if (typeof v === "boolean") return v;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "object") return hasActiveFilters(v);
    return false;
  });
}

function parseFiltersFromQS(search) {
  const p = new URLSearchParams(search);
  const f = {};
  const pick = (k) => {
    const v = p.get(k);
    if (v !== null && v !== "") f[k] = v;
  };
  [
    "city",
    "canton",
    "type",
    "priceMin",
    "priceMax",
    "piecesMin",
    "chambresMin",
    "sdbMin",
    "surfaceMin",
    "surfaceMax",
    "terrainMin",
    "dispoBefore",
  ].forEach(pick);

  if (p.get("meuble") === "1") f.meuble = true;

  for (const [k, v] of p.entries()) {
    if (k.startsWith("atouts.") && v === "1") {
      f.atouts ??= {};
      f.atouts[k.slice(7)] = true;
    }
  }

  const extras = p.getAll("extraFeatures");
  if (extras.length) f.extraFeatures = extras;

  return f;
}

function parseSortFromQS(search) {
  const v = new URLSearchParams(search).get("sort");
  return v || "recent";
}

/* ---------- Hero content avec parallax (scroll plus lent) ---------- */
function HeroContent({ scrollToListings }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      // Le carré monte à 60% de la vitesse du scroll normal
      setOffset(window.scrollY * 0.4);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-8 py-14 sm:py-16 md:py-28"
      style={{ transform: `translateY(${offset}px)` }}
    >
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
                onClick={scrollToListings}
                minWidth={260}
              />
              <CTAWhiteSweep to="/contact" label="Contacter GARY" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- composant principal ---------- */
export default function BuyIntro() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, loading } = useProperties();
  const facets = useMemo(() => deriveFacets(data), [data]);

  /* ---- Filtres & tri (système complet issu de Listings) ---- */
  const [filters, setFilters] = useState(() =>
    parseFiltersFromQS(location.search)
  );
  const [sort, setSort] = useState(() => parseSortFromQS(location.search));

  // Re-sync si l'URL change (back/forward)
  useEffect(() => {
    setFilters(parseFiltersFromQS(location.search));
    setSort(parseSortFromQS(location.search));
  }, [location.search]);

  const filtered = useMemo(
    () => sortItems(applyFilters(data, filters), sort),
    [data, filters, sort]
  );
  const isFiltered = hasActiveFilters(filters);

  /* ---- Scroll vers la grille ---- */
  const listingsRef = useRef(null);
  const scrollToListings = () => {
    listingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

  /* reveals */
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
      {/* Vidéo de fond FIXÉE — ne scroll pas */}
      <div className="fixed inset-0" style={{ zIndex: 0 }}>
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

      {/* 1) HERO — carré opaque avec parallax (scroll plus lent) */}
      <section className="relative min-h-[100svh] flex items-center overflow-x-clip" style={{ zIndex: 1 }}>
        <HeroContent scrollToListings={scrollToListings} />
      </section>

      {/* 2) FiltersBar + SortMenu + ListingGrid — passe par-dessus */}
      <section ref={listingsRef} className="relative bg-white" style={{ zIndex: 2 }}>
        <div className="relative">
          <FiltersBar
            cities={facets.cities}
            cantons={facets.cantons}
            types={facets.types}
            features={facets.features}
            resultCount={filtered.length}
            onChange={setFilters}
            initialFilters={filters}
          />
        </div>

        <SortMenu value={sort} onChange={setSort} />

        <ListingGrid items={filtered} isFiltered={isFiltered} />
      </section>

      {/* 3) Maison de la semaine */}
      <div
        className="relative bg-white"
        style={{ zIndex: 2 }}
      >
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
      </div>

      {/* 4) Exclusivités */}
      <section
        className="relative pt-12 pb-8 md:pt-16 md:pb-10 bg-white"
        style={{ zIndex: 2 }}
      >
        <div
          ref={exRef}
          className={`transition-all duration-[1200ms] ${
            exShown ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
          }`}
        >
          <BeigeOrnament className="opacity-30" />
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <BandCarousel
              title="Exclusivités"
              items={exclusivites}
              cta="Voir tout"
              onCta={scrollToListings}
            />
          </div>
        </div>
      </section>

      {/* 5) Nouveautés */}
      <section
        className="relative pt-6 md:pt-8 pb-24 md:pb-28 bg-[#FAF6F0]"
        style={{ zIndex: 2 }}
      >
        <div
          ref={newRef}
          className={`transition-all duration-[1200ms] ${
            newShown ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
          }`}
        >
          <BeigeOrnament />
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <BandCarousel
              title="Nouveautés"
              items={nouveautes}
              cta="Voir tout"
              onCta={() => {
                setSort("recent");
                scrollToListings();
              }}
            />
          </div>
        </div>
      </section>

      {/* 6) Ventes réalisées */}
      <section
        className="relative py-24 bg-white"
        style={{ zIndex: 2 }}
      >
        <div
          ref={vendRef}
          className={`transition-all duration-700 ${vendShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <BandCarousel
            title="Déjà vendu"
            items={vendus}
            cta="Voir nos ventes"
            onCta={() => navigate("/ventes")}
            renderItem={ListingCardSold}
          />
          {/*
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
          */}
        </div>
        </div>
      </section>


      {/* 7) Process */}
      {/*
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
      </section> */}

      {/* 8) Calculette */}
      {/*
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
            onSearch={(budgetMax) => {
              setFilters((prev) => ({
                ...prev,
                priceMax: String(Math.round(budgetMax)),
              }));
              scrollToListings();
            }}
          />
        </div>
      </section>
      */}

      {/* 9) Newsletter / Alertes */}

      {/*
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
      */}

      {/* 10) TrustStrip */}
      <div className="relative bg-white" style={{ zIndex: 2 }}>
        <TrustStrip
          size="xl"
          reviewsLabel="RealAdvisor"
          reviewsUrl="https://realadvisor.ch/fr/agences-immobilieres/agence-gary"
          rating={5}
          reviewsCount={75}
        />
      </div>

      {/* 11) Pont vers VENTE */}
      <div className="relative" style={{ zIndex: 2 }}>
        <AlreadyOwner toEstimate="/estimer" toSell="/vendre" />
      </div>
    </main>
  );
}
