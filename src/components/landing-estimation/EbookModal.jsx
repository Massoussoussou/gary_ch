import React, { useState, useEffect, useCallback } from "react";
import { IconCheckGold, IconBook, IconCheck } from "./icons";
import { useLocale } from "../../hooks/useLocale.js";

const pushGTM = (event, data = {}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
};

export default function EbookModal({ open, onClose }) {
  const { t } = useLocale();
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

  const listItems = t("estimate.ebook.list_items", { returnObjects: true });

  return (
    <div className="ebook-overlay" onClick={handleOverlayClick}>
      <div className="ebook-modal">
        <button className="ebook-close" onClick={onClose} aria-label={t("aria.close")}>
          &times;
        </button>

        {!sent ? (
          <>
            <div className="ebook-icon"><IconBook size={24} /></div>
            <div className="ebook-title">{t("estimate.ebook.title")}</div>
            <div className="ebook-desc" dangerouslySetInnerHTML={{ __html: t("estimate.ebook.desc") }} />
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
              {sending ? t("estimate.ebook.sending") : t("estimate.ebook.submit")}
            </button>
            <div className="ebook-note">
              {t("estimate.ebook.note")}
            </div>
          </>
        ) : (
          <>
            <div className="ebook-icon">
              <IconCheck size={24} color="#2d8a4e" strokeWidth={2} />
            </div>
            <div className="ebook-title">{t("estimate.ebook.sent_title")}</div>
            <div className="ebook-desc">
              {t("estimate.ebook.sent_desc")}
            </div>
            <button
              className="ebook-confirm-btn secondary"
              onClick={onClose}
            >
              {t("aria.close")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
