import React, { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import data from "../data/projects.json";
import "../styles/projet.css";
import CTAFuturaGlow, { VillaIcon, InfoIcon } from "../components/CTAFuturaGlow.jsx";
import CTAWhiteSweep from "../components/CTAWhiteSweep.jsx";


/* Easing qui ralentit bien sur la fin */
const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);

export default function ProjetNeuf() {
  const wrapRef = useRef(null);
  const idxRef = useRef(0);
  const lockRef = useRef(false);
  const navigate = useNavigate();

  const slides = useMemo(() => {
    const intro = {
      id: "__intro__",
      name: "Découvrez nos projets",
      tagline: "Des lieux d’exception, une signature GARY.",
      cover:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000&auto=format&fit=crop",
    };
    const coming = { id: "__coming__", kind: "coming" };
    return [intro, ...data, coming];
  }, []);

  // Ajoute / retire .is-visible pour déclencher l’anim de texte
  useEffect(() => {
    const root = wrapRef.current;
    const secs = root?.querySelectorAll(".proj-screen") ?? [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-visible");
          else e.target.classList.remove("is-visible");
        });
      },
      { root, threshold: 0.55 }
    );
    secs.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Scroll piloté (molette / clavier / touch) avec freinage en fin
  useEffect(() => {
    const el = wrapRef.current;
    const vh = () => el.clientHeight;
    const total = slides.length;

    const goTo = (next) => {
      if (lockRef.current) return;
      const target = Math.max(0, Math.min(total - 1, next));
      if (target === idxRef.current) return;

      lockRef.current = true;
      const start = performance.now();
      const dur = 980;
      const startTop = el.scrollTop;
      const endTop = target * vh();

      const step = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const k = easeOutQuint(t);
        el.scrollTo(0, startTop + (endTop - startTop) * k);
        if (t < 1) requestAnimationFrame(step);
        else {
          idxRef.current = target;
          lockRef.current = false;
        }
      };
      requestAnimationFrame(step);
    };

    const onWheel = (e) => {
      if (lockRef.current) return e.preventDefault();
      if (Math.abs(e.deltaY) < 6) return;
      e.preventDefault();
      goTo(idxRef.current + (e.deltaY > 0 ? 1 : -1));
    };
    const onKey = (e) => {
      if (lockRef.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goTo(idxRef.current + 1);
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goTo(idxRef.current - 1);
      }
    };

    // touch
    let touchY = 0;
    let dragging = false;
    const onStart = (e) => {
      touchY = e.touches[0].clientY;
      dragging = true;
    };
    const onMove = (e) => {
      if (!dragging || lockRef.current) return;
      const dy = e.touches[0].clientY - touchY;
      if (Math.abs(dy) > 44) {
        goTo(idxRef.current + (dy < 0 ? 1 : -1));
        dragging = false;
      }
    };
    const onEnd = () => {
      dragging = false;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onEnd);

    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, [slides.length]);

const handleKnowMore = (projectId) => {
  if (!wrapRef.current) return;

  // 1) Anim inverse sur les textes visibles
  const current = wrapRef.current.querySelectorAll(
    ".proj-screen.is-visible .proj-title, .proj-screen.is-visible .proj-sub, .proj-screen.is-visible .proj-title-slow, .proj-screen.is-visible .proj-sub-slow"
  );
  current.forEach((el) => el.classList.add("leave-reverse"));

  // 2) Overlay noir (une seule fois, et on le marque)
  let overlay = document.querySelector(".transition-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "transition-overlay";
    overlay.dataset.source = "list"; // marqueur
    document.body.appendChild(overlay);
  }
  overlay.classList.add("is-on");

  // 3) Navigue rapidement
  setTimeout(() => {
    navigate(`/projets-neufs/${projectId}`);
  }, 120);

  // 4) Filet de sécurité: si pour une raison X la navigation ne part pas, on retire l'overlay
  setTimeout(() => {
    if (overlay && document.body.contains(overlay)) {
      overlay.classList.remove("is-on");
      setTimeout(() => overlay.remove(), 300);
    }
  }, 3000);
};

