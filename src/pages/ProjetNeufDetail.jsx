import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import data from "../data/projects.json";
import team from "../data/team.json";

import "../styles/projet.css";

/* --------- Utilitaire : mise en sections lisibles de la 2e description --------- */
function parseSecondDescription(raw = "") {
  const txt = (raw || "").replace(/\s+/g, " ").trim();
  const sections = [];
  const labels = ["Rez-de-chaussée", "Premier étage", "Sous-sol", "Extérieur"];
  let rest = txt;

  for (let i = 0; i < labels.length; i++) {
    const label = labels[i], nextLabel = labels[i + 1];
    const startIdx = rest.indexOf(label);
    if (startIdx === -1) continue;

    const afterLabel = rest.slice(startIdx + label.length);
    const colonTrim = afterLabel.replace(/^\s*:\s*/, " ");
    let endIdx = colonTrim.length;

    if (nextLabel) {
      const nIdx = colonTrim.indexOf(nextLabel);
      if (nIdx !== -1) endIdx = nIdx;
    }
    const body = colonTrim.slice(0, endIdx).trim();
    sections.push({ title: label, body });
    rest = colonTrim.slice(endIdx);
  }
  if (sections.length === 0 && txt) sections.push({ title: "Détails", body: txt });
  return sections;
}



