/**
 * Navigation retour avec overlay noir — masque le flash de scroll restoration.
 * Utilisé par tous les boutons croix (×) des pages détail.
 */

const NAV_KEY = "gary_has_navigated";
const REFERRER_KEY = "gary_nav_referrer";

/**
 * Marque qu'une navigation interne a eu lieu.
 * Sauvegarde la page d'origine pour le fallback.
 * Appelé par ScrollToTop à chaque PUSH.
 */
export function markNavigation(fromPath) {
  try {
    sessionStorage.setItem(NAV_KEY, "1");
    if (fromPath) sessionStorage.setItem(REFERRER_KEY, fromPath);
  } catch {}
}

/**
 * Détermine la page parent : d'abord la page d'origine sauvegardée,
 * sinon déduit depuis l'URL courante.
 */
function getFallbackRoute() {
  // Utiliser la page d'origine si elle existe
  try {
    const saved = sessionStorage.getItem(REFERRER_KEY);
    if (saved) return saved;
  } catch {}

  // Sinon deviner depuis l'URL
  const path = window.location.pathname;
  if (path.startsWith("/annonce")) return "/acheter";
  if (path.startsWith("/projets-neufs/")) return "/projets-neufs";
  if (path.startsWith("/actualites/")) return "/actualites";
  if (path.startsWith("/equipe/")) return "/a-propos";
  return "/";
}

export default function navigateBack(navigate) {
  // Overlay noir
  let overlay = document.querySelector(".transition-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "transition-overlay";
    document.body.appendChild(overlay);
  }
  overlay.offsetHeight; // reflow
  overlay.classList.add("is-on");

  const hasNavigated = sessionStorage.getItem(NAV_KEY) === "1";
  const fallback = getFallbackRoute();

  setTimeout(() => {
    if (hasNavigated) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  }, 250);
}

/**
 * Fade-out de l'overlay au montage d'une page (à appeler dans useEffect).
 */
export function fadeOutOverlay() {
  const overlay = document.querySelector(".transition-overlay");
  if (!overlay) return;

  const t = setTimeout(() => {
    overlay.classList.remove("is-on");
    setTimeout(() => {
      if (overlay && document.body.contains(overlay)) overlay.remove();
    }, 250);
  }, 80);

  return () => clearTimeout(t);
}
