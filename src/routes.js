/**
 * Route definitions for FR (default) and EN.
 * FR routes have no prefix, EN routes are prefixed with /en.
 */

export const routeMap = {
  home:              { fr: "/",                   en: "/en" },
  buy:               { fr: "/acheter",            en: "/en/buy" },
  listing:           { fr: "/annonce/:id",        en: "/en/listing/:id" },
  sell:              { fr: "/vendre",             en: "/en/sell" },
  estimate:          { fr: "/estimer",            en: "/en/estimate" },
  estimateConfirm:   { fr: "/estimer/confirmation", en: "/en/estimate/confirmation" },
  about:             { fr: "/a-propos",           en: "/en/about" },
  contact:           { fr: "/contact",            en: "/en/contact" },
  team:              { fr: "/equipe/:slug",       en: "/en/team/:slug" },
  newProjects:       { fr: "/projets-neufs",      en: "/en/new-projects" },
  newProjectDetail:  { fr: "/projets-neufs/:id",  en: "/en/new-projects/:id" },
  news:              { fr: "/actualites",         en: "/en/news" },
  newsDetail:        { fr: "/actualites/:id",     en: "/en/news/:id" },
  press:             { fr: "/presse",             en: "/en/press" },
  resources:         { fr: "/ressources",         en: "/en/resources" },
  legal:             { fr: "/mentions-legales",    en: "/en/legal" },
  privacy:           { fr: "/politique-de-confidentialite", en: "/en/privacy" },
};

/**
 * Génère un path localisé.
 * Ex: localePath("news", "en") → "/en/news"
 *     localePath("listing", "fr", { id: "123" }) → "/annonce/123"
 */
export function localePath(routeKey, lang = "fr", params = {}) {
  const route = routeMap[routeKey];
  if (!route) return "/";
  let path = route[lang] || route.fr;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });
  return path;
}

/**
 * Détecte la langue depuis le pathname.
 */
export function langFromPath(pathname) {
  return pathname.startsWith("/en") ? "en" : "fr";
}