function SpecIcon({ name }) {
  const p = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "reference":   return (<svg {...p}><path d="M4 4h16v16H4z"/><path d="M8 8h8"/><path d="M8 12h6"/></svg>);
    case "pieces":      return (<svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>);
    case "sdb":         return (<svg {...p}><path d="M4 10h16"/><path d="M7 10V6a3 3 0 1 1 6 0v4"/><path d="M6 14v2a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-2"/></svg>);
    case "chambres":    return (<svg {...p}><path d="M3 20v-6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6"/><path d="M4 12V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v5"/><path d="M7 20v-4m10 4v-4"/></svg>);
    case "surface":     return (<svg {...p}><path d="M3 7V3h4"/><path d="M21 17v4h-4"/><rect x="5" y="5" width="14" height="14" rx="1"/></svg>);
    case "surfaceUtile":return (<svg {...p}><rect x="4" y="4" width="16" height="16" rx="2" strokeDasharray="3 3"/></svg>);
    case "terrain":     return (<svg {...p}><path d="M2 20h20"/><path d="M6 20v-5l3-2 3 2v5"/><path d="M18 20v-8l-3-2-3 2"/></svg>);
    case "vue":         return (<svg {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>);
    case "etat":        return (<svg {...p}><path d="M12 2v4m6.36-2.36-2.83 2.83M22 12h-4M18.36 18.36l-2.83-2.83M12 22v-4M7.64 18.36l2.83-2.83M2 12h4M7.64 5.64l2.83 2.83"/></svg>);
    case "terrasse":    return (<svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3m10-10h-3M5 12H2m15.07-7.07-2.12 2.12M9.05 14.95l-2.12 2.12M19.07 19.07l-2.12-2.12M9.05 9.05 6.93 6.93"/></svg>);
    case "jardin":      return (<svg {...p}><path d="M12 22v-6"/><path d="M9 12c0 3 3 4 3 4s3-1 3-4-3-6-3-6-3 3-3 6Z"/><path d="M5 22h14"/></svg>);
    default:            return (<svg {...p}><circle cx="12" cy="12" r="9"/></svg>);
  }
}






export default function ProjetNeufDetail() {
  const { id } = useParams();
  const p = useMemo(() => (data || []).find((x) => x.id === id), [id]);
  const [isReady, setIsReady] = useState(false);

  const specsRef = useRef(null);   // ancre 2e description (juste sous le hero)
  const catRef = useRef(null);     // ancre galerie
  const bottomRef = useRef(null);  // ancre bas de page (carte + agent)

  /* --------- Overlay d'entrée (voile court) --------- */
  useEffect(() => {
    let overlay = document.querySelector(".transition-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "transition-overlay is-on";
      overlay.dataset.source = "detail";
      document.body.appendChild(overlay);
    } else {
      overlay.classList.add("is-on");
    }
    const t = setTimeout(() => {
      overlay.classList.remove("is-on");
      setIsReady(true);
      setTimeout(() => {
        if (overlay && document.body.contains(overlay)) overlay.remove();
      }, 250);
    }, 120);
    return () => clearTimeout(t);
  }, []);

  /* --------- Reveal de la 2e description quand visible --------- */
  useEffect(() => {
    const el = specsRef.current; if (!el) return;
    el.setAttribute("data-reveal", "");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) el.classList.add("in"); }),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!p) {
    return (
      <div className="gary-list" style={{ padding: 20 }}>
        <p>Projet introuvable.</p>
        <Link to="/projets-neufs" className="gary-btn" style={{ marginTop: 12 }}>
          ← Retour
        </Link>
      </div>
    );
  }

  /* --------- Images de la galerie --------- */
  const images = (p.media && Array.isArray(p.media.images)) ? p.media.images : [];
  const grouped = useMemo(() => {
    const out = [];
    let i = 0;
    const isPortrait = (url) => /portrait|portr|vert/i.test(url);
    const isLandscape = (url) => /landscape|pays|hori/i.test(url);
    while (i < images.length) {
      const a = images[i];
      const portraitA = isPortrait(a) && !isLandscape(a);
      if (portraitA && i + 1 < images.length) {
        const b = images[i + 1];
        const portraitB = isPortrait(b) && !isLandscape(b);
        if (portraitB) { out.push({ kind: "pair", items: [a, b] }); i += 2; continue; }
      }
      out.push({ kind: "single", items: [a] }); i += 1;
    }
    return out;
  }, [images]);

  const address = p.address || `${p.name || ""}${p.city ? ", " + p.city : ""}`.trim();

  /* --------- Agent depuis team.json via agentSlug (fallback = 1er agent) --------- */
  const agent = useMemo(() => {
    if (p.agentSlug) {
      const found = (team || []).find((t) => t.slug === p.agentSlug);
      if (found) return found;
    }
    return (team || [])[0] || {
      name: "Conseiller GARY",
      role: "Conseiller immobilier",
      email: "contact@gary.ch",
      phone: "+41 22 557 07 00",
      photo: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=1000&auto=format&fit=crop",
    };
  }, [p]);

  /* --------- Scroll handlers --------- */
  const scrollToSpecs = () => specsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  /* --------- 2e description formatée --------- */
  const secondSections = parseSecondDescription((p.secondDescription || "").trim());

  return (
    <div className="detail-wrap text-white">
      {/* BACKDROP HERO (cover pleine, rien par-dessus) */}
      <div
        className={`hero-backdrop ${isReady ? "is-visible" : ""}`}
        style={{ backgroundImage: `url(${p.cover || ""})` }}
        aria-hidden
      />

      {/* HERO */}
      <main className="detail-hero-fixed">
        {/* Bouton retour vers Projets Neufs */}
<Link
  to="/projets-neufs"
  className="close-back-btn"
  aria-label="Revenir à la page Projets Neufs"
  title="Revenir aux projets neufs"
>
  <svg className="close-back-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
</Link>

        <section className={`hero-pane ${isReady ? "is-visible" : ""}`}>
          <header className="detail-hero__title">
            <h1 className="proj-serif">{p.name || "Projet"}</h1>
          </header>

          <aside className="detail-hero__aside">
            <div className="aside-inner">
              {(p.type || p.city) && (
                <div className="aside-city text-sm opacity-90 mb-1">
                  {p.type ? `${p.type}` : ""}{p.type && p.city ? " — " : ""}{p.city || ""}
                </div>
              )}

              <div className="aside-desc">
                {((p.longDescription || p.description || p.tagline || "") + "")
                  .split("\n")
                  .map((line, i) => (line.trim() ? <p key={i}>{line}</p> : <div key={i} className="h-2" />))}
              </div>

              {/* Bouton -> BAS DE PAGE (carte + vendeur) */}
             
            </div>
          </aside>

          {/* Flèche -> 2e description (juste sous le hero) */}
          <button className="detail-hero__cta" onClick={scrollToSpecs} aria-label="Découvrir le bien">
            <span className="cta-label">Découvrir le bien</span>
            <svg viewBox="0 0 64 36" className="cta-arrow" aria-hidden>
              <path
                d="M16 12 L32 28 L48 12"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </section>

        {/* ======= 2e DESCRIPTION (fond page, pas d'overlay) ======= */}
        <section ref={specsRef} className="detail-specs detail-specs--plain hero-like-anim">
          <article className="specs-copy overlay-copy">
            {secondSections.map((s, idx) => (
              <section key={idx} className="specs-section">
                <h3 className="specs-title hero-anim-item">{s.title}</h3>
                <p className="specs-body hero-anim-item">{s.body}</p>
              </section>
            ))}
          </article>
            <aside className="specs-aside" aria-label="Caractéristiques du bien">
    {(() => {
      const specs = p.specs || {};
      const rows = [
        { k: "reference",    label: "Référence", v: specs.reference },
        { k: "pieces",       label: "Pièces", v: specs.pieces },
        { k: "sdb",          label: "Nb de salles de bain", v: specs.sdb },
        { k: "chambres",     label: "Nb de chambres", v: specs.chambres },
        { k: "surface",      label: "Surface", v: specs.surface },
        { k: "surfaceUtile", label: "Surface utile", v: specs.surfaceUtile },
        { k: "terrain",      label: "Surface du terrain", v: specs.terrain },
        { k: "vue",          label: "Vue", v: specs.vue },
        { k: "etat",         label: "État", v: specs.etat },
        { k: "terrasse",     label: "Surface terrasse", v: specs.terrasse },
        { k: "jardin",       label: "Jardin", v: specs.jardin },
      ].filter(x => x.v);

      if (!rows.length) return null;

      return (
        <ul className="specs-grid">
          {rows.map((r, i) => (
            <li key={r.k} className="spec-chip hero-anim-item" style={{ "--i": i }}>
              <span className="spec-ico"><SpecIcon name={r.k} /></span>
              <div className="spec-texts">
                <span className="spec-label">{r.label}</span>
                <span className="spec-value">{r.v}</span>
              </div>
            </li>
          ))}
        </ul>
      );
    })()}
  </aside>

        </section>

        {/* ======= GALERIE ======= */}
        <section ref={catRef} className="catalogue">
          {grouped.length === 0 ? (
            <div className="catalogue-slide">
              <div className="proj-overlay">Aucune image disponible.</div>
            </div>
          ) : (
            grouped.map((g, i) => (
              <div key={i} className={`catalogue-slide ${g.kind === "pair" ? "catalogue-slide--pair" : ""}`}>
                {g.kind === "pair" ? (
                  <>
                    <img className="catalogue-img catalogue-img--half" src={g.items[0]} alt={`Photo ${i}-A ${p.name}`} loading="lazy" />
                    <img className="catalogue-img catalogue-img--half" src={g.items[1]} alt={`Photo ${i}-B ${p.name}`} loading="lazy" />
                  </>
                ) : (
                  <img className="catalogue-img catalogue-img--full" src={g.items[0]} alt={`Photo ${i} ${p.name}`} loading="lazy" />
                )}
              </div>
            ))
          )}
        </section>



                  {/* ======= BAS DE PAGE : CARTE (gauche) + AGENT (droite) ======= */}
        <section ref={bottomRef} className="detail-bottom">
          <div className="detail-bottom__map">
            <div className="detail-map__inner">
              {address && (
                <div className="map-address">
                  <span className="map-address-icon" aria-hidden>
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M12 2a7 7 0 0 0-7 7c0 4.1 5.1 9.3 6.5 10.7a1 1 0 0 0 1.4 0C13.9 18.3 19 13.1 19 9a7 7 0 0 0-7-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span className="map-address-text">{address}</span>
                </div>
              )}

              <iframe
                title={`Carte - ${p.name || "Adresse"}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(address || "")}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <aside className="detail-bottom__agent">
            <div className="agent-card enhanced">
              <div className="agent-media">
                <img src={agent.photo} alt={agent.name} loading="lazy" />
              </div>

              <div className="agent-info">
                <div className="agent-top">
                  <h3 className="agent-name">{agent.name}</h3>
                  {agent.role && <div className="agent-role">{agent.role}</div>}
                </div>

                {agent.quote && <div className="agent-quote">“{agent.quote}”</div>}

                <div className="agent-contacts">
                  {agent.phone && (
                    <a className="agent-chip" href={`tel:${agent.phone}`}>
                      {agent.phone}
                    </a>
                  )}
                  {agent.email && (
                    <a className="agent-chip" href={`mailto:${agent.email}`}>
                      {agent.email}
                    </a>
                  )}
                </div>

                <div className="agent-actions">
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = "/contact";
                    }}
                    className="group inline-flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 rounded-xl text-[15px] text-white shadow-lg transition hover:shadow-xl"
                    style={{ backgroundColor: "#FF4A3E" }}
                  >
                    Contacter
                    <span
                      aria-hidden
                      className="inline-block translate-x-0 transition-transform duration-200 ease-out group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Logo GARY sous la fiche vendeur */}
            <div className="detail-agent-logo">
              <img
                src="/Logo/logo-gary-orange.png"
                alt="Logo GARY"
                loading="lazy"
              />
            </div>
          </aside>
        </section>


        
    
        
      </main>
    </div>
  );
}
