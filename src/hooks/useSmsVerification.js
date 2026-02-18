import { useState, useRef, useCallback } from "react";

/**
 * Hook pour le flow de vérification SMS (optionnel).
 * États : idle → sending → codeSent → verifying → verified | failed
 */
export default function useSmsVerification() {
  const [status, setStatus] = useState("idle"); // idle | sending | codeSent | verifying | verified | failed
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef(null);

  const startCountdown = useCallback(() => {
    let seconds = 60;
    setCountdown(seconds);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      seconds--;
      setCountdown(seconds);
      if (seconds <= 0) clearInterval(intervalRef.current);
    }, 1000);
  }, []);

  const sendCode = useCallback(async (phone) => {
    setStatus("sending");
    setError("");
    try {
      await fetch("/api/sms-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      setStatus("codeSent");
      startCountdown();
    } catch {
      setStatus("codeSent"); // stub toujours OK
      startCountdown();
    }
  }, [startCountdown]);

  const verifyCode = useCallback(async (phone, code) => {
    setStatus("verifying");
    setError("");
    try {
      const res = await fetch("/api/sms-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (data.valid) {
        setStatus("verified");
        clearInterval(intervalRef.current);
        return true;
      } else {
        setStatus("failed");
        setError("Code incorrect");
        return false;
      }
    } catch {
      // Fallback : accepter tout code à 4 chiffres
      if (/^\d{4}$/.test(code)) {
        setStatus("verified");
        clearInterval(intervalRef.current);
        return true;
      }
      setStatus("failed");
      setError("Code incorrect");
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setError("");
    setCountdown(0);
    clearInterval(intervalRef.current);
  }, []);

  return { status, error, countdown, sendCode, verifyCode, reset };
}
