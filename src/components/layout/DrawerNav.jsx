import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

export default function DrawerNav({ open, onClose }) {
  const { pathname } = useLocation();
  const firstLinkRef = useRef(null);
  const aboutSubsRef = useRef(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  const isPathActive = (to) =>
    pathname === to || (to !== "/" && pathname.startsWith(to + "/"));

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t = setTimeout(() => firstLinkRef.current?.focus?.(), 60);

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      clearTimeout(t);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  // Fermer l'accordéon quand le drawer se ferme
  useEffect(() => {
    if (!open) setAboutOpen(false);
  }, [open]);

  const navItems = [
    { to: "/acheter", label: "ACHETER", sub: "Découvrir nos biens" },
    { to: "/vendre", label: "VENDRE", sub: "Vendre avec GARY" },
    { to: "/estimer", label: "ESTIMER", sub: "Estimation confidentielle" },
    { to: "/projets-neufs", label: "PROJETS NEUFS", sub: "Programmes immobiliers" },
  ];

  const aboutSubs = [
    { to: "/a-propos", label: "Qui est GARY" },
    { to: "/actualites", label: "Actualités" },
    { to: "/actualites", label: "Presse" },
    { to: "/actualites", label: "Ressources" },
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
              {navItems.map((item, idx) => {
                const active = isPathActive(item.to);
                return (
                  <li key={item.to}>
                    <NavLink
                      ref={idx === 0 ? firstLinkRef : undefined}
                      to={item.to}
                      onClick={onClose}
                      className={`
                        group relative block rounded-2xl px-5 py-3.5 overflow-hidden
                        border border-black/12
                        bg-white/55
                        transition-all duration-200
                        hover:bg-white/80 hover:border-black/18
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E]/30
                        ${
                          active
                            ? "bg-[#FF4A3E]/6 border-black/18 shadow-[0_10px_24px_rgba(0,0,0,0.06),inset_0_0_0_1px_rgba(255,74,62,0.28)]"
                            : ""
                        }
                      `}
                    >
                      <span
                        className={`
                          pointer-events-none absolute left-0 top-0 h-full w-[5px]
                          bg-[#FF4A3E]
                          transition-opacity duration-200
                          ${
                            active
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-30"
                          }
                        `}
                      />
                      <div className="pl-2">
                        <div className="text-black font-light uppercase leading-none tracking-[0.26em] text-[clamp(22px,6.6vw,34px)]">
                          {item.label}
                        </div>
                        <div className="mt-2 text-[13px] text-black/70">
                          {item.sub}
                        </div>
                      </div>
                    </NavLink>
                  </li>
                );
              })}

              {/* A propos — accordéon */}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setAboutOpen((v) => {
                      if (!v) {
                        // Scroll le conteneur nav pour mettre les sous-options bien en vue
                        setTimeout(() => {
                          const el = aboutSubsRef.current;
                          if (!el) return;
                          const scrollParent = el.closest("[class*='overflow-y']") || el.closest("nav");
                          if (scrollParent) {
                            const target = el.offsetTop - 20;
                            scrollParent.scrollTo({ top: target, behavior: "smooth" });
                          }
                        }, 100);
                      }
                      return !v;
                    });
                  }}
                  className={`
                    group relative w-full text-left block rounded-2xl px-5 py-3.5 overflow-hidden
                    border border-black/12
                    bg-white/55
                    transition-all duration-200
                    hover:bg-white/80 hover:border-black/18
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E]/30
                    ${
                      aboutActive || aboutOpen
                        ? "bg-[#FF4A3E]/6 border-black/18 shadow-[0_10px_24px_rgba(0,0,0,0.06),inset_0_0_0_1px_rgba(255,74,62,0.28)]"
                        : ""
                    }
                  `}
                >
                  <span
                    className={`
                      pointer-events-none absolute left-0 top-0 h-full w-[5px]
                      bg-[#FF4A3E]
                      transition-opacity duration-200
                      ${
                        aboutActive || aboutOpen
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-30"
                      }
                    `}
                  />
                  <div className="pl-2 flex items-center justify-between">
                    <div>
                      <div className="text-black font-light uppercase leading-none tracking-[0.26em] text-[clamp(22px,6.6vw,34px)]">
                        À PROPOS
                      </div>
                      <div className="mt-2 text-[13px] text-black/70">
                        En savoir plus sur GARY
                      </div>
                    </div>
                    <span
                      className="text-black/40 text-[20px] transition-transform duration-300 ease-out"
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
                  className="overflow-hidden transition-all duration-300 ease-out"
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
                              border border-black/8
                              bg-white/50
                              transition-all duration-200
                              hover:bg-white/80 hover:border-black/15
                              focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E]/30
                              ${
                                subActive
                                  ? "bg-[#FF4A3E]/5 border-black/15"
                                  : ""
                              }
                            `}
                          >
                            <span className={`text-[15px] ${subActive ? "text-[#FF4A3E]" : "text-black/85"}`}>
                              {sub.label}
                            </span>
                            <span className="text-black/25 group-hover:text-black/45 text-[13px] transition-colors">
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
                tracking-[0.18em] uppercase text-[12px]
                shadow-sm transition-transform duration-200
                hover:scale-[1.01]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E]/35
              "
            >
              Contacter GARY
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
