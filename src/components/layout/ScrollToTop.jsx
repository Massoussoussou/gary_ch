import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

function getScroll() {
  if (window.__lenis) return window.__lenis.scroll || window.__lenis.animatedScroll || 0;
  return window.scrollY || document.documentElement.scrollTop || 0;
}

function forceScroll(y) {
  if (window.__lenis) {
    window.__lenis.stop();
    window.__lenis.scrollTo(y, { immediate: true, force: true });
  }
  window.scrollTo(0, y);
  document.documentElement.scrollTop = y;
  document.body.scrollTop = y;
}

function reenableLenis(y) {
  if (window.__lenis) {
    window.__lenis.scrollTo(y, { immediate: true, force: true });
    window.__lenis.start();
    // Force une seconde fois après le premier raf pour écraser toute valeur interne
    requestAnimationFrame(() => {
      if (window.__lenis) {
        window.__lenis.scrollTo(y, { immediate: true, force: true });
      }
    });
  }
}

const STORAGE_KEY = "gary_scroll_positions";
function loadPositions() {
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}
function savePositions(map) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(map)); } catch {}
}

// Flag global pour bloquer la sauvegarde pendant la restauration
let restoring = false;

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const prevPathname = useRef(pathname);
  const isFirstRender = useRef(true);
  const restoreTimers = useRef([]);

  // Sauvegarder la position en continu (sauf pendant une restauration)
  useEffect(() => {
    const save = () => {
      if (restoring) return;
      const map = loadPositions();
      map[prevPathname.current] = getScroll();
      savePositions(map);
    };
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, []);

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Annuler les restaurations précédentes
    restoreTimers.current.forEach(clearTimeout);
    restoreTimers.current = [];

    // Sauvegarder la position de la page qu'on quitte
    const map = loadPositions();
    map[prevPathname.current] = getScroll();
    savePositions(map);

    if (navigationType === "POP") {
      const saved = map[pathname] || 0;
      restoring = true;

      forceScroll(saved);

      restoreTimers.current = [
        setTimeout(() => { forceScroll(saved); }, 50),
        setTimeout(() => { forceScroll(saved); }, 150),
        setTimeout(() => { forceScroll(saved); reenableLenis(saved); }, 350),
        setTimeout(() => { forceScroll(saved); reenableLenis(saved); }, 600),
        setTimeout(() => {
          forceScroll(saved);
          reenableLenis(saved);
          // Fin de la restauration — réactiver la sauvegarde
          restoring = false;
        }, 1200),
      ];
    } else {
      forceScroll(0);
      setTimeout(() => reenableLenis(0), 50);
    }

    prevPathname.current = pathname;
  }, [pathname, navigationType]);

  return null;
}
