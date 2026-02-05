// src/utils/queryString.js

export function toQS(filters) {
  const params = new URLSearchParams();
  Object.entries(filters || {}).forEach(([k, v]) => {
    if (v == null) return;
    if (typeof v === "string" && v.trim() === "") return;
    if (typeof v === "boolean") {
      if (!v) return;
      params.set(k, "1");
      return;
    }
    if (Array.isArray(v)) {
      if (!v.length) return;
      v.forEach((x) => params.append(k, x));
      return;
    }
    if (typeof v === "object") {
      Object.entries(v).forEach(([kk, vv]) => {
        if (vv) params.set(`${k}.${kk}`, "1");
      });
      return;
    }
    params.set(k, String(v));
  });
  const s = params.toString();
  return s ? `?${s}` : "";
}
