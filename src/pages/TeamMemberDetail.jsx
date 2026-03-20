import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import team from '../data/team.json';
import { Linkedin } from "lucide-react";

import "../styles/projet.css";

export default function Member() {
  const { slug } = useParams();
  const navigate = useNavigate();
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
    <main className="min-h-screen bg-white">
      {/* Bouton croix animé (style ProjetNeufDetail) */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="close-back-btn close-back-btn--inverted"
        aria-label="Retour à l'équipe"
        title="Retour à l'équipe"
      >
        <svg className="close-back-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* ====== MOBILE LAYOUT (< md) ====== */}
      <div className="md:hidden">
        {/* Header centré — photo + nom + rôle */}
        <div className="pt-20 pb-8 px-6 text-center">
          <div className="relative w-28 h-28 mx-auto mb-5">
            <img
              src={member.photo}
              alt={member.name}
              className="w-full h-full rounded-full object-cover shadow-lg"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://via.placeholder.com/120";
              }}
            />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#FF4A3E] rounded-full flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="font-serif text-[1.75rem] tracking-wide text-gray-900">{member.name}</h1>
          <p className="text-[13px] uppercase tracking-[0.15em] text-[#FF4A3E] font-semibold mt-1.5">{member.role}</p>

          {member.quote && (
            <p className="mt-5 text-gray-500 text-[15px] italic leading-relaxed max-w-[320px] mx-auto">
              "{member.quote}"
            </p>
          )}
        </div>

        {/* Boutons de contact */}
        <div className="px-6 pb-8 flex flex-col gap-3 max-w-[400px] mx-auto">
          {member.phoneMobile && (
            <a
              href={`tel:${member.phoneMobile}`}
              className="flex items-center gap-4 bg-[#FAF7F4] px-5 py-4 transition-colors active:bg-[#f0ece7]"
            >
              <div className="w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.08em] text-gray-400 font-semibold">Mobile</p>
                <p className="text-[15px] text-gray-900">{member.phoneMobile}</p>
              </div>
            </a>
          )}

          {member.phoneOffice && (
            <a
              href={`tel:${member.phoneOffice}`}
              className="flex items-center gap-4 bg-[#FAF7F4] px-5 py-4 transition-colors active:bg-[#f0ece7]"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.08em] text-gray-400 font-semibold">Bureau</p>
                <p className="text-[15px] text-gray-900">{member.phoneOffice}</p>
              </div>
            </a>
          )}

          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="flex items-center gap-4 bg-[#FAF7F4] px-5 py-4 transition-colors active:bg-[#f0ece7]"
            >
              <div className="w-8 h-8 bg-[#FF4A3E] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.08em] text-gray-400 font-semibold">Email</p>
                <p className="text-[15px] text-gray-900">{member.email}</p>
              </div>
            </a>
          )}

          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 bg-[#FAF7F4] px-5 py-4 transition-colors active:bg-[#f0ece7]"
            >
              <div className="w-8 h-8 bg-[#0A66C2] rounded-full flex items-center justify-center flex-shrink-0">
                <Linkedin size={14} className="text-white" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.08em] text-gray-400 font-semibold">LinkedIn</p>
                <p className="text-[15px] text-gray-900">Voir le profil</p>
              </div>
            </a>
          )}
        </div>

        {/* Langues */}
        {member.languages?.length > 0 && (
          <div className="px-6 pb-6 max-w-[400px] mx-auto">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] uppercase tracking-[0.08em] text-gray-400 font-semibold">Langues</span>
              <span className="text-gray-300">—</span>
              {member.languages.map((lang, i) => (
                <span key={lang} className="text-[13px] text-gray-600">
                  {lang}{i < member.languages.length - 1 ? "," : ""}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Séparateur */}
        <div className="mx-6 h-px bg-gray-200" />

        {/* Bio */}
        <div className="px-6 py-10">
          <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-semibold mb-5">Parcours</p>
          <div className="text-[15px] leading-7 text-gray-700 whitespace-pre-line">
            {member.bio}
          </div>
        </div>
      </div>

      {/* ====== DESKTOP LAYOUT (>= md) ====== */}
      <div className="hidden md:block mx-auto max-w-6xl px-4 py-14">
        <h1 className="mt-6 text-3xl font-bold md:text-4xl">{member.name}</h1>

        <section className="mt-8 grid gap-10 md:grid-cols-[minmax(0,1fr)_280px]">
          {/* BIO */}
          <div className="border-l-2 border-[#FF4A3E]/20 pl-12 md:pl-16">
            {member.quote && (
              <p className="text-xl text-gray-500 italic leading-relaxed mb-8 font-light">
                "{member.quote}"
              </p>
            )}
            <div className="max-w-3xl text-[15px] md:text-base leading-7 text-gray-900 whitespace-pre-line">
              {member.bio}
            </div>
          </div>

          {/* COORDONNÉES */}
          <aside>
            {/* Photo + info */}
            <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-gray-100">
              <img
                src={member.photo}
                alt={member.name}
                className="h-24 w-24 rounded-full object-cover shadow-md mb-4"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://via.placeholder.com/96";
                }}
              />
              <p className="font-serif text-lg text-gray-900">{member.name}</p>
              <p className="text-[12px] uppercase tracking-[0.12em] text-[#FF4A3E] font-semibold mt-1">{member.role}</p>
            </div>

            {/* Coordonnées */}
            <div className="flex flex-col gap-3">
              {member.phoneMobile && (
                <a href={`tel:${member.phoneMobile}`} className="flex items-center gap-3 group">
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF4A3E] transition-colors">
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.06em] text-gray-400 font-medium">Mobile</p>
                    <p className="text-sm text-gray-900 group-hover:text-[#FF4A3E] transition-colors">{member.phoneMobile}</p>
                  </div>
                </a>
              )}

              {member.phoneOffice && (
                <a href={`tel:${member.phoneOffice}`} className="flex items-center gap-3 group">
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF4A3E] transition-colors">
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.06em] text-gray-400 font-medium">Bureau</p>
                    <p className="text-sm text-gray-900 group-hover:text-[#FF4A3E] transition-colors">{member.phoneOffice}</p>
                  </div>
                </a>
              )}

              {member.email && (
                <a href={`mailto:${member.email}`} className="flex items-center gap-3 group">
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF4A3E] transition-colors">
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.06em] text-gray-400 font-medium">Email</p>
                    <p className="text-sm text-gray-900 group-hover:text-[#FF4A3E] transition-colors">{member.email}</p>
                  </div>
                </a>
              )}

              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 group">
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#0A66C2] transition-colors">
                    <Linkedin size={15} className="text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.06em] text-gray-400 font-medium">LinkedIn</p>
                    <p className="text-sm text-gray-900 group-hover:text-[#0A66C2] transition-colors">Voir le profil</p>
                  </div>
                </a>
              )}
            </div>

            {/* Langues */}
            {member.languages?.length > 0 && (
              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-[11px] uppercase tracking-[0.06em] text-gray-400 font-medium mb-2">Langues</p>
                <p className="text-sm text-gray-700">{member.languages.join(", ")}</p>
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
