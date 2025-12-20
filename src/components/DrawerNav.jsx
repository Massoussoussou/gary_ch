import { useEffect, useRef } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

export default function DrawerNav({ open, onClose }) {
  const { pathname } = useLocation();
  const firstLinkRef = useRef(null);

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

  const primary = [
    { to: "/acheter", label: "ACHETER", sub: "Découvrir nos biens" },
    { to: "/vendre", label: "VENDRE", sub: "Vendre avec GARY" },
    { to: "/estimer", label: "ESTIMER", sub: "Estimation confidentielle" },
  ];

  const secondary = [
    { to: "/projets-neufs", label: "Projets neufs" },
    { to: "/a-propos", label: "Qui est GARY ?" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <div
      className={`
        xl:hidden fixed inset-0 z-[9999]
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
              aria-label="Retour à l’accueil"
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
            {/* Section title */}
            <div className="mb-4 flex items-center gap-3">
              <p className="text-[11px] uppercase tracking-[0.32em] text-black/70">
                Navigation
              </p>
              <span className="h-px flex-1 bg-black/15" />
            </div>

            <ul className="space-y-3">
              {primary.map((item, idx) => {
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
                      {/* Accent bar */}
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
                        <div
                          className="
                            text-black font-light uppercase leading-none
                            tracking-[0.26em]
                            text-[clamp(22px,6.6vw,34px)]
                          "
                        >
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
            </ul>

            <div className="mt-8">
              <div className="mb-3 flex items-center gap-3">
                <p className="text-[11px] uppercase tracking-[0.32em] text-black/70">
                  À propos
                </p>
                <span className="h-px flex-1 bg-black/15" />
              </div>

              <ul className="space-y-2">
                {secondary.map((item) => {
                  const active = isPathActive(item.to);
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        onClick={onClose}
                        className={`
                          group flex items-center justify-between
                          rounded-2xl px-5 py-4
                          border border-black/12
                          bg-white/45
                          transition-all duration-200
                          hover:bg-white/75 hover:border-black/18
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4A3E]/30
                          ${
                            active
                              ? "bg-[#FF4A3E]/4 border-black/18 shadow-[0_10px_22px_rgba(0,0,0,0.05),inset_0_0_0_1px_rgba(255,74,62,0.18)]"
                              : ""
                          }
                        `}
                      >
                        <span className="text-[16px] text-black/90">
                          {item.label}
                        </span>
                        <span className="text-black/30 group-hover:text-black/45 transition-colors">
                          →
                        </span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
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
