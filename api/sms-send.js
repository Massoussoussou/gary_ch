/**
 * Stub API — Envoi SMS
 * Prêt pour intégration Twilio + Supabase/KV
 *
 * POST /api/sms-send
 * Body: { phone: "+41..." }
 * Response: { success: true }
 */
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone } = req.body || {};
  if (!phone) {
    return res.status(400).json({ error: "Phone number required" });
  }

  // TODO: Intégrer Twilio pour envoyer un vrai SMS
  // const code = Math.floor(1000 + Math.random() * 9000);
  // await twilioClient.messages.create({ to: phone, body: `Votre code GARY: ${code}` });
  // await kv.set(`sms:${phone}`, code, { ex: 300 });

  return res.status(200).json({ success: true });
}
