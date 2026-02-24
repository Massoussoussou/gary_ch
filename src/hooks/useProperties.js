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
        // DEV : injecter des biens vendus fictifs pour visualiser le carousel
        if (import.meta.env.DEV) {
          items = [...items, ...normalizeData(FAKE_VENDUS)];
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
          setData([MOCK_LISTING, ...normalizeData(FAKE_VENDUS)]);
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

/* ── Biens vendus fictifs (DEV uniquement, à supprimer avant prod) ── */
const FAKE_VENDUS = [
  { id: "fake-vendu-1", titre: "Villa contemporaine", ville: "Cologny", canton: "GE", type: "Villa", prix: 4850000, devise: "CHF", pieces: 8, chambres: 4, sdb: 3, surface_m2: 320, images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"], vendu: true, bandeau: "Vendu", tags: ["vendu"], createdAt: "2025-11-01" },
  { id: "fake-vendu-2", titre: "Appartement vue lac", ville: "Genève", canton: "GE", type: "Appartement", prix: 2200000, devise: "CHF", pieces: 5, chambres: 3, sdb: 2, surface_m2: 145, images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80","https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80"], vendu: true, bandeau: "Vendu", tags: ["vendu"], createdAt: "2025-10-15" },
  { id: "fake-vendu-3", titre: "Maison de maître", ville: "Vandoeuvres", canton: "GE", type: "Maison", prix: 6500000, devise: "CHF", pieces: 10, chambres: 5, sdb: 4, surface_m2: 450, images: ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80","https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80"], vendu: true, bandeau: "Vendu", tags: ["vendu"], createdAt: "2025-09-20" },
  { id: "fake-vendu-4", titre: "Penthouse panoramique", ville: "Carouge", canton: "GE", type: "Appartement", prix: 3100000, devise: "CHF", pieces: 6, chambres: 3, sdb: 2, surface_m2: 200, images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80","https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80"], vendu: true, bandeau: "Vendu", tags: ["vendu"], createdAt: "2025-08-10" },
  { id: "fake-vendu-5", titre: "Duplex rénové", ville: "Chêne-Bougeries", canton: "GE", type: "Appartement", prix: 1750000, devise: "CHF", pieces: 4, chambres: 2, sdb: 1, surface_m2: 110, images: ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80","https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800&q=80"], vendu: true, bandeau: "Vendu", tags: ["vendu"], createdAt: "2025-07-05" },
  { id: "fake-vendu-6", titre: "Loft industriel", ville: "Genève", canton: "GE", type: "Loft", prix: 1950000, devise: "CHF", pieces: 3, chambres: 1, sdb: 1, surface_m2: 160, images: ["https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80"], vendu: true, bandeau: "Vendu", tags: ["vendu"], createdAt: "2025-06-18" },
];

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
