import React, { useState, useCallback } from "react";
import {
  IconCheck,
  IconCalendar,
  IconChart,
  IconHome,
  IconTarget,
  IconPhone,
  IconBook,
} from "./icons";

const pushGTM = (event, data = {}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
};

const timeline = [
  {
    num: "1",
    title: "Analyse de votre bien",
    time: "Prochaines heures",
    desc: "Un courtier expert de votre quartier prépare une évaluation du marché local.",
  },
  {
    num: "2",
    title: "Planification du RDV",
    time: "Sous 24h",
    desc: "Réservez un créneau ci-dessous, ou attendez notre appel pour fixer la visite.",
  },
  {
    num: "3",
    title: "Estimation sur place",
    time: "À la date convenue",
    desc: "Visite, estimation détaillée et stratégie de vente personnalisée en 3 phases.",
  },
];

const rdvItems = [
  { icon: <IconChart />, text: "Estimation chiffrée avec fourchette de prix" },
  { icon: <IconHome />, text: "Analyse des ventes récentes dans votre quartier" },
  { icon: <IconTarget />, text: "Stratégie de vente personnalisée (Off-Market, Coming Soon ou Public)" },
  { icon: <IconCalendar size={18} color="#c8a45c" />, text: "Calendrier prévisionnel de vente" },
];

export default function ConfirmationPage({ firstName, onOpenEbook }) {
  const [copied, setCopied] = useState(false);

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText("gary@gary.ch").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, []);

  const handleCalendly = () => {
    pushGTM("calendly_click");
  };

  const handlePhoneClick = () => {
    pushGTM("phone_click");
  };

  return (
    <section className="confirmation-page">
      <div className="conf-inner">
        <div className="conf-header">
          <div className="conf-check-circle">
            <IconCheck size={28} color="#FA4838" strokeWidth={2.5} />
          </div>
          <h2 className="conf-title">
            Demande reçue, <span>{firstName || "merci"}</span>.
          </h2>
          <p className="conf-sub">
            Votre demande d'estimation a bien été envoyée. Voici la suite :
          </p>
        </div>

        <div className="conf-timeline">
          {timeline.map((step) => (
            <div className="conf-timeline-step" key={step.num}>
              <div className="conf-timeline-dot">{step.num}</div>
              <div className="conf-timeline-title">{step.title}</div>
              <div className="conf-timeline-time">{step.time}</div>
              <div className="conf-timeline-desc">{step.desc}</div>
            </div>
          ))}
        </div>

        <div className="conf-booking">
          <div className="conf-booking-inner">
            <div className="conf-booking-left">
              <div className="conf-booking-icon">
                <IconCalendar size={24} color="white" />
              </div>
              <div>
                <div className="conf-booking-title">
                  Réservez votre RDV d'estimation
                </div>
                <div className="conf-booking-sub">
                  30 min · à votre domicile · gratuit et sans engagement
                </div>
              </div>
            </div>
            <a
              href="https://calendly.com/gary-immobilier"
              target="_blank"
              rel="noopener noreferrer"
              className="conf-booking-btn"
              onClick={handleCalendly}
            >
              Choisir un créneau
            </a>
          </div>
          <div className="conf-booking-alt">
            Vous préférez être rappelé ? Notre équipe vous contacte sous 24h.
          </div>
        </div>

        <div className="conf-bottom">
          <div className="conf-rdv-preview">
            <div className="conf-rdv-label">
              Ce que votre courtier vous apportera
            </div>
            {rdvItems.map((item, i) => (
              <div className="conf-rdv-item" key={i}>
                <div className="conf-rdv-icon">{item.icon}</div>
                <div className="conf-rdv-text">{item.text}</div>
              </div>
            ))}
          </div>

          <div className="conf-meanwhile">
            <div className="conf-meanwhile-label">En attendant</div>
            <a
              href="/acheter"
              className="conf-link"
            >
              <span className="conf-rdv-icon"><IconHome /></span>
              <span className="conf-link-text">Découvrir nos biens en vente</span>
            </a>
            <button
              type="button"
              className="conf-link"
              onClick={onOpenEbook}
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="conf-rdv-icon"><IconBook /></span>
              <span className="conf-link-text">
                Recevoir notre guide de vente (eBook gratuit)
              </span>
            </button>
            <div className="conf-contact-block">
              <div className="conf-rdv-icon"><IconPhone /></div>
              <div className="conf-contact-info">
                <span className="conf-link-text">Nous contacter</span>
                <div className="conf-contact-actions">
                  <a
                    href="tel:+41225570700"
                    className="conf-action-btn"
                    onClick={handlePhoneClick}
                  >
                    +41 22 557 07 00
                  </a>
                  <button
                    type="button"
                    className={`conf-action-btn email-copy${copied ? " copied" : ""}`}
                    onClick={copyEmail}
                  >
                    {copied ? "\u2713 Copié !" : "gary@gary.ch \u2014 copier"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
