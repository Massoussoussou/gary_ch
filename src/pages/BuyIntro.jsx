// src/pages/BuyIntro.jsx
import { useMemo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* Données & composants (→ chemins en ../...) */
import dataRaw from "../data/listings.json";
import BandCarousel from "../components/BandCarousel.jsx";
import WeekSpotlightCard from "../components/cards/WeekCardV1.jsx";
import FiltersBarCompact from "../components/FiltersBarCompact.jsx";
import USPSection, { DEFAULT_BUY_USPS as buyUSPs } from "../components/USPSection.jsx";
import MapExplorer from "../components/MapExplorer.jsx";
import TrustStrip from "../components/TrustStrip.jsx";
import ProcessSteps from "../components/ProcessSteps.jsx";
import FiltersBarSticky from "../components/FiltersBarSticky.jsx";
import ToolsBudgetCalc from "../components/ToolsBudgetCalc.jsx";
import ContactBand from "../components/ContactBand.jsx";
import ToolsAlerts from "../components/ToolsAlerts.jsx";
import AlreadyOwner from "../components/AlreadyOwner.jsx";
import SoldCircularSection from "../components/SoldCircularSection.jsx";
import WeekCardV1 from "../components/cards/WeekCardV1.jsx";
import ListingCardSold from "../components/cards/ListingCardSold.jsx";


import CTAFuturaGlow from "../components/CTAFuturaGlow.jsx";
import CTAWhiteSweep from "../components/CTAWhiteSweep.jsx";




/* ---------- hooks utilitaires ---------- */

//Fonction qui charge une video en delai dans le hero, pour ameliorer le LCP
function pickVideoSrc() {
  // Conditions d’économie data / motion
  const conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
  const saveData = !!conn?.saveData;
  const slow = /^(slow-)?2g$/.test(conn?.effectiveType || "");
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  if (saveData || slow || reduced) return null; // pas de vidéo

  const isDesktop = window.matchMedia?.("(min-width: 1024px)")?.matches;
  // WebM d’abord si supporté, sinon MP4
  const canWebM = document.createElement("video").canPlayType("video/webm");
  if (isDesktop) {
    return canWebM ? "/media/buy/hero24.webm" : "/media/buy/hero24.mp4";
  } else {
    return canWebM ? "/media/buy/hero24.webm" : "/media/buy/hero24.mp4";
  }
}


function useRevealOnce(options) {
  const [shown, setShown] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setShown(true); return; }
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries, observer) => {
        const [entry] = entries;
        if (entry.isIntersecting) { setShown(true); observer.disconnect(); }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8%", ...(options || {}) }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return [ref, shown];
}

/* ---------- helpers data ---------- */
function hasTag(it, rx) {
  const hay = [it?.bandeau, it?.status, it?.ribbon, ...(it?.tags || []), ...(it?.badges || [])]
    .filter(Boolean)
    .join(" ");
  return rx.test(String(hay));
}
function isRecent(it, days = 21) {
  if (!it?.createdAt) return false;
  const d = new Date(it.createdAt);
  if (isNaN(d)) return false;
  return Date.now() - d.getTime() <= days * 86400 * 1000;
}
const data = (dataRaw || []).map((it) => ({
  ...it,
  prix: +(+it.prix || 0),
  surface_m2: +(+it.surface_m2 || 0),
}));

const uniqSorted = (arr) =>
  [...new Set(arr.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), "fr"));
function deriveFacets(items) {
  return {
    cities: uniqSorted(items.map((i) => i.ville || "")),
    cantons: uniqSorted(items.map((i) => i.canton || "")),
    types: uniqSorted(items.map((i) => i.type || "")),
    features: uniqSorted(items.flatMap((i) => i.equipements || [])),
  };
}

