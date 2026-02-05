export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.REALFORCE_PUBLIC_API_KEY;
    const leadsBase = process.env.REALFORCE_LEADS_BASE_URL || "https://leads.realforce.ch";

    if (!apiKey) return res.status(500).json({ error: "Missing REALFORCE_PUBLIC_API_KEY" });

    const body = req.body || {};

    // Anti-spam simple (honeypot)
    if (body.website) {
      return res.status(200).json({ success: true }); // on fait comme si ok
    }

    const sender_message = String(body.sender_message || "").trim();
    if (!sender_message) return res.status(400).json({ error: "sender_message is required" });

    // Un seul identifiant cible
    const property_id = body.property_id ? String(body.property_id) : null;
    const property_reference = body.property_reference ? String(body.property_reference) : null;
    const promotion_id = body.promotion_id ? String(body.promotion_id) : null;

    const countTargets = [property_id, property_reference, promotion_id].filter(Boolean).length;
    if (countTargets !== 1) {
      return res.status(400).json({
        error: "Provide exactly ONE of property_id, property_reference, promotion_id",
      });
    }

    const payload = {
      sender_message,
      date: Math.floor(Date.now() / 1000), // timestamp secondes
      sender_firstname: body.sender_firstname ? String(body.sender_firstname) : undefined,
      sender_lastname: body.sender_lastname ? String(body.sender_lastname) : undefined,
      sender_mail: body.sender_email ? String(body.sender_email) : undefined,
      sender_number: body.sender_number ? String(body.sender_number) : undefined,
      property_id: property_id || undefined,
      property_reference: property_reference || undefined,
      promotion_id: promotion_id || undefined,
    };

    // Nettoyage: enlève les undefined
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

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
    try { json = JSON.parse(text); } catch { json = { raw: text }; }

    if (!rfResp.ok) {
      return res.status(rfResp.status).json({ error: "Realforce error", details: json });
    }

    return res.status(200).json(json);
  } catch (err) {
    console.error("API /leads error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
