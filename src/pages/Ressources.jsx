import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

const INPUT_CLASS =
  "w-full px-4 py-3.5 bg-[#FAF7F4] border border-[#E5E7EB] text-gray-900 text-[15px] outline-none transition-colors focus:border-[#FF4A3E] placeholder:text-gray-400";
const LABEL_CLASS =
  "block text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500 mb-1.5";

/* ========== Modal formulaire e-book ========== */
function EbookModal({ onClose }) {
  const [form, setForm] = useState({ firstname: "", lastname: "", email: "", phone: "" });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    if (window.__lenis) window.__lenis.stop();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      if (window.__lenis) window.__lenis.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const handleChange = useCallback((e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) return;
    setStatus("sending");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_firstname: form.firstname,
          sender_lastname: form.lastname,
          sender_email: form.email,
          sender_number: form.phone,
          sender_message: "Demande de téléchargement du e-book : Les 5 erreurs qui font perdre des milliers aux vendeurs",
          property_reference: "EBOOK-GUIDE",
          website: honeypot,
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[120]" data-lenis-prevent>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-6" onClick={onClose}>
        <div
          className="relative bg-white w-full max-w-[540px] max-h-[90vh] overflow-y-auto shadow-2xl"
          style={{ animation: "ebookIn 0.35s cubic-bezier(0.22, 1, 0.36, 1)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Fermer"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8 md:p-10">
            {status === "success" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl text-gray-900 mb-3">Demande envoyée</h3>
                <p className="text-gray-500 leading-relaxed">
                  Merci pour votre intérêt. Vous recevrez votre e-book par email dans les plus brefs délais.
                </p>
                <button
                  onClick={onClose}
                  className="mt-8 text-[#FF4A3E] font-medium text-sm uppercase tracking-[0.1em] hover:underline"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-2xl md:text-3xl text-gray-900 mb-2">Recevoir le e-book</h3>
                <p className="text-gray-500 text-sm mb-8">Remplissez le formulaire et recevez votre guide gratuitement par email.</p>

                <form onSubmit={handleSubmit}>
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ position: "absolute", left: "-9999px", opacity: 0 }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={LABEL_CLASS}>Nom</label>
                      <input
                        type="text"
                        name="lastname"
                        placeholder="Votre nom"
                        required
                        value={form.lastname}
                        onChange={handleChange}
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>Prénom</label>
                      <input
                        type="text"
                        name="firstname"
                        placeholder="Votre prénom"
                        required
                        value={form.firstname}
                        onChange={handleChange}
                        className={INPUT_CLASS}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className={LABEL_CLASS}>Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="votre@email.com"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div className="mb-6">
                    <label className={LABEL_CLASS}>Téléphone <span className="font-normal text-gray-400">(optionnel)</span></label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+41 79 000 00 00"
                      value={form.phone}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-red-500 text-sm mb-4">Une erreur est survenue. Veuillez réessayer.</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group/btn relative w-full inline-flex items-center justify-center gap-2 bg-[#1a1a1a] text-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] overflow-hidden disabled:opacity-60"
                  >
                    <span className="absolute -inset-1 bg-[#FF4A3E] translate-y-[110%] group-hover/btn:translate-y-0 transition-transform duration-[0.4s] ease-[cubic-bezier(0.22,1,0.36,1)]" />
                    <span className="relative z-10">
                      {status === "sending" ? "Envoi en cours..." : "Recevoir mon e-book"}
                    </span>
                    {status !== "sending" && (
                      <svg className="relative z-10 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes ebookIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
}

/* ========== PAGE RESSOURCES ========== */
export default function Ressources() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#FAF6F0] text-[#0F1115]">
      {/* Hero section pleine largeur */}
      <section className="pt-28 md:pt-36 pb-20 md:pb-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
          {/* Header */}
          <div className="text-center mb-20 md:mb-28">
            <p className="text-[12px] md:text-[13px] uppercase tracking-[0.2em] text-neutral-500 mb-3">
              Outils et guides
            </p>
            <h1 className="font-serif tracking-[-0.03em] leading-[1.05] text-[clamp(2.8rem,8vw,4.5rem)]">
              Ressources
            </h1>
          </div>

          {/* E-book — grande carte */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            {/* Image — plus grande */}
            <div>
              <img
                src="/ebook-cover.png"
                alt="E-book GARY — Les 5 erreurs qui font perdre des milliers aux vendeurs"
                className="w-full h-auto max-w-[600px] mx-auto lg:mx-0"
              />
            </div>

            {/* Texte + CTA */}
            <div className="lg:pl-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#FF4A3E] font-semibold mb-5">
                Guide gratuit
              </p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.2rem] leading-[1.15] text-gray-900 mb-8">
                Les <span className="text-[#FF4A3E]">5 erreurs</span> qui font
                perdre des milliers aux vendeurs
              </h2>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-12 max-w-[520px]">
                Vous envisagez de vendre votre bien ? Découvrez les erreurs les plus fréquentes
                commises par les propriétaires et comment les éviter pour maximiser la valeur de
                votre vente.
              </p>

              {/* Bouton recevoir */}
              <button
                onClick={() => setModalOpen(true)}
                className="group/btn relative inline-flex items-center gap-3 bg-[#1a1a1a] text-white px-12 py-5 text-base font-semibold uppercase tracking-[0.12em] overflow-hidden"
              >
                <span className="absolute -inset-1 bg-[#FF4A3E] translate-y-[110%] group-hover/btn:translate-y-0 transition-transform duration-[0.4s] ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative z-10">Recevoir le e-book</span>
                <svg className="relative z-10 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {modalOpen && <EbookModal onClose={() => setModalOpen(false)} />}
    </main>
  );
}
