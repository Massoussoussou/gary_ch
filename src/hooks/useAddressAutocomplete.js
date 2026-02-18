import { useState, useRef, useCallback } from "react";

/**
 * Hook pour l'autocomplete d'adresse via Nominatim (OpenStreetMap).
 * Debounce de 300ms, limité à la Suisse.
 */
export default function useAddressAutocomplete() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  const search = useCallback((query) => {
    clearTimeout(timerRef.current);
    if (!query || query.trim().length < 3) {
      setResults([]);
      return;
    }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const url =
          "https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=ch&limit=5&q=" +
          encodeURIComponent(query.trim());
        const res = await fetch(url);
        const data = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const clear = useCallback(() => {
    clearTimeout(timerRef.current);
    setResults([]);
  }, []);

  /**
   * Extrait l'adresse, le NPA et la localité d'un résultat Nominatim.
   */
  const extractAddress = useCallback((item) => {
    const a = item.address || {};
    let street = a.road || "";
    if (a.house_number) street += " " + a.house_number;
    const npa = a.postcode || "";
    const city = a.city || a.town || a.village || a.municipality || "";
    return {
      street: street || item.display_name.split(",")[0],
      npa,
      city,
    };
  }, []);

  return { results, loading, search, clear, extractAddress };
}
