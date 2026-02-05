import { useState } from "react";

/**
 * Hook pour envoyer un lead via POST /api/leads.
 *
 * @returns {{ send: (payload) => Promise<boolean>, sending: boolean, error: string|null, success: boolean }}
 *
 * payload attendu :
 *  - sender_firstname, sender_lastname, sender_email, sender_number
 *  - sender_message (requis)
 *  - property_id | property_reference | promotion_id (exactement un)
 *  - website (honeypot — doit rester vide)
 */
export default function useSendLead() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const send = async (payload) => {
    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Erreur ${res.status}`);
      }

      setSuccess(true);
      setSending(false);
      return true;
    } catch (err) {
      setError(err.message);
      setSending(false);
      return false;
    }
  };

  return { send, sending, error, success };
}
