/**
 * Stub API — Vérification code SMS
 * Prêt pour intégration Twilio + Supabase/KV
 *
 * POST /api/sms-verify
 * Body: { phone: "+41...", code: "1234" }
 * Response: { valid: true/false }
 */
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone, code } = req.body || {};
  if (!phone || !code) {
    return res.status(400).json({ error: "Phone and code required" });
  }

  // TODO: Vérifier le code avec Supabase/KV
  // const stored = await kv.get(`sms:${phone}`);
  // const valid = stored && stored.toString() === code.toString();

  // Stub: accepte tout code à 4 chiffres
  const valid = /^\d{4}$/.test(code);

  return res.status(200).json({ valid });
}
