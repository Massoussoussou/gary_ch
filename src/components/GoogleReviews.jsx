import { useState, useRef, useEffect, useCallback } from "react";
import reviews from "../data/reviews.json";

const GOOGLE_URL =
  "https://www.google.com/maps/place/GARY/@46.2076666,6.1350407,17z/data=!4m16!1m9!3m8!1s0x478c65ab47ccae1f:0x198c041cb8124a41!2sGARY!8m2!3d46.2007532!4d6.1554987!9m1!1b1!16s%2Fg%2F11vbtxghc1!3m5!1s0x478c65ab47ccae1f:0x198c041cb8124a41!8m2!3d46.2007532!4d6.1554987!16s%2Fg%2F11vbtxghc1?entry=ttu&g_ep=EgoyMDI2MDMxMC4wIKXMDSoASAFQAw%3D%3D";

/* ── Hook : trigger once on scroll into view ── */
function useInViewOnce(opts = {}) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); obs.disconnect(); } },
      { threshold: opts.threshold ?? 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, seen];
}

/* ── Étoile SVG ── */
function Star() {
  return (
    <svg className="w-[18px] h-[18px] text-[#FBBC04]" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

/* ── Logo Google (couleurs officielles) ── */
function GoogleLogo({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/* ── Carte d'avis ── */
function ReviewCard({ review, index, seen }) {
  return (
    <div
      className="bg-white border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 md:p-8 flex flex-col"
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.7s ease-out ${0.2 + index * 0.15}s, transform 0.7s ease-out ${0.2 + index * 0.15}s`,
      }}
    >
      {/* Header : avatar + nom + date */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-11 h-11 rounded-full bg-[#FF4A3E] flex items-center justify-center shrink-0">
          <span className="text-white text-sm font-semibold tracking-wide">{review.avatar}</span>
        </div>
        <div>
          <p className="text-gray-900 font-semibold text-[15px] leading-tight">{review.author}</p>
          <p className="text-gray-400 text-[13px] mt-0.5">{review.date}</p>
        </div>
      </div>

      {/* Étoiles */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: review.rating }).map((_, j) => (
          <Star key={j} />
        ))}
      </div>

      {/* Texte */}
      <p className="text-gray-700 text-[15px] md:text-base leading-relaxed flex-1">
        &ldquo;{review.text}&rdquo;
      </p>
    </div>
  );
}

/* ── Composant principal ── */
export default function GoogleReviews() {
  const [ref, seen] = useInViewOnce({ threshold: 0.1 });

  return (
    <section ref={ref} className="relative z-10 bg-white py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">

        {/* Trait décoratif */}
        <div className="flex justify-center mb-6">
          <div
            className="h-[2px] bg-[#FF4A3E]"
            style={{
              width: seen ? "60px" : "0px",
              transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>

        {/* Titre + logo Google */}
        <div className="text-center mb-14 md:mb-20">
          <h3
            className="font-serif text-3xl md:text-5xl tracking-wide text-gray-900"
            style={{
              opacity: seen ? 1 : 0,
              transform: seen ? "translateY(0)" : "translateY(15px)",
              transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
            }}
          >
            Ce que nos clients <span className="text-[#FF4A3E]">pensent</span> de nous
          </h3>

          {/* Badge Google */}
          <div
            className="inline-flex items-center gap-2.5 mt-6 px-5 py-2.5 border border-gray-200 bg-gray-50/60"
            style={{
              opacity: seen ? 1 : 0,
              transition: "opacity 0.6s ease-out 0.2s",
            }}
          >
            <GoogleLogo className="w-5 h-5" />
            <span className="text-sm text-gray-600 font-medium">Avis Google</span>
            <span className="text-sm text-gray-400">·</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} />)}
            </div>
          </div>
        </div>

        {/* Grille d'avis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <ReviewCard key={i} review={review} index={i} seen={seen} />
          ))}
        </div>

        {/* Lien Google Maps */}
        <div
          className="text-center mt-12"
          style={{
            opacity: seen ? 1 : 0,
            transition: "opacity 0.6s ease-out 0.6s",
          }}
        >
          <a
            href={GOOGLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[15px] text-gray-600 hover:text-[#FF4A3E] transition-colors duration-300 border-b border-gray-300 hover:border-[#FF4A3E] pb-0.5"
          >
            <GoogleLogo className="w-4 h-4" />
            Voir tous nos avis Google
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
