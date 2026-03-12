/**
 * Cache mémoire des labels Realforce.
 * Le préfixe "_" empêche Vercel de l'exposer comme route API.
 *
 * En serverless, le cache survit tant que l'instance est "warm" (~5-15 min).
 * TTL de 1 h pour éviter les données périmées entre invocations warm.
 */

const CACHE_TTL = 60 * 60 * 1000; // 1 h

const cache = new Map();

/**
 * Fetch un endpoint Labels Realforce avec cache mémoire.
 * @param {"locations"|"categories"|"choices"|"amenities"|"amenities-categories"|"amenities-groups"} type
 * @param {Record<string,string>} params  — query params supplémentaires (lang, is_city, category…)
 * @returns {Promise<object>}
 */
export async function fetchLabels(type, params = {}) {
  const apiKey = process.env.REALFORCE_PUBLIC_API_KEY;
  // Les labels sont sur un domaine séparé (labels.realforce.ch), pas sur listings.realforce.ch
  const baseUrl = process.env.REALFORCE_LABELS_BASE_URL || "https://labels.realforce.ch";

  if (!apiKey) throw new Error("Missing REALFORCE_PUBLIC_API_KEY");

  const ROUTES = {
    locations:              "get-locations",
    categories:             "get-categories-labels",
    choices:                "get-choices-labels",
    amenities:              "get-amenities-labels",
    "amenities-categories": "get-amenities-categories-labels",
    "amenities-groups":     "get-amenities-groups",
  };

  const route = ROUTES[type];
  if (!route) throw new Error(`Unknown label type: ${type}`);

  // Clé de cache basée sur type + params
  const cacheKey = `${type}:${JSON.stringify(params)}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data;
  }

  const url = new URL(`${baseUrl}/api/v1/${route}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const resp = await fetch(url.toString(), {
    headers: { "X-API-KEY": apiKey },
  });

  if (!resp.ok) {
    throw new Error(`Labels ${type} error: ${resp.status}`);
  }

  const data = await resp.json();
  cache.set(cacheKey, { data, ts: Date.now() });
  return data;
}

/**
 * Fetch les 4 jeux de labels nécessaires aux properties en parallèle.
 * @param {string} lang
 * @returns {Promise<{ cities: object, categories: object, amenities: object, choices: object }>}
 */
export async function fetchPropertyLabels(lang = "fr") {
  const [cities, categories, amenities, choices] = await Promise.all([
    fetchLabels("locations", { is_city: "1", lang }).catch(() => ({})),
    fetchLabels("categories", { lang }).catch(() => ({})),
    fetchLabels("amenities", { lang }).catch(() => ({})),
    fetchLabels("choices", { lang }).catch(() => ({})),
  ]);
  return { cities, categories, amenities, choices };
}
