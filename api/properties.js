import { fetchPropertyLabels } from "./_labels-cache.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.REALFORCE_PUBLIC_API_KEY;
    const baseUrl = process.env.REALFORCE_PUBLIC_BASE_URL || "https://listings.realforce.ch";

    if (!apiKey) {
      return res.status(500).json({ error: "Missing REALFORCE_PUBLIC_API_KEY" });
    }

    // Params venant du front (avec valeurs par défaut)
    const perPage = Math.min(parseInt(req.query.per_page || "100", 10), 100);
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const lang = String(req.query.lang || "fr").toLowerCase().replace(/[^a-z|]/g, "");
    if (!lang) return res.status(400).json({ error: "Invalid lang" });

    // Langue principale (premier code avant le pipe)
    const primaryLang = lang.split("|")[0];

    const url = new URL(`${baseUrl}/api/v1/get-full-listings`);
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("page", String(page));
    url.searchParams.set("lang", lang);

    // Optionnel: filtre sur date de mise à jour (format YYYY-MM-DD)
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    if (req.query.update_date_min) {
      const d = String(req.query.update_date_min);
      if (dateRe.test(d)) url.searchParams.set("update_date_min", d);
    }
    if (req.query.update_date_max) {
      const d = String(req.query.update_date_max);
      if (dateRe.test(d)) url.searchParams.set("update_date_max", d);
    }

    // Fetch listings + labels en parallèle (labels peuvent échouer sans bloquer)
    console.log("[properties] Fetching from:", url.toString());

    const [rfResp, labels] = await Promise.all([
      fetch(url.toString(), { headers: { "X-API-KEY": apiKey } }),
      fetchPropertyLabels(primaryLang).catch((err) => {
        console.warn("[properties] Labels fetch failed:", err.message);
        return { cities: {}, categories: {}, amenities: {} };
      }),
    ]);

    console.log("[properties] Realforce response status:", rfResp.status);

    if (!rfResp.ok) {
      const text = await rfResp.text();
      return res.status(rfResp.status).json({
        error: "Realforce error",
        status: rfResp.status,
        details: text.slice(0, 300),
      });
    }

    const payload = await rfResp.json();
    console.log("[properties] Payload count:", payload.count, "data length:", (payload.data || []).length);

    // Helpers de résolution
    const { cities, categories, amenities } = labels;

    const resolveCity = (cityId) => {
      const entry = cities[String(cityId)];
      if (!entry) return null;
      const lbl = entry.labels || entry;
      return lbl[primaryLang] || lbl.fr || lbl.en || null;
    };

    const resolveCategory = (catId) => {
      const entry = categories[String(catId)];
      if (!entry) return null;
      return entry[primaryLang] || entry.fr || entry.en || null;
    };

    const resolveAmenity = (amenityId) => {
      const entry = amenities[String(amenityId)];
      if (!entry) return String(amenityId);
      return entry[primaryLang] || entry.fr || entry.en || String(amenityId);
    };

    // Cache 5 min (pour tests) — passer à s-maxage=7200 en production
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

    // Mapping vers le format front
    const data = (payload.data || []).map((p) => {
      const desc = p.description?.[primaryLang] || p.description?.en || {};
      const title = desc.title || p.reference || "Annonce";
      const description = desc.description || "";

      // Surface: habitable > usable > m2
      const surface =
        (p.habitable != null ? Number(p.habitable) : null) ??
        (p.usable != null ? Number(p.usable) : null) ??
        (p.m2 != null ? Number(p.m2) : null);

      // Résolution du type de bien
      const subCatLabel = resolveCategory(p.sub_category_id);
      const mainCatLabel = resolveCategory(p.main_category_id);

      // Résolution des amenities (IDs → noms lisibles)
      const rawAmenities = Array.isArray(p.amenities) ? p.amenities : [];
      const equipements = rawAmenities.map((id) => resolveAmenity(id));

      return {
        id: p.id,
        reference: p.reference || null,
        titre: title,
        prix: p.price != null ? Number(p.price) : null,
        devise: "CHF",
        ville: resolveCity(p.city_id) || (p.zip ? `ZIP ${p.zip}` : null),
        zip: p.zip || null,
        canton: p.canton_id || null,
        pays: "CH",
        type: subCatLabel || mainCatLabel || p.sub_category_id || p.main_category_id || null,
        typeId: p.sub_category_id || p.main_category_id || null,
        pieces: p.rooms != null ? Number(p.rooms) : null,
        chambres: p.bedrooms != null ? Number(p.bedrooms) : null,
        sdb: p.bathrooms != null ? Number(p.bathrooms) : null,
        surface_m2: surface,
        surfaceTerrain: p.land != null ? Number(p.land) : null,
        surfaceBalcon: p.balcony != null ? Number(p.balcony) : null,
        surfaceTerrasse: p.terrace != null ? Number(p.terrace) : null,
        etage: p.floor || null,
        meuble: p.furnish_id != null,
        dispo: p.availability_date || null,
        images: Array.isArray(p.photos) ? p.photos : [],
        description,
        equipements,
        tags: [],
        createdAt: p.lastupdate || p.publication_date || p.creation || null,
        coords: {
          lat: p.latitude != null ? Number(p.latitude) : null,
          lng: p.longitude != null ? Number(p.longitude) : null,
        },
        broker: {
          name: [p.broker_firstname, p.broker_lastname].filter(Boolean).join(" ") || null,
          email: p.broker_email || null,
          phone: p.broker_phone || p.broker_mobile || null,
          avatar: p.broker_avatar || null,
          slug: `${(p.broker_firstname || "agent")}-${(p.broker_lastname || "gary")}`.toLowerCase(),
        },
      };
    });

    return res.status(200).json({
      count: payload.count ?? data.length,
      page: payload.page ?? page,
      per_page: payload.per_page ?? perPage,
      data,
    });
  } catch (err) {
    console.error("API /properties error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
