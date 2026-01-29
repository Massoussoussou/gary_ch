export default async function handler(req, res) {
  try {
    const apiKey = process.env.REALFORCE_PUBLIC_API_KEY;
    const baseUrl = process.env.REALFORCE_PUBLIC_BASE_URL || "https://listings.realforce.ch";

    if (!apiKey) {
      return res.status(500).json({ error: "Missing REALFORCE_PUBLIC_API_KEY" });
    }

    // Params venant du front (avec valeurs par défaut)
    const perPage = Math.min(parseInt(req.query.per_page || "100", 10), 100);
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const lang = (req.query.lang || "fr").toLowerCase();

    const url = new URL(`${baseUrl}/api/v1/get-full-listings`);
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("page", String(page));
    url.searchParams.set("lang", lang);

    // Optionnel: filtre sur date de mise à jour (si tu veux)
    if (req.query.update_date_min) url.searchParams.set("update_date_min", req.query.update_date_min);
    if (req.query.update_date_max) url.searchParams.set("update_date_max", req.query.update_date_max);

    const rfResp = await fetch(url.toString(), {
      headers: { "X-API-KEY": apiKey },
    });

    if (!rfResp.ok) {
      const text = await rfResp.text();
      return res.status(rfResp.status).json({
        error: "Realforce error",
        status: rfResp.status,
        details: text.slice(0, 300),
      });
    }

    const payload = await rfResp.json();

    // Cache 2h (recommandation Realforce)
    // s-maxage = cache CDN Vercel
    res.setHeader("Cache-Control", "s-maxage=7200, stale-while-revalidate=86400");

    // Mapping vers ton format front (proche de ton listings.json)
    const data = (payload.data || []).map((p) => {
      const desc = p.description?.[lang] || p.description?.en || {};
      const title = desc.title || p.reference || "Annonce";
      const description = desc.description || "";

      // surface: on prend "habitable" en priorité, sinon "usable", sinon "m2"
      const surface =
        (p.habitable != null ? Number(p.habitable) : null) ??
        (p.usable != null ? Number(p.usable) : null) ??
        (p.m2 != null ? Number(p.m2) : null);

      return {
        id: p.id,
        titre: title,
        prix: p.price != null ? Number(p.price) : null,
        devise: "CHF", // on ajustera si Realforce renvoie une vraie devise exploitable
        ville: p.zip ? `ZIP ${p.zip}` : null, // on enrichira avec Labels/Locations si besoin
        canton: p.canton_id || null,
        pays: "CH",
        type: p.sub_category_id || p.main_category_id || null,
        pieces: p.rooms != null ? Number(p.rooms) : null,
        chambres: p.bedrooms != null ? Number(p.bedrooms) : null,
        sdb: p.bathrooms != null ? Number(p.bathrooms) : null,
        surface_m2: surface,
        meuble: false,
        dispo: p.availability_date || null,
        images: Array.isArray(p.photos) ? p.photos : [],
        description,
        equipements: Array.isArray(p.amenities) ? p.amenities : [],
        tags: [],
        createdAt: p.lastupdate || p.publication_date || p.creation || null,
        coordsFake: {
          lat: p.latitude != null ? Number(p.latitude) : null,
          lng: p.longitude != null ? Number(p.longitude) : null,
        },
        agentSlug: `${(p.broker_firstname || "agent")}-${(p.broker_lastname || "gary")}`.toLowerCase(),
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