/* ---------- querystring ---------- */
function toQS(f) {
  const params = new URLSearchParams();
  Object.entries(f || {}).forEach(([k, v]) => {
    if (v == null) return;
    if (typeof v === "string" && v.trim() === "") return;
    if (typeof v === "boolean") { if (!v) return; params.set(k, "1"); return; }
    if (Array.isArray(v)) { if (!v.length) return; v.forEach((x) => params.append(k, x)); return; }
    if (typeof v === "object") { Object.entries(v).forEach(([kk, vv]) => { if (vv) params.set(`${k}.${kk}`, "1"); }); return; }
    params.set(k, String(v));
  });
  const s = params.toString();
  return s ? `?${s}` : "";
}

/* ---------- décor minimal ---------- */
function BeigeOrnament({ className = "" }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 -z-10 ${className}`}>
      <div className="absolute left-[5%] top-[10%] h-[26rem] w-[26rem] bg-[#FAF0E6]/40 blur-3xl" />
      <div className="absolute right-[2%] top-[35%] h-[22rem] w-[22rem] bg-[#FF4A3E]/8 blur-3xl" />
    </div>
  );
}

/* ---------- composant principal ---------- */
export default function BuyIntro() {
  const navigate = useNavigate();
  const facets = useMemo(() => deriveFacets(data), []);

  /* sections data */
  const weekItem = useMemo(() => {
    const bySpotlight = data.find((d) => String(d.spotlight || "").toLowerCase() === "xxl");
    if (bySpotlight) return bySpotlight;
    const byTag = data.find((d) => hasTag(d, /feature|semaine|week/i));
    if (byTag) return byTag;
    return ([...data].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))[0] || data[0]);
  }, []);

  const nouveautes   = useMemo(() => data.filter((d) => hasTag(d, /nouveau/i) || isRecent(d)), []);
  const exclusivites = useMemo(() => data.filter((d) => hasTag(d, /exclu/i)), []);
  const vendus       = useMemo(() => data.filter((d) => hasTag(d, /vendu/i) || d.vendu), []);
  const available    = useMemo(() => data.filter((d) => !(hasTag(d, /vendu/i) || d.vendu)), []);

  /* recherche */
  const [resultCount, setResultCount] = useState(available.length);
  const filtersRef = useRef({});
  function coerceNum(v) {
    if (v === "" || v == null) return null;
    const n = +String(v).replace(/[^\d.]/g, "");
    return Number.isFinite(n) ? n : null;
  }
  function filterListings(items, f = {}) {
    return items.filter((it) => {
      if (f.city && String(it.ville || "").toLowerCase() !== String(f.city).toLowerCase()) return false;
      if (f.type && String(it.type || "").toLowerCase() !== String(f.type).toLowerCase()) return false;
      const pMin = coerceNum(f.priceMin), pMax = coerceNum(f.priceMax);
      const price = +(+it.prix || 0);
      if (pMin != null && price < pMin) return false;
      if (pMax != null && price > pMax) return false;
      const surfMin = coerceNum(f.surfaceMin), surfMax = coerceNum(f.surfaceMax);
      const surf = +(+it.surface_m2 || 0);
      if (surfMin != null && surf < surfMin) return false;
      if (surfMax != null && surf > surfMax) return false;
      const chambres = +(it.chambres ?? it.nb_chambres ?? it.bedrooms ?? it.pieces ?? 0);
      const sdb = +(it.sdb ?? it.salles_de_bain ?? it.bathrooms ?? 0);
      if (coerceNum(f.chambresMin) != null && chambres < +f.chambresMin) return false;
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
  const [filtRef,   filtShown]   = useRevealOnce({ threshold: 0.01 });
  const [weekRef,   weekShown]   = useRevealOnce({ threshold: 0.12 });
  const [exRef,     exShown]     = useRevealOnce();
  const [newRef,    newShown]    = useRevealOnce();
  const [zonesRef,  zonesShown]  = useRevealOnce();
  const [mapRef,    mapShown]    = useRevealOnce();
  const [uspRef,    uspShown]    = useRevealOnce();
  const [vendRef,   vendShown]   = useRevealOnce();
  const [testRef,   testShown]   = useRevealOnce();
  const [journalRef,journalShown]= useRevealOnce();
  const [procRef,   procShown]   = useRevealOnce();
  const [calcRef,   calcShown]   = useRevealOnce();
  const [alertsRef, alertsShown] = useRevealOnce();

  const [ready, setReady] = useState(false);
  const src = useMemo(() => {
                try { return pickVideoSrc() || "/media/buy/hero24.mp4"; }
                catch { return "/media/buy/hero24.mp4"; }
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
      {/* Sticky compacte — n’apparaît qu’après l’ancre #filters-under-hero 
      <FiltersBarSticky
        facets={facets}
        onSearch={(filters) => goCatalogue(toQS(filters))}
        onChange={handleFiltersChange}
        resultCount={resultCount}
        anchorId="filters-under-hero"
        topOffset={62}
      />
      
      */}

      {/* 1) HERO FULL SCREEN (image éditoriale + H1 + gros CTAs) */}
      {/* HERO — version luxe, texte lisible + très grand */}
      <section className="relative isolate min-h-[100svh] flex items-center overflow-x-clip">
        <div className="absolute inset-0">
      {/* BACKGROUND */}
      <div className="sticky top-0 h-[100svh] -z-10">
        {/* Poster = LCP */}
        <img
          src="/media/hero-poster.webp" alt="" width="1920" height="1080"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
          fetchpriority="high" decoding="async"
        />

        {/* Vidéo (si conditions OK) */}
       
          {/* Vidéo (montée quoi qu'il arrive) */}
<video
  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  poster="/media/hero-poster.webp"
  onLoadedData={() => setReady(true)}
  onCanPlay={() => setReady(true)}      // fallback
  onError={(e) => console.warn("Video error", e)}
  aria-hidden="true"
>
  {/* 1) source préférée (déduite) */}
  <source src={src} type={src.endsWith(".webm") ? "video/webm" : "video/mp4"} />
  {/* 2) fallback autre codec même nom */}
  <source
    src={src.endsWith(".webm") ? src.replace(".webm", ".mp4") : src.replace(".mp4", ".webm")}
    type={src.endsWith(".webm") ? "video/mp4" : "video/webm"}
  />
</video>
        
        
        {/* voile global très doux pour équilibrer l'image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-transparent md:from-white/55 md:via-white/25 md:to-transparent" />
          <div className="absolute inset-0 md:bg-gradient-to-r md:from-white/55 md:via-white/25 md:to-transparent" />
        </div>

        </div>
        </div>
        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-8 py-14 sm:py-16 md:py-28">
          {/* Panneau verre/blanc derrière le texte pour une lisibilité parfaite */}
          <div className="relative flex justify-center md:justify-start">
            <div className="relative w-full max-w-[92vw] sm:max-w-[min(900px,84vw)] mx-auto md:mx-0">
              {/* verre : arrondi + shadow seulement sur mobile */}
              <div className="absolute -inset-y-5 -inset-x-4 sm:-inset-y-6 sm:-inset-x-6 md:-inset-y-6 md:-left-6 md:-right-6 bg-white/55 backdrop-blur-sm rounded-3xl md:rounded-none shadow-[0_22px_70px_-45px_rgba(0,0,0,0.45)] md:shadow-none" />

              <div className="relative text-center px-3 sm:px-0 py-5 sm:py-0">
                <p className="text-[12px] md:text-[13px] uppercase tracking-[0.2em] text-neutral-600 mb-3">
                  Acheter
                </p>

                {/* ✅ H1 : plus petit sur mobile, identique sur md+ */}
                <h1 className="font-serif tracking-[-0.03em] leading-[0.95] md:leading-[0.9] text-[clamp(2.6rem,11vw,4.2rem)] md:text-[clamp(4.2rem,10vw,7.6rem)]">
                  L’immobilier d’exception<span className="text-[#FF4A3E]">,</span>
                  <br />
                  <span className="block">simplement.</span>
                </h1>

                <p className="mt-5 text-[clamp(1.05rem,2.1vw,1.4rem)] text-neutral-900/90 max-w-[52ch] mx-auto">
                  Sélection stricte, visites en 48h, data-pricing et accompagnement clé en main.
                </p>

                {/* CTAs */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <CTAFuturaGlow label="Voir les annonces" to="/acheter/catalogue" minWidth={260} />
                  <CTAWhiteSweep to="/contact" label="Contacter GARY" />
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </section>


  {/* 2) Recherche + Trust — ruban luxe zoomé */}
<section className="relative isolate overflow-x-clip">
  {/* Ruban beige + VOILE global pour l'ambiance luxe */}
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
      {/* Carte “verre” + ZOOM fort de la barre */}
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
   

  {/* TRUST STRIP — plus GRAND + voile blanc */}
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


      {/* 3) Maison de la semaine — WeekCardV1 */}
<div
  ref={weekRef}
  className={`transition-all duration-[1000ms] ${
    weekShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  }`}
>
  <WeekCardV1
    item={weekItem}
    mode="split"
    bg="slideshow"     // 'none' | 'blur' | 'slideshow'
    bgOpacity={0.65}   // monte à 0.7 si tu veux encore plus présent
    bgBlur={4}         // 0–6 (4 c’est déjà peu flou)
    overlay="light"    // 'none' si tu veux zéro voile
    bgIntervalMs={9000}
  />
</div>


      {/* 4) Exclusivités */}
      <section
        ref={exRef}
        className={`relative pt-12 pb-8 md:pt-16 md:pb-10 bg-white transition-all duration-[1200ms] ${
                    exShown ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`}
      >
        <BeigeOrnament className="opacity-30" />
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <BandCarousel title="Exclusivités" items={exclusivites} cta="Voir tout" onCta={() => goCatalogue("")} />
        </div>
      </section>

      {/* 5) Nouveautés */}
      <section
        ref={newRef}
        className={`relative pt-6 md:pt-8 pb-24 md:pb-28 bg-[#FAF6F0] transition-all duration-[1200ms] ${
                    newShown ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`}
      >
        <BeigeOrnament />
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <BandCarousel title="Nouveautés" items={nouveautes} cta="Voir tout" onCta={() => goCatalogue("?sort=recent")} />
        </div>
      </section>

      {/* 6) Zones / Quartiers (placeholder sobre) 


      <section
        ref={zonesRef}
        className={`relative py-24 bg-white transition-all duration-700 ${zonesShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2 className="text-3xl md:text-5xl leading-[1.05] tracking-tight mb-8">Zones & quartiers</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {(facets.cities || []).slice(0, 6).map((c) => (
              <button
                key={c}
                onClick={() => goCatalogue(toQS({ city: c }))}
                className="group relative aspect-[4/3] overflow-hidden rounded-none border border-black/10 bg-gradient-to-br from-[#FAF6F0] to-white"
              >
                <span className="absolute left-3 bottom-3 md:left-4 md:bottom-4 text-[15px] md:text-[17px] font-medium tracking-tight">
                  {c}
                </span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#FF4A3E]/5" />
              </button>
            ))}
          </div>
        </div>
      </section> 
      
      */}




      {/* 7) Carte interactive
      
      <section
  ref={mapRef}
  className={`relative bg-[#FAF6F0] transition-opacity duration-700 ${
    mapShown ? "opacity-100" : "opacity-0"
  } pt-0 md:pt-2 pb-16 md:pb-24`}
>
  <BeigeOrnament />
  <div className="max-w-7xl mx-auto px-6 md:px-8">
    <MapExplorer listings={data} onMarkerClick={() => {}} />
  </div>
</section>

    */}

      {/*
      
      8) USP plein écran 
      <section ref={uspRef} className="relative py-0">
        <div className={`transition-opacity duration-700 ${uspShown ? "opacity-100" : "opacity-0"}`}>
          <USPSection items={buyUSPs} stickyTopClass="top-24" />
        </div>
      </section>
      
      */}

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
            <div><div className="text-3xl md:text-4xl font-medium tabular-nums">+{vendus.length}</div><div className="text-sm text-zinc-600">biens déjà vendus</div></div>
            <div><div className="text-3xl md:text-4xl font-medium tabular-nums">48h</div><div className="text-sm text-zinc-600">délai moyen visite</div></div>
            <div><div className="text-3xl md:text-4xl font-medium tabular-nums">30%</div><div className="text-sm text-zinc-600">off-market</div></div>
          </div>
        </div>
      </section>

      {/* 10) Témoignages (sobre) 
      <section
        ref={testRef}
        className={`relative py-24 bg-[#FAF6F0] transition-all duration-700 ${testShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <BeigeOrnament />
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2 className="text-3xl md:text-5xl leading-[1.05] tracking-tight mb-8">Ils nous ont confié leur projet</h2>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {[
              { q: "Accompagnement irréprochable, visibilité parfaite sur tout le process.", a: "M. Dubois" },
              { q: "Sélection très qualitative, on gagne du temps et on achète serein.", a: "C. Morel" },
              { q: "Négociation et financement gérés d’une main de maître.", a: "Famille R." },
            ].map((t, i) => (
              <figure key={i} className="border border-black/10 bg-white p-5 md:p-6 rounded-none">
                <blockquote className="text-[15px] md:text-[16px] leading-relaxed text-neutral-800">“{t.q}”</blockquote>
                <figcaption className="mt-3 text-sm text-neutral-500">— {t.a}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>*/}

      {/* 11) Journal / Conseils 
      <section
        ref={journalRef}
        className={`relative py-24 bg-white transition-all duration-700 ${journalShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2 className="text-3xl md:text-5xl leading-[1.05] tracking-tight mb-8">Journal & Conseils</h2>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {[
              { t: "Acheter en Suisse: check-list express", h: "/conseils/checklist-achat" },
              { t: "Comprendre le financement (taux, apport, stress test)", h: "/conseils/financement" },
              { t: "Négocier un bien rare sans se brûler", h: "/conseils/negociation" },
            ].map((p) => (
              <a key={p.h} href={p.h} className="block border border-black/10 bg-white p-5 md:p-6 hover:-translate-y-0.5 hover:shadow-md transition rounded-none">
                <h3 className="text-[18px] font-medium tracking-tight">{p.t}</h3>
                <p className="mt-2 text-sm text-neutral-600">Lecture 3–5 min</p>
              </a>
            ))}
          </div>
        </div>
      </section>  */}

      {/* 12) Process */}
      <section
        ref={procRef}
        className={`relative py-24 bg-[#FAF6F0] transition-all duration-700 ${procShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <BeigeOrnament />
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <ProcessSteps
            steps={[
              { title: "Définir le besoin", desc: "Critères, zone, budget, priorités." },
              { title: "Visiter", desc: "Créneaux en 48h, compte-rendu clair." },
              { title: "Offrir", desc: "Comparables & analyse de prix." },
              { title: "Financer", desc: "Pré-accord indicatif 24/48h." },
              { title: "Signer", desc: "Accompagnement jusqu’à la remise des clés." },
            ]}
            imageUrl="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600"
            onCallClick={() => {}}
          />
        </div>
      </section>

      {/* 13) Calculette */}
      <section
        ref={calcRef}
        aria-label="Outils d’achat – calculette"
        className={`relative py-24 bg-white transition-all duration-700 ${calcShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <ToolsBudgetCalc
            currency="CHF"
            defaultIncomeMonthly={9000}
            defaultDownPayment={200000}
            defaultRate={2.5}
            defaultYears={25}
            onSearch={(budgetMax) => goCatalogue(toQS({ priceMax: Math.round(budgetMax) }))}
          />
        </div>
      </section>

      {/* 14) Band Contact (bas de page, pas en topbar) 
      <section className="relative py-16 bg-[#FAF6F0]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <ContactBand onCall={() => {}} onWhatsApp={() => {}} stickyMobile variant="light" />
        </div>
      </section>*/}

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
      {/* Footer géré par le layout */}
    </main>
  );
}
