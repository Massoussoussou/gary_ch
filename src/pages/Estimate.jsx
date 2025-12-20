// src/pages/Estimate.jsx — Module 1 (écran d’accueil uniquement)
// Fond plein écran + assombrissement + titre + bouton "Commencer" (non cliquable)
// Aucune logique d’étapes ici : on ajoute ça au Module 2.

import React, { useRef, useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Building2, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CTAFuturaGlow, { CalculatorIcon } from "../components/CTAFuturaGlow.jsx";
import CTAWhiteSweep from "../components/CTAWhiteSweep.jsx";


// Variantes d'entrée "smooth"
const panelVariants = {
  hidden:  { opacity: 0, y: 64, scale: 0.985 },
  show:    { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.42, ease: [0.22,1,0.36,1] } },
  exit:    { opacity: 0, y: 24, scale: 0.995, transition: { duration: 0.28, ease: [0.22,1,0.36,1] } },
};

const contentStagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.04, delayChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};


const ORANGE = "#FF4A3E"

// === Image de fond libre de droit (Unsplash). Tu peux changer l’URL si tu veux ===
const HERO_BG = "https://images.unsplash.com/photo-1515266591878-f93e32bc5937?q=80&w=2400&auto=format&fit=crop"

// Images de fond par étape (libres de droit)
// 0=Type, 1=Sous-type, 2=Localisation, 3=Surface, 4=État, 5=Atouts, 6=Récap
const STEP_BG = [
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=2400&auto=format&fit=crop", // 0
  "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=2400&auto=format&fit=crop", // 1
  "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2400&auto=format&fit=crop", // 2
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2400&auto=format&fit=crop", // 3
  "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d19?q=80&w=2400&auto=format&fit=crop", // 4
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=2400&auto=format&fit=crop", // 5
  "https://images.unsplash.com/photo-1496307653780-42ee777d4833?q=80&w=2400&auto=format&fit=crop", // 6
];




function DynamicBackground({ bgSrc, fadeSrc, onFadeDone }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none select-none">
      {/* Image de BASE : toujours visible (pas animée) */}
      <img
        src={bgSrc}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover will-change-[opacity,transform] transform-gpu"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />

      {/* Image OVERLAY : se fade-in puis on la “commit” en base */}
      <AnimatePresence>
        {fadeSrc && (
          <motion.img
            key={fadeSrc}
            src={fadeSrc}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover will-change-[opacity,transform] transform-gpu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            // quand le fade-in est terminé : on remplace l'image de base et on retire l'overlay
            onAnimationComplete={(def) => {
              if (def === "animate") onFadeDone?.();
            }}
          />
        )}
      </AnimatePresence>

      {/* Overlay sombre léger */}
      <div className="absolute inset-0 bg-black/25" />
    </div>
  );
}


