import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { markNavigation } from "../../utils/navigateBack.js";

const STORAGE_KEY = "gary_scroll_positions";

function readMap() {
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}
function writeMap(map) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(map)); } catch {}
}

/**
 * Force le scroll à `target`, retente jusqu'à ce que ça marche
 * ou timeout de 2.5s. Gère Lenis.
 */
function restoreScroll(target, onDone) {
  const doScroll = () => {
    window.scrollTo(0, target);
    if (window.__lenis) {
      window.__lenis.scrollTo(target, { immediate: true, force: true });
    }
  };

  if (target <= 0) {
    doScroll();
    if (window.__lenis) window.__lenis.start();
    if (onDone) setTimeout(onDone, 80);
    return () => {};
  }

  let timer;
  let attempts = 0;

  const tryScroll = () => {
    doScroll();
    attempts++;

    const reached = Math.abs(window.scrollY - target) < 15;

    if (reached || attempts >= 40) {
      // Réussi ou timeout (40 × 50ms = 2s max)
      doScroll();
      if (window.__lenis) window.__lenis.start();
      if (onDone) setTimeout(onDone, 300);
      return;
    }

    // Page pas assez haute encore → réessayer
    timer = setTimeout(tryScroll, 50);
  };

  timer = setTimeout(tryScroll, 30);

  return () => clearTimeout(timer);
}

/** Retire l'overlay noir en fade-out */
function fadeOverlay() {
  const overlay = document.querySelector(".transition-overlay");
  if (!overlay) return;
  overlay.classList.remove("is-on");
  setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 250);
}

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const prevPath = useRef(pathname);
  const cleanup = useRef(null);

  // Sauvegarder la position scroll AVANT chaque navigation
  // On écoute en capture pour sauver avant que navigate() ne change le pathname
  useEffect(() => {
    const save = () => {
      const y = window.__lenis
        ? (window.__lenis.scroll ?? window.__lenis.animatedScroll ?? window.scrollY)
        : window.scrollY;
      if (y > 0) {
        const map = readMap();
        map[pathname] = y;
        writeMap(map);
      }
    };

    // Sauvegarder sur clic ET sur beforeunload (cas refresh)
    document.addEventListener("click", save, true);
    window.addEventListener("beforeunload", save);

    return () => {
      document.removeEventListener("click", save, true);
      window.removeEventListener("beforeunload", save);
    };
  }, [pathname]);

  useEffect(() => {
    if (prevPath.current === pathname) return;

    // Nettoyer les timers précédents
    if (cleanup.current) cleanup.current();

    if (navigationType === "POP") {
      // Retour arrière → restaurer le scroll
      const map = readMap();
      const saved = map[pathname] || 0;

      // Bloquer Lenis pendant la restauration
      if (window.__lenis) window.__lenis.stop();
      window.scrollTo(0, saved);

      cleanup.current = restoreScroll(saved, fadeOverlay);
    } else {
      // Navigation avant (PUSH/REPLACE) → scroll en haut + marquer la navigation
      markNavigation(prevPath.current);

      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true, force: true });
      }
      window.scrollTo(0, 0);

      // Retirer l'overlay s'il existe (cas fallback navigateBack → PUSH)
      requestAnimationFrame(fadeOverlay);
    }

    prevPath.current = pathname;
  }, [pathname, navigationType]);

  return null;
}
