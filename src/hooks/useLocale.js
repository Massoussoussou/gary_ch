import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { routeMap, langFromPath } from "../routes.js";

/**
 * Hook central pour la gestion de la langue.
 * Retourne la langue courante, une fonction pour changer de langue,
 * et un helper pour générer des liens localisés.
 */
export function useLocale() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const lang = i18n.language;

  /**
   * Change de langue et navigue vers l'URL équivalente.
   * Ex: /actualites/3 → /en/news/3
   */
  function switchLanguage(targetLang) {
    if (targetLang === lang) return;

    const currentPath = location.pathname;
    const currentLang = langFromPath(currentPath);

    // Cherche la route correspondante dans routeMap
    let newPath = targetLang === "en" ? "/en" : "/";

    for (const [, routes] of Object.entries(routeMap)) {
      const pattern = routes[currentLang];
      const target = routes[targetLang];
      if (!pattern || !target) continue;

      // Convertit le pattern en regex pour matcher le path actuel
      const regexStr = "^" + pattern.replace(/:[^/]+/g, "([^/]+)") + "$";
      const match = currentPath.match(new RegExp(regexStr));
      if (match) {
        // Reconstruit le path cible avec les params capturés
        let result = target;
        const params = [...match].slice(1);
        let paramIdx = 0;
        result = result.replace(/:[^/]+/g, () => params[paramIdx++] || "");
        newPath = result;
        break;
      }
    }

    i18n.changeLanguage(targetLang);
    navigate(newPath + location.search + location.hash, { replace: true });
  }

  /**
   * Génère un path localisé.
   * Ex: link("news", { id: "3" }) → "/actualites/3" ou "/en/news/3"
   */
  function link(routeKey, params = {}) {
    const route = routeMap[routeKey];
    if (!route) return "/";
    let path = route[lang] || route.fr;
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, value);
    });
    return path;
  }

  return { lang, t, i18n, switchLanguage, link };
}