export default function Estimate() {
  const [bgSrc, setBgSrc] = useState(HERO_BG);
  const [fadeSrc, setFadeSrc] = useState(null);
  const [started, setStarted] = useState(false);
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: Type, 1: Sous-type
    useEffect(() => {
  const target = started ? STEP_BG[Math.min(step, STEP_BG.length - 1)] : HERO_BG;
  if (!target || target === bgSrc || target === fadeSrc) return;

  const img = new Image();
  img.decoding = "async";
  img.onload = () => setFadeSrc(target); // on prépare le crossfade
  img.src = target;
}, [started, step, bgSrc, fadeSrc]);


  const [form, setForm] = useState({


    
  // 0–1
  type: null,
  sousType: "",

  // 2 Localisation
  ville: "",
  canton: "",
  annee: "",

  // 3 Surface & composition
  surface: "",
  terrain: "",
  pieces: "",
  chambres: "",
  sallesEau: "",

  // 4 État
  etat: "",  // "neuf|rafraichir|renover|lourd"

  // 5 Atouts (+ m² optionnels)
  atouts: {
    jardin: false, piscine: false, vue: false,
    garage: false, garageM2: "",
    parkingInterieur: false, parkingExterieur: false,
    cave: false, caveM2: "",
    balcon: false, balconM2: "",
    terrasse: false, terrasseM2: "",
  },

  // 6 Récap / contact (si tu veux)
  nom: "", prenom: "", email: "", telephone: "", adresse: ""
});
  const maxStep = 6;
const canGoNext = (s = step, f = form) => {
  switch (s) {
    case 0: return !!f.type;
    case 1: return !!f.sousType;
    case 2: return !!f.ville && !!f.canton; // annee facultative
    case 3: return !!f.surface && !!f.pieces; // règles simples
    case 4: return !!f.etat;
    case 5: return true; // atouts facultatifs
    case 6: return !!f.nom && !!f.email; // minimum pour envoyer
    default: return true;
  }
};
const next = () => setStep((s) => Math.min(s + 1, maxStep));
const prev = () => setStep((s) => Math.max(s - 1, 0));

  const canNext = useMemo(() => (step === 0 ? !!form.type : step === 1 ? !!form.sousType : true), [step, form]);
  // === Étape 6 : scroll contrôlé ===
const scrollRef = useRef(null);

useEffect(() => {
  if (started) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}, [step, started]);


  return (
    <div className="relative z-10 isolate min-h-screen grid place-items-center px-4">
      {/* Fond dynamique */}
      <DynamicBackground
  bgSrc={bgSrc}
  fadeSrc={fadeSrc}
  onFadeDone={() => { setBgSrc(fadeSrc); setFadeSrc(null); }}
/>
  {/* === VOILE BLANC DOUX (identique au style "Acheter") === */}
  <div aria-hidden className="fixed inset-0 z-10 pointer-events-none">
    <div className="absolute inset-0 bg-black/10" />
    <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-transparent md:from-white/55 md:via-white/25 md:to-transparent" />
    <div className="absolute inset-0 md:bg-gradient-to-r md:from-white/55 md:via-white/25 md:to-transparent" />
  </div>

  
{/* Couche centrée commune (rend cliquables seulement les sections internes) */}
<div className={`${!started ? 'fixed inset-0 flex items-center justify-center' : 'relative py-16'} z-20 px-4`}>
  <AnimatePresence initial={false} mode="wait">
    {/* === HERO Estimer — clone strict, SANS image, AVEC tuile verre === */}
    {!started && (
      <section className="relative isolate min-h-[100svh] flex items-center pointer-events-auto">
        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-8 py-14 sm:py-16 md:py-28">
          {/* ✅ Mobile centré / Desktop identique */}
          <div className="relative flex justify-center md:justify-start">
            <div
              className="
                relative w-full
                max-w-[92vw] sm:max-w-[min(900px,84vw)]
                mx-auto md:mx-0
                md:translate-x-[-160px]
                md:-translate-y-[-50px]
              "
            >
              {/* ✅ tuile verre : arrondi + shadow sur mobile uniquement */}
              <div className="absolute -inset-y-5 -inset-x-4 sm:-inset-y-6 sm:-inset-x-6 md:-inset-y-6 md:-left-6 md:-right-6 bg-white/55 backdrop-blur-sm rounded-3xl md:rounded-none shadow-[0_22px_70px_-45px_rgba(0,0,0,0.45)] md:shadow-none" />

              <div className="relative z-10 text-center text-black px-3 sm:px-0 py-5 sm:py-0">
                <p className="text-[12px] md:text-[13px] uppercase tracking-[0.2em] text-neutral-600 mb-3">
                  Estimer
                </p>

                {/* ✅ H1 : plus petit sur mobile, inchangé sur md+ */}
                <h1 className="font-serif tracking-[-0.03em] leading-[0.95] md:leading-[0.9] text-[clamp(2.6rem,11vw,4.2rem)] md:text-[clamp(4.2rem,10vw,7.6rem)]">
                  Estimer votre bien<span className="text-[#FF4A3E]">,</span>
                  <br />
                  <span className="block">simplement.</span>
                </h1>

                <p className="mt-5 text-[clamp(1.05rem,2.1vw,1.4rem)] text-neutral-900/90 max-w-[52ch] mx-auto">
                  Estimation gratuite en 7 étapes, fondée sur des données marché et validée par nos experts.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <CTAFuturaGlow
                    label="Démarrer l’estimation"
                    Icon={CalculatorIcon}
                    onClick={() => { setStarted(true); setStep(0); }}
                    splitDist="35px"
                    minWidth={360}
                  />
                  <CTAWhiteSweep to="/contact" label="Contacter GARY" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    )}


    {/* === WIZARD (questionnaire) === */}
    {started && (
      <motion.section
        key="wizard"
        initial={{ opacity: 0, y: -4, scale: 0.995 }}   // démarre déjà au centre (légèrement au-dessus)
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        exit={{ opacity: 0, y: -4, scale: 0.995 }}
        transition={{ duration: 0.30, ease: [0.22, 1, 0.36, 1] }}
        className="w-full md:w-[min(96vw,1400px)] mx-auto pointer-events-auto"      >
        <div className="rounded-3xl border border-white/20 bg-white/70 backdrop-blur-sm shadow-md overflow-hidden">
          <div
  ref={scrollRef}
  className={`px-8 md:px-14 py-8 md:py-10 min-h-[420px] ${
    step === 6
      ? 'max-h-[calc(100vh-160px)] overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/20'
      : 'overflow-visible'
  }`}
>
            {/* header */}
            <div className="text-center">
              <h2 className="font-serif text-3xl md:text-4xl">Estimation — Étape {step + 1}</h2>
              <p className="text-sm text-black/60 mt-1">Répondez simplement à chaque étape.</p>
            </div>

       

           {/* === CONTENU DES ÉTAPES === */}
<div className="mt-8">
  <motion.div
    key={step}
    initial={{ opacity: 0, y: -2 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -2 }}
    transition={{ duration: 0.22, ease: "easeOut" }}
  >
    {step === 0 ? (
      <StepType
        value={form.type}
        onChange={(v) => setForm({ ...form, type: v, sousType: "" })}
      />
    ) : step === 1 ? (
      <StepSousType
        type={form.type}
        value={form.sousType}
        onChange={(v) => setForm({ ...form, sousType: v })}
      />
    ) : step === 2 ? (
      <StepLocalisation
        value={{ ville: form.ville, canton: form.canton, annee: form.annee }}
        onChange={(vals) => setForm({ ...form, ...vals })}
      />
    ) : step === 3 ? (
      <StepSurface
        value={{
          surface: form.surface,
          terrain: form.terrain,
          pieces: form.pieces,
          chambres: form.chambres,
          sallesEau: form.sallesEau,
        }}
        onChange={(vals) => setForm({ ...form, ...vals })}
      />
    ) : step === 4 ? (
  <StepEtat
    value={form.etat}
    onChange={(v) => setForm({ ...form, etat: v })}
  />

    ) : step === 5 ? (
      <StepAtouts
        value={form.atouts}
        onChange={(at) => setForm({ ...form, atouts: at })}
      />
    ) : (
      <StepRecap form={form} setForm={setForm} />
    )}
  </motion.div>
</div>

{/* === FOOTER === */}
<div className="mt-10 flex items-center justify-between">
  {/* RETOUR : blanc, opaque */}
  <button
    onClick={prev}
    disabled={step === 0}
    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
               bg-white text-black border border-black/10 shadow-sm
               transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0
               disabled:opacity-40 disabled:cursor-not-allowed"
  >
    ← Retour
  </button>

  {/* CONTINUER : animé (lift + shadow) ; caché à l'étape 6 */}
  {step < 6 && (
    <button
      onClick={next}
      disabled={!canGoNext()}
      className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white
                 shadow-lg transition will-change-transform
                 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0
                 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ backgroundColor: '#FF4A3E' }}
    >
      Continuer
      <span
        className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-0.5"
        aria-hidden
      >
        →
      </span>
    </button>
  )}
</div>


          </div>
        </div>
      </motion.section>
    )}
  </AnimatePresence>
