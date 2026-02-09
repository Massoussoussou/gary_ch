import { useState, useEffect, useRef } from "react";

/* ===== Cache module-level ===== */
let listCache = null;
let listCacheTs = 0;
const detailCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 min

/**
 * Hook pour la liste des promotions depuis /api/promotions.
 * @param {object} [opts]
 * @param {number} [opts.perPage=50]
 * @param {number} [opts.page=1]
 * @param {string} [opts.lang="fr"]
 */
export function usePromotionsList({ perPage = 50, page = 1, lang = "fr" } = {}) {
  const [data, setData] = useState(listCache?.data || []);
  const [loading, setLoading] = useState(!listCache);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const fetchData = (force = false) => {
    if (!force && listCache && Date.now() - listCacheTs < CACHE_TTL) {
      setData(listCache.data);
      setLoading(false);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      per_page: String(perPage),
      page: String(page),
      lang,
    });

    fetch(`/api/promotions?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        const items = normalizePromotionsList(json.data || []);
        listCache = { data: items };
        listCacheTs = Date.now();
        setData(items);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("usePromotionsList error:", err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [perPage, page, lang]);

  return { data, loading, error, refetch: () => fetchData(true) };
}

/**
 * Hook pour le détail d'une promotion depuis /api/promotion?id=X.
 * @param {string} promotionId
 */
export function usePromotionDetail(promotionId) {
  const cached = detailCache.get(promotionId);
  const [data, setData] = useState(cached?.data || null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!promotionId) return;

    // Cache hit
    const c = detailCache.get(promotionId);
    if (c && Date.now() - c.ts < CACHE_TTL) {
      setData(c.data);
      setLoading(false);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    fetch(`/api/promotion?id=${encodeURIComponent(promotionId)}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        const item = normalizePromotionDetail(json);
        detailCache.set(promotionId, { data: item, ts: Date.now() });
        setData(item);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("usePromotionDetail error:", err);
        setError(err.message);
        setLoading(false);
      });

    return () => abortRef.current?.abort();
  }, [promotionId]);

  return { data, loading, error };
}

/* ===== Normalisation ===== */

/**
 * Adapte la réponse promotions list au format attendu par ProjetsNeufs.jsx
 * (compatible avec l'ancien projects.json).
 */
function normalizePromotionsList(items) {
  return items.map((p) => ({
    id: p.id,
    type: "Programme neuf",
    name: p.name || "Promotion",
    city: p.location || "",
    cover: p.photos?.[0]?.url || p.photos?.[0] || "",
    tagline: `Dès ${fmtPrice(p.price)} ${p.currency || "CHF"}`,
    reference: p.reference || null,
    specs: {
      pieces: p.min_rooms ? `${p.min_rooms} – ${p.max_rooms}` : null,
      chambres: p.min_bedrooms ? `${p.min_bedrooms} – ${p.max_bedrooms}` : null,
      surface: p.min_surface ? `${p.min_surface} – ${p.max_surface} m²` : null,
    },
    photos: (p.photos || []).map((ph) => (typeof ph === "string" ? ph : ph.url)),
    aptAvailable: p.apt_available || 0,
    aptActive: p.apt_active || 0,
    aptSold: p.apt_sold || 0,
    propertyIds: p.property_ids || [],
    // Garder les données brutes pour le détail
    _raw: p,
  }));
}

/**
 * Adapte la réponse promotion detail au format attendu par ProjetNeufDetail.jsx.
 */
function normalizePromotionDetail(p) {
  if (!p || !p.id) return null;

  // L'API retourne description comme string HTML, pas un objet {fr: {...}}
  const rawDesc = typeof p.description === "string"
    ? p.description
    : (p.description?.fr?.promotion_description || p.description?.fr || "");
  const plainDesc = String(rawDesc).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  // Séparer la 2e partie (détails par étage) si elle existe dans la description
  const locDesc = typeof p.description === "object"
    ? (p.description?.fr?.location_description || "")
    : "";
  const plainLocDesc = String(locDesc).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  return {
    id: p.id,
    type: "Programme neuf",
    name: p.name || "Promotion",
    city: p.location || "",
    cover: p.photos?.[0]?.url || "",
    tagline: `Dès ${fmtPrice(p.price)} ${p.currency || "CHF"}`,
    description: plainDesc,
    reference: p.reference || null,
    longDescription: plainDesc,
    secondDescription: plainLocDesc || plainDesc,
    specs: {
      reference: p.reference || null,
      pieces: p.min_rooms ? `${p.min_rooms} – ${p.max_rooms}` : null,
      sdb: null,
      chambres: p.min_bedrooms ? `${p.min_bedrooms} – ${p.max_bedrooms}` : null,
      surface: p.min_surface ? `${p.min_surface} – ${p.max_surface} m²` : null,
      surfaceUtile: null,
      terrain: null,
      vue: null,
      etat: "Neuf",
      terrasse: null,
      jardin: null,
    },
    media: {
      images: (p.photos || [])
        .filter((ph) => !ph.is_plan)
        .map((ph) => ph.url || ph),
    },
    plans: (p.photos || [])
      .filter((ph) => ph.is_plan)
      .map((ph) => ph.url || ph),
    properties: (p.properties || []).map((lot) => ({
      id: lot.id,
      reference: lot.reference,
      status: lot.status || null,
      statusId: lot.status_id || null,
      rooms: lot.rooms,
      floor: lot.floor,
      surface: lot.habitable || lot.dimensions_habitable || null,
      balcony: lot.balcony || lot.dimensions_balcony || null,
      terrace: lot.terrace || lot.dimensions_terrace || null,
      price: lot.price,
      priceOnRequest: !!lot.price_on_request,
    })),
    aptAvailable: p.apt_available || 0,
    aptActive: p.apt_active || 0,
    aptSold: p.apt_sold || 0,
    contacts: p.contacts || [],
    _raw: p,
  };
}

function fmtPrice(n) {
  if (n == null) return "Prix sur demande";
  return Number(n).toLocaleString("fr-CH");
}
