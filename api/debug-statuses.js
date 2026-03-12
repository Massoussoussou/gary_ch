/**
 * GET /api/debug-statuses
 *
 * Endpoint temporaire de debug pour voir :
 * 1. Les champs bruts d'une propriété (tous les champs Realforce)
 * 2. Les status_id présents dans les biens + le champ status brut
 * 3. Les labels de get-choices-labels avec différentes catégories (1→20)
 *
 * À SUPPRIMER après avoir confirmé le mapping des statuts.
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.REALFORCE_PUBLIC_API_KEY;
    const listingsUrl = process.env.REALFORCE_PUBLIC_BASE_URL || "https://listings.realforce.ch";
    const labelsUrl = process.env.REALFORCE_LABELS_BASE_URL || "https://labels.realforce.ch";
    const lang = req.query.lang || "fr";

    if (!apiKey) return res.status(500).json({ error: "Missing API key" });

    // 1. Fetch les listings pour voir les données brutes
    const url = new URL(`${listingsUrl}/api/v1/get-full-listings`);
    url.searchParams.set("per_page", "5");
    url.searchParams.set("page", "1");
    url.searchParams.set("lang", lang);

    const rfResp = await fetch(url.toString(), {
      headers: { "X-API-KEY": apiKey },
    });

    let rawSample = null;
    let statusSummary = {};
    let totalCount = 0;

    if (rfResp.ok) {
      const payload = await rfResp.json();
      totalCount = payload.count || 0;

      // Première propriété brute (tous les champs sauf photos pour lisibilité)
      if (payload.data && payload.data[0]) {
        const first = { ...payload.data[0] };
        // Tronquer les photos pour pas surcharger
        if (Array.isArray(first.photos)) first.photos = `[${first.photos.length} photos]`;
        if (first.photosObject) first.photosObject = `[${Object.keys(first.photosObject).length} entries]`;
        if (first.description && typeof first.description === "object") {
          first.description = "[object — multilang]";
        } else if (typeof first.description === "string" && first.description.length > 200) {
          first.description = first.description.slice(0, 200) + "…";
        }
        rawSample = first;
      }

      // Fetch TOUTES les pages pour un comptage complet des status_id
      const allUrl = new URL(`${listingsUrl}/api/v1/get-full-listings`);
      allUrl.searchParams.set("per_page", "100");
      allUrl.searchParams.set("page", "1");
      allUrl.searchParams.set("lang", lang);

      const allResp = await fetch(allUrl.toString(), {
        headers: { "X-API-KEY": apiKey },
      });

      if (allResp.ok) {
        const allPayload = await allResp.json();
        for (const p of allPayload.data || []) {
          const sid = String(p.status_id ?? "null");
          if (!statusSummary[sid]) {
            statusSummary[sid] = {
              count: 0,
              status_string: p.status || null,
              sell_date: p.sell_date || null,
              sample_ref: p.reference,
              sample_title: p.title || null,
            };
          }
          statusSummary[sid].count++;
        }
      }
    } else {
      return res.status(rfResp.status).json({
        error: "Realforce API error",
        status: rfResp.status,
        body: (await rfResp.text()).slice(0, 500),
      });
    }

    // 2. Tester get-choices-labels avec catégories 1 à 20
    const choicesByCategory = {};
    const categoryTests = Array.from({ length: 20 }, (_, i) => i + 1);

    await Promise.all(
      categoryTests.map(async (cat) => {
        try {
          const choiceUrl = new URL(`${labelsUrl}/api/v1/get-choices-labels`);
          choiceUrl.searchParams.set("lang", lang);
          choiceUrl.searchParams.set("category", String(cat));

          const resp = await fetch(choiceUrl.toString(), {
            headers: { "X-API-KEY": apiKey },
          });

          if (resp.ok) {
            const data = await resp.json();
            const keys = Object.keys(data);
            if (keys.length > 0) {
              choicesByCategory[`category_${cat}`] = data;
            }
          } else {
            choicesByCategory[`category_${cat}`] = `HTTP ${resp.status}`;
          }
        } catch (err) {
          choicesByCategory[`category_${cat}`] = `Error: ${err.message}`;
        }
      })
    );

    return res.status(200).json({
      _info: "Debug temporaire — à supprimer après diagnostic",
      total_listings: totalCount,
      status_ids_found: statusSummary,
      raw_sample_property: rawSample,
      choices_by_category: choicesByCategory,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
}
