import { useState, useEffect, useRef } from "react";
import MOCK_PROMOTION from "../data/mock-promotion.js";

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
        let items = normalizePromotionsList(json.data || []);
        // En dev, si l'API ne renvoie rien, injecter le mock
        if (items.length === 0 && import.meta.env.DEV) {
          items = [MOCK_PROMOTION];
        }
        listCache = { data: items };
        listCacheTs = Date.now();
        setData(items);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("usePromotionsList error:", err);
        // En dev, fallback sur le mock en cas d'erreur API
        if (import.meta.env.DEV) {
          setData([MOCK_PROMOTION]);
          setLoading(false);
          return;
        }
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
        // En dev, si l'API renvoie null, fallback sur le mock
        if (!item && import.meta.env.DEV) {
          setData(MOCK_PROMOTION);
          setLoading(false);
          return;
        }
        detailCache.set(promotionId, { data: item, ts: Date.now() });
        setData(item);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("usePromotionDetail error:", err);
        // En dev, fallback sur le mock en cas d'erreur API
        if (import.meta.env.DEV) {
          setData(MOCK_PROMOTION);
          setLoading(false);
          return;
        }
        setError(err.message);
        setLoading(false);
      });

    return () => abortRef.current?.abort();
  }, [promotionId]);

  return { data, loading, error };
}

/* ===== Normalisation ===== */

/**
 * Extrait une string depuis un champ qui peut être :
 * - string directe : "hello"
 * - objet localisé simple : {fr: "bonjour", en: "hello"}
 * - objet localisé imbriqué : {fr: {promotion_description: "..."}, en: {...}}
 * Descend récursivement jusqu'à trouver une string.
 */
function str(v, lang = "fr") {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "object") {
    // Essayer la langue demandée, puis en, puis fr
    const picked = v[lang] ?? v.en ?? v.fr;
    if (picked == null) return "";
    if (typeof picked === "string") return picked;
    // Si c'est encore un objet (ex: {promotion_description: "..."})
    if (typeof picked === "object") {
      // Chercher le premier champ non-vide
      for (const val of Object.values(picked)) {
        if (typeof val === "string" && val.trim()) return val;
      }
    }
    return "";
  }
  return String(v);
}

/** Retire les balises HTML d'une string */
function stripHtml(s) {
  return String(s || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Extrait description depuis les deux formats de l'API Realforce :
 * - Liste : description = "HTML string" (texte tronqué)
 * - Détail : description = {fr: {promotion_description, location_description, ...}, ...}
 */
function extractDescriptions(desc) {
  if (desc == null) return { promo: "", location: "" };

  // Format liste : string HTML directe
  if (typeof desc === "string") {
    return { promo: stripHtml(desc), location: "" };
  }

  // Format détail : objet localisé {fr: {promotion_description, location_description}}
  if (typeof desc === "object") {
    const langObj = desc.fr || desc.en || {};
    if (typeof langObj === "string") {
      return { promo: stripHtml(langObj), location: "" };
    }
    return {
      promo: stripHtml(langObj.promotion_description || ""),
      location: stripHtml(langObj.location_description || ""),
    };
  }

  return { promo: "", location: "" };
}

/**
 * Adapte la réponse promotions list au format attendu par ProjetsNeufs.jsx
 */
function normalizePromotionsList(items) {
  return items.map((p) => {
    const { promo } = extractDescriptions(p.description);
    return {
      id: p.id,
      type: "Programme neuf",
      name: str(p.name) || "Promotion",
      city: str(p.location),
      cover: p.photos?.[0]?.url || p.photos?.[0] || "",
      tagline: p.price ? `Dès ${fmtPrice(p.price)} ${str(p.currency) || "CHF"}` : "",
      reference: str(p.reference) || null,
      description: promo,
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
      _raw: p,
    };
  });
}

/**
 * Adapte la réponse promotion detail au format attendu par ProjetNeufDetail.jsx.
 */
function normalizePromotionDetail(p) {
  if (!p || !p.id) return null;

  const { promo, location } = extractDescriptions(p.description);

  return {
    id: p.id,
    type: "Programme neuf",
    name: str(p.name) || "Promotion",
    city: str(p.location),
    cover: p.photos?.[0]?.url || "",
    tagline: p.price ? `Dès ${fmtPrice(p.price)} ${str(p.currency) || "CHF"}` : "",
    description: promo,
    reference: str(p.reference) || null,
    longDescription: promo,
    secondDescription: location || promo,
    longitude: p.longitude || null,
    latitude: p.latitude || null,
    specs: {
      reference: str(p.reference) || null,
      pieces: p.min_rooms ? `${p.min_rooms} – ${p.max_rooms}` : null,
      sdb: null,
      chambres: p.min_bedrooms ? `${p.min_bedrooms} – ${p.max_bedrooms}` : null,
      surface: p.min_surface ? `${p.min_surface} – ${p.max_surface} m²` : null,
      surfaceUtile: aggregateRange(p.properties, "dimensions_usable"),
      terrain: aggregateRange(p.properties, "dimensions_land"),
      vue: null,
      etat: "Neuf",
      terrasse: aggregateRange(p.properties, "dimensions_terrace")
        || aggregateRange(p.properties, "terrace"),
      jardin: aggregateRange(p.properties, "dimensions_garden")
        || aggregateRange(p.properties, "garden"),
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
      reference: str(lot.reference),
      status: str(lot.status) || null,
      statusId: lot.status_id || null,
      rooms: lot.rooms,
      bedrooms: lot.bedrooms,
      floor: lot.floor,
      surface: lot.habitable || lot.dimensions_habitable || null,
      surfaceUsable: lot.dimensions_usable || null,
      surfaceLand: lot.dimensions_land || null,
      surfaceWeighted: lot.dimensions_weighted || null,
      balcony: lot.balcony || lot.dimensions_balcony || null,
      terrace: lot.terrace || lot.dimensions_terrace || null,
      garden: lot.garden || lot.dimensions_garden || null,
      price: lot.price,
      priceOnRequest: !!lot.price_on_request,
    })),
    price: p.price || null,
    currency: str(p.currency) || "CHF",
    aptAvailable: p.apt_available || 0,
    aptActive: p.apt_active || 0,
    aptSold: p.apt_sold || 0,
    contacts: p.contacts || [],
    _raw: p,
  };
}

/**
 * Agrège min/max d'un champ numérique depuis les lots (properties).
 * Retourne "X – Y m²" ou valeur unique, ou null si aucun lot n'a le champ.
 */
function aggregateRange(properties, fieldName, unit = "m²") {
  const values = (properties || [])
    .map((lot) => {
      const v = lot[fieldName];
      return v != null ? Number(v) : NaN;
    })
    .filter((n) => !isNaN(n) && n > 0);

  if (values.length === 0) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) return `${min} ${unit}`;
  return `${min} – ${max} ${unit}`;
}

function fmtPrice(n) {
  if (n == null) return "Prix sur demande";
  return Number(n).toLocaleString("fr-CH");
}
