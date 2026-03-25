// src/components/TeamMemberCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../hooks/useLocale.js";

export default function TeamMemberCard({ name, role, role_en, photo, quote, quote_en, slug }) {
  const { t, lang, link } = useLocale();
  const displayRole = lang === "en" && role_en ? role_en : role;
  const displayQuote = lang === "en" && quote_en ? quote_en : quote;
  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-lg">
      {/* Image */}
      <img
        src={photo}
        alt={`${name} — ${role}`}
        className="h-80 w-full object-cover transition duration-300 ease-out group-hover:blur-sm group-hover:scale-105"
        loading="lazy"
      />

      {/* Voile orangé (couleur marque) */}
      <div className="pointer-events-none absolute inset-0 bg-primary/0 transition duration-300 ease-out group-hover:bg-primary/45" />

      {/* Badge rôle + nom (masqués au hover) */}
      <div className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-800 shadow transition-opacity duration-200 group-hover:opacity-0">
        {displayRole}
      </div>
      <div className="absolute bottom-14 left-3 z-10 text-white drop-shadow-lg transition-opacity duration-200 group-hover:opacity-0">
        <p className="text-lg font-semibold">{name}</p>
      </div>

      {/* Citation + bouton (affichés au hover) */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 p-6 opacity-0 transition duration-300 ease-out group-hover:opacity-100">
        <blockquote className="text-center text-white max-w-xs">
          <p className="text-sm italic leading-relaxed md:text-base">
            &ldquo;{displayQuote}&rdquo;
          </p>
          <footer className="mt-3 text-xs opacity-90">— {name}</footer>
        </blockquote>

        <Link
          to={link("team", { slug })}
          className="pointer-events-auto inline-block border border-white/80 rounded-full px-5 py-2 text-sm font-medium transition-transform duration-300 ease-out hover:bg-white hover:text-black hover:scale-110 hover:shadow-lg hover:shadow-white/30 active:scale-95"
        >
          {t("cta.learn_more")}
        </Link>
      </div>

      {/* Liseré subtil au survol */}
      <div className="pointer-events-none absolute inset-0 ring-0 transition duration-300 group-hover:ring-2 group-hover:ring-primary/60 rounded-2xl" />
    </div>
  );
}
