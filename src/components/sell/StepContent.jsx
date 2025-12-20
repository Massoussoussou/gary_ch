// src/components/sell/StepContent.jsx
import { Link } from "react-router-dom";

export default function StepContent({ step }) {
  return (
    <div className="mt-7 md:mt-9 max-w-[48ch]">
      <h2 className="font-serif text-[28px] md:text-[34px] lg:text-[40px] leading-[1.1] tracking-[-0.015em]">
        {step.title}
      </h2>

      <ul className="mt-5 md:mt-6 space-y-3 md:space-y-3.5 text-[15px] md:text-[17px] text-black/80">
        {step.bullets.map((b, i) => (
          <li key={i} className="pl-6 relative">
            <span className="absolute left-0 top-[0.7rem] w-2 h-2 rounded-full bg-primary/75" />
            {b}
          </li>
        ))}
      </ul>

      {/* Barre de CTA : bouton rouge + bouton e-book à taille fixe */}
      <div className="mt-6 md:mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
        {step.cta && (
          <Link
            to={step.cta.href}
            className="group inline-flex items-center justify-center
                       shrink-0 whitespace-nowrap
                       h-[48px] md:h-[52px] px-6 md:px-7
                       text-[15px] md:text-[16px] font-medium tracking-tight
                       rounded-none bg-[#FF4A3E] text-white
                       border border-[#FF4A3E]
                       shadow-[0_10px_24px_rgba(255,74,62,0.35)]
                       hover:bg-[#ff5a4d] hover:shadow-[0_14px_28px_rgba(255,74,62,0.42)]
                       focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70
                       transition-all"
          >
            <span className="relative inline-flex items-center gap-2">
              <span>Demander une visite d’estimation</span>
              {/* petite flèche qui glisse légèrement à droite au hover */}
              <svg width="16" height="16" viewBox="0 0 24 24"
                   className="transition-transform duration-200 group-hover:translate-x-[2px]"
                   aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>
        )}

        {/* Bouton e-book : taille fixe + pas de “shrink” + no-wrap */}
        <Link
          to="/ebook-bien-vendre"
          aria-label="Télécharger l’e-book Bien vendre sa maison (PDF, 32 pages)"
          className="group inline-flex items-center justify-center gap-2
                     shrink-0 whitespace-nowrap
                     w-[260px] md:w-[280px] h-[48px] md:h-[52px]
                     rounded-2xl border border-black/10
                     bg-white/70 supports-[backdrop-filter]:bg-white/60 backdrop-blur
                     text-[15px] md:text-[16px] font-medium
                     shadow-[0_8px_20px_rgba(0,0,0,0.05)]
                     hover:bg-white hover:shadow-[0_12px_28px_rgba(0,0,0,0.10)]
                     transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"
               className="opacity-80 group-hover:opacity-100" aria-hidden="true">
            <path d="M4 19.5V5.6c0-.9.7-1.6 1.6-1.6h9.8c.9 0 1.6.7 1.6 1.6v13.9M4 19.5c0-.9.7-1.6 1.6-1.6h9.8c.9 0 1.6.7 1.6 1.6M4 19.5h13"
                  stroke="currentColor" fill="none" strokeWidth="1.5" />
          </svg>
          <span>Télécharger l’e-book</span>
        </Link>
      </div>

      <div className="mt-1 text-[12px] text-black/50">
        PDF • 32 pages • check-list incluse
      </div>
    </div>
  );
}
