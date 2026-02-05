// src/utils/data.js

export function hasTag(item, regex) {
  const hay = [
    item?.bandeau,
    item?.status,
    item?.ribbon,
    ...(item?.tags || []),
    ...(item?.badges || []),
  ]
    .filter(Boolean)
    .join(" ");
  return regex.test(String(hay));
}

export function isRecent(item, days = 21) {
  if (!item?.createdAt) return false;
  const d = new Date(item.createdAt);
  if (isNaN(d)) return false;
  return Date.now() - d.getTime() <= days * 86400 * 1000;
}

export function coerceNum(v) {
  if (v === "" || v == null) return null;
  const n = +String(v).replace(/[^\d.]/g, "");
  return Number.isFinite(n) ? n : null;
}

export const uniqSorted = (arr) =>
  [...new Set(arr.filter(Boolean))].sort((a, b) =>
    String(a).localeCompare(String(b), "fr")
  );

export function deriveFacets(items) {
  return {
    cities: uniqSorted(items.map((i) => i.ville || "")),
    cantons: uniqSorted(items.map((i) => i.canton || "")),
    types: uniqSorted(items.map((i) => i.type || "")),
    features: uniqSorted(items.flatMap((i) => i.equipements || [])),
  };
}

export function normalizeListingData(dataRaw) {
  return (dataRaw || []).map((it) => ({
    ...it,
    prix: +(+it.prix || 0),
    surface_m2: +(+it.surface_m2 || 0),
  }));
}
