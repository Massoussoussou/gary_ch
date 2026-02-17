import { useState, useEffect, useRef } from "react";
import MOCK_LISTING from "../data/mock-listing.js";

/**
 * Cache module-level : partagé entre tous les composants qui appellent le hook.
 * Évite de re-fetch à chaque navigation entre pages.
 */
let propertiesCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 min

/**
 * Hook pour récupérer les propriétés depuis /api/properties.
 * @param {object} [opts]
 * @param {number} [opts.perPage=100]
 * @param {number} [opts.page=1]
 * @param {string} [opts.lang="fr"]
 * @returns {{ data: Array, loading: boolean, error: string|null, refetch: () => void }}
 */
export default function useProperties({ perPage = 100, page = 1, lang = "fr" } = {}) {
  const [data, setData] = useState(propertiesCache?.data || []);
  const [loading, setLoading] = useState(!propertiesCache);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const fetchData = (force = false) => {
    // Utiliser le cache si encore frais
    if (
      !force &&
      propertiesCache &&
      Date.now() - cacheTimestamp < CACHE_TTL &&
      propertiesCache.page === page &&
      propertiesCache.perPage === perPage
    ) {
      setData(propertiesCache.data);
      setLoading(false);
      return;
    }

    // Annuler un éventuel fetch en cours
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

    fetch(`/api/properties?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        let items = normalizeData(json.data || []);
        // En dev, si l'API ne renvoie rien, injecter le mock
        if (items.length === 0 && import.meta.env.DEV) {
          items = [MOCK_LISTING];
        }
        propertiesCache = { data: items, page, perPage };
        cacheTimestamp = Date.now();
        setData(items);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("useProperties error:", err);
        // En dev, fallback sur le mock en cas d'erreur API
        if (import.meta.env.DEV) {
          setData([MOCK_LISTING]);
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
 * Normalise les données API pour correspondre au format attendu par les composants.
 * Compatibilité avec l'ancien listings.json.
 */
function normalizeData(items) {
  return items.map((it) => ({
    ...it,
    // Compat anciens champs
    coordsFake: it.coords || it.coordsFake || { lat: null, lng: null },
    agentSlug: it.broker?.slug || it.agentSlug || null,
    // Coercition numérique
    prix: it.prix != null && it.prix !== 0 ? +it.prix : null,
    surface_m2: +(it.surface_m2 || 0),
    pieces: +(it.pieces || 0),
    chambres: +(it.chambres || 0),
    sdb: +(it.sdb || 0),
    // Fallbacks
    ville: it.ville || "",
    canton: it.canton || "",
    type: it.type || "",
    equipements: Array.isArray(it.equipements) ? it.equipements : [],
    meuble: !!it.meuble,
    dispo: it.dispo || "",
    createdAt: it.createdAt || "",
    bandeau: it.bandeau || null,
    tags: it.tags || [],
    // Description (texte brut + HTML)
    description: it.description || "",
    descriptionHtml: it.descriptionHtml || it.description || "",
  }));
}
