// src/components/projectData.js
// calqué sur teamData.js : on importe le JSON et on expose helpers

import projets from "../data/projects.json"; // ← JSON natif

export function getProjectById(id) {
  if (!id) return null;
  return (projets || []).find((p) => p && (p.slug === id || p.id === id));
}

export function getAllCities() {
  const s = new Set();
  (projets || []).forEach((p) => { if (p && p.ville) s.add(p.ville); });
  return Array.from(s).sort();
}

export default projets;
