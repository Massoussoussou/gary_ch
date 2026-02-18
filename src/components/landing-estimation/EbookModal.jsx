import React, { useState, useEffect, useCallback } from "react";
import { IconCheckGold, IconBook, IconCheck } from "./icons";

const pushGTM = (event, data = {}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
};

export default function EbookModal({ open, onClose }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) setSent(false);
  }, [open]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const handleConfirm = useCallback(async () => {
    setSending(true);
    try {
      await fetch("/api/ebook-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "landing-estimation" }),
      });
    } catch {
      // stub — toujours OK
    }
    setSending(false);
    setSent(true);
    pushGTM("ebook_request");
  }, []);

  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const listItems = [
    "Comment fonctionne la diffusion séquentielle",
    "Les erreurs qui font baisser votre prix de vente",
    "Checklist complète pour préparer votre bien",
    "Étude de cas : ventes réalisées avec la méthode GARY",
  ];

  return (
    <div className="ebook-overlay" onClick={handleOverlayClick}>
      <div className="ebook-modal">
        <button className="ebook-close" onClick={onClose} aria-label="Fermer">
          &times;
        </button>

        {!sent ? (
          <>
            <div className="ebook-icon"><IconBook size={24} /></div>
            <div className="ebook-title">Notre guide de vente immobilière</div>
            <div className="ebook-desc">
              Recevez gratuitement notre eBook avec la{" "}
              <strong>stratégie détaillée de vente en 3 phases</strong> utilisée
              par nos courtiers pour maximiser le prix de vente.
            </div>
            <div className="ebook-list">
              {listItems.map((text, i) => (
                <div className="ebook-list-item" key={i}>
                  <IconCheckGold />
                  {text}
                </div>
              ))}
            </div>
            <button
              className="ebook-confirm-btn"
              onClick={handleConfirm}
              disabled={sending}
            >
              {sending ? "Envoi..." : "Recevoir le guide par email"}
            </button>
            <div className="ebook-note">
              Envoyé à l'adresse email renseignée dans votre demande
            </div>
          </>
        ) : (
          <>
            <div className="ebook-icon">
              <IconCheck size={24} color="#2d8a4e" strokeWidth={2} />
            </div>
            <div className="ebook-title">C'est envoyé !</div>
            <div className="ebook-desc">
              Vous recevrez notre guide de vente par email dans les prochaines
              minutes. Pensez à vérifier vos spams.
            </div>
            <button
              className="ebook-confirm-btn secondary"
              onClick={onClose}
            >
              Fermer
            </button>
          </>
        )}
      </div>
    </div>
  );
}
