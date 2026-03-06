// src/pages/Estimate.jsx
import React, { useRef, useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import CTAFuturaGlow, { CalculatorIcon } from "../components/cta/CTAFuturaGlow.jsx";
import CTAWhiteSweep from "../components/cta/CTAWhiteSweep.jsx";
import DynamicBackground from "../components/common/DynamicBackground.jsx";

import {
  StepType,
  StepSousType,
  StepLocalisation,
  StepSurface,
  StepEtat,
  StepAtouts,
  StepRecap,
} from "../components/estimate/index.js";

// Image de fond (accueil)
const HERO_BG =
  "https://images.unsplash.com/photo-1515266591878-f93e32bc5937?q=80&w=2400&auto=format&fit=crop";

// Images de fond par étape
const STEP_BG = [
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d19?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496307653780-42ee777d4833?q=80&w=2400&auto=format&fit=crop",
];

const MAX_STEP = 6;

const INITIAL_FORM = {
  type: null,
  sousType: "",
  ville: "",
  canton: "",
  annee: "",
  surface: "",
  terrain: "",
  pieces: "",
  chambres: "",
  sallesEau: "",
  etat: "",
  atouts: {
    jardin: false,
    piscine: false,
    vue: false,
    garage: false,
    garageM2: "",
    parkingInterieur: false,
    parkingExterieur: false,
    cave: false,
    caveM2: "",
    balcon: false,
    balconM2: "",
    terrasse: false,
    terrasseM2: "",
  },
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  adresse: "",
};

function canGoNext(step, form) {
  switch (step) {
    case 0:
      return !!form.type;
    case 1:
      return !!form.sousType;
    case 2:
      return !!form.ville && !!form.canton;
    case 3:
      return !!form.surface && !!form.pieces;
    case 4:
      return !!form.etat;
    case 5:
      return true;
    case 6:
      return !!form.nom && !!form.email;
    default:
      return true;
  }
}

export default function Estimate() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [bgSrc, setBgSrc] = useState(HERO_BG);
  const [fadeSrc, setFadeSrc] = useState(null);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);

  // Précharger et changer le fond selon l'étape
  useEffect(() => {
    const target = started
      ? STEP_BG[Math.min(step, STEP_BG.length - 1)]
      : HERO_BG;
    if (!target || target === bgSrc || target === fadeSrc) return;

    const img = new Image();
    img.decoding = "async";
    img.onload = () => setFadeSrc(target);
    img.src = target;
  }, [started, step, bgSrc, fadeSrc]);

  // Scroll to top on step change
  useEffect(() => {
    if (started) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step, started]);

  const next = () => setStep((s) => Math.min(s + 1, MAX_STEP));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="relative z-10 isolate min-h-screen grid place-items-center px-4">
      <DynamicBackground
        bgSrc={bgSrc}
        fadeSrc={fadeSrc}
        onFadeDone={() => {
          setBgSrc(fadeSrc);
          setFadeSrc(null);
        }}
      />

      {/* Voile blanc doux */}
      <div aria-hidden className="fixed inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-transparent md:from-white/55 md:via-white/25 md:to-transparent" />
        <div className="absolute inset-0 md:bg-gradient-to-r md:from-white/55 md:via-white/25 md:to-transparent" />
      </div>

      <div
        className={`${!started ? "fixed inset-0 flex items-center justify-center" : "relative py-16"} z-20 px-4`}
      >
        <AnimatePresence initial={false} mode="wait">
          {/* Hero */}
          {!started && (
            <section className="relative isolate min-h-[100svh] flex items-center pointer-events-auto">
              <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-8 py-14 sm:py-16 md:py-28">
                <div className="relative flex justify-center">
                  <div className="relative w-full max-w-[92vw] sm:max-w-[min(900px,84vw)] mx-auto">
                    <div className="absolute -inset-y-5 -inset-x-4 sm:-inset-y-6 sm:-inset-x-6 md:-inset-y-6 md:-left-6 md:-right-6 bg-white/55 backdrop-blur-sm rounded-none shadow-[0_22px_70px_-45px_rgba(0,0,0,0.45)] md:shadow-none" />

                    <div className="relative z-10 text-center text-black px-3 sm:px-0 py-5 sm:py-0">
                      <p className="text-[12px] md:text-[13px] uppercase tracking-[0.2em] text-neutral-600 mb-3">
                        Estimer
                      </p>

                      <h1 className="font-serif tracking-[-0.03em] leading-[0.95] md:leading-[0.9] text-[clamp(2.6rem,11vw,4.2rem)] md:text-[clamp(4.2rem,10vw,7.6rem)]">
                        Estimer votre bien
                        <span className="text-[#FF4A3E]">,</span>
                        <br />
                        <span className="block">simplement.</span>
                      </h1>

                      <p className="mt-5 text-[clamp(1.05rem,2.1vw,1.4rem)] text-neutral-900/90 max-w-[52ch] mx-auto">
                        Estimation gratuite en 7 étapes, fondée sur des données
                        marché et validée par nos experts.
                      </p>

                      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <CTAFuturaGlow
                          label="Démarrer l'estimation"
                          Icon={CalculatorIcon}
                          onClick={() => {
                            setStarted(true);
                            setStep(0);
                          }}
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

          {/* Wizard */}
          {started && (
            <motion.section
              key="wizard"
              initial={{ opacity: 0, y: -4, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.995 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full md:w-[min(96vw,1400px)] mx-auto pointer-events-auto"
            >
              <div className="rounded-none border border-white/20 bg-white/70 backdrop-blur-sm shadow-md overflow-hidden">
                <div
                  ref={scrollRef}
                  className={`px-8 md:px-14 py-8 md:py-10 min-h-[420px] ${
                    step === 6
                      ? "max-h-[calc(100vh-160px)] overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/20"
                      : "overflow-visible"
                  }`}
                >
                  {/* Header */}
                  <div className="text-center">
                    <h2 className="font-serif text-3xl md:text-4xl">
                      Estimation — Étape {step + 1}
                    </h2>
                    <p className="text-sm text-black/60 mt-1">
                      Répondez simplement à chaque étape.
                    </p>
                  </div>

                  {/* Contenu des étapes */}
                  <div className="mt-8">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -2 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                    >
                      {step === 0 && (
                        <StepType
                          value={form.type}
                          onChange={(v) =>
                            setForm({ ...form, type: v, sousType: "" })
                          }
                        />
                      )}
                      {step === 1 && (
                        <StepSousType
                          type={form.type}
                          value={form.sousType}
                          onChange={(v) => setForm({ ...form, sousType: v })}
                        />
                      )}
                      {step === 2 && (
                        <StepLocalisation
                          value={{
                            ville: form.ville,
                            canton: form.canton,
                            annee: form.annee,
                          }}
                          onChange={(vals) => setForm({ ...form, ...vals })}
                        />
                      )}
                      {step === 3 && (
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
                      )}
                      {step === 4 && (
                        <StepEtat
                          value={form.etat}
                          onChange={(v) => setForm({ ...form, etat: v })}
                        />
                      )}
                      {step === 5 && (
                        <StepAtouts
                          value={form.atouts}
                          onChange={(at) => setForm({ ...form, atouts: at })}
                        />
                      )}
                      {step === 6 && (
                        <StepRecap form={form} setForm={setForm} />
                      )}
                    </motion.div>
                  </div>

                  {/* Footer */}
                  <div className="mt-10 flex items-center justify-between">
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

                    {step < 6 && (
                      <button
                        onClick={next}
                        disabled={!canGoNext(step, form)}
                        className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white
                                   shadow-lg transition will-change-transform
                                   hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: "#FF4A3E" }}
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
  );
}
