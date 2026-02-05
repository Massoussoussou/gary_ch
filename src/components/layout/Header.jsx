// Header scalé + placements fins (logo à gauche non-collé, CTA à droite)
import { useState, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import DrawerNav from './DrawerNav.jsx'

/* === Réglages rapides === */

const NAV_FONT_SCALE = 1; // 1 = inchangé, 1.6 = +60% (mets 1.3, 1.8, 2.0…)

const UI_SCALE   = 1.30            // échelle globale
const NAV_SPREAD = 2.0             // >1 augmente l’écart entre onglets

// Bords de page (gros réglages) : contrôlent le “pas collé” gauche/droite
const EDGE_LEFT  = 24;             // px — augmente pour décoller le logo du bord gauche
const EDGE_RIGHT = 28;             // px — augmente pour décoller le CTA du bord droit

// Micro-réglages “au millimètre”
const LOGO_OFFSET_X = 60;           // px — décale le bloc logo+vidéo (←/→)
const LOGO_OFFSET_Y = 0;           // px — (↑/↓)
const NAV_OFFSET_X  = 190;           // px — décale la nav (optionnel)
const CTA_OFFSET_X  = 200;           // px — décale le bloc CTA (→ positif, ← négatif)

// ⚠️ À ne pas toucher sauf micro-correction de l’overlay vidéo
const VIDEO_TWEAK_X = 0;
const VIDEO_TWEAK_Y = -0.5;
const VIDEO_SCALE   = 1.98;

// Soulignement animé des onglets
const UNDERLINE_THICKNESS = 1;     // px (ex: 2, 3)
const UNDERLINE_OFFSET    = -3;     // px sous la baseline (ex: 4~8)
const UNDERLINE_DURATION  = 250;   // ms (ex: 200, 300)

// Effet "logo en fond" sur le bouton
const BTN_LOGO_OPACITY = 0.18;   // intensité du logo en fond (0.12–0.25 recommandé)
const BTN_LOGO_HOVER_SCALE = 1.02; // petit zoom du calque au hover (1 = aucun)

/* Bases */
const BASE = {
  logoH: 28, padY: 12, padX: 16, navGap: 24, rightGap: 12,
  navFont: 14, ctaPadX: 20, ctaPadY: 8, ctaFont: 14,
  burgerWH: 40, burgerBarW: 20, burgerBarH: 2,
}

/* Tailles dérivées */
const S = {
  logoH: Math.round(BASE.logoH * UI_SCALE),
  padY: Math.round(BASE.padY * UI_SCALE),
  navGap: Math.round(BASE.navGap * UI_SCALE * NAV_SPREAD),
  rightGap: Math.round(BASE.rightGap * UI_SCALE),
  navFont: Math.round(BASE.navFont * UI_SCALE * NAV_FONT_SCALE),
  ctaPadX: Math.round(BASE.ctaPadX * UI_SCALE),
  ctaPadY: Math.round(BASE.ctaPadY * UI_SCALE),
  ctaFont: Math.round(BASE.ctaFont * UI_SCALE),
  burgerWH: Math.round(BASE.burgerWH * UI_SCALE),
  burgerBarW: Math.round(BASE.burgerBarW * UI_SCALE),
  burgerBarH: Math.max(2, Math.round(BASE.burgerBarH * UI_SCALE)),
}

function LogoWithHoverAnim() {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    setShowVideo(true);
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = 0
        videoRef.current.play().catch(() => {})
      } catch {}
    }
  };
  const handleEnded = () => setShowVideo(false);

  return (
    <div
      className="relative inline-block align-middle overflow-hidden"
      style={{ height: S.logoH }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => {}}
      aria-label="GARY - Accueil"
    >
      <img
        src="/Logo/logo-gary-orange.png"
        alt="GARY"
        className={`block ${showVideo ? 'invisible' : 'visible'}`}
        style={{ height: S.logoH, width: 'auto' }}
        decoding="async"
        fetchpriority="high"
      />
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full ${showVideo ? 'opacity-100' : 'opacity-0'} pointer-events-none transition-opacity duration-75`}
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          transform: `translate(${VIDEO_TWEAK_X}px, ${VIDEO_TWEAK_Y}px) scale(${VIDEO_SCALE})`,
          transformOrigin: 'center',
          willChange: 'transform',
        }}
        src="https://gary.ch/wp-content/uploads/2024/07/GARY_Anim_4K_HORIZONTAL.mp4"
        muted
        playsInline
        preload="auto"
        loop={false}
        onEnded={handleEnded}
        onError={() => setShowVideo(false)}
        controls={false}
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
      />
    </div>
  );
}

export default function Header(){
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  const headerCls = isHome
    ? 'absolute top-0 left-0 right-0 z-50 bg-white'
    : 'sticky top-0 z-50 bg-white border-b border-line/60'

  // ✅ Hamburger: tailles + offsets calculés (plus “droit” que -10/+10 fixes)
  const burgerWH = Math.min(S.burgerWH, 46)                 // cap pour éviter un bouton trop gros
  const burgerBarW = Math.round(burgerWH * 0.46)
  const burgerBarH = Math.max(2, Math.round(burgerWH * 0.045))
  const burgerY = Math.round(burgerWH * 0.20)               // écart vertical des barres

  return (
    <header className={headerCls} style={{ overflowX: 'clip' }}>
      <div
        className="mx-auto grid items-center"
        style={{
          gridTemplateColumns: 'auto 1fr auto',
          columnGap: 'clamp(12px, 2.4vw, 32px)',
          width: '100%',
          maxWidth: '100%',
          margin: '0 auto',
          paddingTop: `${S.padY}px`,
          paddingBottom: `${S.padY}px`,
          paddingLeft: `${Math.max(0, EDGE_LEFT)}px`,
          paddingRight: `max(${Math.max(0, EDGE_RIGHT)}px, env(safe-area-inset-right, 0px))`,
          boxSizing: 'border-box',
        }}
      >
        <Link
          to="/"
          aria-label="Accueil"
          className="justify-self-start inline-block"
          style={{ marginLeft: LOGO_OFFSET_X, marginTop: LOGO_OFFSET_Y }}
        >
          <LogoWithHoverAnim />
        </Link>

        <nav
          className="hidden xl:flex items-center justify-center nav-desktop"
          style={{ fontSize: `${S.navFont}px`, lineHeight: 1.2 }}
        >
          <style>{`
            .nav-link { position: relative; display: inline-block; }
            .nav-item { position: relative; display: inline-block; }
            .nav-item::after {
              content: "";
              position: absolute;
              left: 0; right: 0;
              bottom: var(--ul-offset, 6px);
              height: var(--ul-thickness, 2px);
              background: #FF4A3E;
              transform-origin: left;
              transform: scaleX(0);
              transition: transform var(--ul-duration, 250ms) ease;
            }
            .nav-link:hover .nav-item::after,
            .nav-link:focus-visible .nav-item::after { transform: scaleX(1); }
            .nav-link[aria-current="page"] .nav-item::after { transform: scaleX(1); }

            .nav-desktop {
              margin-left: ${NAV_OFFSET_X}px;
              white-space: nowrap;
              gap: ${S.navGap}px;
            }
            @media (max-width: 1600px) {
              .nav-desktop { margin-left: ${NAV_OFFSET_X - 120}px; gap: ${Math.round(S.navGap * 0.8)}px; }
            }
            @media (max-width: 1440px) {
              .nav-desktop { margin-left: ${NAV_OFFSET_X - 210}px; gap: ${Math.round(S.navGap * 0.65)}px; }
            }
          `}</style>

          {[
            { to: '/acheter',       label: 'Acheter' },
            { to: '/vendre',        label: 'Vendre' },
            { to: '/estimer',       label: 'Estimer' },
            { to: '/projets-neufs', label: 'Projets\u00A0neufs' },
            { to: '/actualites',    label: 'Actualités' },
            { to: '/a-propos',      label: 'Qui\u00A0est\u00A0GARY\u00A0?' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                (isActive ? 'text-[#FF4A3E]' : 'text-text hover:text-[#FF4A3E]') +
                ' nav-link transition-colors duration-150'
              }
            >
              <span
                className="nav-item"
                style={{
                  ['--ul-thickness']: `${UNDERLINE_THICKNESS}px`,
                  ['--ul-offset']: `${UNDERLINE_OFFSET}px`,
                  ['--ul-duration']: `${UNDERLINE_DURATION}ms`,
                }}
              >
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div
          className="flex items-center justify-self-end header-cta"
          style={{ gap: `${S.rightGap}px` }}
        >
          <style>{`
            .header-cta { margin-right: ${CTA_OFFSET_X}px; }
            @media (max-width: 1600px) { .header-cta { margin-right: ${CTA_OFFSET_X - 60}px; } }
            @media (max-width: 1440px) { .header-cta { margin-right: ${CTA_OFFSET_X - 110}px; } }
            @media (max-width: 1279px) { .header-cta { margin-right: 0px; } }

            .btn-gary { position: relative; overflow: hidden; }
            .logo-reveal {
              position:absolute; inset:0; pointer-events:none;
              clip-path: inset(0 100% 0 0);
              transition: clip-path var(--wipeDur, 500ms) cubic-bezier(.22,.61,.36,1);
            }
            .btn-gary:hover .logo-reveal,
            .btn-gary:focus-visible .logo-reveal { clip-path: inset(0 0 0 0); }

            @supports (mask-image: url("")) or (-webkit-mask-image: url("")){
              .logo-layer {
                position:absolute; inset:0; pointer-events:none;
                background-color: #fff;
                opacity: var(--logoAlpha, 0.16);
                -webkit-mask: var(--logoUrl, none) center / cover no-repeat;
                        mask: var(--logoUrl, none) center / cover no-repeat;
              }
            }
          `}</style>

          <Link
            to="/contact"
            className="btn-gary hidden xl:inline-flex items-center gap-2 rounded-full bg-[#FF4A3E] text-white shadow-sm
                       transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E]/40
                       relative"
            style={{
              padding: `${S.ctaPadY}px ${S.ctaPadX}px`,
              fontSize: `${S.ctaFont}px`,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              ['--logoUrl']: "url('/Logo/logo-gary-orange.png')",
              ['--logoAlpha']: 0.16,
              ['--wipeDur']: '550ms',
            }}
          >
            <span className="logo-reveal" aria-hidden="true">
              <span className="logo-layer" />
            </span>
            <span className="relative z-[1]">Contactez GARY</span>
          </Link>

          {/* ✅ Burger mobile refait (plus clean + centré) */}
          <button
            type="button"
            className={`
              xl:hidden relative inline-flex items-center justify-center rounded-full
              backdrop-blur-md border shadow-sm
              transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E]/35
              ${open
                ? "bg-[#FF4A3E] border-[#FF4A3E]/50"
                : "bg-white/85 border-black/10 hover:bg-white hover:border-black/20"}
            `}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
            style={{ width: burgerWH, height: burgerWH }}
          >
            <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>

            <span
              aria-hidden="true"
              className={`
                absolute left-1/2 top-1/2 rounded-full
                transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none
                ${open ? "bg-white" : "bg-text"}
              `}
              style={{
                width: burgerBarW,
                height: burgerBarH,
                willChange: 'transform, opacity',
                transform: open
                  ? "translate(-50%, -50%) rotate(45deg)"
                  : `translate(-50%, -50%) translateY(-${burgerY}px) rotate(0deg)`,
              }}
            />
            <span
              aria-hidden="true"
              className={`
                absolute left-1/2 top-1/2 rounded-full
                transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none
                ${open ? "bg-white" : "bg-text"}
              `}
              style={{
                width: burgerBarW,
                height: burgerBarH,
                willChange: 'transform, opacity',
                opacity: open ? 0 : 1,
                transform: open
                  ? "translate(-50%, -50%) scaleX(0)"
                  : "translate(-50%, -50%) scaleX(1)",
              }}
            />
            <span
              aria-hidden="true"
              className={`
                absolute left-1/2 top-1/2 rounded-full
                transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none
                ${open ? "bg-white" : "bg-text"}
              `}
              style={{
                width: burgerBarW,
                height: burgerBarH,
                willChange: 'transform, opacity',
                transform: open
                  ? "translate(-50%, -50%) rotate(-45deg)"
                  : `translate(-50%, -50%) translateY(${burgerY}px) rotate(0deg)`,
              }}
            />
          </button>
        </div>
      </div>

      <DrawerNav open={open} onClose={() => setOpen(false)} />
    </header>
  )
}
