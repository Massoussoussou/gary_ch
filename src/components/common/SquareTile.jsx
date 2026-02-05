// src/components/common/SquareTile.jsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Tuile responsive :
 * - mobile (<md) : pleine largeur, hauteur auto, arrondi + blur (premium)
 * - desktop (>=md) : carré (base) qui s'agrandit si le contenu dépasse
 */
export default function SquareTile({ base = 780, children }) {
  const wrapRef = useRef(null);
  const [side, setSide] = useState(base);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = (e) => setIsMobile(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  useLayoutEffect(() => {
    if (isMobile) return;
    if (typeof ResizeObserver === "undefined") return;

    const el = wrapRef.current;
    const inner = el?.querySelector?.("[data-square-inner]");
    if (!el || !inner) return;

    const measure = () => {
      const innerH = inner.scrollHeight;
      setSide(Math.max(base, innerH + 32));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [base, isMobile]);

  return (
    <div ref={wrapRef} className="mx-auto w-full grid place-items-center">
      <div
        className="
          relative overflow-hidden shadow-xl
          border border-black/10 md:border-white/25
          bg-white/94 md:bg-white
          backdrop-blur-xl md:backdrop-blur-sm
          rounded-3xl md:rounded-none
          w-full max-w-[min(560px,94vw)] md:max-w-none
          h-auto
        "
        style={!isMobile ? { width: side, height: side } : undefined}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)" }}
        />
        {children}
      </div>
    </div>
  );
}
