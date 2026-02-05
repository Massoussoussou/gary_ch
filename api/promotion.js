export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.REALFORCE_PUBLIC_API_KEY;
    const baseUrl =
      process.env.REALFORCE_PROMOTIONS_BASE_URL || "https://promotions.realforce.ch";

    if (!apiKey) return res.status(500).json({ error: "Missing REALFORCE_PUBLIC_API_KEY" });

    const promotion_id = String(req.query.promotion_id ?? req.query.id ?? "").trim();
    if (!promotion_id) return res.status(400).json({ error: "Missing promotion_id" });

    const safeId = promotion_id.replace(/[^a-zA-Z0-9-_]/g, "");
    if (!safeId) return res.status(400).json({ error: "Invalid promotion_id" });

    const url = `${baseUrl}/api/v1/promotion/${safeId}`;

    const rfResp = await fetch(url, {
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

    // Cache possible aussi (mêmes raisons)
    res.setHeader("Cache-Control", "s-maxage=7200, stale-while-revalidate=86400");

    return res.status(200).json(payload);
  } catch (err) {
    console.error("API /promotion error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