// Petit "tic" de scroll pour déclencher l'anim, sans bloquer le scroll ensuite
const nudgeScroll = () => {
  const el = wrapRef.current; // ton conteneur scrollable, sinon fallback fenêtre
  const delta =
    el?.clientHeight ? Math.round(Math.min(140, Math.max(80, el.clientHeight * 0.06))) : 120;

  if (el && el.scrollBy) {
    el.scrollBy({ top: delta, left: 0, behavior: "smooth" });
  } else {
    window.scrollBy({ top: delta, left: 0, behavior: "smooth" });
  }
};



function CTAEnrollButton(){
  const btnRef = React.useRef(null);
  const onMove = (e) => {
    const el = btnRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  const onLeave = () => {
    const el = btnRef.current; if (!el) return;
    el.style.removeProperty("--x"); el.style.removeProperty("--y");
  };
  const brand = "#FF4A3E"; const brandDark = "#E43E33";

  return (
    <>
      <button
        type="button"
        aria-label="Je m’inscris"
        ref={btnRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="cta-enroll group relative inline-flex items-center justify-center rounded-2xl px-10 py-5 text-xl font-semibold text-white shadow-[0_12px_40px_rgba(255,74,62,0.35)] active:scale-[0.98] transition-transform"
        style={{ background: `linear-gradient(180deg, ${brand}, ${brandDark})` }}
      >
        <span
          aria-hidden
          className="absolute -inset-px rounded-2xl opacity-50 blur-xl transition-opacity duration-300 group-hover:opacity-80"
          style={{
            background:
              "radial-gradient(180px 180px at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.45), rgba(255,255,255,0) 60%)",
          }}
        />
        <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <span className="cta-sweep absolute top-0 bottom-0 -left-[60%] w-[60%] opacity-35"
                style={{ background:"linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)",
                         transform:"skewX(-18deg)" }} />
          <span className="cta-sweep-quick absolute top-0 bottom-0 -left-[60%] w-[60%] opacity-0 group-hover:opacity-70"
                style={{ background:"linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 100%)",
                         transform:"skewX(-18deg)" }} />
        </span>
        <span className="relative z-10 inline-flex items-center gap-3">
          Je m’inscris
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </span>
      </button>

      {/* animations (copie About) */}
      <style>{`
        @keyframes sweep {
          0% { transform: translateX(0) skewX(-18deg); }
          100%{ transform: translateX(320%) skewX(-18deg); }
        }
        @keyframes sweepQuick {
          0% { transform: translateX(0) skewX(-18deg); }
          100%{ transform: translateX(320%) skewX(-18deg); }
        }
        .cta-enroll .cta-sweep { animation: sweep 2.4s linear infinite; }
        .cta-enroll:hover .cta-sweep { animation-duration: 1.4s; }
        .cta-enroll .cta-sweep-quick { animation: none; }
        .cta-enroll:hover .cta-sweep-quick { animation: sweepQuick 0.55s linear 1; }
        @media (prefers-reduced-motion: reduce) {
          .cta-enroll .cta-sweep, .cta-enroll .cta-sweep-quick { animation:none !important; }
        }
      `}</style>
    </>
  );
}




  return (
    <main ref={wrapRef} className="proj-wrap bg-black text-white">
      {slides.map((p) => (
        <section key={p.id} className="proj-screen">
          {p.id === "__intro__" && (
  <>
    <div
      className="proj-bg"
      style={{ backgroundImage: `url(${p.cover})` }}
    />
    {/* Voile blanc doux au-dessus de l'image (et sous la tuile) */}
<div aria-hidden className="absolute inset-0 z-[1] pointer-events-none">
  <div className="absolute inset-0 bg-black/10" />
  <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/25 to-transparent md:from-white/60 md:via-white/30 md:to-transparent" />
  <div className="absolute inset-0 md:bg-gradient-to-r md:from-white/55 md:via-white/25 md:to-transparent" />
</div>


    {/* === HERO intro : tuile qui s’adapte au contenu + texte étalé === */}
{/* === HERO intro — version alignée sur le style #2 === */}
<section className="relative mx-auto w-full max-w-7xl px-6 md:px-8 py-20 md:py-28">
  <div className="relative flex justify-start">
    {/* Tuile verre/blanc derrière le texte */}
    <div className="relative w-full max-w-[min(900px,84vw)]">
      <div className="absolute -inset-y-6 -left-6 -right-6 bg-white/55 backdrop-blur-sm z-0 rounded-none" />
      
      {/* Contenu */}
      <div className="relative z-10 text-center text-black">
        <p className="text-[12px] md:text-[13px] uppercase tracking-[0.2em] text-neutral-600 mb-3">
          Découvrez nos projets
        </p>

        <h1 className="font-serif tracking-[-0.03em] leading-[0.9] text-[clamp(3.2rem,8.8vw,7.2rem)]">
          <span className="block">Des lieux</span>
          d’exception<span className="text-[#FF4A3E]">,</span>
          <span className="block">une signature</span>
          <span className="block">GARY.</span>
        </h1>
        <p className="mt-5 text-[clamp(1.1rem,2.1vw,1.4rem)] text-neutral-900/90 max-w-[52ch] mx-auto">
          Sélection stricte, visites en 48h, data-pricing et accompagnement clé en main.
        </p>

    {/* Boutons */}
    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
 
<CTAFuturaGlow
  label="Parcourir les Projets"
  Icon={VillaIcon}
  onClick={nudgeScroll}
/>
          <CTAWhiteSweep
        to="/contact"
        label="S'inscrire"
      />
    </div>
    </div>
  </div>
</div>
</section>


    
  </>
)}

          {/* PROJETS */}
          {p.id !== "__intro__" && p.id !== "__coming__" && (
            <>
              <div
                className="proj-bg"
                style={{ backgroundImage: `url(${p.cover})` }}
              />
              <div className="absolute inset-0 proj-veil-proj" />
              <div className="proj-overlay">
                <div className="text-sm tracking-wide opacity-90 mb-2">
                  {p.type} — {p.city}
                </div>
                <h2 className="proj-title-slow proj-serif text-[42px] md:text-[64px] leading-[1.05] tracking-tight">
                  {p.name}
                </h2>
                {p.tagline && (
                  <p className="proj-sub-slow mt-3 text-base md:text-lg">
                    {p.tagline}
                  </p>
                )}
                <div className="mt-6">
                  <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => handleKnowMore(p.id)}
                  >
                    En savoir plus
                  </button>
                </div>
              </div>
              <div className="proj-arrow">
                <svg viewBox="0 0 64 36">
                  <path
                    d="M16 12 L32 28 L48 12"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </>
          )}

          {/* CTA (ex-Coming soon) */}
{p.id === "__coming__" && (
  <>
    <div
      className="proj-bg"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop)",
      }}
    />
    {/* filtre orange + léger assombrissement pour la lisibilité */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(0deg, rgba(255,74,62,.22), rgba(255,74,62,.22)), radial-gradient(80% 80% at 50% 50%, rgba(0,0,0,.06), rgba(0,0,0,.18))",
      }}
      aria-hidden
    />

    <div className="cta-coming-wrap">
      <div className="cta-coming-inner">
        <h2 className="cta-coming-title proj-serif">COMING&nbsp;SOON</h2>

        <p className="cta-coming-sub">
          Inscrivez-vous pour recevoir en avant-première les
          informations sur nos futurs programmes neufs.
        </p>

        {/* Form posé directement sur la slide */}
        <form className="cta-coming-form">
          <div className="field">
            <label>Prénom</label>
            <input type="text" placeholder="Votre prénom" />
          </div>
          <div className="field">
            <label>Nom</label>
            <input type="text" placeholder="Votre nom" />
          </div>
          <div className="field">
            <label>Adresse e-mail</label>
            <input type="email" placeholder="prenom.nom@email.com" />
          </div>
          <div className="field">
            <label>Téléphone</label>
            <input type="tel" placeholder="+33 6 12 34 56 78" />
          </div>
          <div className="field field--full">
            <label>Je suis intéressé par</label>
            <select defaultValue="maison">
              <option value="maison">Maison</option>
              <option value="appartement">Appartement</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          {/* Bouton identique à la page About */}
          <div className="field field--full flex justify-center pt-1">
            <CTAEnrollButton />
          </div>
        </form>
      </div>
    </div>
  </>
)}

        </section>
      ))}
    </main>
  );
}
