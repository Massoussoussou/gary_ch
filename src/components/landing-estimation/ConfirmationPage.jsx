import React, { useState, useCallback } from "react";
import CalendarPicker from "./CalendarPicker";
import {
  IconCheck,
  IconChart,
  IconHome,
  IconTarget,
  IconCalendar,
  IconPhone,
  IconBook,
} from "./icons";

const pushGTM = (event, data = {}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
};

export default function ConfirmationPage({ firstName, onOpenEbook }) {
  const [copied, setCopied] = useState(false);

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText("gary@gary.ch").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, []);

  return (
    <section className="conf">
      <div className="conf-wrap">

        {/* ===== LEFT COLUMN ===== */}
        <div className="conf-left">

          {/* Header */}
          <div className="conf-header">
            <p className="conf-eyebrow">Demande envoyée</p>
            <h1 className="conf-title">
              Merci{firstName ? `, ${firstName}` : ""}<span>.</span>
            </h1>
            <p className="conf-desc">
              Votre demande d'estimation a bien été prise en compte.
              Un courtier GARY, expert de votre quartier, vous contactera
              dans les prochaines 24 heures pour organiser une visite
              à votre domicile.
            </p>
          </div>

          {/* What you'll get */}
          <div className="conf-expect">
            <h3 className="conf-label">Lors du rendez-vous, vous recevrez</h3>
            <div className="conf-expect-list">
              <div className="conf-expect-item">
                <span className="conf-expect-icon"><IconChart /></span>
                <div>
                  <strong>Estimation chiffrée</strong>
                  <p>Fourchette de prix basée sur le marché actuel</p>
                </div>
              </div>
              <div className="conf-expect-item">
                <span className="conf-expect-icon"><IconHome /></span>
                <div>
                  <strong>Analyse comparative</strong>
                  <p>Ventes récentes dans votre quartier</p>
                </div>
              </div>
              <div className="conf-expect-item">
                <span className="conf-expect-icon"><IconTarget /></span>
                <div>
                  <strong>Stratégie de vente</strong>
                  <p>Off-Market, Coming Soon ou Public</p>
                </div>
              </div>
              <div className="conf-expect-item">
                <span className="conf-expect-icon"><IconCalendar size={18} color="#FF4A3E" /></span>
                <div>
                  <strong>Calendrier prévisionnel</strong>
                  <p>Planning de mise en vente optimisé</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary links */}
          <div className="conf-links">
            <h3 className="conf-label">En attendant</h3>
            <a href="/acheter" className="conf-link-item">
              <span className="conf-link-ico"><IconHome /></span>
              Découvrir nos biens en vente
            </a>
            <button type="button" className="conf-link-item" onClick={onOpenEbook}>
              <span className="conf-link-ico"><IconBook /></span>
              Recevoir notre guide de vente gratuit
            </button>
          </div>
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div className="conf-right">

          {/* Calendar */}
          <div className="conf-calendar">
            <h2 className="conf-calendar-title">Réservez votre créneau</h2>
            <p className="conf-calendar-sub">
              30 min · à votre domicile · gratuit et sans engagement
            </p>
            <CalendarPicker />
          </div>

          {/* Contact */}
          <div className="conf-contact-bar">
            <p className="conf-contact-text">
              <IconPhone size={14} color="#FF4A3E" />
              Une question ?
            </p>
            <div className="conf-contact-actions">
              <a
                href="tel:+41225570700"
                className="conf-contact-btn"
                onClick={() => pushGTM("phone_click")}
              >
                +41 22 557 07 00
              </a>
              <button
                type="button"
                className={`conf-contact-btn${copied ? " copied" : ""}`}
                onClick={copyEmail}
              >
                {copied ? "\u2713 Copié" : "gary@gary.ch"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
