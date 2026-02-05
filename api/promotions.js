export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.REALFORCE_PUBLIC_API_KEY;
    const baseUrl =
      process.env.REALFORCE_PROMOTIONS_BASE_URL || "https://promotions.realforce.ch";
    const defaultLang =
      process.env.REALFORCE_PUBLIC_DEFAULT_LOCALE || "fr";

    if (!apiKey) return res.status(500).json({ error: "Missing REALFORCE_PUBLIC_API_KEY" });

    const perPageRaw = req.query.per_page ?? "20";
    const pageRaw = req.query.page ?? "1";
    const langRaw = req.query.lang ?? defaultLang;

    const per_page = Math.min(Math.max(parseInt(perPageRaw, 10) || 20, 1), 100);
    const page = Math.max(parseInt(pageRaw, 10) || 1, 1);
    const lang = String(langRaw).toLowerCase().replace(/[^a-z|]/g, "");
    if (!lang) return res.status(400).json({ error: "Invalid lang" });

    const url = new URL(`${baseUrl}/api/v1/promotions`);
    url.searchParams.set("per_page", String(per_page));
    url.searchParams.set("page", String(page));
    url.searchParams.set("lang", lang);

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

    // Cache côté CDN (2h) pour éviter de re-pinger Realforce
    res.setHeader("Cache-Control", "s-maxage=7200, stale-while-revalidate=86400");

    return res.status(200).json(payload);
  } catch (err) {
    console.error("API /promotions error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
