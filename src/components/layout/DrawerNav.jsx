import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale.js";

export default function DrawerNav({ open, onClose }) {
  const { pathname } = useLocation();
  const { t, link, lang, switchLanguage } = useLocale();
  const firstLinkRef = useRef(null);
  const aboutSubsRef = useRef(null);
  const vendreSubsRef = useRef(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [vendreOpen, setVendreOpen] = useState(false);

  const homePath = link("home");
  const isPathActive = (to) =>
    pathname === to || (to !== "/" && to !== "/en" && to !== homePath && pathname.startsWith(to + "/"));

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.setAttribute("data-drawer-open", "");

    const t = setTimeout(() => firstLinkRef.current?.focus?.(), 60);

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.removeAttribute("data-drawer-open");
      clearTimeout(t);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  // Fermer les accordéons quand le drawer se ferme
  useEffect(() => {
    if (!open) { setAboutOpen(false); setVendreOpen(false); }
  }, [open]);

  // Scroll en bas quand un accordéon s'ouvre
  useEffect(() => {
    if (!aboutOpen) return;
    const t = setTimeout(() => {
      const el = aboutSubsRef.current;
      if (!el) return;
      const scrollParent = el.closest("[class*='overflow-y']") || el.closest("nav");
      if (scrollParent) {
        scrollParent.scrollTo({ top: scrollParent.scrollHeight, behavior: "smooth" });
      }
    }, 160);
    return () => clearTimeout(t);
  }, [aboutOpen]);

  useEffect(() => {
    if (!vendreOpen) return;
    const t = setTimeout(() => {
      const el = vendreSubsRef.current;
      if (!el) return;
      const scrollParent = el.closest("[class*='overflow-y']") || el.closest("nav");
      if (scrollParent) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 160);
    return () => clearTimeout(t);
  }, [vendreOpen]);

  const navItems = [
    { to: link("buy"), label: t("drawer.buy"), sub: t("drawer.buy_sub") },
    { to: link("estimate"), label: t("drawer.estimate"), sub: t("drawer.estimate_sub") },
    { to: link("newProjects"), label: t("drawer.new_projects"), sub: t("drawer.new_projects_sub") },
  ];

  const vendreSubs = [
    { to: link("sell") + "#constat",        label: t("nav.sell_sub.observation") },
    { to: link("sell") + "#difference",     label: t("nav.sell_sub.difference") },
    { to: link("sell") + "#parcours",       label: t("nav.sell_sub.journey") },
    { to: link("sell") + "#livrables",      label: t("nav.sell_sub.deliverables") },
    { to: link("sell") + "#faq",            label: t("nav.sell_sub.faq") },
    { to: link("sell") + "#vendus",         label: t("nav.sell_sub.recently_sold") },
    { to: link("sell") + "#equipe",         label: t("nav.sell_sub.team") },
    { to: link("sell") + "#cta-final-sell", label: t("nav.sell_sub.contact_us") },
  ];

  const sellPath = link("sell");
  const vendreActive = pathname === sellPath || pathname.startsWith(sellPath + "/");

  const aboutSubs = [
    { to: link("about"), label: t("nav.about_sub.who_is_gary") },
    { to: link("news"), label: t("nav.about_sub.articles") },
    { to: link("press"), label: t("nav.about_sub.press") },
    { to: link("resources"), label: t("nav.about_sub.resources") },
  ];

  const aboutActive = aboutSubs.some((s) => isPathActive(s.to));

  return (
    <div
      className={`
        xl:hidden fixed inset-0 z-[10000]
        transition-[visibility] duration-300
        ${open ? "visible" : "invisible"}
      `}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <button
        type="button"
        onClick={onClose}
        aria-label={t("aria.close_menu")}
        className={`
          absolute inset-0
          bg-black/60 backdrop-blur-[2px]
          transition-opacity duration-300 ease-out
          ${open ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Sheet */}
      <aside
        className={`
          absolute right-0 top-0 h-full w-[92vw] max-w-[460px]
          bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-xl
          border-l border-black/10 shadow-2xl
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-6 py-5 border-b border-black/10"
            style={{ paddingTop: "max(18px, env(safe-area-inset-top))" }}
          >
            <Link
              to={link("home")}
              onClick={onClose}
              className="flex flex-col"
              aria-label={t("aria.back_home")}
            >
              <span className="uppercase font-medium text-[13px] tracking-[0.34em] text-black">
                {t("drawer.gary")}
              </span>
              <span className="mt-1 text-[11px] uppercase tracking-[0.22em] text-black/70">
                {t("drawer.menu")}
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { switchLanguage(lang === "fr" ? "en" : "fr"); onClose(); }}
                className="
                  inline-flex items-center justify-center rounded-full
                  h-11 w-11
                  bg-white/80 border border-black/12 shadow-sm
                  transition-all duration-200
                  hover:bg-white hover:border-black/20
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E]/35
                  text-[13px] font-semibold tracking-wide text-black/85
                "
                aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}
              >
                {lang === "fr" ? "EN" : "FR"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="
                  inline-flex items-center justify-center rounded-full
                  h-11 w-11
                  bg-white/80 border border-black/12 shadow-sm
                  transition-all duration-200
                  hover:bg-white hover:border-black/20
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E]/35
                "
                aria-label={t("aria.close")}
              >
                <span className="text-[18px] leading-none text-black/85">✕</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <nav className="flex-1 overflow-y-auto px-6 py-6">
            <ul className="space-y-3">
              {/* ACHETER */}
              <li>
                <NavLink
                  ref={firstLinkRef}
                  to={link("buy")}
                  onClick={onClose}
                  className={`
                    group relative block rounded-2xl px-5 py-3.5 overflow-hidden border
                    transition-all duration-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E]/30
                    ${!aboutOpen && !vendreOpen && isPathActive(link("buy"))
                      ? "bg-[#FF4A3E] border-[#FF4A3E] shadow-[0_10px_24px_rgba(255,74,62,0.25)]"
                      : "border-black/12 bg-white/55 hover:bg-white/80 hover:border-black/18"}
                  `}
                >
                  <div className="pl-2">
                    <div className={`font-light uppercase leading-none tracking-[0.26em] text-[clamp(22px,6.6vw,34px)] ${!aboutOpen && !vendreOpen && isPathActive(link("buy")) ? "text-white" : "text-black"}`}>{t("drawer.buy")}</div>
                    <div className={`mt-2 text-[13px] ${!aboutOpen && !vendreOpen && isPathActive(link("buy")) ? "text-white/80" : "text-black/70"}`}>{t("drawer.buy_sub")}</div>
                  </div>
                </NavLink>
              </li>

              {/* VENDRE — accordéon */}
              <li>
                <div
                  className={`
                    group relative w-full text-left rounded-2xl px-5 py-3.5 overflow-hidden border
                    transition-all duration-200
                    ${vendreActive || vendreOpen
                      ? "bg-[#FF4A3E] border-[#FF4A3E] shadow-[0_10px_24px_rgba(255,74,62,0.25)]"
                      : "border-black/12 bg-white/55 hover:bg-white/80 hover:border-black/18"}
                  `}
                >
                  <div className="pl-2 flex items-center justify-between">
                    <NavLink
                      to={link("sell")}
                      onClick={onClose}
                      className="flex-1 min-w-0"
                    >
                      <div className={`font-light uppercase leading-none tracking-[0.26em] text-[clamp(22px,6.6vw,34px)] ${vendreActive || vendreOpen ? "text-white" : "text-black"}`}>{t("drawer.sell")}</div>
                      <div className={`mt-2 text-[13px] ${vendreActive || vendreOpen ? "text-white/80" : "text-black/70"}`}>{t("drawer.sell_sub")}</div>
                    </NavLink>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setVendreOpen((v) => !v); }}
                      className="p-2 -mr-2 focus:outline-none"
                      aria-label={vendreOpen ? "Fermer sous-menu" : "Ouvrir sous-menu"}
                    >
                      <span
                        className={`text-[20px] transition-transform duration-300 ease-out ${vendreActive || vendreOpen ? "text-white/60" : "text-black/40"}`}
                        style={{ transform: vendreOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                        aria-hidden
                      >▾</span>
                    </button>
                  </div>
                </div>
                <div
                  ref={vendreSubsRef}
                  className="overflow-hidden transition-all duration-150 ease-out"
                  style={{
                    maxHeight: vendreOpen ? `${vendreSubs.length * 56}px` : "0px",
                    opacity: vendreOpen ? 1 : 0,
                  }}
                >
                  <ul className="mt-2 ml-4 space-y-1.5">
                    {vendreSubs.map((sub) => (
                      <li key={sub.label}>
                        <NavLink
                          to={sub.to}
                          onClick={onClose}
                          className="group flex items-center justify-between rounded-xl px-4 py-3 border border-black/8 bg-white/50 hover:bg-white/80 hover:border-black/15 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E]/30"
                        >
                          <span className="text-[15px] text-black/85">{sub.label}</span>
                          <span className="text-[13px] text-black/25 group-hover:text-black/45 transition-colors">→</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>

              {/* ESTIMER, PROJETS NEUFS */}
              {navItems.filter(item => item.to !== link("buy")).map((item) => {
                const active = !aboutOpen && !vendreOpen && isPathActive(item.to);
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={onClose}
                      className={`
                        group relative block rounded-2xl px-5 py-3.5 overflow-hidden border
                        transition-all duration-200
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E]/30
                        ${active
                          ? "bg-[#FF4A3E] border-[#FF4A3E] shadow-[0_10px_24px_rgba(255,74,62,0.25)]"
                          : "border-black/12 bg-white/55 hover:bg-white/80 hover:border-black/18"}
                      `}
                    >
                      <div className="pl-2">
                        <div className={`font-light uppercase leading-none tracking-[0.26em] text-[clamp(22px,6.6vw,34px)] ${active ? "text-white" : "text-black"}`}>{item.label}</div>
                        <div className={`mt-2 text-[13px] ${active ? "text-white/80" : "text-black/70"}`}>{item.sub}</div>
                      </div>
                    </NavLink>
                  </li>
                );
              })}

              {/* A propos — accordéon */}
              <li>
                <button
                  type="button"
                  onClick={() => setAboutOpen((v) => !v)}
                  className={`
                    group relative w-full text-left block rounded-2xl px-5 py-3.5 overflow-hidden
                    border
                    transition-all duration-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E]/30
                    ${
                      aboutActive || aboutOpen
                        ? "bg-[#FF4A3E] border-[#FF4A3E] shadow-[0_10px_24px_rgba(255,74,62,0.25)]"
                        : "border-black/12 bg-white/55 hover:bg-white/80 hover:border-black/18"
                    }
                  `}
                >
                  <div className="pl-2 flex items-center justify-between">
                    <div>
                      <div className={`font-light uppercase leading-none tracking-[0.26em] text-[clamp(22px,6.6vw,34px)] ${aboutActive || aboutOpen ? "text-white" : "text-black"}`}>
                        {t("drawer.about")}
                      </div>
                      <div className={`mt-2 text-[13px] ${aboutActive || aboutOpen ? "text-white/80" : "text-black/70"}`}>
                        {t("drawer.about_sub")}
                      </div>
                    </div>
                    <span
                      className={`text-[20px] transition-transform duration-300 ease-out ${aboutActive || aboutOpen ? "text-white/60" : "text-black/40"}`}
                      style={{ transform: aboutOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      aria-hidden
                    >
                      ▾
                    </span>
                  </div>
                </button>

                {/* Sous-menu dépliable */}
                <div
                  ref={aboutSubsRef}
                  className="overflow-hidden transition-all duration-150 ease-out"
                  style={{
                    maxHeight: aboutOpen ? `${aboutSubs.length * 56}px` : "0px",
                    opacity: aboutOpen ? 1 : 0,
                  }}
                >
                  <ul className="mt-2 ml-4 space-y-1.5">
                    {aboutSubs.map((sub) => {
                      const subActive = isPathActive(sub.to);
                      return (
                        <li key={sub.label}>
                          <NavLink
                            to={sub.to}
                            onClick={onClose}
                            className={`
                              group flex items-center justify-between
                              rounded-xl px-4 py-3
                              border
                              transition-all duration-200
                              focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E]/30
                              ${
                                subActive
                                  ? "bg-[#FF4A3E] border-[#FF4A3E] shadow-[0_6px_16px_rgba(255,74,62,0.2)]"
                                  : "border-black/8 bg-white/50 hover:bg-white/80 hover:border-black/15"
                              }
                            `}
                          >
                            <span className={`text-[15px] ${subActive ? "text-white font-medium" : "text-black/85"}`}>
                              {sub.label}
                            </span>
                            <span className={`text-[13px] transition-colors ${subActive ? "text-white/70" : "text-black/25 group-hover:text-black/45"}`}>
                              →
                            </span>
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            </ul>
          </nav>

          {/* Bottom CTA */}
          <div
            className="px-6 pt-4 pb-6 border-t border-black/10"
            style={{ paddingBottom: "max(18px, env(safe-area-inset-bottom))" }}
          >
            <NavLink
              to={link("contact")}
              onClick={onClose}
              className="
                w-full inline-flex items-center justify-center
                rounded-full bg-[#FF4A3E] text-white
                px-6 py-4
                tracking-[0.18em] uppercase text-lg
                shadow-sm transition-transform duration-200
                hover:scale-[1.01]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E]/35
                relative overflow-hidden
              "
            >
              {/* Logo GARY en fond — toujours visible */}
              <span
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundColor: '#fff',
                  opacity: 0.16,
                  WebkitMask: "url('/Logo/logo-gary-orange.png') center / cover no-repeat",
                  mask: "url('/Logo/logo-gary-orange.png') center / cover no-repeat",
                }}
              />
              <span className="relative z-[1]">{t("drawer.contact_gary")}</span>
            </NavLink>

            <p className="mt-3 text-[12px] text-black/55 text-center">
              {t("drawer.tagline")}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
