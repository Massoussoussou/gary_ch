/**
 * GET /api/debug-statuses
 *
 * Endpoint temporaire de debug pour voir :
 * 1. Les labels de choix (statuts) depuis get-choices-labels
 * 2. Les status_id effectivement présents dans les biens
 *
 * À SUPPRIMER après avoir confirmé le mapping des statuts.
 */
import { fetchLabels } from "./_labels-cache.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.REALFORCE_PUBLIC_API_KEY;
    const baseUrl = process.env.REALFORCE_PUBLIC_BASE_URL || "https://listings.realforce.ch";
    const lang = req.query.lang || "fr";

    if (!apiKey) return res.status(500).json({ error: "Missing API key" });

    // 1. Fetch ALL choices labels (sans category)
    let choicesLabels = null;
    let choicesError = null;
    try {
      choicesLabels = await fetchLabels("choices", { lang });
    } catch (err) {
      choicesError = err.message;
    }

    // 2. Fetch une page de listings pour voir les status_id réels
    const url = new URL(`${baseUrl}/api/v1/get-full-listings`);
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", "1");
    url.searchParams.set("lang", lang);

    const rfResp = await fetch(url.toString(), {
      headers: { "X-API-KEY": apiKey },
    });

    let statusIdsSeen = {};
    if (rfResp.ok) {
      const payload = await rfResp.json();
      for (const p of payload.data || []) {
        const sid = p.status_id || "null";
        if (!statusIdsSeen[sid]) {
          statusIdsSeen[sid] = { count: 0, sample_ref: p.reference, status_field: p.status || null };
        }
        statusIdsSeen[sid].count++;
      }
    }

    return res.status(200).json({
      message: "Debug des statuts RealForce",
      choices_labels: choicesLabels,
      choices_error: choicesError,
      status_ids_in_listings: statusIdsSeen,
      total_listings_checked: Object.values(statusIdsSeen).reduce((s, v) => s + v.count, 0),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
