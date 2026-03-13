/**
 * POST /api/leads
 *
 * Rate limiting : max 5 requêtes par IP par minute (en mémoire serverless).
 * Validation : email, téléphone, longueurs max.
 * Honeypot : champ "website" doit rester vide.
 */

// ── Rate limiting en mémoire (par IP, reset à chaque cold start ~5-15 min) ──
const rateMap = new Map();
const RATE_WINDOW = 60_000; // 1 minute
const RATE_MAX = 5;         // 5 requêtes max par fenêtre

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now - entry.start > RATE_WINDOW) {
    rateMap.set(ip, { start: now, count: 1 });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_MAX) return true;
  return false;
}

// Nettoyage périodique pour éviter fuite mémoire (garde max 500 entrées)
function pruneRateMap() {
  if (rateMap.size > 500) {
    const now = Date.now();
    for (const [ip, entry] of rateMap) {
      if (now - entry.start > RATE_WINDOW) rateMap.delete(ip);
    }
  }
}

// ── Validation ──
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s+().\-]{6,30}$/;
const MAX_MESSAGE = 5000;
const MAX_FIELD = 200;

function sanitize(str, maxLen = MAX_FIELD) {
  if (!str || typeof str !== "string") return null;
  return str.trim().slice(0, maxLen) || null;
}

// ── Handler ──
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Rate limiting par IP
    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim()
      || req.headers["x-real-ip"]
      || "unknown";

    pruneRateMap();
    if (isRateLimited(ip)) {
      return res.status(429).json({ error: "Trop de requêtes. Réessayez dans une minute." });
    }

    const apiKey = process.env.REALFORCE_PUBLIC_API_KEY;
    const leadsBase = process.env.REALFORCE_LEADS_BASE_URL || "https://leads.realforce.ch";

    if (!apiKey) return res.status(500).json({ error: "Configuration error" });

    const body = req.body || {};

    // Anti-spam honeypot
    if (body.website) {
      return res.status(200).json({ success: true });
    }

    // Validation message (requis)
    const sender_message = sanitize(String(body.sender_message || ""), MAX_MESSAGE);
    if (!sender_message) {
      return res.status(400).json({ error: "Le message est requis." });
    }

    // Validation email
    const sender_email = sanitize(body.sender_email);
    if (sender_email && !EMAIL_RE.test(sender_email)) {
      return res.status(400).json({ error: "Adresse email invalide." });
    }

    // Validation téléphone
    const sender_number = sanitize(body.sender_number);
    if (sender_number && !PHONE_RE.test(sender_number)) {
      return res.status(400).json({ error: "Numéro de téléphone invalide." });
    }

    // Identifiant cible (0 = lead général, 1 = lié à un bien)
    const property_id = sanitize(body.property_id);
    const property_reference = sanitize(body.property_reference);
    const promotion_id = sanitize(body.promotion_id);

    const countTargets = [property_id, property_reference, promotion_id].filter(Boolean).length;
    if (countTargets > 1) {
      return res.status(400).json({ error: "Un seul identifiant de bien autorisé." });
    }

    const payload = {
      sender_message,
      date: Math.floor(Date.now() / 1000),
    };

    // Champs optionnels
    const firstname = sanitize(body.sender_firstname);
    const lastname = sanitize(body.sender_lastname);
    if (firstname) payload.sender_firstname = firstname;
    if (lastname) payload.sender_lastname = lastname;
    if (sender_email) payload.sender_mail = sender_email;
    if (sender_number) payload.sender_number = sender_number;
    if (property_id) payload.property_id = property_id;
    if (property_reference) payload.property_reference = property_reference;
    if (promotion_id) payload.promotion_id = promotion_id;

    const rfResp = await fetch(`${leadsBase}/api/v1/lead`, {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await rfResp.text();
    let json;
    try { json = JSON.parse(text); } catch { json = null; }

    if (!rfResp.ok) {
      // Ne pas exposer les détails Realforce au frontend
      console.error("[leads] Realforce error:", rfResp.status, text.slice(0, 300));
      return res.status(502).json({ error: "Erreur lors de l'envoi. Réessayez plus tard." });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[leads] Server error:", err.message);
    return res.status(500).json({ error: "Erreur serveur." });
  }
}
