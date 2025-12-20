// src/components/AgentCard.jsx
import React from "react";
import team from "../data/team.json";

const sanitize = (p="") => String(p).replace(/[^\d+]/g, "");

export default function AgentCard({
  agentSlug,
  agent: agentProp,
  variant = "card",            // "card" (tuile blanche) ou "inline"
  className = "",
}) {
  const fromSlug = agentSlug ? team.find(a => a.slug === agentSlug) : null;
  const agent = {
    name:      agentProp?.name      ?? fromSlug?.name      ?? "Conseiller immobilier",
    role:      agentProp?.role      ?? fromSlug?.role      ?? "Associé & Courtier",
    photo:     agentProp?.photo     ?? fromSlug?.photo     ?? "/team/placeholder.jpg",
    email:     agentProp?.email     ?? fromSlug?.email     ?? "contact@gary.ch",
    phone:     agentProp?.phone     ?? fromSlug?.phone     ?? "",
    linkedin:  agentProp?.linkedin  ?? fromSlug?.linkedin  ?? "",
    languages: agentProp?.languages ?? fromSlug?.languages ?? ["FR"],
  };
  const tel = agent.phone ? `tel:${sanitize(agent.phone)}` : null;
  const wa  = agent.phone ? `https://wa.me/${sanitize(agent.phone)}` : null;

  if (variant === "inline") {
    return (
      <div className={"flex items-center gap-4 " + className}>
        <img src={agent.photo} alt={agent.name} className="h-12 w-12 rounded-full object-cover ring-1 ring-black/10" />
        <div className="min-w-0 flex-1">
          <div className="font-medium text-neutral-900 truncate">{agent.name}</div>
          <div className="text-[12px] text-neutral-600">{agent.role} • {(agent.languages||[]).join(" / ")}</div>
        </div>
        <button
          type="button"
          className="shrink-0 px-5 py-2 bg-[#FF4A3E] text-white text-[12px] md:text-[13px]
                     uppercase tracking-[0.08em] rounded-none shadow-[0_8px_18px_rgba(255,74,62,.22)]
                     hover:scale-[1.02] active:scale-[0.99] transition"
        >
          Planifier une visite
        </button>
      </div>
    );
  }

  // Variante "card" — tuile blanche compacte
  return (
    <aside
      className={[
        "rounded-none bg-white/85 supports-backdrop-blur:bg-white/60 backdrop-blur-xl",
        "ring-1 ring-black/10 shadow-[0_10px_28px_rgba(0,0,0,.12)]",
        "px-5 py-5 md:px-6 md:py-6 space-y-4",
        className,
      ].join(" ")}
    >
      {/* Micro en-tête */}
      <div className="text-[11px] tracking-[0.18em] uppercase text-neutral-500">
        Associé & Courtier
      </div>

      {/* Header profil */}
      <div className="flex items-center gap-4">
        <img
          src={agent.photo}
          alt={agent.name}
          className="h-14 w-14 rounded-full object-cover ring-1 ring-black/10"
          loading="eager"
        />
        <div className="min-w-0">
          <div className="font-serif text-[19px] md:text-[20px] leading-tight text-neutral-900 truncate">
            {agent.name}
          </div>
          <div className="text-[12px] text-neutral-600">{(agent.languages || []).join(" / ")}</div>
        </div>
      </div>

      {/* Contacts en pills (propres, pas des champs de saisie) */}
      <div className="flex flex-wrap gap-2">
        {agent.email && (
          <a href={`mailto:${agent.email}`} className="px-3 py-1.5 text-[13px] rounded-none ring-1 ring-black/10 bg-neutral-100 hover:bg-neutral-200/70">
            ✉️ {agent.email}
          </a>
        )}
        {tel && (
          <a href={tel} className="px-3 py-1.5 text-[13px] rounded-none ring-1 ring-black/10 bg-neutral-100 hover:bg-neutral-200/70">
            📞 {agent.phone}
          </a>
        )}
        {wa && (
          <a href={wa} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-[13px] rounded-none ring-1 ring-black/10 bg-neutral-100 hover:bg-neutral-200/70">
            💬 WhatsApp
          </a>
        )}
        {agent.linkedin && (
          <a href={agent.linkedin} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-[13px] rounded-none ring-1 ring-black/10 bg-neutral-100 hover:bg-neutral-200/70">
            🔗 LinkedIn
          </a>
        )}
      </div>

      {/* CTA principal */}
      <button
        type="button"
        className="w-full px-6 py-3 bg-[#FF4A3E] text-white rounded-none
                   font-semibold uppercase tracking-[0.08em]
                   shadow-[0_10px_24px_rgba(255,74,62,.25)]
                   hover:scale-[1.02] active:scale-[0.99] transition"
      >
        Planifier une visite
      </button>

      {/* Lien brochure (sobre) */}
      <button
        type="button"
        className="w-full px-6 py-3 bg-neutral-100 text-neutral-900 rounded-none ring-1 ring-black/10"
      >
        Recevoir la brochure PDF
      </button>
    </aside>
  );
}
