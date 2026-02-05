// src/utils/format.js

export function fmtPrice(amount, currency = "CHF") {
  if (typeof amount !== "number") return "";
  const withSep = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  return `${withSep} ${currency || "CHF"}`;
}

export function formatAtouts(atouts) {
  if (!atouts || !Array.isArray(atouts)) return [];
  return atouts.filter(Boolean);
}
