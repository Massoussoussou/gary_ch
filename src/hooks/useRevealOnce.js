// src/hooks/useRevealOnce.js
import { useState, useRef, useEffect } from "react";

export function useRevealOnce(options = {}) {
  const [shown, setShown] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      ([entry], observer) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8%", ...options }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return [ref, shown];
}
