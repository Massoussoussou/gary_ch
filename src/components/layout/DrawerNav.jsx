import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

export default function DrawerNav({ open, onClose }) {
  const { pathname } = useLocation();
  const firstLinkRef = useRef(null);
  const aboutSubsRef = useRef(null);
  const vendreSubsRef = useRef(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [vendreOpen, setVendreOpen] = useState(false);

  const isPathActive = (to) =>
    pathname === to || (to !== "/" && pathname.startsWith(to + "/"));

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
    { to: "/acheter", label: "ACHETER", sub: "Découvrir nos biens" },
    { to: "/estimer", label: "ESTIMER", sub: "Estimation et stratégie" },
    { to: "/projets-neufs", label: "PROJETS NEUFS", sub: "Les projets neufs" },
  ];

  const vendreSubs = [
    { to: "/vendre#constat",        label: "Le constat" },
    { to: "/vendre#difference",     label: "Notre différence" },
    { to: "/vendre#parcours",       label: "Votre parcours" },
    { to: "/vendre#livrables",      label: "Nos livrables" },
    { to: "/vendre#faq",            label: "Questions fréquentes" },
    { to: "/vendre#vendus",         label: "Vendus récemment" },
    { to: "/vendre#equipe",         label: "L'équipe" },
    { to: "/vendre#cta-final-sell", label: "Contactez-nous" },
  ];

  const vendreActive = pathname === "/vendre" || pathname.startsWith("/vendre/");

  const aboutSubs = [
    { to: "/a-propos", label: "Qui est GARY" },
    { to: "/actualites", label: "Articles" },
    { to: "/presse", label: "Presse" },
    { to: "/ressources", label: "Ressources" },
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
        aria-label="Fermer le menu"
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
              to="/"
              onClick={onClose}
              className="flex flex-col"
              aria-label="Retour à l'accueil"
            >
              <span className="uppercase font-medium text-[13px] tracking-[0.34em] text-black">
                GARY
              </span>
              <span className="mt-1 text-[11px] uppercase tracking-[0.22em] text-black/70">
                Menu
              </span>
            </Link>

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
              aria-label="Fermer"
            >
              <span className="text-[18px] leading-none text-black/85">✕</span>
            </button>
          </div>

          {/* Content */}
          <nav className="flex-1 overflow-y-auto px-6 py-6">
            <ul className="space-y-3">
              {/* ACHETER */}
              <li>
                <NavLink
                  ref={firstLinkRef}
                  to="/acheter"
                  onClick={onClose}
                  className={`
                    group relative block rounded-2xl px-5 py-3.5 overflow-hidden border
                    transition-all duration-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E]/30
                    ${!aboutOpen && !vendreOpen && isPathActive("/acheter")
                      ? "bg-[#FF4A3E] border-[#FF4A3E] shadow-[0_10px_24px_rgba(255,74,62,0.25)]"
                      : "border-black/12 bg-white/55 hover:bg-white/80 hover:border-black/18"}
                  `}
                >
                  <div className="pl-2">
                    <div className={`font-light uppercase leading-none tracking-[0.26em] text-[clamp(22px,6.6vw,34px)] ${!aboutOpen && !vendreOpen && isPathActive("/acheter") ? "text-white" : "text-black"}`}>ACHETER</div>
                    <div className={`mt-2 text-[13px] ${!aboutOpen && !vendreOpen && isPathActive("/acheter") ? "text-white/80" : "text-black/70"}`}>Découvrir nos biens</div>
                  </div>
                </NavLink>
              </li>

              {/* VENDRE — accordéon */}
              <li>
                <button
                  type="button"
                  onClick={() => setVendreOpen((v) => !v)}
                  className={`
                    group relative w-full text-left block rounded-2xl px-5 py-3.5 overflow-hidden border
                    transition-all duration-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E]/30
                    ${vendreActive || vendreOpen
                      ? "bg-[#FF4A3E] border-[#FF4A3E] shadow-[0_10px_24px_rgba(255,74,62,0.25)]"
                      : "border-black/12 bg-white/55 hover:bg-white/80 hover:border-black/18"}
                  `}
                >
                  <div className="pl-2 flex items-center justify-between">
                    <div>
                      <div className={`font-light uppercase leading-none tracking-[0.26em] text-[clamp(22px,6.6vw,34px)] ${vendreActive || vendreOpen ? "text-white" : "text-black"}`}>VENDRE</div>
                      <div className={`mt-2 text-[13px] ${vendreActive || vendreOpen ? "text-white/80" : "text-black/70"}`}>Le processus complet</div>
                    </div>
                    <span
                      className={`text-[20px] transition-transform duration-300 ease-out ${vendreActive || vendreOpen ? "text-white/60" : "text-black/40"}`}
                      style={{ transform: vendreOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      aria-hidden
                    >▾</span>
                  </div>
                </button>
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
              {navItems.filter(item => item.to !== "/acheter").map((item) => {
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
                        À PROPOS
                      </div>
                      <div className={`mt-2 text-[13px] ${aboutActive || aboutOpen ? "text-white/80" : "text-black/70"}`}>
                        En savoir plus sur GARY
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
              to="/contact"
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
              <span className="relative z-[1]">Contacter GARY</span>
            </NavLink>

            <p className="mt-3 text-[12px] text-black/55 text-center">
              Réponse rapide • Discrétion • Expertise Genève
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
