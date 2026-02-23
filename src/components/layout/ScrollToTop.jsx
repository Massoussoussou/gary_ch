import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  // useLayoutEffect se déclenche avant le paint du navigateur
  useLayoutEffect(() => {
    // Reset Lenis (scroll interne + DOM)
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true, force: true });
    }
    // Fallback natif — toujours exécuté pour garantir le scroll
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