</div>


    </div>
  )
}

// === UI ===
function Badge({ children }) {
  return (
    <span
      className="inline-flex items-center px-5 py-2 rounded-full
                 text-[clamp(14px,1.4vw,18px)] font-medium
                 text-white border border-white bg-transparent
                 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]
                 select-none"
    >
                 
      {children}
    </span>
  )
}

function CtaBig({ children, onClick, disabled = false }) {
  // Effet glow + balayages; flèche qui glisse au hover (group-hover)
  const btnRef = useRef(null);

  const onMove = (e) => {
    if (disabled) return;
    const el = btnRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  const onLeave = () => {
    const el = btnRef.current; if (!el) return;
    el.style.removeProperty("--x");
    el.style.removeProperty("--y");
  };

  return (
    <button
      ref={btnRef}
      onClick={disabled ? undefined : onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      disabled={disabled}
      aria-disabled={disabled}
      className={`group relative inline-flex items-center justify-center rounded-3xl
                  px-12 md:px-16 py-6 md:py-8 text-2xl md:text-3xl font-semibold text-white
                  shadow-[0_16px_50px_rgba(255,74,62,0.45)]
                  ${disabled ? "cursor-not-allowed" : "active:scale-[0.98]"} select-none`}
      style={{ background: "linear-gradient(180deg,#FF4A3E,#E43E33)" }}
    >
      {/* glow focalisé */}
      <span
        aria-hidden
        className={`absolute -inset-px rounded-3xl blur-2xl transition-opacity duration-300
                    ${disabled ? "opacity-40" : "opacity-50 group-hover:opacity-80"}`}
        style={{
          background:
            "radial-gradient(220px 220px at var(--x,50%) var(--y,50%), rgba(255,255,255,0.45), rgba(255,255,255,0) 60%)",
        }}
      />

      {/* balayages */}
      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <span
          className="cta-sweep absolute top-0 bottom-0 -left-[60%] w-[60%] opacity-35"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)",
            transform: "skewX(-18deg)",
          }}
        />
        <span
          className="cta-sweep-quick absolute top-0 bottom-0 -left-[60%] w-[60%] opacity-0 group-hover:opacity-70"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 100%)",
            transform: "skewX(-18deg)",
          }}
        />
      </span>

      {/* === CONTENU : texte + petite flèche SVG qui se décale au hover === */}
      <span className="relative z-10 inline-flex items-center gap-3">
        <span>{children}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="w-6 h-6 translate-x-0 transition-transform duration-300 ease-out group-hover:translate-x-1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </span>

      {/* keyframes pour les balayages */}
      <style>{`
        @keyframes sweep { 
          0% { transform: translateX(0) skewX(-18deg); } 
          100% { transform: translateX(320%) skewX(-18deg); } 
        }
        @keyframes sweepQuick { 
          0% { transform: translateX(0) skewX(-18deg); } 
          100% { transform: translateX(320%) skewX(-18deg); } 
        }
        .cta-sweep { animation: sweep 2.4s linear infinite; }
        button.group:hover .cta-sweep { animation-duration: 1.4s; }
        .cta-sweep-quick { animation: none; }
        button.group:hover .cta-sweep-quick { animation: sweepQuick 0.55s linear 1; }
        @media (prefers-reduced-motion: reduce) {
          .cta-sweep, .cta-sweep-quick { animation: none !important; }
        }
      `}</style>
    </button>
  );
}

