/**
 * GET /api/labels?type={type}&lang={lang}&...
 *
 * Proxy unique pour les 6 endpoints Labels de Realforce :
 *   type=locations             → get-locations
 *   type=categories            → get-categories-labels
 *   type=choices               → get-choices-labels
 *   type=amenities             → get-amenities-labels
 *   type=amenities-categories  → get-amenities-categories-labels
 *   type=amenities-groups      → get-amenities-groups
 *
 * Cache CDN 24 h (ces données bougent rarement).
 */

const ROUTES = {
  locations:              "get-locations",
  categories:             "get-categories-labels",
  choices:                "get-choices-labels",
  amenities:              "get-amenities-labels",
  "amenities-categories": "get-amenities-categories-labels",
  "amenities-groups":     "get-amenities-groups",
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.REALFORCE_PUBLIC_API_KEY;
    const baseUrl =
      process.env.REALFORCE_LABELS_BASE_URL || "https://labels.realforce.ch";
    const defaultLang = process.env.REALFORCE_PUBLIC_DEFAULT_LOCALE || "fr";

    if (!apiKey) return res.status(500).json({ error: "Missing REALFORCE_PUBLIC_API_KEY" });

    // --- type (obligatoire) ---
    const type = String(req.query.type || "").toLowerCase();
    const route = ROUTES[type];
    if (!route) {
      return res.status(400).json({
        error: `Invalid type. Must be one of: ${Object.keys(ROUTES).join(", ")}`,
      });
    }

    // --- Construire l'URL Realforce ---
    const url = new URL(`${baseUrl}/api/v1/${route}`);

    // lang (requis sauf amenities-groups)
    if (type !== "amenities-groups") {
      const lang = String(req.query.lang || defaultLang)
        .toLowerCase()
        .replace(/[^a-z|]/g, "");
      if (!lang) return res.status(400).json({ error: "Invalid lang" });
      url.searchParams.set("lang", lang);
    }

    // --- Params spécifiques à locations ---
    if (type === "locations") {
      const locationFlags = [
        "is_country", "is_canton", "is_district",
        "is_zone", "is_city", "is_quarter",
      ];
      let hasFlag = false;
      for (const flag of locationFlags) {
        if (req.query[flag] === "1") {
          url.searchParams.set(flag, "1");
          hasFlag = true;
        }
      }
      if (!hasFlag) {
        return res.status(400).json({
          error: "Locations requires at least one flag: is_country, is_canton, is_district, is_zone, is_city, is_quarter",
        });
      }

      // Filtres optionnels (IDs numériques)
      const locationFilters = [
        "country_id", "canton_id", "district_id",
        "zone_id", "city_id", "quarter_id",
      ];
      for (const filter of locationFilters) {
        const val = req.query[filter];
        if (val && /^\d+$/.test(String(val))) {
          url.searchParams.set(filter, String(val));
        }
      }
    }

    // --- Param spécifique à choices ---
    if (type === "choices") {
      const category = String(req.query.category || "").trim();
      if (!category || !/^\d+$/.test(category)) {
        return res.status(400).json({ error: "choices requires a numeric category param" });
      }
      url.searchParams.set("category", category);
    }

    // --- Appel Realforce ---
    const rfResp = await fetch(url.toString(), {
      headers: { "X-API-KEY": apiKey },
    });

    const text = await rfResp.text();
    let payload;
    try { payload = JSON.parse(text); } catch { payload = { raw: text }; }

    if (!rfResp.ok) {
      return res.status(rfResp.status).json({
        error: "Realforce error",
        status: rfResp.status,
        details: payload,
      });
    }

    // Cache CDN 24 h — les labels changent rarement
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=172800");

    return res.status(200).json(payload);
  } catch (err) {
    console.error("API /labels error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
