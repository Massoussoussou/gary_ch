// src/pages/Contact.jsx
import React, { useState } from "react";
import BackgroundSlideshow from "../components/common/BackgroundSlideshow.jsx";
import SquareTile from "../components/common/SquareTile.jsx";
import TabsDemandType from "../components/forms/TabsDemandType.jsx";
import useSendLead from "../hooks/useSendLead.js";

const ESTIMATE_BG = [
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d19?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496307653780-42ee777d4833?q=80&w=2400&auto=format&fit=crop",
];

const HERO_BG =
  "https://images.unsplash.com/photo-1515266591878-f93e32bc5937?q=80&w=2400&auto=format&fit=crop";

export default function Contact() {
  const [type, setType] = useState("Estimation");
  const { send, sending, error, success } = useSendLead();

  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);

    // Honeypot check (champ caché "website")
    if (fd.get("website")) return;

    const sujet = fd.get("sujet") || "";
    const message = fd.get("message") || "";
    const fullMessage = `[${type}]${sujet ? ` ${sujet}` : ""}\n\n${message}`.trim();

    await send({
      sender_lastname: fd.get("nom") || "",
      sender_firstname: fd.get("prenom") || "",
      sender_email: fd.get("email") || "",
      sender_number: fd.get("tel") || "",
      sender_message: fullMessage,
      property_reference: "CONTACT-GENERAL",
    });
  };

  return (
    <div className="relative isolate min-h-screen overflow-x-clip">
      <BackgroundSlideshow images={[HERO_BG, ...ESTIMATE_BG]} duration={6.2} />

      <main className="relative z-10 flex justify-center px-4 pt-24 pb-14 sm:py-16">
        <section className="w-full max-w-[min(980px,94vw)]">
          <SquareTile base={780}>
            <div
              data-square-inner
              className="relative z-10 px-5 sm:px-8 md:px-14 py-6 sm:py-8 md:py-12"
            >
              <header className="text-center mt-2 md:mt-8">
                <h1 className="font-serif tracking-[-0.03em] leading-tight text-[clamp(2.15rem,9vw,3.5rem)] text-black">
                  Parlez-nous de votre{" "}
                  <span className="text-[#FF4A3E]">projet</span>
                </h1>

                <p className="mt-3 text-[clamp(1rem,1.9vw,1.1rem)] text-black/70 max-w-md mx-auto">
                  Nous vous recontactons rapidement pour vous conseiller.
                </p>

                <div className="mt-6 md:mt-9">
                  <TabsDemandType type={type} onChange={setType} />
                </div>
              </header>

              <form onSubmit={onSubmit} className="mt-8 grid gap-5 md:gap-6">
                {/* Honeypot anti-spam — caché */}
                <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

                {success && (
                  <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-800 text-sm">
                    Merci ! Votre message a été envoyé. Nous vous recontactons rapidement.
                  </div>
                )}
                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
                    Erreur : {error}. Veuillez réessayer.
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="nom" className="text-sm text-black/70">
                      Nom
                    </label>
                    <input
                      id="nom"
                      name="nom"
                      required
                      className="w-full rounded-lg border border-black/15 bg-white/95 px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
                    />
                  </div>
                  <div>
                    <label htmlFor="prenom" className="text-sm text-black/70">
                      Prénom
                    </label>
                    <input
                      id="prenom"
                      name="prenom"
                      required
                      className="w-full rounded-lg border border-black/15 bg-white/95 px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="text-sm text-black/70">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full rounded-lg border border-black/15 bg-white/95 px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
                      placeholder="vous@exemple.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="tel" className="text-sm text-black/70">
                      Téléphone
                    </label>
                    <input
                      id="tel"
                      name="tel"
                      type="tel"
                      inputMode="tel"
                      required
                      className="w-full rounded-lg border border-black/15 bg-white/95 px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
                      placeholder="+41 79 123 45 67"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="sujet" className="text-sm text-black/70">
                    Sujet
                  </label>
                  <input
                    id="sujet"
                    name="sujet"
                    className="w-full rounded-lg border border-black/15 bg-white/95 px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
                    placeholder="Estimer mon bien / Vendre mon bien..."
                  />
                </div>

                <input type="hidden" name="type" value={type} />

                <div>
                  <label htmlFor="message" className="text-sm text-black/70">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full rounded-lg border border-black/15 bg-white/95 px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
                    placeholder="Décrivez votre bien (type, surface, localisation), vos délais, vos questions…"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-xs text-black/60 leading-relaxed">
                    En envoyant ce formulaire, vous acceptez d'être recontacté(e)
                    par GARY.
                  </p>

                  <button
                    type="submit"
                    disabled={sending}
                    className="group inline-flex items-center justify-center gap-2 px-7 md:px-9 py-3 rounded-2xl text-white shadow-lg transition hover:shadow-xl disabled:opacity-60 disabled:cursor-wait"
                    style={{ backgroundColor: "#FF4A3E" }}
                  >
                    {sending ? "Envoi en cours…" : "Envoyer"}
                    <span
                      aria-hidden
                      className="inline-block translate-x-0 transition-transform duration-200 ease-out group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </SquareTile>
        </section>
      </main>
    </div>
  );
}