function BubbleOption({ icon: Icon, label, active, onClick }) {
  return (
   <div className="group flex flex-col items-center gap-3 w-[12rem] md:w-[13.5rem] shrink-0">
      <motion.button
        type="button"
        aria-label={label}
        aria-pressed={active}
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.985 }}
        onClick={onClick}
        className={`relative isolate overflow-hidden grid place-items-center
                   w-40 h-40 md:w-48 md:h-48 rounded-full border transition will-change-transform
                    ${active
                      ? 'bg-[var(--gary-primary,#FF4A3E)] border-[var(--gary-primary,#FF4A3E)] text-white shadow-xl shadow-[rgba(255,74,62,0.35)]'
                      : 'bg-white/95 border-white/70 hover:border-white hover:shadow-2xl hover:shadow-black/20'}`}
      >
        {active && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full ring-8 ring-white/20"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
            />
            <motion.div
              className="absolute inset-0 rounded-full z-0 pointer-events-none"
              initial={{ scale: 0.2, opacity: 0.95 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
              style={{ background: ORANGE }}
            />
          </>
        )}

      <Icon aria-hidden className={`relative z-10 w-14 h-14 md:w-16 md:h-16 ${active ? 'text-white' : 'text-black'}`} />
      </motion.button>

      {/* nom toujours visible */}
      <span className="text-base text-black leading-tight text-center drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
        {label}
      </span>
    </div>
  )
}

