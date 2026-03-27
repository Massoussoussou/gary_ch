import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import DrawerNav from './DrawerNav.jsx'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import { useLocale } from '../../hooks/useLocale.js'

/* === Réglages rapides === */

const NAV_FONT_SCALE = 1; // 1 = inchangé, 1.6 = +60% (mets 1.3, 1.8, 2.0…)

const UI_SCALE   = 1.30            // échelle globale
const NAV_SPREAD = 2.0             // >1 augmente l’écart entre onglets

// Bords de page : contrôlent le padding gauche/droite
const EDGE_LEFT  = 32;             // px
const EDGE_RIGHT = 32;             // px

// ⚠️ À ne pas toucher sauf micro-correction de l’overlay vidéo
const VIDEO_TWEAK_X = 0;
const VIDEO_TWEAK_Y = -0.5;
const VIDEO_SCALE   = 1.98;

// Soulignement animé des onglets
const UNDERLINE_THICKNESS = 1;     // px (ex: 2, 3)
const UNDERLINE_OFFSET    = -3;     // px sous la baseline (ex: 4~8)
const UNDERLINE_DURATION  = 250;   // ms (ex: 200, 300)

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
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);
  const { t } = useLocale();

  const handleMouseEnter = () => {
    if (!videoReady || !videoRef.current) return;
    setShowVideo(true);
    try {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => setShowVideo(false))
    } catch { setShowVideo(false) }
  };
  const handleEnded = () => setShowVideo(false);

  return (
    <div
      className="relative inline-block align-middle overflow-hidden"
      style={{ height: S.logoH }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => {}}
      aria-label={t("aria.logo")}
    >
      <img
        src="/Logo/logo-gary-orange.png"
        alt="GARY"
        width={138}
        height={36}
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
        onCanPlayThrough={() => setVideoReady(true)}
        onEnded={handleEnded}
        onError={() => { setVideoReady(false); setShowVideo(false); }}
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
  const { t, link, lang, switchLanguage } = useLocale()
  const isHome = pathname === '/' || pathname === '/en'

  const headerRef = useRef(null)
  const [headerH, setHeaderH] = useState(0)

  // Mesurer la hauteur du header pour le spacer + variable CSS globale
  useEffect(() => {
    if (!headerRef.current) return
    const ro = new ResizeObserver(([e]) => {
      const h = e.contentRect.height
      setHeaderH(h)
      document.documentElement.style.setProperty('--header-h', `${h}px`)
    })
    ro.observe(headerRef.current)
    return () => ro.disconnect()
  }, [])

  const headerCls = isHome
    ? 'fixed top-0 left-0 right-0 z-50 bg-white'
    : 'fixed top-0 left-0 right-0 z-50 bg-white border-b border-line/60'

  // ✅ Hamburger: tailles + offsets calculés (plus “droit” que -10/+10 fixes)
  const burgerWH = Math.min(S.burgerWH, 46)                 // cap pour éviter un bouton trop gros
  const burgerBarW = Math.round(burgerWH * 0.46)
  const burgerBarH = Math.max(2, Math.round(burgerWH * 0.045))
  const burgerY = Math.round(burgerWH * 0.20)               // écart vertical des barres

  return (
    <>
    <header ref={headerRef} className={headerCls} style={{ overflowX: 'clip' }}>
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
          paddingLeft: `clamp(12px, 2.5vw, ${EDGE_LEFT}px)`,
          paddingRight: `max(clamp(12px, 2.5vw, ${EDGE_RIGHT}px), env(safe-area-inset-right, 0px))`,
          boxSizing: 'border-box',
        }}
      >
        <Link
          to={link("home")}
          aria-label={t("aria.home")}
          className="justify-self-start inline-block"
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
              transform-origin: right;
              transform: scaleX(0);
              transition: transform var(--ul-duration, 250ms) ease;
            }
            .nav-link:hover .nav-item::after,
            .nav-link:focus-visible .nav-item::after { transform-origin: left; transform: scaleX(1); }
            .nav-link[aria-current="page"] .nav-item::after { transform-origin: left; transform: scaleX(1); }

            .nav-desktop {
              white-space: nowrap;
              gap: ${S.navGap}px;
            }
            @media (max-width: 1600px) {
              .nav-desktop { gap: ${Math.round(S.navGap * 0.8)}px; }
            }
            @media (max-width: 1440px) {
              .nav-desktop { gap: ${Math.round(S.navGap * 0.65)}px; }
            }
          `}</style>

          {[
            { to: link("buy"),       label: t("nav.buy") },
            { to: link("sell"),        label: t("nav.sell"), dropdown: [
              { to: link("sell") + '#constat',        label: t("nav.sell_sub.observation") },
              { to: link("sell") + '#difference',     label: t("nav.sell_sub.difference") },
              { to: link("sell") + '#parcours',       label: t("nav.sell_sub.journey") },
              { to: link("sell") + '#livrables',      label: t("nav.sell_sub.deliverables") },
              { to: link("sell") + '#faq',            label: t("nav.sell_sub.faq") },
              { to: link("sell") + '#vendus',         label: t("nav.sell_sub.recently_sold") },
            ]},
            { to: link("estimate"),       label: t("nav.estimate") },
            { to: link("newProjects"), label: t("nav.new_projects") },
            { to: link("news"),    label: t("nav.news"), dropdown: [
              { to: link("news"), label: t("nav.about_sub.articles") },
              { to: link("press"),     label: t("nav.about_sub.press") },
              { to: link("resources"), label: t("nav.about_sub.resources") },
            ]},
            { to: link("about"),      label: t("nav.about") },
          ].map(({ to, label, dropdown }) =>
            dropdown ? (
              <div key={to} className="relative group/dd">
                <NavLink
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
                {/* Dropdown */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover/dd:opacity-100 group-hover/dd:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-lg shadow-lg border border-black/5 py-3 min-w-[200px]">
                    {dropdown.map((sub) => {
                      const hasHash = sub.to.includes('#');
                      const handleClick = hasHash ? (e) => {
                        e.preventDefault();
                        const hash = sub.to.split('#')[1];
                        const basePath = sub.to.split('#')[0];
                        if (pathname === basePath || pathname === basePath + '/') {
                          const el = document.getElementById(hash);
                          if (el) {
                            const headerH = headerRef.current?.offsetHeight || 72;
                            const y = el.getBoundingClientRect().top + window.scrollY - headerH - 20;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                          }
                        } else {
                          window.location.href = sub.to;
                        }
                      } : undefined;
                      return (
                        <NavLink
                          key={sub.to}
                          to={sub.to}
                          onClick={handleClick}
                          className={({ isActive }) =>
                            'block px-6 py-3 text-[14px] tracking-[0.05em] transition-colors duration-150 ' +
                            (isActive && !hasHash ? 'text-[#FF4A3E]' : 'text-neutral-700 hover:text-[#FF4A3E] hover:bg-neutral-50')
                          }
                        >
                          {sub.label}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
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
            )
          )}
        </nav>

        <div
          className="flex items-center justify-self-end header-cta"
          style={{ gap: `${S.rightGap}px` }}
        >
          <style>{`

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

          {/* Bouton combiné Langue + Contact */}
          <div className="hidden xl:inline-flex items-stretch rounded-full overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => switchLanguage(lang === "fr" ? "en" : "fr")}
              className="group/lang relative flex items-center justify-center bg-white text-gray-900 font-normal uppercase tracking-[0.1em]
                         overflow-hidden
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E]/40"
              style={{
                padding: `${S.ctaPadY}px ${Math.round(S.ctaPadX * 0.75)}px`,
                fontSize: `${S.ctaFont}px`,
                borderTopLeftRadius: '9999px',
                borderBottomLeftRadius: '9999px',
                border: '1px solid #FF4A3E',
                borderRight: 'none',
              }}
              aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}
            >
              <span className="absolute inset-0 bg-[#FF4A3E] origin-bottom scale-y-0 group-hover/lang:scale-y-100 transition-transform duration-300 ease-out" />
              <span className="relative z-[1] transition-colors duration-300 group-hover/lang:text-white">{lang === "fr" ? "EN" : "FR"}</span>
            </button>
            <Link
              to={link("contact")}
              className="btn-gary relative inline-flex items-center gap-2 bg-[#FF4A3E] text-white
                         transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E]/40"
              style={{
                padding: `${S.ctaPadY}px ${S.ctaPadX}px`,
                fontSize: `${S.ctaFont}px`,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                borderTopRightRadius: '9999px',
                borderBottomRightRadius: '9999px',
                ['--logoUrl']: "url('/Logo/logo-gary-orange.png')",
                ['--logoAlpha']: 0.16,
                ['--wipeDur']: '550ms',
              }}
            >
              <span className="logo-reveal" aria-hidden="true">
                <span className="logo-layer" />
              </span>
              <span className="relative z-[1]">{t("nav.contact_gary")}</span>
            </Link>
          </div>

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
            aria-label={open ? t("aria.close_menu") : t("aria.open_menu")}
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
            style={{ width: burgerWH, height: burgerWH }}
          >
            <span className="sr-only">{open ? t("aria.close_menu") : t("aria.open_menu")}</span>

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
    {/* Spacer pour compenser le header fixed */}
    <div style={{ height: headerH }} />
    </>
  )
}
