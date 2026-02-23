import React from "react";
import { Link, useParams } from "react-router-dom";
import team from '../data/team.json';
import { Linkedin } from "lucide-react";

import "../styles/projet.css";

export default function Member() {
  const { slug } = useParams();
  const member = team.find(m => m.slug === slug);

  if (!member) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-gray-600">Membre introuvable.</p>
        <Link to="/a-propos" className="text-brand underline">
          Retour à l'équipe
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      {/* Bouton croix animé (style ProjetNeufDetail) */}
      <Link
        to="/a-propos"
        className="close-back-btn close-back-btn--inverted"
        aria-label="Retour à l'équipe"
        title="Retour à l'équipe"
      >
        <svg className="close-back-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </Link>

      <h1 className="mt-6 text-3xl font-bold md:text-4xl">{member.name}</h1>

      {/* 2 colonnes: bio gauche + coordonnées droite */}
      <section className="mt-6 md:mt-8 grid gap-10 md:grid-cols-[minmax(0,1fr)_260px]">
        {/* BIO */}
        <div className="border-l border-brand pl-12 md:pl-16">
          <div className="max-w-3xl text-[15px] md:text-base leading-7 text-gray-900 whitespace-pre-line">
            {member.bio}
          </div>
        </div>

        {/* COORDONNÉES en colonne */}
        <aside className="text-sm">
          {/* Photo centrée */}
          <div className="flex flex-col items-start gap-3 mb-4">
            <img
              src={member.photo}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://via.placeholder.com/80";
              }}
            />
            <div>
              <p className="font-semibold">{member.name}</p>
              <p className="text-xs text-gray-500">{member.role}</p>
            </div>
          </div>

          {/* Coordonnées cliquables */}
          <div className="flex flex-col gap-1.5 leading-6">
            {member.phoneMobile && (
              <a href={`tel:${member.phoneMobile}`} className="hover:underline">
                {member.phoneMobile}
              </a>
            )}
            {member.phoneOffice && (
              <a href={`tel:${member.phoneOffice}`} className="hover:underline text-gray-500">
                {member.phoneOffice}
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="text-brand hover:underline"
              >
                {member.email}
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-brand hover:underline"
              >
                <Linkedin size={14} />
                Profil LinkedIn
              </a>
            )}
          </div>

          {/* Langues */}
          {member.languages?.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-400 mb-1">Langues</p>
              <p className="text-sm text-gray-700">{member.languages.join(", ")}</p>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
