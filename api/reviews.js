/**
 * API — Avis Google (Places API)
 * GET /api/reviews
 * Cache : 24h (les avis ne changent pas souvent)
 */

let cache = { data: null, ts: 0 };
const TTL = 24 * 60 * 60 * 1000; // 24h

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const now = Date.now();
  if (cache.data && now - cache.ts < TTL) {
    res.setHeader("X-Cache", "HIT");
    return res.status(200).json(cache.data);
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GOOGLE_PLACES_API_KEY not configured" });
  }

  const placeId = "ChIJH67MR6tljEcRQUoSuBwEjBk";

  try {
    const resp = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?languageCode=fr`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "reviews,rating,userRatingCount",
        },
      }
    );

    if (!resp.ok) {
      const err = await resp.text();
      return res.status(502).json({ error: "Google API error", details: err });
    }

    const raw = await resp.json();

    const result = {
      rating: raw.rating,
      totalReviews: raw.userRatingCount,
      reviews: (raw.reviews || []).slice(0, 3).map((r) => ({
        name: r.authorAttribution?.displayName || "Anonyme",
        text: r.text?.text || "",
        stars: r.rating || 5,
        photoUrl: r.authorAttribution?.photoUri || null,
        date: r.publishTime || null,
      })),
    };

    cache = { data: result, ts: now };

    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=3600");
    res.setHeader("X-Cache", "MISS");
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch reviews", message: err.message });
  }
}