function StepType({ value, onChange }) {
  return (
    <div className="text-center">
      <h3 className="font-serif text-2xl">Quel est votre type de bien ?</h3>
      <p className="text-black/60 mt-1">Choisissez une catégorie.</p>

      <div className="flex flex-wrap justify-center gap-10 mt-8">
        <BubbleOption icon={Home} label="Maison" active={value === 'maison'} onClick={() => onChange('maison')} />
        <BubbleOption icon={Building2} label="Appartement" active={value === 'appartement'} onClick={() => onChange('appartement')} />
      </div>
    </div>
  )
}

 function StepSousType({ type, value, onChange }) {
  const options = type === "maison"
    ? [
        { key: "Individuelle",        Icon: IconDetached },
        { key: "Jumelée",             Icon: IconSemi },
        { key: "Contiguë",            Icon: IconRow },
        { key: "Contiguë en pignon",  Icon: IconCorner },
        { key: "Autre",               Icon: IconHouseOther },
      ]
    : [
        { key: "Attique",        Icon: IconPenthouse },
        { key: "Comble",         Icon: IconAttic },
        { key: "Duplex",         Icon: IconDuplex },
        { key: "Rez de Jardin",  Icon: IconGardenLevel },
        { key: "Traversant",     Icon: IconCrossVent },
        { key: "Autre",          Icon: IconAptOther },
      ];

  return (
    <div className="text-center">
      <h3 className="font-serif text-2xl">
        {type === "maison" ? "Type de maison" : "Type d'appartement"}
      </h3>
      <p className="text-black/60 mt-1">Sélectionnez un sous-type.</p>

      <div className="mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 place-items-center">
          {options.map(({ key, Icon }) => (
            <div key={key} className="justify-self-center">
              <BubbleOption
                icon={Icon}
                label={key}
                active={value === key}
                onClick={() => onChange(key)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}




function StepLocalisation({ value, onChange }) {
  const update = (k, v) => onChange({ ...value, [k]: v });
  const villes = ["Genève", "Cologny", "Chêne-Bourg", "Neuchâtel", "Lausanne", "Montreux"];
  const cantons = ["GE", "VD", "VS", "NE", "FR", "TI"];

  return (
    <div>
      <h3 className="font-serif text-2xl text-center">Où se situe le bien ?</h3>
      <p className="text-black/60 mt-1 text-center">Commune, canton et (facultatif) année de construction.</p>

      <div className="mt-6 grid md:grid-cols-3 gap-5">
        <div>
          <label className="text-sm text-black/70">Ville</label>
          <input list="villes" placeholder="ex. Genève"
            className="w-full rounded-xl border border-black/15 bg-white/90 pl-3 pr-3 py-2 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
            value={value.ville} onChange={(e) => update('ville', e.target.value)} />
          <datalist id="villes">{villes.map(v => <option key={v} value={v} />)}</datalist>
        </div>

        <div>
          <label className="text-sm text-black/70">Canton</label>
          <input list="cantons" placeholder="ex. GE"
            className="w-full rounded-xl border border-black/15 bg-white/90 pl-3 pr-3 py-2 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
            value={value.canton} onChange={(e) => update('canton', e.target.value.toUpperCase())} />
          <datalist id="cantons">{cantons.map(v => <option key={v} value={v} />)}</datalist>
        </div>

        <div>
          <label className="text-sm text-black/70">Année</label>
          <input type="number" placeholder="ex. 2008"
            className="w-full rounded-xl border border-black/15 bg-white/90 pl-3 pr-3 py-2 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
            value={value.annee} onChange={(e) => update('annee', e.target.value)} />
        </div>
      </div>
    </div>
  );
}
function StepEtat({ value, onChange }) {
  const options = [
    { key: "neuf",        label: "Neuf / Rénové",         Icon: IconSparkle },
    { key: "rafraichir",  label: "À rafraîchir",          Icon: IconRoller },
    { key: "renover",     label: "À rénover",             Icon: IconWrench },
    { key: "lourd",       label: "Rénovation lourde",     Icon: IconHardHat },
  ];

  return (
    <div className="text-center">
      <h3 className="font-serif text-2xl">État du bien</h3>
      <p className="text-black/60 mt-1">Choisissez l’état général.</p>

      {/* Grille centrée (2 / 3 / 4 colonnes) avec gros boutons ronds */}
      <div className="mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 place-items-center">
          {options.map(({ key, label, Icon }) => (
            <div key={key} className="justify-self-center">
              <BubbleOption
                icon={Icon}
                label={label}
                active={value === key}
                onClick={() => onChange(key)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Aide (caractères échappés) */}
      
    </div>
  );
}


function StepAtouts({ value, onChange }) {
  const toggle = (k) => {
    const next = { ...value, [k]: !value[k] };
    // nettoyer la surface si on désactive
    if (!next[k]) {
      if (k === 'garage') next.garageM2 = '';
      if (k === 'cave') next.caveM2 = '';
      if (k === 'balcon') next.balconM2 = '';
      if (k === 'terrasse') next.terrasseM2 = '';
    }
    onChange(next);
  };

  // 9 atouts (4 + 4 + 1)
  const atouts = [
    { k: "jardin", label: "Jardin", Icon: IconLeaf },
    { k: "piscine", label: "Piscine", Icon: IconWaves },
    { k: "vue", label: "Vue d'exception", Icon: IconMountain },
    { k: "garage", label: "Garage/Box", Icon: IconCar, size: "garageM2" },
    { k: "parkingInterieur", label: "Parking intérieur", Icon: IconParking },
    { k: "parkingExterieur", label: "Parking extérieur", Icon: IconParking },
    { k: "cave", label: "Cave", Icon: IconBox, size: "caveM2" },
    { k: "balcon", label: "Balcon", Icon: IconBalcony, size: "balconM2" },
    { k: "terrasse", label: "Terrasse", Icon: IconTerrace, size: "terrasseM2" },
  ];

  const top8 = atouts.slice(0, 8);
  const last = atouts[8];

  return (
    <div className="text-center">
      <h3 className="font-serif text-2xl">Atouts du bien</h3>
      <p className="text-black/60 mt-1">Sélectionnez vos atouts. Ajoutez la surface quand c’est pertinent.</p>

      {/* 2 lignes de 4 */}
      <div className="mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 md:gap-y-6 gap-x-2 md:gap-x-3 place-items-center">
          {top8.map(({ k, label, Icon }) => (
            <div key={k} className="justify-self-center">
              <BubbleOption
                icon={Icon}
                label={label}
                active={!!value[k]}
                onClick={() => toggle(k)}
              />
            </div>
          ))}

          {/* dernière ligne : 1 seul élément centré */}
          <div className="col-span-2 md:col-span-4 flex justify-center">
            <BubbleOption
              icon={last.Icon}
              label={last.label}
              active={!!value[last.k]}
              onClick={() => toggle(last.k)}
            />
          </div>
        </div>
      </div>

      {/* champs m² pour les atouts actifs qui en ont besoin */}
      <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
        {atouts.filter(a => a.size && value[a.k]).map(({ k, label, size }) => (
          <div key={k}>
            <label className="text-sm text-black/70">{label} — Surface (m²)</label>
            <input
              type="number" inputMode="numeric" placeholder="m²"
              className="w-full rounded-xl border border-black/15 bg-white/90 pl-3 pr-3 py-2 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
              value={value[size] || ""}
              onChange={(e) => onChange({ ...value, [size]: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}




function StepRecap({ form, setForm }) {
  const formatAtouts = (at) => {
    const labels = {
      jardin: "Jardin", piscine: "Piscine", vue: "Vue d'exception",
      garage: "Garage/Box", parkingInterieur: "Parking intérieur", parkingExterieur: "Parking extérieur",
      cave: "Cave", balcon: "Balcon", terrasse: "Terrasse",
    };
    const sized = { garage: "garageM2", cave: "caveM2", balcon: "balconM2", terrasse: "terrasseM2" };
    const items = [];
    for (const k of Object.keys(labels)) {
      if (form.atouts[k]) {
        let txt = labels[k];
        if (sized[k] && Number(form.atouts[sized[k]] || 0) > 0) {
          txt += ` (${form.atouts[sized[k]]} m²)`;
        }
        items.push(txt);
      }
    }
    return items.length ? items.join(", ") : "—";
  };

  return (

    <div className="pt-2">
      <h3 className="font-serif text-2xl text-center">Récapitulatif</h3>
      <div className="mt-6 grid md:grid-cols-2 gap-6 text-sm">
        <div className="bg-white/80 rounded-xl border border-black/10 p-4">

         <h4 className="font-semibold mb-3 text-lg md:text-xl">Bien</h4>
         <div className="space-y-1.5 text-[15px] md:text-base leading-relaxed">
           <div>Type : <b className="font-semibold">{form.type || "—"}</b></div>
           <div>Sous-type : <b className="font-semibold">{form.sousType || "—"}</b></div>
           <div>Localisation : <b className="font-semibold">{form.ville || "—"} {form.canton ? `(${form.canton})` : ""}</b></div>
           <div>Année : <b className="font-semibold">{form.annee || "—"}</b></div>
           <div>Surface : <b className="font-semibold">{form.surface || "—"} m²</b> — Terrain : <b className="font-semibold">{form.terrain || "—"} m²</b></div>
           <div>Pièces/Chambres/SDE : <b className="font-semibold">{form.pieces || "—"}</b> / <b className="font-semibold">{form.chambres || "—"}</b> / <b className="font-semibold">{form.sallesEau || "—"}</b></div>
           <div>État : <b className="font-semibold">{form.etat || "—"}</b></div>
           <div>Atouts : <b className="font-semibold">{formatAtouts(form.atouts)}</b></div>
         </div>
        </div>

        <div className="bg-white/80 rounded-xl border border-black/10 p-4">
          <h4 className="font-semibold mb-2">Vos coordonnées</h4>
          <div className="grid grid-cols-2 gap-3">

           <input placeholder="Nom" className="rounded-lg border border-black/15 bg-white/90 px-3 py-2"
                  value={form.nom} onChange={(e)=> setForm(f => ({ ...f, nom: e.target.value }))} />
           <input placeholder="Prénom" className="rounded-lg border border-black/15 bg-white/90 px-3 py-2"
                  value={form.prenom} onChange={(e)=> setForm(f => ({ ...f, prenom: e.target.value }))} />
           <input placeholder="Email" className="rounded-lg border border-black/15 bg-white/90 px-3 py-2 col-span-2"
                  value={form.email} onChange={(e)=> setForm(f => ({ ...f, email: e.target.value }))} />
           <input placeholder="Téléphone" className="rounded-lg border border-black/15 bg-white/90 px-3 py-2 col-span-2"
                  value={form.telephone} onChange={(e)=> setForm(f => ({ ...f, telephone: e.target.value }))} />
           <input placeholder="Adresse" className="rounded-lg border border-black/15 bg-white/90 px-3 py-2 col-span-2"
                  value={form.adresse} onChange={(e)=> setForm(f => ({ ...f, adresse: e.target.value }))} />
          </div>

         <button
           className="mt-5 w-full px-6 py-3 rounded-xl text-white transition
                      hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0
                      focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
           style={{ backgroundColor: "#FF4A3E" }}
           onClick={() => alert("Soumis (mock). À brancher sur ton API/CRM.")}
         >
            Envoyer ma demande d’estimation
          </button>
        </div>
      </div>
    </div>
  );
}





function StepSurface({ value, onChange }) {
  const update = (k, v) => onChange({ ...value, [k]: v });

  return (
    <div>
      <h3 className="font-serif text-2xl text-center">Surface & composition</h3>
      <p className="text-black/60 mt-1 text-center">Indiquez les surfaces et les pièces principales.</p>

      <div className="mt-6 grid md:grid-cols-3 gap-5">
        <FieldNum label="Surface habitable (m²)" value={value.surface} onChange={(v) => update('surface', v)} />
        <FieldNum label="Terrain (m²)" value={value.terrain} onChange={(v) => update('terrain', v)} />
        <FieldNum label="Pièces" value={value.pieces} onChange={(v) => update('pieces', v)} />
        <FieldNum label="Chambres" value={value.chambres} onChange={(v) => update('chambres', v)} />
        <FieldNum label="Salles d’eau" value={value.sallesEau} onChange={(v) => update('sallesEau', v)} />
      </div>
    </div>
  );
}

function FieldNum({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-black/70">{label}</label>
      <input
        type="number"
        inputMode="numeric"
        className="w-full rounded-xl border border-black/15 bg-white/90 pl-3 pr-3 py-2
                   focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}


const commonIconProps = {
  viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round",
  className: "w-12 h-12 md:w-14 md:h-14"
};

function IconLeaf(props) {
  return (
    <svg {...commonIconProps} {...props}>
      <path d="M5 12c7-7 14-6 14-6s1 7-6 14c-5 5-10 1-10-4 0-2 1-3 2-4" />
    </svg>
  );
}
function IconWaves(props) {
  return (
    <svg {...commonIconProps} {...props}>
      <path d="M3 12c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />
      <path d="M3 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />
    </svg>
  );
}
function IconMountain(props) {
  return (
    <svg {...commonIconProps} {...props}>
      <path d="M3 20l7-12 3 5 2-3 6 10H3z" />
      <path d="M10 8l1.5 2.5" />
    </svg>
  );
}
function IconCar(props) {
  return (
    <svg {...commonIconProps} {...props}>
      <path d="M3 13l2-6h14l2 6" />
      <path d="M5 16h14" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </svg>
  );
}
function IconParking(props) {
  return (
    <svg {...commonIconProps} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6h-4" />
    </svg>
  );
}
function IconBox(props) {
  return (
    <svg {...commonIconProps} {...props}>
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M12 13v8" />
      <path d="M3 8v8l9 5 9-5V8" />
    </svg>
  );
}
function IconBalcony(props) {
  return (
    <svg {...commonIconProps} {...props}>
      <path d="M4 10h16" />
      <path d="M6 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" />
      <path d="M6 14h12M6 18h12" />
      <path d="M6 14v4M10 14v4M14 14v4M18 14v4" />
    </svg>
  );
}
function IconTerrace(props) {
  return (
    <svg {...commonIconProps} {...props}>
      <path d="M3 20h18" />
      <path d="M6 20V12l6-3 6 3v8" />
      <path d="M9 9l3-3 3 3" />
    </svg>
  );
}


const _iconProps = {
  viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round",
  className: "w-12 h-12 md:w-14 md:h-14"
};

function IconSparkle(props) {
  return (
    <svg {..._iconProps} {...props}>
      <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" />
      <path d="M5 18l1-2 2-1-2-1-1-2-1 2-2 1 2 1 1 2z" />
      <path d="M18 5l.7 1.6L20 7l-1.3.4L18 9l-.7-1.6L16 7l1.3-.4L18 5z" />
    </svg>
  );
}

function IconRoller(props) {
  return (
    <svg {..._iconProps} {...props}>
      <rect x="3" y="4" width="10" height="6" rx="2" />
      <path d="M13 7h4a2 2 0 0 1 2 2v1" />
      <path d="M12 10v6" />
      <rect x="10.5" y="16" width="3" height="5" rx="1" />
    </svg>
  );
}

function IconWrench(props) {
  return (
    <svg {..._iconProps} {...props}>
      <path d="M14 7a4 4 0 0 0-5.7 5.6l-4.6 4.6a2 2 0 1 0 2.8 2.8l4.6-4.6A4 4 0 0 0 14 7z" />
      <circle cx="14.5" cy="6.5" r="1" />
    </svg>
  );
}

function IconHardHat(props) {
  return (
    <svg {..._iconProps} {...props}>
      <path d="M3 19h18" />
      <path d="M6 19v-3a6 6 0 0 1 12 0v3" />
      <path d="M12 7V4" />
      <path d="M9 11V7" />
      <path d="M15 11V7" />
    </svg>
  );
}


const subIconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "w-16 h-16 md:w-18 md:h-18"
};

/* ——— Maisons ——— */
function IconDetached(props){ return(
  <svg {...subIconProps} {...props}>
    <path d="M3 11l9-7 9 7" />
    <path d="M6 10v10h12V10" />
    <path d="M10 20v-5h4v5" />
    <path d="M4 14h4" />
    <path d="M16 14h4" />
  </svg>
);}
function IconSemi(props){ return(
  <svg {...subIconProps} {...props}>
    <path d="M3 11l9-7 9 7" />
    <path d="M12 4v16" />
    <path d="M6 10v10h6" />
    <path d="M18 10v10h-6" />
  </svg>
);}
function IconRow(props) {
  return (
    <svg {...subIconProps} {...props}>
      {/* Toits (3 pignons alignés) */}
      <path d="M2 12L6 8L10 12" />
      <path d="M10 12L14 8L18 12" />
      <path d="M18 12L22 8.5L22 12" />

      {/* Façade continue (murs mitoyens visibles) */}
      <rect x="2" y="12" width="20" height="8" rx="1" />
      <path d="M10 12V20" />
      <path d="M18 12V20" />

      {/* Détails (portes) */}
      <path d="M6 20v-3" />
      <path d="M14 20v-3" />
      <path d="M20 20v-3" />
    </svg>
  );
}

function IconCorner(props){ return(
  <svg {...subIconProps} {...props}>
    <path d="M4 20V8l8-5 8 5v12" />
    <path d="M12 3v17" />
    <path d="M12 12h8" />
  </svg>
);}
function IconHouseOther(props){ return(
  <svg {...subIconProps} {...props}>
    <path d="M3 11l9-7 9 7" />
    <path d="M6 10v10h12V10" />
    <circle cx="12" cy="15" r="2.5" />
  </svg>
);}

/* ——— Appartements ——— */
function IconPenthouse(props){ return(
  <svg {...subIconProps} {...props}>
    <path d="M3 20h18" />
    <path d="M6 20V9l6-4 6 4v11" />
    <path d="M10 20v-5h4v5" />
    <path d="M9 9h6" />
  </svg>
);}
function IconAttic(props){ return(
  <svg {...subIconProps} {...props}>
    <path d="M3 20h18" />
    <path d="M6 20V12l6-6 6 6v8" />
    <path d="M12 8v4" />
  </svg>
);}
function IconDuplex(props){ return(
  <svg {...subIconProps} {...props}>
    <rect x="4" y="7" width="16" height="12" rx="2" />
    <path d="M12 7v12" />
    <path d="M7.5 11h3" />
    <path d="M13.5 11h3" />
  </svg>
);}
function IconGardenLevel(props){ return(
  <svg {...subIconProps} {...props}>
    <rect x="4" y="8" width="16" height="10" rx="2" />
    <path d="M3 18h18" />
    <path d="M6 18c1.5-2 3.5-2 5 0" />
  </svg>
);}
function IconCrossVent(props){ return(
  <svg {...subIconProps} {...props}>
    <rect x="4" y="6" width="16" height="12" rx="2" />
    <path d="M8 9h8" />
    <path d="M8 15h8" />
    <path d="M6 12h4" />
    <path d="M14 12h4" />
  </svg>
);}
function IconAptOther(props){ return(
  <svg {...subIconProps} {...props}>
    <rect x="4" y="6" width="16" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);}
